# Demo Website — Riverside Family Clinic

A small static website (a fictional clinic/hospital) used to **test the AI Chat
Assistant** by embedding it exactly the way a real customer would: with the
widget's `<script>` snippet. The assistant mounts in the corner as a floating
chat launcher.

This is a plain HTML/CSS site — no build step. It just needs to be served over
HTTP (opening the file directly with `file://` will not work because the widget
makes network requests).

```
demo-website/
  index.html        The clinic host page (hero, services, doctors, hours, FAQ…)
  styles.css        Site styles
  demo-config.js    Injects the widget embed snippet; lets you override the
                    site key / backend URL at runtime (stored in localStorage)
  widget/
    aca-widget.js   The built assistant widget bundle (copied from the
                    AI chat assistant monorepo)
```

## How the embed works

In production a site owner drops one async script tag onto their page:

```html
<script async src="https://your-cdn.example.com/aca-widget.js"
  data-aca-site="pk_xxxxxxxxxxxx"
  data-aca-base="https://your-api.example.com"></script>
```

- `data-aca-site` — the site's **public key** (created in the dashboard).
- `data-aca-base` — the **backend base URL**.

This demo does the same thing via `demo-config.js`. It defaults to the site key
provisioned locally for this demo (`pk_acddc46807a10f40f1236a4d`) and backend
`http://localhost:8787`, and adds a **"Configure widget"** button (top banner)
so you can paste a different key/URL without editing files.

## Current local state (already set up)

For this machine the full stack has already been brought up:

- Postgres (pgvector) running in Docker, migrations applied.
- Backend running on `:8787` with `LLM_PROVIDER=ollama` (chat `qwen3:1.7b`,
  embeddings `nomic-embed-text`) — no OpenAI key needed.
- A site provisioned: **`pk_acddc46807a10f40f1236a4d`** (login
  `demo@riverside.example` / `demopass123`).
- This demo page crawled and indexed, so the assistant answers from the clinic
  content (verified: it correctly returns Saturday hours and urgent-care policy
  with a citation back to the page).

Just serve this folder (below) and open it — the chat launcher appears bottom-right.

## Prerequisites — the assistant must be running

The widget is only a front end. To see it actually answer questions you need
the assistant's **backend** running and a **site** provisioned. From the
`AI chat assistant/` project:

1. **Start the database** (Postgres + pgvector):

   ```bash
   docker compose up -d
   pnpm --filter @aca/backend migrate
   ```

2. **Run the backend** with the mock LLM (no OpenAI key needed):

   ```bash
   LLM_PROVIDER=mock pnpm --filter @aca/backend dev   # serves on :8787
   ```

   Make sure `CORS_ORIGINS` allows this demo's origin (e.g. `*` for local dev),
   since the page is served from a different port than the backend.

3. **Provision a site** to get a public key. Create one via the owner
   dashboard (`pnpm --filter @aca/dashboard dev`, then sign up and add a site),
   or via the owner API. Copy the generated `pk_…` key. Crawl some content so
   the assistant has something to answer from.

4. (Optional) **Rebuild the widget** if you've changed it, then refresh the copy
   here:

   ```bash
   pnpm --filter @aca/widget build
   cp packages/widget/dist/aca-widget.js /path/to/demo-website/widget/aca-widget.js
   ```

## Run the demo

Serve this folder over HTTP from `demo-website/`:

```bash
npx serve -l 4000 .
# or: python3 -m http.server 4000
```

Then open http://localhost:4000.

1. Click **Configure widget** in the top banner.
2. Enter your site public key (`pk_…`) and backend URL (`http://localhost:8787`).
3. The page reloads and the chat launcher appears in the corner. Open it and
   ask something like *"What are your Saturday hours?"* or *"Do I need an
   appointment for urgent care?"*.

## Notes

- With no backend reachable, the page renders fine but the chat launcher won't
  appear (the widget aborts mounting if `GET /widget-config/:key` fails — check
  the browser console for an `[ACA]` error).
- The clinic content (services, hours, insurance, FAQ) is intentionally
  detailed so a crawl + RAG has realistic material to answer from.
- This is a fictional business. Phone numbers, addresses, and emails are
  placeholders.
