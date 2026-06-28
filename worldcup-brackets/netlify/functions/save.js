// POST /.netlify/functions/save { token, picks }  ->  { ok, picks }
// Saves a player's bracket. Rejected once locked. Server re-validates picks
// against the configured matchups so only legal selections are stored.
import {
  getPlayers,
  getR32,
  getConfig,
  isLocked,
  getJSON,
  setJSON,
  json,
} from './_lib.js'
import { buildSlots, optionsForSlot } from '../../shared/bracket.js'

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  let body
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Invalid JSON' }, 400)
  }

  const { token, picks: incoming } = body || {}
  if (!token) return json({ error: 'Missing token.' }, 401)

  const config = await getConfig()
  if (isLocked(config)) return json({ error: 'Brackets are locked.' }, 403)

  const players = await getPlayers()
  const player = players.find((p) => p.token === token)
  if (!player) return json({ error: 'Not recognized — please rejoin.' }, 401)

  // Re-validate the submitted picks slot-by-slot against legal options so a
  // tampered request can't store an impossible bracket.
  const r32 = await getR32()
  const slots = buildSlots()
  const clean = {}
  for (const slot of slots) {
    const [a, b] = optionsForSlot(slot, r32, clean)
    const chosen = incoming?.[slot.id]
    if (chosen && (chosen === a || chosen === b)) clean[slot.id] = chosen
  }

  const all = await getJSON('picks', {})
  all[player.id] = clean
  await setJSON('picks', all)

  return json({ ok: true, picks: clean })
}
