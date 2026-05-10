# agent

Production AI agent for bilateral factoring workflows. The service runs on Google ADK with tool execution against Supabase/PostgreSQL and is deployed on Cloud Run.

## Scope

- Validate payer/counterparty identity (RUC/DNI workflows).
- Build risk context from credit profile signals.
- Match invoice opportunities to active factors.
- Register platform intents for downstream workflows.

## Runtime Stack

- Python 3.10+
- `google-adk` (with LiteLLM extensions)
- Provider routing by `MODEL_PROVIDER`
- Supabase PostgreSQL via `POSTGRES_URL`

## Local Setup

```bash
cd apps/agent
uv venv
uv sync
cp factor_bridge_agent/.env.example factor_bridge_agent/.env
```

Set required secrets in `factor_bridge_agent/.env`:

- `MODEL_PROVIDER`
- `POSTGRES_URL`
- `HUGGINGFACE_API_KEY` or `OPENROUTER_API_KEY` (based on provider)

## Run Modes

```bash
# Interactive web UI
adk web

# CLI run
adk run factor_bridge_agent

# API server mode
adk api_server factor_bridge_agent --port 8080
```

## API Contract

Primary query endpoint in deployed environments:

```http
POST /query
Content-Type: application/json

{
  "message": "Valida el RUC 20512345678",
  "session_id": "session-001",
  "user_id": "optional-user"
}
```

Health check:

```http
GET /health
```

## Docs

- Deployment runbook: `docs/deployment_gcp.md`
- Model/provider strategy: `docs/model_providers.md`
