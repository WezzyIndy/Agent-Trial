"""
Run this once on your LOCAL machine to capture your Facebook session.
It opens a real browser — log in, then press Enter to save the session.

Usage: python setup_fb_session.py
Output: fb_cookies.json  (copy this to your project directory)
"""
import asyncio
import json
from playwright.async_api import async_playwright


async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context()
        page = await context.new_page()
        await page.goto("https://www.facebook.com")
        print("Log into Facebook in the browser window.")
        print("After the home feed loads, press Enter here to save your session...")
        input()
        cookies = await context.cookies()
        with open("fb_cookies.json", "w") as f:
            json.dump(cookies, f, indent=2)
        print(f"Saved {len(cookies)} cookies to fb_cookies.json")
        await browser.close()


asyncio.run(main())
