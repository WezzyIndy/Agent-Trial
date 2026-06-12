from react_agent.pricing import BUNDLE_DISCOUNT, BUNDLE_THRESHOLD, build_estimate


def test_single_service_no_discount() -> None:
    items, subtotal, discount, total = build_estimate(house_wash_stories=1)
    assert len(items) == 1
    assert discount == 0.0
    assert total == subtotal


def test_bundle_discount_applied() -> None:
    items, subtotal, discount, total = build_estimate(
        house_wash_stories=2,
        driveway_sqft=400.0,
        deck_patio_sqft=200.0,
    )
    assert len(items) == BUNDLE_THRESHOLD
    assert discount > 0.0
    assert round(discount, 2) == round(subtotal * BUNDLE_DISCOUNT, 2)
    assert total == round(subtotal - discount, 2)


def test_house_wash_stories_clamp() -> None:
    _, _, _, total_low = build_estimate(house_wash_stories=0)
    _, _, _, total_1 = build_estimate(house_wash_stories=1)
    assert total_low == total_1

    _, _, _, total_high = build_estimate(house_wash_stories=99)
    _, _, _, total_3 = build_estimate(house_wash_stories=3)
    assert total_high == total_3


def test_minimum_prices_respected() -> None:
    # Very small measurements should still hit service minimums
    items, _, _, _ = build_estimate(driveway_sqft=1.0)
    assert items[0].unit_price >= 65.0

    items, _, _, _ = build_estimate(fence_linear_ft=1.0)
    assert items[0].unit_price >= 75.0

    items, _, _, _ = build_estimate(roof_sqft=1.0)
    assert items[0].unit_price >= 200.0


def test_empty_estimate() -> None:
    items, subtotal, discount, total = build_estimate()
    assert items == []
    assert subtotal == 0.0
    assert discount == 0.0
    assert total == 0.0
