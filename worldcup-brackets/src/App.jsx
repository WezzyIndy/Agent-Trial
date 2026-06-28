import React, { useEffect, useState, useRef, useCallback } from 'react'
import * as api from './api.js'
import Bracket from './Bracket.jsx'
import AdminPanel from './AdminPanel.jsx'
import { TOTAL_SLOTS, pruneInvalidPicks } from '../shared/bracket.js'

const TOKEN_KEY = 'wc_token'

function useHash() {
  const [hash, setHash] = useState(window.location.hash)
  useEffect(() => {
    const on = () => setHash(window.location.hash)
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return hash
}

function Countdown({ iso }) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  const ms = new Date(iso).getTime() - now
  if (ms <= 0) return <span className="countdown">locking…</span>
  const s = Math.floor(ms / 1000)
  const d = Math.floor(s / 86400)
  const h = Math.floor((s % 86400) / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  const parts = d ? [`${d}d`, `${h}h`, `${m}m`] : [`${h}h`, `${m}m`, `${sec}s`]
  return <span className="countdown">{parts.join(' ')} left to pick</span>
}

export default function App() {
  const hash = useHash()
  if (hash === '#admin') return <AdminPanel />

  return <Pool />
}

function Pool() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '')
  const [state, setState] = useState(null)
  const [error, setError] = useState('')
  const [picks, setPicks] = useState({})
  const [saveStatus, setSaveStatus] = useState('') // '', 'saving', 'saved', 'error'
  const saveTimer = useRef(null)

  const load = useCallback(async () => {
    try {
      const s = await api.getState(token)
      setState(s)
      if (s.you) setPicks(s.you.picks || {})
      setError('')
      return s
    } catch (e) {
      setError(e.message)
      return null
    }
  }, [token])

  useEffect(() => {
    load()
  }, [load])

  // Once locked, poll for live leaderboard/results updates.
  useEffect(() => {
    if (!state?.locked) return
    const t = setInterval(load, 30000)
    return () => clearInterval(t)
  }, [state?.locked, load])

  const onPick = (slotId, team) => {
    setPicks((prev) => {
      const next = pruneInvalidPicks(state.r32, { ...prev, [slotId]: team })
      scheduleSave(next)
      return next
    })
  }

  const scheduleSave = (next) => {
    setSaveStatus('saving')
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      try {
        await api.savePicks(token, next)
        setSaveStatus('saved')
      } catch (e) {
        setSaveStatus('error')
        setError(e.message)
      }
    }, 600)
  }

  const handleJoin = async (name) => {
    try {
      const r = await api.join(name)
      localStorage.setItem(TOKEN_KEY, r.token)
      setToken(r.token)
      await load()
    } catch (e) {
      setError(e.message)
    }
  }

  if (!state) {
    return (
      <Shell>
        {error ? <p className="error">{error}</p> : <p className="muted">Loading…</p>}
      </Shell>
    )
  }

  // Locked → everyone's brackets + leaderboard.
  if (state.locked) {
    return (
      <Shell subtitle="Brackets are locked 🔒">
        <LockedView state={state} />
      </Shell>
    )
  }

  // Not joined yet → name entry.
  if (!state.you) {
    return (
      <Shell subtitle={<Countdown iso={state.lockTimeISO} />}>
        <JoinForm onJoin={handleJoin} players={state.players} error={error} />
      </Shell>
    )
  }

  // Joined & open → bracket editor.
  const picked = Object.keys(picks).length
  return (
    <Shell subtitle={<Countdown iso={state.lockTimeISO} />}>
      <div className="toolbar">
        <div>
          <strong>{state.you.name}</strong>'s bracket
          <span className="muted"> — {picked}/{TOTAL_SLOTS} picked</span>
        </div>
        <div className={`save ${saveStatus}`}>
          {saveStatus === 'saving' && 'Saving…'}
          {saveStatus === 'saved' && 'Saved ✓'}
          {saveStatus === 'error' && 'Save failed'}
        </div>
      </div>
      {error && <p className="error">{error}</p>}
      <p className="muted small">
        Tap a team to advance it. Your picks save automatically and you can change
        them until the lock. Everyone's brackets reveal after the deadline.
      </p>
      <Bracket r32={state.r32} picks={picks} onPick={onPick} />
    </Shell>
  )
}

function Shell({ children, subtitle }) {
  return (
    <div className="wrap">
      <header className="app-header">
        <h1>🏆 Family World Cup Brackets</h1>
        {subtitle && <div className="subtitle">{subtitle}</div>}
      </header>
      {children}
      <footer className="app-footer muted small">
        World Cup 2026 · Round of 32 → Final
      </footer>
    </div>
  )
}

function JoinForm({ onJoin, players, error }) {
  const [name, setName] = useState('')
  return (
    <div className="card">
      <h2>Who are you?</h2>
      <p className="muted">Enter your name to start your bracket. No password needed.</p>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (name.trim()) onJoin(name.trim())
        }}
      >
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Grandpa Joe"
          maxLength={40}
        />
        <button type="submit" className="primary">Start my bracket</button>
      </form>
      {error && <p className="error">{error}</p>}
      {players?.length > 0 && (
        <p className="muted small">
          Already playing: {players.map((p) => p.name).join(', ')}
        </p>
      )}
    </div>
  )
}

function LockedView({ state }) {
  const [view, setView] = useState('leaderboard') // 'leaderboard' | playerId
  const standings = state.standings || []
  const selected = state.players?.find((p) => p.id === view)

  return (
    <div>
      <div className="tabs">
        <button
          className={view === 'leaderboard' ? 'active' : ''}
          onClick={() => setView('leaderboard')}
        >
          Leaderboard
        </button>
        {state.players?.map((p) => (
          <button key={p.id} className={view === p.id ? 'active' : ''} onClick={() => setView(p.id)}>
            {p.name}
          </button>
        ))}
      </div>

      {view === 'leaderboard' ? (
        <table className="leaderboard">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Points</th>
              <th>Correct</th>
              <th>Champion pick</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((row, i) => (
              <tr key={row.id}>
                <td>{i + 1}</td>
                <td>{row.name}</td>
                <td><strong>{row.points}</strong></td>
                <td>{row.correct}</td>
                <td className="muted">{row.champion || '—'}</td>
              </tr>
            ))}
            {standings.length === 0 && (
              <tr><td colSpan="5" className="muted">No players.</td></tr>
            )}
          </tbody>
        </table>
      ) : (
        <div>
          <h2>{selected?.name}'s bracket</h2>
          <Bracket r32={state.r32} picks={selected?.picks || {}} results={state.results} />
        </div>
      )}
    </div>
  )
}
