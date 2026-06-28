import React, { useEffect, useState } from 'react'
import * as api from './api.js'
import Bracket from './Bracket.jsx'

const ADMIN_KEY = 'wc_admin'

export default function AdminPanel() {
  const [key, setKey] = useState(() => localStorage.getItem(ADMIN_KEY) || '')
  const [authed, setAuthed] = useState(false)
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')

  const load = async (k = key) => {
    try {
      const d = await api.adminGet(k)
      setData(d)
      setAuthed(true)
      localStorage.setItem(ADMIN_KEY, k)
      setError('')
    } catch (e) {
      setError(e.message)
      setAuthed(false)
    }
  }

  useEffect(() => {
    if (key) load(key)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const flash = (m) => {
    setMsg(m)
    setTimeout(() => setMsg(''), 2500)
  }

  if (!authed) {
    return (
      <div className="wrap">
        <header className="app-header"><h1>🔧 Admin</h1></header>
        <div className="card">
          <h2>Enter admin key</h2>
          <p className="muted small">
            This is the <code>ADMIN_KEY</code> you set in Netlify's environment variables.
          </p>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="admin key"
          />
          <button className="primary" onClick={() => load(key)}>Unlock admin</button>
          {error && <p className="error">{error}</p>}
        </div>
        <p className="muted small"><a href="#">← back to the pool</a></p>
      </div>
    )
  }

  return (
    <div className="wrap">
      <header className="app-header">
        <h1>🔧 Admin</h1>
        <div className="subtitle"><a href="#">← back to the pool</a></div>
      </header>
      {msg && <p className="ok-banner">{msg}</p>}
      {error && <p className="error">{error}</p>}

      <LockControls data={data} adminKey={key} onDone={(m) => { flash(m); load() }} />
      <TeamsEditor data={data} adminKey={key} onDone={(m) => { flash(m); load() }} />
      <ResultsEditor data={data} adminKey={key} onDone={(m) => { flash(m); load() }} />
    </div>
  )
}

function Section({ title, children, desc }) {
  return (
    <section className="card">
      <h2>{title}</h2>
      {desc && <p className="muted small">{desc}</p>}
      {children}
    </section>
  )
}

function LockControls({ data, adminKey, onDone }) {
  const cfg = data.config || {}
  const [iso, setIso] = useState(cfg.lockTimeISO || '')

  const post = async (payload, m) => {
    try {
      await api.adminPost(adminKey, { action: 'setLock', ...payload })
      onDone(m)
    } catch (e) {
      alert(e.message)
    }
  }

  const override = cfg.lockedOverride
  const overrideLabel =
    override === true ? 'FORCED LOCKED' : override === false ? 'FORCED OPEN' : 'automatic (by time)'

  return (
    <Section title="Lock" desc={`Current mode: ${overrideLabel}. Lock time: ${cfg.lockTimeISO}`}>
      <label className="field">
        Lock time (ISO, UTC)
        <input value={iso} onChange={(e) => setIso(e.target.value)} placeholder="2026-06-29T03:59:00.000Z" />
      </label>
      <div className="btn-row">
        <button onClick={() => post({ lockTimeISO: iso }, 'Lock time updated')}>Save lock time</button>
        <button onClick={() => post({ lockedOverride: null }, 'Set to automatic')}>Automatic</button>
        <button onClick={() => post({ lockedOverride: false }, 'Forced OPEN')}>Force open</button>
        <button className="danger" onClick={() => post({ lockedOverride: true }, 'Forced LOCKED')}>Force lock now</button>
      </div>
    </Section>
  )
}

function TeamsEditor({ data, adminKey, onDone }) {
  const [r32, setR32] = useState(() => JSON.parse(JSON.stringify(data.r32 || {})))
  const setTeam = (slot, side, val) =>
    setR32((p) => ({ ...p, [slot]: { ...p[slot], [side]: val } }))

  const save = async () => {
    try {
      await api.adminPost(adminKey, { action: 'setTeams', r32 })
      onDone('Teams saved')
    } catch (e) {
      alert(e.message)
    }
  }

  return (
    <Section
      title="Round-of-32 teams"
      desc="Set the 32 real team names BEFORE sharing the link. Changing these after people pick will clear any picks that no longer fit."
    >
      <div className="teams-grid">
        {Array.from({ length: 16 }, (_, i) => {
          const id = `R32-${i + 1}`
          const m = r32[id] || { a: '', b: '' }
          return (
            <div className="team-edit" key={id}>
              <span className="mnum">M{i + 1}</span>
              <input value={m.a} onChange={(e) => setTeam(id, 'a', e.target.value)} />
              <span className="vs">vs</span>
              <input value={m.b} onChange={(e) => setTeam(id, 'b', e.target.value)} />
            </div>
          )
        })}
      </div>
      <button className="primary" onClick={save}>Save teams</button>
    </Section>
  )
}

function ResultsEditor({ data, adminKey, onDone }) {
  const [results, setResults] = useState(() => ({ ...(data.results || {}) }))
  const [overwrite, setOverwrite] = useState(false)

  const setResult = async (slotId, winner) => {
    const next = { ...results, [slotId]: winner }
    setResults(next)
    try {
      await api.adminPost(adminKey, { action: 'setResult', slotId, winner })
    } catch (e) {
      alert(e.message)
    }
  }

  const pull = async () => {
    try {
      const r = await api.pullResults(adminKey, overwrite)
      onDone(`Pulled ${r.count} result(s) from the API`)
    } catch (e) {
      alert(e.message)
    }
  }

  return (
    <Section
      title="Results & scoring"
      desc="Tap the actual winner of each match to score brackets. Round of 32 first, then later rounds unlock as winners advance."
    >
      <div className="btn-row">
        <button onClick={pull}>⚡ Auto-pull from API</button>
        <label className="check">
          <input type="checkbox" checked={overwrite} onChange={(e) => setOverwrite(e.target.checked)} />
          overwrite existing
        </label>
      </div>
      <Bracket r32={data.r32} picks={results} onPick={setResult} results={results} />
    </Section>
  )
}
