// Default Round-of-32 matchups. The 2026 World Cup knockout pairings depend on
// group-stage results, so these ship as editable placeholders. The admin sets
// the 32 real team names from the Admin screen (or you can pre-fill them here)
// BEFORE sharing the link with the family.
//
// Shape: { 'R32-1': { a: 'Team A', b: 'Team B' }, ... } for all 16 matches.
export const DEFAULT_R32 = Object.fromEntries(
  Array.from({ length: 16 }, (_, i) => {
    const n = i + 1
    return [`R32-${n}`, { a: `Team ${n * 2 - 1}`, b: `Team ${n * 2}` }]
  })
)
