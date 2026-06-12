"""Jobber GraphQL API client.

To get credentials:
  1. Go to https://developer.getjobber.com and sign in with your Jobber account.
  2. Create a new app — note the Client ID and Client Secret.
  3. Complete the OAuth authorization flow to obtain an access token and refresh token.
     Authorization URL: https://api.getjobber.com/api/oauth/authorize
     Token URL:         https://api.getjobber.com/api/oauth/token
  4. Set JOBBER_CLIENT_ID, JOBBER_CLIENT_SECRET, JOBBER_ACCESS_TOKEN, and
     JOBBER_REFRESH_TOKEN in your environment (see .env.example).
"""

import os
from typing import Any, Dict, List, Optional

import httpx

_GRAPHQL_URL = "https://api.getjobber.com/api/graphql"
_TOKEN_URL = "https://api.getjobber.com/api/oauth/token"
_API_VERSION = "2024-11-15"


class JobberClient:
    """Async client for Jobber's GraphQL API."""

    def __init__(self) -> None:
        self.access_token = os.environ.get("JOBBER_ACCESS_TOKEN", "")
        self.refresh_token = os.environ.get("JOBBER_REFRESH_TOKEN", "")
        self.client_id = os.environ.get("JOBBER_CLIENT_ID", "")
        self.client_secret = os.environ.get("JOBBER_CLIENT_SECRET", "")

    def is_configured(self) -> bool:
        """Return True if an access token is present."""
        return bool(self.access_token)

    async def _refresh_access_token(self) -> None:
        """Exchange the stored refresh token for a new access token."""
        async with httpx.AsyncClient() as http:
            resp = await http.post(
                _TOKEN_URL,
                data={
                    "grant_type": "refresh_token",
                    "client_id": self.client_id,
                    "client_secret": self.client_secret,
                    "refresh_token": self.refresh_token,
                },
                timeout=15.0,
            )
            resp.raise_for_status()
            tokens = resp.json()
            self.access_token = tokens["access_token"]
            if "refresh_token" in tokens:
                self.refresh_token = tokens["refresh_token"]

    async def _execute(
        self, query: str, variables: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Execute a GraphQL operation, refreshing the token once on 401."""
        payload: Dict[str, Any] = {"query": query}
        if variables:
            payload["variables"] = variables

        for attempt in range(2):
            headers = {
                "Authorization": f"Bearer {self.access_token}",
                "Content-Type": "application/json",
                "X-JOBBER-GRAPHQL-VERSION": _API_VERSION,
            }
            async with httpx.AsyncClient() as http:
                resp = await http.post(
                    _GRAPHQL_URL, json=payload, headers=headers, timeout=30.0
                )

            if resp.status_code == 401 and attempt == 0 and self.refresh_token:
                await self._refresh_access_token()
                continue

            resp.raise_for_status()
            data: Dict[str, Any] = resp.json()

            if "errors" in data:
                raise ValueError(f"Jobber GraphQL error: {data['errors']}")

            return data.get("data", {})

        raise RuntimeError("Jobber authentication failed after token refresh.")

    async def search_clients(self, query: str) -> List[Dict[str, Any]]:
        """Search clients in Jobber by name (partial match supported)."""
        gql = """
        query SearchClients($filter: ClientFilterAttributes) {
          clients(filter: $filter) {
            nodes {
              id
              name
              emails { address }
              phones { number }
              billingAddress { street city province postalCode country }
            }
          }
        }
        """
        result = await self._execute(gql, {"filter": {"name": query}})
        nodes: List[Dict[str, Any]] = result.get("clients", {}).get("nodes", [])
        return nodes

    async def create_client(
        self,
        first_name: str,
        last_name: str,
        email: Optional[str] = None,
        phone: Optional[str] = None,
        street: Optional[str] = None,
        city: Optional[str] = None,
        province: Optional[str] = None,
        postal_code: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Create a new client record in Jobber."""
        gql = """
        mutation ClientCreate($input: ClientCreateInput!) {
          clientCreate(input: $input) {
            client { id name }
            userErrors { message }
          }
        }
        """
        inp: Dict[str, Any] = {"firstName": first_name, "lastName": last_name}
        if email:
            inp["emails"] = [{"address": email, "primary": True}]
        if phone:
            inp["phones"] = [{"number": phone, "primary": True, "smsAllowed": True}]

        addr = {
            k: v
            for k, v in {
                "street": street,
                "city": city,
                "province": province,
                "postalCode": postal_code,
            }.items()
            if v
        }
        if addr:
            inp["billingAddress"] = addr

        result = await self._execute(gql, {"input": inp})
        client_create: Dict[str, Any] = result.get("clientCreate", {})
        errors: List[Dict[str, Any]] = client_create.get("userErrors", [])
        if errors:
            messages = ", ".join(e.get("message", "") for e in errors)
            raise ValueError(f"Jobber client creation failed: {messages}")
        client: Dict[str, Any] = client_create.get("client", {})
        return client

    async def create_quote(
        self,
        client_id: str,
        title: str,
        line_items: List[Dict[str, Any]],
        message: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Create a quote in Jobber with the given line items.

        Each element of line_items must have keys: name, unit_price, description,
        and optionally quantity (defaults to 1).
        """
        gql = """
        mutation QuoteCreate($input: QuoteCreateInput!) {
          quoteCreate(input: $input) {
            quote {
              id
              quoteNumber
              amounts { total }
              client { name }
            }
            userErrors { message }
          }
        }
        """
        nodes = [
            {
                "name": item["name"],
                "quantity": str(item.get("quantity", 1)),
                "unitPrice": item["unit_price"],
                "description": item.get("description", ""),
            }
            for item in line_items
        ]

        inp: Dict[str, Any] = {
            "client": {"id": client_id},
            "title": title,
            "lineItems": {"nodes": nodes},
        }
        if message:
            inp["message"] = message

        result = await self._execute(gql, {"input": inp})
        quote_create: Dict[str, Any] = result.get("quoteCreate", {})
        errors = quote_create.get("userErrors", [])
        if errors:
            messages = ", ".join(e.get("message", "") for e in errors)
            raise ValueError(f"Jobber quote creation failed: {messages}")
        quote: Dict[str, Any] = quote_create.get("quote", {})
        return quote
