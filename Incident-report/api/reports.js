import { executeReports } from '../server/reports.js'

export default async function handler(req, res) {
  const body =
    req.method === 'POST'
      ? typeof req.body === 'string'
        ? JSON.parse(req.body || '{}')
        : (req.body ?? {})
      : undefined

  const { status, json } = await executeReports({ method: req.method, body, env: process.env })
  res.status(status).json(json)
}
