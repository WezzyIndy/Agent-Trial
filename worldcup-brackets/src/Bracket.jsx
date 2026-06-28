import React from 'react'
import { ROUNDS, buildSlots, optionsForSlot } from '../shared/bracket.js'

const SLOTS = buildSlots()

// Renders a bracket round-by-round (mobile-friendly column layout).
// - editable: when onPick is provided, options are tappable.
// - results: when provided, marks each slot correct/incorrect vs the actual
//   winner and shows what really happened.
export default function Bracket({ r32, picks, onPick, results }) {
  return (
    <div className="bracket">
      {ROUNDS.map((round) => (
        <section key={round.key} className="round">
          <h3 className="round-title">
            {round.name} <span className="pts">{round.points} pt{round.points > 1 ? 's' : ''} each</span>
          </h3>
          <div className="matches">
            {SLOTS.filter((s) => s.roundKey === round.key).map((slot) => {
              const [a, b] = optionsForSlot(slot, r32, picks)
              const chosen = picks[slot.id] || null
              const actual = results ? results[slot.id] : undefined
              return (
                <div className="match" key={slot.id}>
                  {[a, b].map((team, idx) => {
                    const isChosen = chosen && team === chosen
                    const ready = Boolean(team)
                    let status = ''
                    if (actual && isChosen) status = team === actual ? 'correct' : 'wrong'
                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={!onPick || !ready}
                        className={[
                          'team',
                          isChosen ? 'chosen' : '',
                          status,
                        ].join(' ').trim()}
                        onClick={() => ready && onPick && onPick(slot.id, team)}
                      >
                        <span className="team-name">{team || 'TBD'}</span>
                        {actual && team === actual && <span className="badge">✓ won</span>}
                      </button>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
