# FactorBridge agent

AI service for factoring operations in Sentinel V3.

FactorBridge handles identity checks (RUC/DNI), credit-context generation, factor matching, and intent registration.

## Setup and run

Runtime: Python 3.10+, `google-adk[extensions]==1.33.0`, LiteLLM via `MODEL_PROVIDER`, PostgreSQL via `POSTGRES_URL`.

Local setup:

```bash
cd apps/agent
uv venv
source .venv/bin/activate
uv sync
cp factor_bridge_agent/.env.example factor_bridge_agent/.env
```

Required vars: `MODEL_PROVIDER`, `POSTGRES_URL`, and `HUGGINGFACE_API_KEY` or `OPENROUTER_API_KEY`.

Run modes:

```bash
adk web
adk run factor_bridge_agent
adk api_server factor_bridge_agent --port 8080
```

From repo root (Docker stack):

```bash
make up
make logs
make test
```

## API and docs

Health check:

```http
GET /health
```

Query:

```http
POST /query
Content-Type: application/json

{
  "message": "Valida el RUC 20512345678",
  "session_id": "session-001",
  "user_id": "optional-user"
}
```

- [deployment_gcp.md](/home/dubu/git/dev3pack3/apps/agent/docs/deployment_gcp.md)
- [model_providers.md](/home/dubu/git/dev3pack3/apps/agent/docs/model_providers.md)
