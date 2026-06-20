# gubbi-content

Static weekly content for the **Gubbi** kids learning app, served from GitHub Pages.

- `manifest.json` — `{ latestWeek, weeks[] }` (newest first). The app reads this on launch.
- `weeks/<YYYY-MM-DD>/content.json` — one week of lessons (validated against the app schema).
- `weeks/<YYYY-MM-DD>/img/` — optional images referenced by `content.json` (current weeks use emoji/text labels, so these are empty).
- `validate.mjs` — run before every push; a bad week must never reach a phone.

## Publish a new week

1. Add `weeks/<date>/content.json` (and any `img/`).
2. Update `manifest.json`: set `latestWeek` and prepend the date to `weeks[]`.
3. `node validate.mjs` → must print ✓ for every week and exit 0.
4. Commit and deploy the repo root to the `gh-pages` branch.

Served at: https://pratheek17.github.io/gubbi-content/
