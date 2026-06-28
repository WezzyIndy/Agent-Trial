# 🏆 Family World Cup Brackets (2026)

A tiny web app for a family bracket pool covering the **Round of 32 → Final** of
the 2026 World Cup. Everyone opens one shared link, types their name, and picks
the whole knockout bracket. At the deadline, brackets lock, everyone's picks
reveal, and a **live leaderboard** scores results as games finish.

- **No accounts / passwords** — name-only entry (a token is stored in the
  browser so you can edit your own bracket until lock).
- **Storage:** Netlify Blobs (built in — no database to set up).
- **Scoring (escalating):** R32 = 1, R16 = 2, QF = 4, Semi = 8, Final = 16.
  A perfect bracket is **80 points**.
- **Results:** enter winners by hand in the Admin screen, or auto-pull from a
  free football API.

---

## 1. Deploy to Netlify (≈5 minutes)

The app lives in the `worldcup-brackets/` subfolder of this repo. Two options:

### Option A — Connect the Git repo (recommended)

1. Push this branch to GitHub (already done if you're reading this there).
2. In Netlify: **Add new site → Import an existing project →** pick this repo.
3. Set these build settings:
   - **Base directory:** `worldcup-brackets`
   - **Build command:** `npm run build`
   - **Publish directory:** `worldcup-brackets/dist`
   - (Functions are auto-detected at `worldcup-brackets/netlify/functions`.)
4. Add the environment variable **`ADMIN_KEY`** (any secret string you choose —
   this protects the Admin screen). See step 2.
5. Deploy. Netlify gives you a URL like `https://your-pool.netlify.app`.

### Option B — Deploy from your machine with the CLI

```bash
cd worldcup-brackets
npm install
npm run build
npx netlify deploy --prod
# follow prompts to log in and link/create a site
```

Then set `ADMIN_KEY` under **Site settings → Environment variables** and redeploy.

> **Netlify Blobs** needs no setup — it's enabled automatically for any Netlify
> site, so picks persist with zero extra config.

---

## 2. Required & optional environment variables

| Variable | Required? | What it does |
|---|---|---|
| `ADMIN_KEY` | **Yes** | Unlocks the Admin screen (`/#admin`). Without it, admin is disabled and you can't set teams/results. |
| `FOOTBALL_DATA_API_KEY` | Optional | Enables ⚡ "Auto-pull from API" for results. Get a free key at <https://www.football-data.org/client/register>. You can skip this and enter results by hand. |

---

## 3. First-run setup (do this before sharing the link)

1. Open **`https://your-pool.netlify.app/#admin`** and enter your `ADMIN_KEY`.
2. **Round-of-32 teams:** type the 32 real team names into the 16 matchups and
   **Save teams**. (They ship as placeholders like "Team 1" because the real
   Round-of-32 pairings depend on group-stage results.) ⚠️ Do this *before*
   people pick — changing teams afterward clears picks that no longer fit.
3. **Lock time:** the default is **11:59 pm ET on 2026-06-28**
   (`2026-06-29T03:59:00.000Z`). Change it under **Lock** if you want more time
   — set a new ISO time (UTC) and **Save lock time**, or use **Force open /
   Force lock** to override immediately.
4. Share the base URL (`https://your-pool.netlify.app`) with the family.

---

## 4. Running the pool

- **Family members:** open the link → enter name → tap a team in each match to
  advance it → picks autosave. They can edit until the lock.
- **At the deadline:** brackets lock automatically; the app switches to the
  leaderboard + everyone's brackets.
- **Scoring as games finish:** in `/#admin → Results & scoring`, tap the actual
  winner of each match (Round of 32 first; later rounds unlock as winners
  advance). Or click **⚡ Auto-pull from API** if you set
  `FOOTBALL_DATA_API_KEY`. The leaderboard updates live (refreshes ~every 30s).

---

## 5. Local development

```bash
cd worldcup-brackets
npm install
npm run netlify-dev   # needs the Netlify CLI: npm i -g netlify-cli
```

`netlify dev` serves the site **and** the functions (with a local Blobs
sandbox). Plain `npm run dev` runs only the front end without the API.

---

## How it works (quick tour)

```
worldcup-brackets/
├── shared/bracket.js        # bracket tree + escalating scoring (used by UI + API)
├── shared/defaultTeams.js   # placeholder R32 matchups (edit in Admin)
├── src/                     # React app (Bracket, App, AdminPanel)
└── netlify/functions/
    ├── state.js             # public state + your picks + (after lock) standings
    ├── join.js              # name-only entry
    ├── save.js              # save a bracket (server-validated, blocked when locked)
    ├── admin.js             # set teams / results / lock  (ADMIN_KEY required)
    └── pull-results.js      # optional football-data.org auto-pull
```
