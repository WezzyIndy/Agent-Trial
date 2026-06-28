// Admin endpoint, gated by the ADMIN_KEY env var (sent as x-admin-key header).
//   GET  -> current teams, results, config, player names (for the admin UI)
//   POST { action, ... } -> mutate teams / results / lock
import {
  adminAuthorized,
  getR32,
  getConfig,
  getPlayers,
  getJSON,
  setJSON,
  publicPlayer,
  json,
} from './_lib.js'
import { pruneInvalidPicks } from '../../shared/bracket.js'

export default async (req) => {
  if (!adminAuthorized(req)) return json({ error: 'Unauthorized' }, 401)

  if (req.method === 'GET') {
    const [r32, config, players, results] = await Promise.all([
      getR32(),
      getConfig(),
      getPlayers(),
      getJSON('results', {}),
    ])
    return json({ r32, config, results, players: players.map(publicPlayer) })
  }

  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  let body
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Invalid JSON' }, 400)
  }

  const { action } = body || {}

  switch (action) {
    case 'setTeams': {
      const r32 = body.r32 || {}
      await setJSON('r32', r32)
      // Changing matchups can invalidate already-submitted picks — prune them.
      const picks = await getJSON('picks', {})
      for (const pid of Object.keys(picks)) {
        picks[pid] = pruneInvalidPicks(r32, picks[pid])
      }
      await setJSON('picks', picks)
      return json({ ok: true, r32 })
    }
    case 'setResult': {
      const { slotId, winner } = body
      if (!slotId) return json({ error: 'Missing slotId' }, 400)
      const results = await getJSON('results', {})
      if (winner) results[slotId] = winner
      else delete results[slotId]
      await setJSON('results', results)
      return json({ ok: true, results })
    }
    case 'setResults': {
      await setJSON('results', body.results || {})
      return json({ ok: true, results: body.results || {} })
    }
    case 'setLock': {
      const config = await getConfig()
      const next = {
        lockTimeISO: body.lockTimeISO || config.lockTimeISO,
        lockedOverride:
          body.lockedOverride === undefined ? config.lockedOverride : body.lockedOverride,
      }
      await setJSON('config', next)
      return json({ ok: true, config: next })
    }
    default:
      return json({ error: `Unknown action: ${action}` }, 400)
  }
}
