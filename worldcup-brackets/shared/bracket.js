// Shared bracket structure + scoring. Imported by both the React UI and the
// Netlify Functions, so keep this dependency-free and isomorphic.

// Rounds from Round of 32 down to the Final, with escalating point values.
export const ROUNDS = [
  { key: 'R32', name: 'Round of 32', matches: 16, points: 1 },
  { key: 'R16', name: 'Round of 16', matches: 8, points: 2 },
  { key: 'QF', name: 'Quarterfinals', matches: 4, points: 4 },
  { key: 'SF', name: 'Semifinals', matches: 2, points: 8 },
  { key: 'F', name: 'Final', matches: 1, points: 16 },
]

export const slotId = (roundKey, matchIndex) => `${roundKey}-${matchIndex}`

// Returns the two feeder slot ids for a given round/match, or null for R32
// (whose teams come from the configured matchups instead of feeders).
export function feedersFor(roundIndex, matchIndex) {
  if (roundIndex === 0) return null
  const prev = ROUNDS[roundIndex - 1]
  return [slotId(prev.key, matchIndex * 2 - 1), slotId(prev.key, matchIndex * 2)]
}

// Builds the full slot list (31 matches) with feeder references.
export function buildSlots() {
  const slots = []
  ROUNDS.forEach((round, roundIndex) => {
    for (let m = 1; m <= round.matches; m++) {
      slots.push({
        id: slotId(round.key, m),
        roundKey: round.key,
        roundIndex,
        roundName: round.name,
        points: round.points,
        match: m,
        feeders: feedersFor(roundIndex, m),
      })
    }
  })
  return slots
}

export const TOTAL_SLOTS = ROUNDS.reduce((n, r) => n + r.matches, 0) // 31

// Given a player's picks ({slotId: team}) and the configured R32 matchups
// ({ 'R32-1': {a, b}, ... }), resolve the two team options available at a slot.
// Later-round options depend on the player's own earlier picks.
export function optionsForSlot(slot, r32Matchups, picks) {
  if (slot.roundKey === 'R32') {
    const m = r32Matchups[slot.id] || {}
    return [m.a || null, m.b || null]
  }
  const [fa, fb] = slot.feeders
  return [picks[fa] || null, picks[fb] || null]
}

// When a player changes an earlier pick, downstream picks that referenced the
// removed team are no longer valid. Returns a cleaned picks object.
export function pruneInvalidPicks(r32Matchups, picks) {
  const slots = buildSlots()
  const out = { ...picks }
  // Walk rounds in order so upstream changes cascade forward.
  for (const slot of slots) {
    const [a, b] = optionsForSlot(slot, r32Matchups, out)
    const chosen = out[slot.id]
    if (chosen && chosen !== a && chosen !== b) {
      delete out[slot.id]
    }
  }
  return out
}

// Escalating scoring: a slot scores its round's points when the player's picked
// winner matches the actual winner of that slot.
export function computeStandings(players, picksByPlayer, results) {
  const slots = buildSlots()
  return players
    .map((p) => {
      const picks = picksByPlayer[p.id] || {}
      let points = 0
      let correct = 0
      const perRound = {}
      for (const slot of slots) {
        const actual = results[slot.id]
        if (actual && picks[slot.id] === actual) {
          points += slot.points
          correct += 1
          perRound[slot.roundKey] = (perRound[slot.roundKey] || 0) + 1
        }
      }
      return {
        id: p.id,
        name: p.name,
        points,
        correct,
        perRound,
        champion: picks['F-1'] || null,
        completed: Object.keys(picks).length,
      }
    })
    .sort((a, b) => b.points - a.points || b.correct - a.correct || a.name.localeCompare(b.name))
}
