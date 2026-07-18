# Redial & Guardrails Campaign Score Dashboard

An interactive Next.js dashboard built to configure and evaluate outbound calling settings. The app calculates a real-time campaign efficiency score based on the organization's rules and visualizes campaign health using dynamic weather-themed backdrops.

## What it does

Outbound calling campaigns require fine-tuning to run efficiently. This app provides a simple UI to test calling configurations and see their impact immediately:

* **Guardrails Management**: Toggle calling days of the week (Monday through Sunday) and slide the calling window end-time (from 8 AM up to 9 PM).
* **Redial Tuning**: Adjust the redial count (0–10 attempts) and select the cooling-off interval between retries (3 to 24 hours).
* **Real-time Penalty Scoring**: Computes a score out of 100 using a formula based on org-level optimal targets. Any non-optimal configurations deduct penalty points from the score.
* **Visual Weather Levels**: The campaign score determines the weather rating, swapping the card illustration to reflect the health of your setup:
  * **Level 1 (Score 82-100)**: Clear Skyline (Optimal settings)
  * **Level 2 (Score 62-81)**: Cloudy
  * **Level 3 (Score 42-61)**: Overcast (Triggers an "optimization needed" alert)
  * **Level 4 (Score 0-41)**: Rainy / Stormy

## Technology Stack

* **Framework**: Next.js (App Router)
* **Language**: TypeScript
* **Styling**: Tailwind CSS
* **Scoring Logic**: Separated logic layer under `src/utils/scoring.ts`

## Getting Started

First, install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the dashboard.
