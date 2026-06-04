"""Define the configurable parameters for the agent."""

from __future__ import annotations

import os
from dataclasses import dataclass, field, fields
from typing import Annotated, Optional

from langchain_core.runnables import RunnableConfig, ensure_config

from react_agent import prompts


@dataclass(kw_only=True)
class Configuration:
    """The configuration for the agent."""

    system_prompt: str = field(
        default=prompts.SYSTEM_PROMPT,
        metadata={
            "description": "The system prompt to use for the agent's interactions. "
            "This prompt sets the context and behavior for the agent."
        },
    )

    model: Annotated[str, {"__template_metadata__": {"kind": "llm"}}] = field(
        default="anthropic/claude-opus-4-8",
        metadata={
            "description": "The name of the language model to use for the agent's main interactions. "
            "Should be in the form: provider/model-name."
        },
    )

    max_search_results: int = field(
        default=10,
        metadata={
            "description": "The maximum number of search results to return for each search query."
        },
    )

    city: str = field(
        default_factory=lambda: os.getenv("FB_CITY", ""),
        metadata={
            "description": "Facebook Marketplace city slug (e.g. 'chicago', 'new-york'). Falls back to account location if empty."
        },
    )

    max_buy_price: int = field(
        default=200,
        metadata={
            "description": "Maximum Facebook Marketplace listing price to consider ($)."
        },
    )

    min_profit_multiplier: float = field(
        default=3.0,
        metadata={
            "description": "Minimum eBay-median / FB-price ratio to flag as a deal."
        },
    )

    fb_cookies_file: str = field(
        default_factory=lambda: os.getenv("FB_COOKIES_FILE", "fb_cookies.json"),
        metadata={
            "description": "Path to Facebook session cookies JSON file."
        },
    )

    ebay_min_sold_count: int = field(
        default=3,
        metadata={
            "description": "Minimum number of eBay sold listings required to trust the price."
        },
    )

    @classmethod
    def from_runnable_config(
        cls, config: Optional[RunnableConfig] = None
    ) -> Configuration:
        """Create a Configuration instance from a RunnableConfig object."""
        config = ensure_config(config)
        configurable = config.get("configurable") or {}
        _fields = {f.name for f in fields(cls) if f.init}
        return cls(**{k: v for k, v in configurable.items() if k in _fields})
