// Shared helpers for the Netlify Functions: Blobs access, lock state, auth.
// Underscore-prefixed files are not exposed as endpoints but can be imported.
import { getStore } from '@netlify/blobs'
import { DEFAULT_R32 } from '../../shared/defaultTeams.js'

const DEFAULT_LOCK_ISO = '2026-06-29T03:59:00.000Z' // 11:59pm ET, 2026-06-28

export function store() {
  // Strong consistency so a player reads back their own picks immediately.
  return getStore({ name: 'worldcup', consistency: 'strong' })
}

export async function getJSON(key, fallback) {
  const s = store()
  const val = await s.get(key, { type: 'json' })
  return val == null ? fallback : val
}

export async function setJSON(key, value) {
  await store().setJSON(key, value)
}

export async function getConfig() {
  const cfg = await getJSON('config', null)
  return {
    lockTimeISO: cfg?.lockTimeISO || DEFAULT_LOCK_ISO,
    lockedOverride: cfg?.lockedOverride ?? null, // null=auto, true=force lock, false=force open
  }
}

export function isLocked(config, now = Date.now()) {
  if (config.lockedOverride === true) return true
  if (config.lockedOverride === false) return false
  return now >= new Date(config.lockTimeISO).getTime()
}

export async function getR32() {
  return await getJSON('r32', DEFAULT_R32)
}

export async function getPlayers() {
  return await getJSON('players', [])
}

// Public view of a player record (never leak the edit token).
export const publicPlayer = (p) => ({ id: p.id, name: p.name })

export function adminAuthorized(req) {
  const key = process.env.ADMIN_KEY
  if (!key) return false // admin disabled until an ADMIN_KEY is configured
  const provided =
    req.headers.get('x-admin-key') ||
    new URL(req.url).searchParams.get('adminKey') ||
    ''
  return provided === key
}

export const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export const randomId = () =>
  Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
