# Contributing

Shopie is deployed from the GitHub repository to Render. Treat every merged change as deployment-impacting.

## Local Setup

1. Install root dependencies with `npm install`.
2. Install frontend dependencies with `npm install --prefix frontend`.
3. Copy `backend/config/config.env.example` to `backend/config/config.env`.
4. Run the backend with `npm run dev`.
5. Run the frontend with `API_PROXY_TARGET=http://localhost:4000 npm start --prefix frontend`.

## Checks Before Merge

Run:

```bash
npm run check:backend
npm run build --prefix frontend
```

## Pull Request Expectations

- Keep backend and frontend changes scoped.
- Document any new environment variable.
- Mention whether a Render manual deploy is required.
- Do not commit `backend/config/config.env`, `.env`, or real credentials.

## Commit Style

Prefer short, descriptive commits:

```text
fix: prevent duplicate stock decrement on order update
docs: document render deployment flow
chore: add ci workflow
```
