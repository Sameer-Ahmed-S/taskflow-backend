# taskflow-backend

TaskFlow API — Express + Postgres. Implements the **contract** defined by the spec (ADR-001).

| Repo | Role |
|------|------|
| [taskflow-spec](https://github.com/Sameer-Ahmed-S/taskflow-spec) | **Single source of truth**: requirements, contracts, ADRs |
| [taskflow-db](https://github.com/Sameer-Ahmed-S/taskflow-db) | Postgres schema + migrations |
| **taskflow-backend** (this) | Express API implementing the contract |
| [taskflow-frontend](https://github.com/Sameer-Ahmed-S/taskflow-frontend) | React SPA |

## The spec (start here for any change)

The authoritative spec lives in [taskflow-spec](https://github.com/Sameer-Ahmed-S/taskflow-spec):

- [`requirements.md`](https://github.com/Sameer-Ahmed-S/taskflow-spec/blob/main/requirements.md) — entities + functional requirements
- [`contracts/tasks-api.yaml`](https://github.com/Sameer-Ahmed-S/taskflow-spec/blob/main/contracts/tasks-api.yaml) — OpenAPI contract served by this API
- [`decisions.md`](https://github.com/Sameer-Ahmed-S/taskflow-spec/blob/main/decisions.md) — ADRs, including the contract-first change order (ADR-002)

## Run locally

```sh
cp .env.example .env   # defaults match taskflow-db's docker-compose
npm install
npm run dev            # http://localhost:4000/api
```

Requires `taskflow-db` running (`docker compose up -d` in that repo).

## Endpoints

`GET /api/tasks` · `POST /api/tasks` · `GET /api/tasks/:id` · `PATCH /api/tasks/:id` · `DELETE /api/tasks/:id` — see the contract for exact shapes.
