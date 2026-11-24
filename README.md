# EL-HYDRO Agent SDK & CLI

Read-only JavaScript client for the official public information API of EL-HYDRO INSTAL LIDER, a plumbing business serving Zielona Góra, Nowa Sól, Sulechów and nearby areas in Poland. / Oficjalny klient publicznego API informacyjnego firmy EL-HYDRO INSTAL LIDER.

**Development preview (0.1.0):** source code only; npm publication and licensing have not yet been approved. Requires Node.js 22 or later. No external dependencies, API keys, customer records, orders, bookings or payments. Use the website for individual quotations.

## Quick start from the repository

```sh
node cli.js --help
node cli.js health
node cli.js search "wodomierz" --limit 5
node cli.js travel
```

```js
import { ElHydroClient } from './index.js';
const client = new ElHydroClient();
const results = await client.search('wodomierz', { limit: 5 });
console.log(results);
```

## When to use / Kiedy używać

Use these read-only tools for published plumbing prices, travel fees, business hours, public contact details and service categories. The current response data is authoritative only for published information, not a final quotation or booking. Preserve prices marked `od` (from), units, and the distinction between installation and replacement. A missing result does not imply the company cannot perform the service. Do not send customer personal data or confidential details in searches.

| SDK method | CLI command | Public REST GET route |
|---|---|---|
| `prices()` | `prices` | `/prices` |
| `search(q, {limit})` | `search "wodomierz" --limit 5` | `/search?q=wodomierz&limit=5` |
| `travel()` | `travel` | `/travel` |
| `hours()` | `hours` | `/hours` |
| `company()` | `company` | `/company` |
| `services()` | `services` | `/services` |
| `health()` | `health` | `/health` |

REST base: `https://www.hydraulika.zgora.pl/wp-json/elh-agent/v1/`. Search limit: 1–30, default 10; q must be at most 120 UTF-8 bytes and contain a searchable letter or digit. Data field names are in Polish. API responses include timestamps. The REST API uses a shared server-side limit of 120 requests/minute, also shared with MCP and A2A. Respect HTTP 429/503 and `Retry-After`; this client does not automatically retry. `ElHydroApiError` exposes `status`, `code`, and `retryAfter` (raw header or null). CLI exits nonzero on errors and prints structured error JSON to stderr. Requests use a 15-second default timeout.

## Official integration resources

- [Official website](https://www.hydraulika.zgora.pl/)
- [Developer documentation](https://www.hydraulika.zgora.pl/docs/)
- [Public API overview](https://www.hydraulika.zgora.pl/api/)
- [OpenAPI JSON](https://www.hydraulika.zgora.pl/openapi.json)
- [Agent instructions](https://www.hydraulika.zgora.pl/agents.md)
- [llms.txt](https://www.hydraulika.zgora.pl/llms.txt)
- [Agent information / MCP, WebMCP and A2A](https://www.hydraulika.zgora.pl/dla-agentow/)
- [Official MCP registry entry](https://registry.modelcontextprotocol.io/?q=pl.zgora.hydraulika%2Fel-hydro) — remote server `https://www.hydraulika.zgora.pl/mcp` (Streamable HTTP).
- [A2A Agent Card](https://www.hydraulika.zgora.pl/.well-known/agent-card.json) — endpoint `https://www.hydraulika.zgora.pl/a2a`.
- [Detailed human-readable price list](https://www.hydraulika.zgora.pl/cennik-szczegolowy/)

This SDK/CLI calls REST, not MCP or A2A directly. For those protocols use the linked official documentation and a compatible client. WebMCP tools are registered in a supported browser on the official site.

## Testing

`npm test` runs local tests using mocked HTTP responses without sending traffic to the live website. For a live smoke test run `node cli.js health` and `node cli.js search "wodomierz" --limit 5`.

## License

No open-source license has been granted yet. All rights reserved by the rights holders. Public API access does not itself grant rights to redistribute the SDK code. Publication settings will be updated only after the owner chooses a license.
