import { REPORT_COLUMNS, flattenReport } from '../src/lib/reportFields.js'

export const REQUIRED_TITLES = ['Title', 'Payload', ...REPORT_COLUMNS.map((column) => column.title)]

export function readConfig(env = {}) {
  return {
    baseUrl: (env.NOCODB_URL || 'https://app.nocodb.com').replace(/\/+$/, ''),
    tableId: env.NOCODB_TABLE_ID,
    token: env.NOCODB_API,
    configured: Boolean(env.NOCODB_API && env.NOCODB_TABLE_ID),
  }
}

// NocoDB silently discards unknown keys, so the table schema is verified first.
// Returns null when the schema cannot be read.
export async function fetchFields({ baseUrl, tableId, token }) {
  try {
    const response = await fetch(`${baseUrl}/api/v2/meta/tables/${tableId}`, {
      headers: { 'xc-token': token },
    })
    if (!response.ok) return null
    const data = await response.json()
    const columns = data?.columns?.map((column) => column.title)
    return columns?.length ? columns : null
  } catch {
    return null
  }
}

export async function executeReports({ method, body, env = {} }) {
  const { baseUrl, tableId, token, configured } = readConfig(env)

  if (method === 'GET') {
    const fields = configured ? await fetchFields({ baseUrl, tableId, token }) : null
    return {
      status: 200,
      json: {
        configured,
        tableId: tableId ?? null,
        baseUrl,
        hasPayloadColumn: fields ? fields.includes('Payload') : null,
        missingColumns: fields ? REQUIRED_TITLES.filter((title) => !fields.includes(title)) : null,
      },
    }
  }

  if (method !== 'POST') {
    return { status: 405, json: { error: 'Method not allowed' } }
  }

  if (!configured) {
    return {
      status: 500,
      json: { error: 'NocoDB is not configured. Set NOCODB_API and NOCODB_TABLE_ID.' },
    }
  }

  try {
    const { title, payload } = body ?? {}
    const payloadText = typeof payload === 'string' ? payload : JSON.stringify(payload ?? {})

    let parsed = payload
    if (typeof payload === 'string') {
      try {
        parsed = JSON.parse(payload)
      } catch {
        parsed = {}
      }
    }

    const fields = await fetchFields({ baseUrl, tableId, token })
    if (fields) {
      const missing = REQUIRED_TITLES.filter((column) => !fields.includes(column))
      if (missing.length) {
        return {
          status: 500,
          json: {
            error:
              `NocoDB is missing ${missing.length} column(s) that would otherwise be silently dropped: ` +
              `${missing.slice(0, 6).join(', ')}${missing.length > 6 ? ', …' : ''}`,
          },
        }
      }
    }

    const upstream = await fetch(`${baseUrl}/api/v2/tables/${tableId}/records`, {
      method: 'POST',
      headers: { 'xc-token': token, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...flattenReport(parsed ?? {}),
        Title: title ?? 'Incident report',
        Payload: payloadText,
      }),
    })

    const text = await upstream.text()
    let data
    try {
      data = JSON.parse(text)
    } catch {
      data = { raw: text }
    }

    if (!upstream.ok) {
      return {
        status: upstream.status,
        json: {
          error: data?.message || data?.error || `NocoDB responded with ${upstream.status}`,
        },
      }
    }
    return { status: 200, json: data }
  } catch (error) {
    return { status: 502, json: { error: `Could not reach NocoDB: ${error.message}` } }
  }
}
