import Badge from './Badge'
import { STOCK_STATUS, ALERT_SEVERITY, RESERVATION_STATUS } from '../../utils/constants'

const STOCK = {
  [STOCK_STATUS.IN_STOCK]: { tone: 'success', label: 'In stock' },
  [STOCK_STATUS.LOW]: { tone: 'warning', label: 'Low stock' },
  [STOCK_STATUS.OUT]: { tone: 'danger', label: 'Out of stock' },
}

const SEVERITY = {
  [ALERT_SEVERITY.CRITICAL]: { tone: 'danger', label: 'Critical' },
  [ALERT_SEVERITY.HIGH]: { tone: 'danger', label: 'High' },
  [ALERT_SEVERITY.MODERATE]: { tone: 'warning', label: 'Moderate' },
  [ALERT_SEVERITY.LOW]: { tone: 'gray', label: 'Low' },
}

const RESERVATION = {
  [RESERVATION_STATUS.PENDING]: { tone: 'warning', label: 'Pending' },
  [RESERVATION_STATUS.READY]: { tone: 'brand', label: 'Ready for pickup' },
  [RESERVATION_STATUS.COLLECTED]: { tone: 'success', label: 'Collected' },
  [RESERVATION_STATUS.CANCELLED]: { tone: 'gray', label: 'Cancelled' },
}

export function StockBadge({ status }) {
  const c = STOCK[status] || STOCK[STOCK_STATUS.OUT]
  return <Badge tone={c.tone} dot>{c.label}</Badge>
}

export function SeverityBadge({ severity }) {
  const c = SEVERITY[severity] || SEVERITY[ALERT_SEVERITY.LOW]
  return <Badge tone={c.tone} dot>{c.label}</Badge>
}

export function ReservationBadge({ status }) {
  const c = RESERVATION[status] || RESERVATION[RESERVATION_STATUS.PENDING]
  return <Badge tone={c.tone} dot>{c.label}</Badge>
}
