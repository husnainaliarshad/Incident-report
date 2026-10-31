export function todayIso() {
  const now = new Date()
  const offset = now.getTimezoneOffset()
  return new Date(now.getTime() - offset * 60 * 1000).toISOString().slice(0, 10)
}

export function formatDateDMY(iso) {
  if (!iso || typeof iso !== 'string') return ''
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return iso
  const [, year, month, day] = match
  return `${day}/${month}/${year}`
}

export function isValidIsoDate(iso) {
  if (!iso || typeof iso !== 'string') return false
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false
  const date = new Date(`${iso}T00:00:00`)
  return !Number.isNaN(date.getTime())
}

export function isFutureDate(iso) {
  return isValidIsoDate(iso) && iso > todayIso()
}

export function normalisePhone(value) {
  return (value ?? '').replace(/[^\d+\s()-]/g, '').slice(0, 20)
}

export function digitsOnly(value) {
  return (value ?? '').replace(/\D/g, '')
}
