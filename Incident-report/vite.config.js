import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { executeReports } from './server/reports.js'

const projectDir = path.dirname(fileURLToPath(import.meta.url))
const envDir = path.resolve(projectDir, '..')

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

// Serves POST/GET /api/reports during `vite dev` and `vite preview`.
// On Vercel the same logic runs from api/reports.js instead.
function nocodbBackend(env) {
  const middleware = async (req, res, next) => {
    if (!req.url?.split('?')[0].startsWith('/api/reports')) return next()

    res.setHeader('Content-Type', 'application/json')

    try {
      const body = req.method === 'POST' ? JSON.parse((await readBody(req)) || '{}') : undefined
      const { status, json } = await executeReports({ method: req.method, body, env })
      res.statusCode = status
      res.end(JSON.stringify(json))
    } catch (error) {
      res.statusCode = 500
      res.end(JSON.stringify({ error: `Report handler failed: ${error.message}` }))
    }
  }

  return {
    name: 'nocodb-backend',
    configureServer(server) {
      server.middlewares.use(middleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware)
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, envDir, '')

  return {
    envDir,
    plugins: [react(), tailwindcss(), nocodbBackend(env)],
  }
})
