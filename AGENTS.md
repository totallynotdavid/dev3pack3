# project guidelines

## always

- use repo-local facts before assumptions
- use `bun` for JS workflows
- follow framework conventions and existing architecture
- implement only requested scope
- fix root causes, not symptoms
- prefer direct code over clever abstractions
- ask at most 2 clarifying questions when ambiguity blocks correctness
- state what was verified vs inferred

## when implementing

- make one coherent change at a time
- validate early, keep happy path straight
- remove temporary paths and placeholder logic from touched files
- after edits, summarize what changed, where, and what was validated
- parallelize independent reads/searches

## command map

repository root:

- `make up`
- `make down`
- `make logs`
- `make ps`
- `make reset`
- `make test`
- `make db-shell`

`apps/web`:

- `bun install`
- `bun dev`
- `bun run build`
- `bun x tsc --noEmit`
- `bun run test`
- `bun run lint`
- `bun run format`
- `bun run db:push`
- `bun run db:seed`

## generation rules

if GraphQL documents change in `apps/web`:

- `src/graphql/*.graphql` -> run `bun run generate`
- `src/checkout/graphql/*.graphql` -> run `bun run generate:checkout`

## coding rules

- file and directory naming: kebab-case
- component exports: PascalCase allowed
- web imports: use `@/` alias
- keep changes minimal and task-local
- do not rewrite unrelated files

## documentation rules

- use lowercase `readme.md` for readme files
- use sentence-case headings
- keep docs operational: setup, commands, env vars, troubleshooting
- avoid filler and process narrative
- do not add standalone `*integration*.md` files

## environment variables

web required:

- `NEXT_PUBLIC_SALEOR_API_URL`
- `NEXT_PUBLIC_DEFAULT_CHANNEL`

agent required:

- `POSTGRES_URL`
- `MODEL_PROVIDER`
- `HUGGINGFACE_API_KEY` or `OPENROUTER_API_KEY`
