COMPOSE := docker compose -f compose.yaml -f compose.dev.yaml

.PHONY: up down logs ps reset test web-shell agent-shell db-shell

up:
	$(COMPOSE) up --build

down:
	$(COMPOSE) down

logs:
	$(COMPOSE) logs -f

ps:
	$(COMPOSE) ps

reset:
	$(COMPOSE) down -v
	$(COMPOSE) up -d postgres
	$(COMPOSE) run --rm web bun db:push
	$(COMPOSE) run --rm web bun db:seed

test:
	$(COMPOSE) run --rm web bun test:run
	$(COMPOSE) run --rm agent sh -c "python -m pytest"

web-shell:
	$(COMPOSE) run --rm web sh

agent-shell:
	$(COMPOSE) run --rm agent sh

db-shell:
	$(COMPOSE) exec postgres psql -U postgres -d sentinel
