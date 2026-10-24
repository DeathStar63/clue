# Clue

Understand what might be going on, and who to see. An **educational** web app for India, built to be added to an iPhone home screen.

- **Skin, hair & nails:** safety check first → body map → your own words → doctor-style questions → photos with "also check here" prompts → possible causes explained in plain words → a one-page summary for your doctor.
- **Mind:** short, proven questionnaires (PHQ-9, GAD-7, AUDIT, EPDS and others) with a safety gate that shows Tele-MANAS (14416) and 112 instantly when needed. Free government help is listed first.

**Clue is not a doctor and does not diagnose.** It never suggests medicines. Everything stays on the phone: no account, no tracking.

## Run locally

```bash
npm install
npm run dev
```

## Test and build

```bash
npx vitest run
npm run build
```

Pushing to `main` deploys to GitHub Pages via `.github/workflows/deploy.yml`.

## Content review

The condition cards, safety rules and questionnaire handling still need review by a medical professional before wide sharing. Questionnaire credits and licence notes are in `src/mind/instruments.ts`.
