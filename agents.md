# Agents Guide

## Project Context

This project is a lightweight static frontend plus local Node backend.

The prototype appears to be a playful personal income and purchasing-power tracker. Users enter monthly income, a daily start/end time range, a target amount, and a work schedule. The page then calculates how much money is being earned over time and visualizes that progress as "coins", goal progress, and unlockable purchasing-power cards.

The current visual style has been redesigned as a Cute Folder Arcade UI. It uses a pale sky background, vivid blue active folder cards, white inactive folders, thick soft borders, sticker-like accents, rounded controls, warm stat panels, and a save-file/game-menu feeling.

## Current Page Model

- `index.html` contains HTML, CSS, and JavaScript in one file.
- `server.js` serves the page and exposes local JSON APIs.
- `data/state.json` stores saved settings and reward goals.
- The layout has a top brand/header, a left control panel, and a right results area.
- The left panel includes:
  - a stack of selectable folder cards
  - folder 01 for monthly income
  - folder 02 for daily start and end time selectors
  - folder 03 for work schedule tabs: double weekend, big/small week, single weekend, custom
  - custom monthly workday input when custom mode is selected
- The right side includes:
  - today's real-time earned amount
  - earning speed per second
  - long-term target progress bar
  - hourly rate, target progress, and next unlock stats
  - a purchasing-power card grid
  - custom goal name and amount inputs
  - toast notifications when a goal is unlocked or added

## Business Logic Understanding

- Daily work hours are calculated from the selected start and end times. If the end time is earlier than or equal to the start time, the range is treated as crossing midnight.
- Monthly work hours are calculated as `workDays * dailyHours`.
- Hourly income is calculated as `monthlyIncome / monthlyWorkHours`.
- Per-second income is calculated as `hourlyIncome / 3600`.
- Today's earned amount is calculated from the selected start time to the current real clock time, capped at the selected end time.
- Before the selected start time, today's earned amount is `0`; after the selected end time, it remains at the full daily amount.
- Changing income, start/end time, target, custom days, or schedule refreshes derived progress and unlock notifications.
- Goal progress is `earned / goal.price`.
- The next unlock is the first goal that has not reached 100%.
- Settings and custom goals are persisted through the local backend when the page is opened from `http://localhost:3000`.

## Known Issues To Handle Carefully

- Much of the Chinese text and emoji in `index.html` is currently mojibake, likely from an encoding mismatch. Examples include the page title, labels, strings, currency symbol, and default goal names.
- Some corrupted strings appear to have broken HTML or JavaScript string delimiters. Before expanding features, verify the page in the browser and repair encoding/text safely.
- The backend uses only Node built-ins; no dependency installation is required.
- If the page is opened directly as `file://`, API persistence is disabled. Use the local server URL for saved data.

## Development Rules

- Keep `index.html` as the source of truth until the project intentionally grows beyond a prototype.
- Preserve the playful, optimistic, game-like tone unless the product direction changes.
- Prefer small, direct changes over introducing frameworks.
- Keep HTML semantic and readable.
- Keep responsive behavior in mind: controls and cards should remain usable on mobile.
- Use UTF-8 for all files. When editing Chinese text or emoji, verify the browser displays them correctly.
- Do not add large libraries for simple calculations or layout.
- Avoid unrelated refactors when making targeted changes.
- Keep persistence scoped to `data/state.json` unless the project intentionally grows into a multi-user app.
- If calculations change, document the formula in this file and in `readme.md`.

## Backend API

- Start command: `npm start`
- Local URL: `http://localhost:3000`
- `GET /api/health`: health check.
- `GET /api/state`: returns saved settings and goals.
- `PUT /api/state`: replaces saved settings and goals after validation.

## Product Questions For The Owner

Please answer these four questions so the project direction can be recorded:

1. Who is the primary user of this tool: yourself, office workers broadly, freelancers, students, or another group?
2. Should the product feel more like a cute game, a serious finance tool, a motivational dashboard, or something else?
3. What is the most important next feature: fixing the current text/encoding, saving custom goals, adding charts/history, improving mobile UI, or another feature?
4. What core feeling should users leave with after using it: comfort, control, motivation, reduced anxiety, entertainment, or another feeling?

## Owner Answers

- Primary users: the owner personally, plus interested individual users.
- Product feeling: a cute and fun small tool that is convenient to leave running in the background.
- Next planned direction: change and improve the UI interface.
- Desired user feeling: motivation and emotional value.

## Direction After Owner Feedback

- Treat this as a personal, lightweight, emotionally supportive tool first.
- UI changes should preserve or improve the Cute Folder Arcade UI: folder cards, playful depth, sticker accents, rounded game controls, and "idle/always-on" friendliness.
- Avoid making the experience too corporate, analytical, or heavy unless explicitly requested.
- Future UI work should focus on delight, clarity at a glance, and a sense that progress is quietly accumulating while the page stays open.
