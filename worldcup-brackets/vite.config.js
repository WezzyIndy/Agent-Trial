import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// During `netlify dev`, functions are served on the same origin, so no proxy
// config is needed. Plain `vite` (port 5173) won't have functions — use
// `npm run netlify-dev` for full local testing.
export default defineConfig({
  plugins: [react()],
})
