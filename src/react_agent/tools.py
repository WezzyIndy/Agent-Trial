"""Pressure washing estimate calculator and Jobber CRM integration tools."""

import json
from typing import Any, Callable, List, Optional

from react_agent.jobber_client import JobberClient
from react_agent.pricing import BUNDLE_DISCOUNT, BUNDLE_THRESHOLD, build_estimate

_NOT_CONFIGURED = (
    "Jobber is not configured. Set JOBBER_ACCESS_TOKEN (and optionally "
    "JOBBER_REFRESH_TOKEN, JOBBER_CLIENT_ID, JOBBER_CLIENT_SECRET) in your "
    "environment. See .env.example for details."
)


async def calculate_pressure_washing_estimate(
    house_wash_stories: Optional[int] = None,
    house_wash_sqft: Optional[float] = None,
    driveway_sqft: Optional[float] = None,
    deck_patio_sqft: Optional[float] = None,
    fence_linear_ft: Optional[float] = None,
    roof_sqft: Optional[float] = None,
    gutter_linear_ft: Optional[float] = None,
    sidewalk_sqft: Optional[float] = None,
    concrete_patio_sqft: Optional[float] = None,
) -> str:
    """Calculate a pressure washing estimate for the requested services.

    Provide measurements only for services the customer wants:
    - house_wash_stories: Number of stories (1, 2, or 3). Required for house wash.
    - house_wash_sqft: Optional exterior square footage of the house.
    - driveway_sqft: Square footage of driveway or concrete pad.
    - deck_patio_sqft: Square footage of wood/composite deck or patio.
    - fence_linear_ft: Linear feet of fence to be washed.
    - roof_sqft: Square footage of roof (soft wash treatment).
    - gutter_linear_ft: Linear feet of gutters to clean.
    - sidewalk_sqft: Square footage of sidewalk or walkway.
    - concrete_patio_sqft: Square footage of concrete patio.

    Returns a JSON string containing line_items (for use with create_jobber_quote),
    subtotal, discount, and total.
    """
    items, subtotal, discount, total = build_estimate(
        house_wash_stories=house_wash_stories,
        house_wash_sqft=house_wash_sqft,
        driveway_sqft=driveway_sqft,
        deck_patio_sqft=deck_patio_sqft,
        fence_linear_ft=fence_linear_ft,
        roof_sqft=roof_sqft,
        gutter_linear_ft=gutter_linear_ft,
        sidewalk_sqft=sidewalk_sqft,
        concrete_patio_sqft=concrete_patio_sqft,
    )

    if not items:
        return json.dumps({"error": "No services specified. Please provide at least one measurement."})

    line_items = [
        {
            "name": item.name,
            "description": item.description,
            "unit_price": item.unit_price,
            "quantity": item.quantity,
        }
        for item in items
    ]

    notes: List[str] = []
    if len(items) >= BUNDLE_THRESHOLD:
        notes.append(
            f"{int(BUNDLE_DISCOUNT * 100)}% bundle discount applied for booking {len(items)} services."
        )

    return json.dumps(
        {
            "line_items": line_items,
            "subtotal": subtotal,
            "discount": discount,
            "total": total,
            "notes": notes,
        },
        indent=2,
    )


async def search_jobber_clients(query: str) -> str:
    """Search for existing clients in Jobber by name, email, or phone number.

    Returns a JSON list of matching clients. Each client includes id, name,
    emails, phones, and billing address. Use the client id with create_jobber_quote.
    """
    client = JobberClient()
    if not client.is_configured():
        return _NOT_CONFIGURED

    try:
        clients = await client.search_clients(query)
    except Exception as exc:
        return f"Jobber search failed: {exc}"

    if not clients:
        return json.dumps({"message": f"No clients found matching '{query}'.", "clients": []})

    return json.dumps({"clients": clients}, indent=2)


async def create_jobber_client(
    first_name: str,
    last_name: str,
    email: Optional[str] = None,
    phone: Optional[str] = None,
    street: Optional[str] = None,
    city: Optional[str] = None,
    province: Optional[str] = None,
    postal_code: Optional[str] = None,
) -> str:
    """Create a new client record in Jobber.

    Returns JSON with the new client's id and name, which can be passed to
    create_jobber_quote. province is the state or province abbreviation (e.g. 'FL').
    """
    client = JobberClient()
    if not client.is_configured():
        return _NOT_CONFIGURED

    try:
        created = await client.create_client(
            first_name=first_name,
            last_name=last_name,
            email=email,
            phone=phone,
            street=street,
            city=city,
            province=province,
            postal_code=postal_code,
        )
    except Exception as exc:
        return f"Jobber client creation failed: {exc}"

    return json.dumps({"client": created}, indent=2)


async def create_jobber_quote(
    client_id: str,
    title: str,
    line_items_json: str,
) -> str:
    """Create a quote in Jobber and save it to the client's record.

    client_id: Jobber client ID from search_jobber_clients or create_jobber_client.
    title: Quote title (e.g. 'Pressure Washing - 123 Oak St').
    line_items_json: The 'line_items' array from calculate_pressure_washing_estimate
                     output, pasted as a JSON string.

    Returns the Jobber quote number and a link to view it.
    """
    jobber = JobberClient()
    if not jobber.is_configured():
        return _NOT_CONFIGURED

    try:
        raw = json.loads(line_items_json)
    except json.JSONDecodeError as exc:
        return f"Invalid line_items_json: {exc}"

    # Accept either the full estimate dict or just the line_items array
    if isinstance(raw, dict) and "line_items" in raw:
        items: List[Any] = raw["line_items"]
    elif isinstance(raw, list):
        items = raw
    else:
        return "line_items_json must be the JSON array from calculate_pressure_washing_estimate."

    try:
        quote = await jobber.create_quote(
            client_id=client_id,
            title=title,
            line_items=items,
        )
    except Exception as exc:
        return f"Jobber quote creation failed: {exc}"

    quote_number = quote.get("quoteNumber", "")
    quote_id = quote.get("id", "")
    total = quote.get("amounts", {}).get("total", "")
    client_name = quote.get("client", {}).get("name", "")

    view_url = (
        f"https://secure.getjobber.com/quotes/{quote_id}" if quote_id else "N/A"
    )

    return json.dumps(
        {
            "success": True,
            "quote_number": quote_number,
            "client": client_name,
            "total": total,
            "view_url": view_url,
        },
        indent=2,
    )


TOOLS: List[Callable[..., Any]] = [
    calculate_pressure_washing_estimate,
    search_jobber_clients,
    create_jobber_client,
    create_jobber_quote,
]
