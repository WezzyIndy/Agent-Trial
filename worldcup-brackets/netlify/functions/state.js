// GET /.netlify/functions/state?token=...
// Returns everything the UI needs: lock state, R32 matchups, your own picks,
// and — once locked — everyone's picks, results, and the standings.
import {
  getConfig,
  isLocked,
  getR32,
  getPlayers,
  getJSON,
  publicPlayer,
  json,
} from './_lib.js'
import { computeStandings } from '../../shared/bracket.js'

export default async (req) => {
  const token = new URL(req.url).searchParams.get('token') || ''
  const [config, r32, players, picksByPlayer, results] = await Promise.all([
    getConfig(),
    getR32(),
    getPlayers(),
    getJSON('picks', {}),
    getJSON('results', {}),
  ])
  const locked = isLocked(config)

  const me = token ? players.find((p) => p.token === token) : null
  const you = me
    ? { id: me.id, name: me.name, picks: picksByPlayer[me.id] || {} }
    : null

  const body = {
    lockTimeISO: config.lockTimeISO,
    locked,
    adminEnabled: Boolean(process.env.ADMIN_KEY),
    r32,
    playerCount: players.length,
    you,
  }

  if (locked) {
    // Reveal everyone's picks + standings after the lock.
    body.players = players.map((p) => ({
      ...publicPlayer(p),
      picks: picksByPlayer[p.id] || {},
    }))
    body.results = results
    body.standings = computeStandings(players.map(publicPlayer), picksByPlayer, results)
  } else {
    // Before lock, only expose who has joined (names), not their picks.
    body.players = players.map((p) => ({
      ...publicPlayer(p),
      submitted: Object.keys(picksByPlayer[p.id] || {}).length > 0,
    }))
  }

  return json(body)
}
