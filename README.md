# taskflow-backend

TaskFlow API — Express + Postgres. Owns the **contract** and hosts the authoritative **spec** in [`/spec`](./spec) (ADR-001).

| Repo | Role |
|------|------|
| [taskflow-db](https://github.com/Sameer-Ahmed-S/taskflow-db) | Postgres schema + migrations |
| **taskflow-backend** (this) | Express API + authoritative spec |
| [taskflow-frontend](https://github.com/Sameer-Ahmed-S/taskflow-frontend) | React SPA |

## The spec (start here for any change)

- [`spec/requirements.md`](./spec/requirements.md) — entities + functional requirements
- [`spec/contracts/tasks-api.yaml`](./spec/contracts/tasks-api.yaml) — OpenAPI contract served by this API
- [`spec/decisions.md`](./spec/decisions.md) — ADRs, including the contract-first change order (ADR-002)

## Run locally

```sh
cp .env.example .env   # defaults match taskflow-db's docker-compose
npm install
npm run dev            # http://localhost:4000/api
```

Requires `taskflow-db` running (`docker compose up -d` in that repo).

## Endpoints

`GET /api/tasks` · `POST /api/tasks` · `GET /api/tasks/:id` · `PATCH /api/tasks/:id` · `DELETE /api/tasks/:id` — see the contract for exact shapes.
