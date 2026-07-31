// Formatting helpers shared across the app. Currency defaults to Rwandan Franc.

export function formatCurrency(amount, currency = 'RWF') {
  if (amount == null || Number.isNaN(Number(amount))) return '—'
  return new Intl.NumberFormat('en-RW', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Number(amount))
}

export function formatNumber(value) {
  if (value == null) return '—'
  return new Intl.NumberFormat('en-US').format(Number(value))
}

export function formatDate(input, opts = {}) {
  if (!input) return '—'
  const d = new Date(input)
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...opts,
  })
}

export function formatDateTime(input) {
  if (!input) return '—'
  const d = new Date(input)
  return d.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function timeAgo(input) {
  if (!input) return '—'
  const diff = Date.now() - new Date(input).getTime()
  const mins = Math.round(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  return `${days}d ago`
}

export function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('')
}
