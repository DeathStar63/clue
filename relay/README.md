# Clue relay

A tiny Cloudflare Worker. The Clue app sends it what a person typed ("itchy red patches on my elbows for 3 months"), and it sends back Clue's symptom ids (`itchy`, `red_inflamed`, `duration_over_6w`, area `elbows`). It asks an AI model to do the reading.

The AI key lives only inside this Worker, as a secret. It is never in the app and never in this folder.

## What it does

- `POST /extract` with `{ "text": "..." }` (1 to 1200 characters) returns `{ "features": [...], "areas": [...], "provider": "gemini" }`.
- Any id the model makes up is thrown away before the answer goes back.
- `GET /health` returns `{ "ok": true, "provider": "gemini" }`.
- Only the Clue website and local dev (`ALLOWED_ORIGINS` in `wrangler.toml`) can call it. Other sites get a 403.
- Errors come back as `{ "error": "..." }`: 400 bad input, 403 wrong site, 413 too long, 429 too many requests, 502 the model failed or said no.
- What people type is not logged.

## Set it up (you run these yourself)

You paste your own key. Nobody else needs to see it.

1. Install:
   ```
   cd relay && npm install
   ```
2. Log in to Cloudflare (opens your browser; a free account is fine):
   ```
   npx wrangler login
   ```
3. Add your Gemini key. Get one free at https://aistudio.google.com, then run this and paste it when asked:
   ```
   npx wrangler secret put GEMINI_API_KEY
   ```
4. Put it online:
   ```
   npx wrangler deploy
   ```
   It prints a link like `https://clue-relay.<your-subdomain>.workers.dev`. That link is the relay URL the app needs.

5. Check it works: open `https://clue-relay.<your-subdomain>.workers.dev/health` in a browser. You should see `{"ok":true,"provider":"gemini"}`.

## Switch to Claude later

1. Add your Anthropic key (from https://console.anthropic.com):
   ```
   npx wrangler secret put ANTHROPIC_API_KEY
   ```
2. In `wrangler.toml`, change `PROVIDER = "gemini"` to `PROVIDER = "claude"`.
3. Run `npx wrangler deploy` again.

To go back, set `PROVIDER = "gemini"` and deploy again.

## Privacy, read before real users

On Gemini's **free tier**, Google may use what people type to improve its products. That is fine for your own testing. Before real people use Clue, either turn on paid billing for your Gemini key or switch to Claude.

## Limits

- Text over 1200 characters is refused.
- Each IP gets about 20 requests a minute. This counter lives in memory on each Cloudflare server, so it is best-effort, not a hard wall. For stronger protection, add Cloudflare's Rate Limiting rules in the dashboard.

## For developers

```
npm test            # vitest
npx tsc --noEmit    # type check
npx wrangler dev    # run locally (put keys in a .dev.vars file, never commit it)
```

The list of symptom ids comes straight from `../src/data/features.ts` and `../src/data/bodyAreas.ts`, so redeploy the relay whenever those change.
