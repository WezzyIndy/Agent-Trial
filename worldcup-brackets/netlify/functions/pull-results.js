// POST /.netlify/functions/pull-results  (admin-gated)
// Best-effort auto-pull of actual results from football-data.org. Resolves the
// real teams at each bracket slot from results already known, then matches a
// FINISHED API fixture between those two teams and records the winner.
//
// Requires env FOOTBALL_DATA_API_KEY (free tier: https://www.football-data.org).
// If team names don't line up, the admin can still set results by hand — this
// never overwrites a result the admin set unless `overwrite` is true.
import {
  adminAuthorized,
  getR32,
  getJSON,
  setJSON,
  json,
} from './_lib.js'
import { buildSlots } from '../../shared/bracket.js'

const norm = (s) =>
  (s || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip combining diacritical marks
    .toLowerCase()
    .replace(/[^a-z]/g, '')

// A few aliases where the API name differs from a common short name.
const ALIASES = {
  unitedstates: 'usa',
  korearepublic: 'southkorea',
  iranislamicrepublic: 'iran',
  ivorycoast: 'cotedivoire',
}
const canon = (s) => {
  const n = norm(s)
  return ALIASES[n] || n
}

export default async (req) => {
  if (!adminAuthorized(req)) return json({ error: 'Unauthorized' }, 401)

  const apiKey = process.env.FOOTBALL_DATA_API_KEY
  if (!apiKey) {
    return json(
      { error: 'No FOOTBALL_DATA_API_KEY configured. Enter results manually in Admin.' },
      400
    )
  }

  let overwrite = false
  try {
    overwrite = Boolean((await req.json())?.overwrite)
  } catch {
    /* no body is fine */
  }

  // Fetch the World Cup fixtures.
  let matches
  try {
    const resp = await fetch('https://api.football-data.org/v4/competitions/WC/matches', {
      headers: { 'X-Auth-Token': apiKey },
    })
    if (!resp.ok) {
      return json({ error: `football-data.org returned ${resp.status}` }, 502)
    }
    matches = (await resp.json()).matches || []
  } catch (e) {
    return json({ error: `Fetch failed: ${e.message}` }, 502)
  }

  // Index finished matches by the unordered pair of canonical team names.
  const finished = new Map()
  for (const m of matches) {
    if (m.status !== 'FINISHED') continue
    const home = m.homeTeam?.name
    const away = m.awayTeam?.name
    if (!home || !away) continue
    let winner = null
    if (m.score?.winner === 'HOME_TEAM') winner = home
    else if (m.score?.winner === 'AWAY_TEAM') winner = away
    if (!winner) continue // draw/penalties without a decided winner field — skip
    finished.set([canon(home), canon(away)].sort().join('|'), winner)
  }

  const r32 = await getR32()
  const results = await getJSON('results', {})
  const slots = buildSlots()

  // Resolve the actual two teams at a slot, using known results upstream.
  const actualTeams = (slot) => {
    if (slot.roundKey === 'R32') {
      const m = r32[slot.id] || {}
      return [m.a, m.b]
    }
    return [results[slot.feeders[0]], results[slot.feeders[1]]]
  }

  const applied = []
  // Iterate in round order so upstream winners feed downstream resolution.
  for (const slot of slots) {
    if (results[slot.id] && !overwrite) continue
    const [a, b] = actualTeams(slot)
    if (!a || !b) continue
    const key = [canon(a), canon(b)].sort().join('|')
    const winner = finished.get(key)
    if (winner) {
      // Store the winner using our configured spelling (a or b).
      results[slot.id] = canon(winner) === canon(a) ? a : b
      applied.push({ slot: slot.id, winner: results[slot.id] })
    }
  }

  await setJSON('results', results)
  return json({ ok: true, applied, count: applied.length, results })
}
