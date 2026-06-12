import pytest
from langsmith import unit

from react_agent import graph


@pytest.mark.asyncio
@unit
async def test_estimate_agent_calculates_price() -> None:
    res = await graph.ainvoke(
        {
            "messages": [
                (
                    "user",
                    "I need a quote for washing the exterior of my 2-story house "
                    "and pressure washing my driveway (about 400 sqft).",
                )
            ]
        },
        {
            "configurable": {
                "model": "anthropic/claude-3-5-sonnet-20240620",
            }
        },
    )

    content = str(res["messages"][-1].content).lower()
    # The agent should produce a dollar amount in its response
    assert "$" in content or "total" in content or "estimate" in content
