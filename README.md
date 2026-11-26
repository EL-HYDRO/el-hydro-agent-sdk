# EL-HYDRO Agent SDK & CLI

Official JavaScript SDK and command-line interface for the public information API of EL-HYDRO INSTAL LIDER, a professional plumbing business serving Zielona Góra, Nowa Sól, Sulechów and nearby areas in Poland.

Oficjalny klient publicznego API informacyjnego firmy EL-HYDRO INSTAL LIDER.

**Current version:** 0.1.0
**License:** MIT
**Availability:** Public GitHub source code. Available on npm.
**Requirements:** Node.js 22 or later.

No external dependencies, API keys, customer records, orders, bookings or payments. Use the official website for individual quotations.

## Installation from GitHub

```sh
git clone https://github.com/EL-HYDRO/el-hydro-agent-sdk.git
cd el-hydro-agent-sdk
```

## Quick start – CLI

```sh
node cli.js --help
node cli.js health
node cli.js search "wodomierz" --limit 5
node cli.js prices
node cli.js travel
node cli.js hours
node cli.js company
node cli.js services
```

## Quick start – JavaScript SDK

```js
import { ElHydroClient } from './index.js';

const client = new ElHydroClient();

const results = await client.search('wodomierz', { limit: 5 });

console.log(results);
```

## When to use / Kiedy używać

Use these read-only tools for published plumbing prices, travel fees, business hours, public contact details and service categories.

The current response data is authoritative only for published information, not a final quotation or booking.

Preserve prices marked `od` (from), units, and the distinction between installation and replacement.

A missing result does not imply the company cannot perform the service.

Do not send customer personal data or confidential details in searches.

## Available SDK methods and CLI commands

| SDK method | CLI command | Public REST GET route |
|---|---|---|
| `prices()` | `prices` | `/prices` |
| `search(q, {limit})` | `search "wodomierz" --limit 5` | `/search?q=wodomierz&limit=5` |
| `travel()` | `travel` | `/travel` |
| `hours()` | `hours` | `/hours` |
| `company()` | `company` | `/company` |
| `services()` | `services` | `/services` |
| `health()` | `health` | `/health` |

## Public REST API

Base URL:

https://www.hydraulika.zgora.pl/wp-json/elh-agent/v1/

- Read-only HTTP GET requests.
- No authentication or API keys required.
- JSON responses.
- Data field names are in Polish.
- API responses include timestamps.
- Search limit: 1–30, default 10.
- Search query: maximum 120 UTF-8 bytes and must contain a searchable letter or digit.
- Default request timeout: 15 seconds.
- Shared server-side rate limit: 120 requests per minute, also shared with MCP and A2A.

Respect HTTP 429/503 and the `Retry-After` header.

The SDK does not automatically retry requests.

`ElHydroApiError` exposes `status`, `code`, and `retryAfter` (raw header or null).

CLI exits nonzero on errors and prints structured error JSON to stderr.

## Official integration resources

- [Official website](https://www.hydraulika.zgora.pl/)
- [Developer documentation](https://www.hydraulika.zgora.pl/docs/)
- [Public API overview](https://www.hydraulika.zgora.pl/api/)
- [OpenAPI JSON](https://www.hydraulika.zgora.pl/openapi.json)
- [Agent instructions – agents.md](https://www.hydraulika.zgora.pl/agents.md)
- [llms.txt](https://www.hydraulika.zgora.pl/llms.txt)
- [Agent information – MCP, WebMCP and A2A](https://www.hydraulika.zgora.pl/dla-agentow/)
- [Official GitHub organization](https://github.com/EL-HYDRO)
- [Official SDK and CLI repository](https://github.com/EL-HYDRO/el-hydro-agent-sdk)
- [Detailed human-readable price list](https://www.hydraulika.zgora.pl/cennik-szczegolowy/)

## Model Context Protocol (MCP)

Official MCP server identifier:

`pl.zgora.hydraulika/el-hydro`

Transport: Streamable HTTP.

Endpoint:

https://www.hydraulika.zgora.pl/mcp

[Official MCP Registry entry](https://registry.modelcontextprotocol.io/?q=pl.zgora.hydraulika%2Fel-hydro)

Available MCP tools:

- `elh_search_prices`
- `elh_get_prices`
- `elh_get_travel`
- `elh_get_hours`
- `elh_get_company`
- `elh_get_services`

## Agent-to-Agent Protocol (A2A)

Official Agent Card:

https://www.hydraulika.zgora.pl/.well-known/agent-card.json

A2A endpoint:

https://www.hydraulika.zgora.pl/a2a

## WebMCP

Six read-only WebMCP tools are registered in supported browsers on the official EL-HYDRO website.

This SDK and CLI call the REST API, not MCP or A2A directly. For these protocols, use the official documentation and a compatible client.

## Testing

Run local tests:

```sh
npm test
```

Local tests use mocked HTTP responses without sending traffic to the live website.

For live smoke tests:

```sh
node cli.js health
node cli.js search "wodomierz" --limit 5
node cli.js travel
```

## npm publication status

The SDK and CLI are currently available as public source code on GitHub.

Published on npm: https://www.npmjs.com/package/el-hydro-agent-sdk

Install the official SDK: `npm install el-hydro-agent-sdk`.

Planned package name: `el-hydro-agent-sdk`

Planned CLI command: `el-hydro`

## License

The EL-HYDRO Agent SDK and CLI are licensed under the MIT License.

Copyright (c) 2026 EL-HYDRO INSTAL LIDER MARCIN STODOLSKI.

See the [LICENSE](LICENSE) file for the complete license terms.

The MIT License applies to the SDK and CLI software in this repository. It does not extend to proprietary EL-HYDRO WordPress plugins, website content, company branding or other proprietary software.

Public API access remains subject to the applicable service limitations.

## About EL-HYDRO

EL-HYDRO INSTAL LIDER MARCIN STODOLSKI

Professional plumbing services in Zielona Góra, Nowa Sól, Sulechów and nearby areas, Poland.

Official website:

https://www.hydraulika.zgora.pl/

This project provides public business information for developers, applications and AI agents. It does not process payments, accept orders or make reservations.
