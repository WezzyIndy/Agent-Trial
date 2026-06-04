"""Tools for the Facebook Marketplace arbitrage agent.

Includes:
- search_facebook_marketplace: scrapes FB Marketplace listings via Playwright
- check_ebay_sold_prices: fetches eBay completed/sold listings via httpx + BeautifulSoup
- search: general Tavily web search (kept from original template)
"""

import asyncio
import json
import re
import statistics
import urllib.parse
from typing import Any, Callable, List, Optional, cast

import httpx
from bs4 import BeautifulSoup
from langchain_community.tools.tavily_search import TavilySearchResults
from langchain_core.runnables import RunnableConfig
from langchain_core.tools import InjectedToolArg, tool
from playwright.async_api import async_playwright
from typing_extensions import Annotated

from react_agent.configuration import Configuration


@tool
async def search_facebook_marketplace(
    query: str,
    *,
    config: Annotated[RunnableConfig, InjectedToolArg],
) -> str:
    """Search Facebook Marketplace for collectible listings under the max buy price.

    Args:
        query: The search term to use on Facebook Marketplace.
        config: Injected LangGraph runnable config (provides agent configuration).

    Returns:
        JSON string — a list of listing dicts with keys:
        title, price, url, location. Returns an error JSON dict on failure.
    """
    configuration = Configuration.from_runnable_config(config)
    max_buy_price = configuration.max_buy_price
    fb_cookies_file = configuration.fb_cookies_file
    city = configuration.city

    # Build the Marketplace URL
    encoded_query = urllib.parse.quote_plus(query)
    if city:
        marketplace_url = (
            f"https://www.facebook.com/marketplace/{city}/search"
            f"?query={encoded_query}&maxPrice={max_buy_price}&exact=false"
        )
    else:
        marketplace_url = (
            f"https://www.facebook.com/marketplace/search"
            f"?query={encoded_query}&maxPrice={max_buy_price}&exact=false"
        )

    # Check for cookies file
    import os

    if not os.path.exists(fb_cookies_file):
        return json.dumps(
            {
                "error": (
                    f"{fb_cookies_file} not found. "
                    "Run setup_fb_session.py on your local machine first to capture "
                    "your Facebook session cookies, then copy fb_cookies.json here."
                )
            }
        )

    try:
        with open(fb_cookies_file, "r") as f:
            cookies_data = json.load(f)
    except (OSError, json.JSONDecodeError) as exc:
        return json.dumps({"error": f"Failed to read {fb_cookies_file}: {exc}"})

    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context(
                user_agent=(
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/120.0.0.0 Safari/537.36"
                )
            )

            # Load saved session cookies
            await context.add_cookies(cookies_data)

            page = await context.new_page()
            await page.goto(marketplace_url, wait_until="domcontentloaded")

            # Wait for JS to render initial listings
            await asyncio.sleep(3)

            # Scroll to load more results
            for _ in range(4):
                await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                await asyncio.sleep(1.5)

            # Extract listing elements
            listing_elements = await page.query_selector_all(
                'a[href*="/marketplace/item/"]'
            )

            seen_urls: set[str] = set()
            listings: list[dict[str, Any]] = []

            price_pattern = re.compile(r"\$([\d,]+(?:\.\d{2})?)")

            for el in listing_elements:
                try:
                    href = await el.get_attribute("href")
                    if not href:
                        continue

                    # Normalise to full URL
                    if href.startswith("/"):
                        full_url = f"https://www.facebook.com{href}"
                    else:
                        full_url = href

                    # Strip query params to deduplicate
                    base_url = full_url.split("?")[0].rstrip("/")
                    if base_url in seen_urls:
                        continue
                    seen_urls.add(base_url)

                    inner_text = await el.inner_text()
                    lines = [ln.strip() for ln in inner_text.splitlines() if ln.strip()]

                    # Find price
                    price_match = None
                    title_lines: list[str] = []
                    location = ""

                    for i, line in enumerate(lines):
                        m = price_pattern.search(line)
                        if m and price_match is None:
                            price_match = m
                            # Lines before price → title, lines after → location
                            title_lines = lines[:i]
                            if i + 1 < len(lines):
                                location = lines[i + 1]
                        elif price_match is not None and i > lines.index(
                            next(
                                ln
                                for ln in lines
                                if price_pattern.search(ln)
                            )
                        ):
                            break

                    if price_match is None:
                        continue

                    price_str = price_match.group(1).replace(",", "")
                    price = float(price_str)

                    if price < 1 or price > max_buy_price:
                        continue

                    title = " ".join(title_lines) if title_lines else lines[0] if lines else "Unknown"

                    listings.append(
                        {
                            "title": title,
                            "price": price,
                            "url": base_url,
                            "location": location,
                        }
                    )
                except Exception:
                    # Skip malformed elements silently
                    continue

            await browser.close()

        return json.dumps(listings)

    except Exception as exc:
        return json.dumps({"error": f"Playwright error: {exc}"})


@tool
async def check_ebay_sold_prices(
    search_query: str,
    *,
    config: Annotated[RunnableConfig, InjectedToolArg],
) -> Optional[str]:
    """Fetch eBay completed/sold listings and compute price statistics.

    Args:
        search_query: The item title or search term to look up on eBay.
        config: Injected LangGraph runnable config (provides agent configuration).

    Returns:
        JSON string with keys: median_sold_price, avg_sold_price, min_sold_price,
        max_sold_price, num_sold, query. Returns the string "null" if there are
        fewer sold listings than ebay_min_sold_count or on any error.
    """
    configuration = Configuration.from_runnable_config(config)
    ebay_min_sold_count = configuration.ebay_min_sold_count

    encoded_query = urllib.parse.quote_plus(search_query)
    url = (
        f"https://www.ebay.com/sch/i.html"
        f"?_nkw={encoded_query}"
        f"&LH_Sold=1&LH_Complete=1&_sop=13&_sacat=0"
    )

    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/120.0.0.0 Safari/537.36"
        ),
        "Accept-Language": "en-US,en;q=0.9",
        "Accept": (
            "text/html,application/xhtml+xml,application/xml;"
            "q=0.9,image/webp,*/*;q=0.8"
        ),
    }

    try:
        async with httpx.AsyncClient(
            headers=headers, follow_redirects=True, timeout=20.0
        ) as client:
            response = await client.get(url)
            response.raise_for_status()
            html = response.text

        soup = BeautifulSoup(html, "html.parser")

        price_pattern = re.compile(r"\$([\d,]+(?:\.\d{2})?)")
        prices: list[float] = []

        items = soup.select("li.s-item")
        for item in items:
            # Skip placeholder items injected by eBay
            if "s-item--placeholder" in item.get("class", []):
                continue

            price_el = item.select_one(".s-item__price")
            if price_el is None:
                continue

            price_text = price_el.get_text(strip=True)
            # Handle price ranges — take the lower bound
            match = price_pattern.search(price_text)
            if match:
                price_val = float(match.group(1).replace(",", ""))
                if price_val > 0:
                    prices.append(price_val)

        await asyncio.sleep(0.5)

        if len(prices) < ebay_min_sold_count:
            return "null"

        result = {
            "median_sold_price": statistics.median(prices),
            "avg_sold_price": statistics.mean(prices),
            "min_sold_price": min(prices),
            "max_sold_price": max(prices),
            "num_sold": len(prices),
            "query": search_query,
        }
        return json.dumps(result)

    except Exception:
        return "null"


async def search(
    query: str, *, config: Annotated[RunnableConfig, InjectedToolArg]
) -> Optional[list[dict[str, Any]]]:
    """Search for general web results.

    This function performs a search using the Tavily search engine, which is designed
    to provide comprehensive, accurate, and trusted results. It's particularly useful
    for answering questions about current events.
    """
    configuration = Configuration.from_runnable_config(config)
    wrapped = TavilySearchResults(max_results=configuration.max_search_results)
    result = await wrapped.ainvoke({"query": query})
    return cast(list[dict[str, Any]], result)


TOOLS: List[Callable[..., Any]] = [
    search_facebook_marketplace,
    check_ebay_sold_prices,
    search,
]
