# Income Growth Prototype

## Overview

This is a single-page website prototype for turning income and work time into a playful real-time progress experience.

The page lets a user enter monthly income, a daily start/end time range, a financial target, and a work schedule. It then shows a live estimate of earned money, hourly income, target progress, and "purchasing power" goals that unlock as the simulated earnings grow.

## Current Prototype

The project currently contains:

- `index.html`: the full website prototype, including structure, styles, and interaction logic.
- `server.js`: a small local Node backend that serves the page and saves data.
- `data/state.example.json`: example saved settings and reward goals.
- `package.json`: start script for the local server.
- `agents.md`: working notes and development guidance for future edits.
- `readme.md`: this project summary.

## Main Experience

- Enter monthly income and choose the daily start/end time.
- Choose a work schedule: double weekend, big/small week, single weekend, or custom monthly workdays.
- Watch the page calculate today's real-time earned money from the selected start time to the current actual time.
- Track progress toward a target amount.
- View purchasing-power cards such as small daily purchases and larger goals.
- Add a custom purchase goal during the current browser session.
- Save settings and custom goals when opened through the local backend.

## Run Locally

Use Node.js and start the local backend:

```bash
npm start
```

Then open:

```text
http://localhost:3000
```

Opening `index.html` directly with `file://` still displays the page, but backend saving only works through the local server.

## Backend API

- `GET /api/health`: confirms the server is running.
- `GET /api/state`: reads saved settings and goals.
- `PUT /api/state`: saves settings and goals to `data/state.json`.

`data/state.json` is ignored by Git because it can contain personal salary settings.

## Current Design Direction

The prototype now uses a Cute Folder Arcade UI. It feels like a casual game menu or save-file selection screen, with selectable folder cards, soft sticker-like decorations, rounded toy-like controls, warm stat cards, and a prominent live income display.

## Current Limitations

- Some Chinese text and emoji in `index.html` are currently corrupted by an encoding issue.
- Persistence is local JSON storage only; there is no user account system yet.
- There is no separate build step or frontend framework.
- Calculations are prototype-level and should be reviewed before being treated as financial advice.

## Development Notes

- Keep the prototype simple and static unless the product direction changes.
- Use UTF-8 consistently.
- Preserve the current game-like visual identity when making ordinary improvements.
- Prioritize clarity of calculations and readability of labels.
- Test changes by opening `index.html` in a browser.

## Questions To Clarify The Vision

Please answer these four questions:

1. Who is the primary user of this tool: yourself, office workers broadly, freelancers, students, or another group?
2. Should the product feel more like a cute game, a serious finance tool, a motivational dashboard, or something else?
3. What is the most important next feature: fixing the current text/encoding, saving custom goals, adding charts/history, improving mobile UI, or another feature?
4. What core feeling should users leave with after using it: comfort, control, motivation, reduced anxiety, entertainment, or another feeling?

## Owner Answers

- Primary users: the creator personally, plus interested individual users.
- Desired product style: a cute, fun small tool that is easy to keep open while idling or working.
- Next priority: change and improve the UI.
- Desired feeling: motivation and emotional value.

## Product Direction

This prototype should grow as a playful personal tool rather than a formal finance dashboard. The UI direction is cute, relaxed, game-like, and pleasant to leave open for long periods.
