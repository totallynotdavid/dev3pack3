# ⚔️ Sentinel

Marketplace and agent stack for contract factoring.

Sentinel is a multi-app monorepo:

- `apps/web`: marketplace and operator UI (Next.js, TypeScript, Tailwind)
- `apps/agent`: FactorBridge AI service (Google ADK, LiteLLM, Supabase/PostgreSQL)
- `apps/chain`: Solana/Anchor vault program workspace

## Setup and run

Prerequisites: Bun 1.x, Python 3.10+, Docker (optional), root `.env.local`.

Full stack with Docker:

```bash
make up
make down
make logs
make ps
make reset
make test
```

Web app only:

```bash
cd apps/web
bun install
bun dev
```

## Development commands

Run from `apps/web`:

```bash
bun run generate
bun run generate:checkout
bun x tsc --noEmit
bun run build
bun test:run
```

Required env vars for `apps/web`:
`POSTGRES_URL`, `NEXT_PUBLIC_SOLANA_CLUSTER`, `NEXT_PUBLIC_AGENT_API_URL`, `NEXT_PUBLIC_STOREFRONT_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`.

Required env vars for `apps/agent`:
`POSTGRES_URL`, `MODEL_PROVIDER`, and `HUGGINGFACE_API_KEY` or `OPENROUTER_API_KEY`.

Optional env vars for `apps/agent`:
`APIS_NET_PE_TOKEN`, `PORT`.

## Docs

- [AGENTS.md](/home/dubu/git/dev3pack3/AGENTS.md)
- [apps/agent/readme.md](/home/dubu/git/dev3pack3/apps/agent/readme.md)
- [apps/agent/docs/deployment_gcp.md](/home/dubu/git/dev3pack3/apps/agent/docs/deployment_gcp.md)
- [apps/agent/docs/model_providers.md](/home/dubu/git/dev3pack3/apps/agent/docs/model_providers.md)
- [apps/web/src/styles/readme.md](/home/dubu/git/dev3pack3/apps/web/src/styles/readme.md)
