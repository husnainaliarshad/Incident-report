import { buildSubmission } from './submission'
import { formatDateDMY } from './dates.js'

export function buildRecordTitle(report) {
  const name = report.fullName?.trim() || 'Unnamed reporter'
  const date = formatDateDMY(report.incidentDate?.trim())
  const vehicle = (report.vehicleType === 'Other' ? report.vehicleOther : report.vehicleType)?.trim()
  return [name, date, vehicle].filter(Boolean).join(' · ')
}

export async function submitReport(report) {
  const response = await fetch('/api/reports', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: buildRecordTitle(report),
      payload: buildSubmission(report),
    }),
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data?.error || `Submission failed (HTTP ${response.status})`)
  }
  return data
}

export async function checkBackend() {
  try {
    const response = await fetch('/api/reports')
    if (!response.ok) return { configured: false }
    return await response.json()
  } catch {
    return { configured: false, offline: true }
  }
}
