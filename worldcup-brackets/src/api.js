// Thin wrapper around the Netlify Functions endpoints.
const BASE = '/.netlify/functions'

async function req(path, opts = {}) {
  const res = await fetch(`${BASE}/${path}`, {
    headers: { 'content-type': 'application/json', ...(opts.headers || {}) },
    ...opts,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`)
  return data
}

export const getState = (token) =>
  req(`state${token ? `?token=${encodeURIComponent(token)}` : ''}`)

export const join = (name) =>
  req('join', { method: 'POST', body: JSON.stringify({ name }) })

export const savePicks = (token, picks) =>
  req('save', { method: 'POST', body: JSON.stringify({ token, picks }) })

export const adminGet = (adminKey) =>
  req('admin', { headers: { 'x-admin-key': adminKey } })

export const adminPost = (adminKey, payload) =>
  req('admin', {
    method: 'POST',
    headers: { 'x-admin-key': adminKey },
    body: JSON.stringify(payload),
  })

export const pullResults = (adminKey, overwrite = false) =>
  req('pull-results', {
    method: 'POST',
    headers: { 'x-admin-key': adminKey },
    body: JSON.stringify({ overwrite }),
  })
