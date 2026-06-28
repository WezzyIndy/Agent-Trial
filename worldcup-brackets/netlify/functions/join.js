// POST /.netlify/functions/join { name }  ->  { id, name, token }
// Name-only identity. If the name already exists we hand back a fresh token so
// the same person can re-claim their bracket from a new device (trusted family
// pool). Returns the token the client stores in localStorage to edit picks.
import { getPlayers, setJSON, isLocked, getConfig, randomId, json } from './_lib.js'

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  let body
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Invalid JSON' }, 400)
  }

  const name = (body?.name || '').trim().slice(0, 40)
  if (!name) return json({ error: 'Please enter a name.' }, 400)

  const config = await getConfig()
  if (isLocked(config)) {
    return json({ error: 'Brackets are locked — no new entries.' }, 403)
  }

  const players = await getPlayers()
  let player = players.find((p) => p.name.toLowerCase() === name.toLowerCase())
  if (player) {
    player.token = randomId() // re-issue an edit token for this name
  } else {
    player = { id: randomId(), name, token: randomId() }
    players.push(player)
  }
  await setJSON('players', players)

  return json({ id: player.id, name: player.name, token: player.token })
}
