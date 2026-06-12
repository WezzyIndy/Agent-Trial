"""Pressure washing pricing calculations."""

from dataclasses import dataclass
from typing import Dict, List, Optional, Tuple


@dataclass
class LineItem:
    """A single billable service in a pressure washing estimate."""

    name: str
    description: str
    unit_price: float
    quantity: float = 1.0

    @property
    def total(self) -> float:
        """Return the extended price for this line item."""
        return round(self.quantity * self.unit_price, 2)


# Pricing tables — adjust these to match your actual rates
_HOUSE_WASH: Dict[int, Dict[str, float]] = {
    1: {"base": 175.0, "per_sqft": 0.12},
    2: {"base": 300.0, "per_sqft": 0.12},
    3: {"base": 475.0, "per_sqft": 0.14},
}
_DRIVEWAY: Dict[str, float] = {"base": 80.0, "per_sqft": 0.10, "min": 65.0}
_DECK: Dict[str, float] = {"base": 120.0, "per_sqft": 0.18, "min": 100.0}
_FENCE: Dict[str, float] = {"per_lf": 1.25, "min": 75.0}
_ROOF: Dict[str, float] = {"per_sqft": 0.30, "min": 200.0}
_GUTTERS: Dict[str, float] = {"per_lf": 1.25, "min": 100.0}
_SIDEWALK: Dict[str, float] = {"per_sqft": 0.10, "min": 50.0}
_CONCRETE_PATIO: Dict[str, float] = {"per_sqft": 0.10, "min": 60.0}

BUNDLE_THRESHOLD = 3
BUNDLE_DISCOUNT = 0.10


def _house_wash(stories: int, sqft: Optional[float]) -> LineItem:
    s = max(1, min(stories, 3))
    p = _HOUSE_WASH[s]
    price = max(p["base"], sqft * p["per_sqft"]) if sqft else p["base"]
    desc = f"{s}-story house exterior"
    if sqft:
        desc += f", approx {int(sqft):,} sqft"
    return LineItem("House Exterior Pressure Wash", desc, round(price, 2))


def _driveway(sqft: float) -> LineItem:
    price = max(_DRIVEWAY["min"], _DRIVEWAY["base"] + sqft * _DRIVEWAY["per_sqft"])
    return LineItem(
        "Driveway / Concrete Wash",
        f"approx {int(sqft):,} sqft",
        round(price, 2),
    )


def _deck_patio(sqft: float) -> LineItem:
    price = max(_DECK["min"], _DECK["base"] + sqft * _DECK["per_sqft"])
    return LineItem(
        "Deck / Patio Pressure Wash",
        f"approx {int(sqft):,} sqft",
        round(price, 2),
    )


def _fence(linear_ft: float) -> LineItem:
    price = max(_FENCE["min"], linear_ft * _FENCE["per_lf"])
    return LineItem(
        "Fence Pressure Wash",
        f"approx {int(linear_ft):,} linear ft",
        round(price, 2),
    )


def _roof_soft_wash(sqft: float) -> LineItem:
    price = max(_ROOF["min"], sqft * _ROOF["per_sqft"])
    return LineItem(
        "Roof Soft Wash",
        f"approx {int(sqft):,} sqft (low-pressure chemical treatment)",
        round(price, 2),
    )


def _gutters(linear_ft: float) -> LineItem:
    price = max(_GUTTERS["min"], linear_ft * _GUTTERS["per_lf"])
    return LineItem(
        "Gutter Exterior Cleaning",
        f"approx {int(linear_ft):,} linear ft",
        round(price, 2),
    )


def _sidewalk(sqft: float) -> LineItem:
    price = max(_SIDEWALK["min"], sqft * _SIDEWALK["per_sqft"])
    return LineItem(
        "Sidewalk / Walkway Wash",
        f"approx {int(sqft):,} sqft",
        round(price, 2),
    )


def _concrete_patio(sqft: float) -> LineItem:
    price = max(_CONCRETE_PATIO["min"], sqft * _CONCRETE_PATIO["per_sqft"])
    return LineItem(
        "Concrete Patio Pressure Wash",
        f"approx {int(sqft):,} sqft",
        round(price, 2),
    )


def build_estimate(
    house_wash_stories: Optional[int] = None,
    house_wash_sqft: Optional[float] = None,
    driveway_sqft: Optional[float] = None,
    deck_patio_sqft: Optional[float] = None,
    fence_linear_ft: Optional[float] = None,
    roof_sqft: Optional[float] = None,
    gutter_linear_ft: Optional[float] = None,
    sidewalk_sqft: Optional[float] = None,
    concrete_patio_sqft: Optional[float] = None,
) -> Tuple[List[LineItem], float, float, float]:
    """Compute line items, subtotal, discount, and total for a set of services.

    Returns:
        Tuple of (line_items, subtotal, discount_amount, total).
    """
    items: List[LineItem] = []

    if house_wash_stories is not None:
        items.append(_house_wash(house_wash_stories, house_wash_sqft))
    if driveway_sqft is not None:
        items.append(_driveway(driveway_sqft))
    if deck_patio_sqft is not None:
        items.append(_deck_patio(deck_patio_sqft))
    if fence_linear_ft is not None:
        items.append(_fence(fence_linear_ft))
    if roof_sqft is not None:
        items.append(_roof_soft_wash(roof_sqft))
    if gutter_linear_ft is not None:
        items.append(_gutters(gutter_linear_ft))
    if sidewalk_sqft is not None:
        items.append(_sidewalk(sidewalk_sqft))
    if concrete_patio_sqft is not None:
        items.append(_concrete_patio(concrete_patio_sqft))

    subtotal = round(sum(i.total for i in items), 2)
    discount = round(subtotal * BUNDLE_DISCOUNT, 2) if len(items) >= BUNDLE_THRESHOLD else 0.0
    total = round(subtotal - discount, 2)

    return items, subtotal, discount, total
