export const ROLES = {
  PATIENT: 'patient',
  PHARMACY: 'pharmacy',
  AUTHORITY: 'authority',
}

export const ROLE_HOME = {
  [ROLES.PATIENT]: '/patient',
  [ROLES.PHARMACY]: '/pharmacy',
  [ROLES.AUTHORITY]: '/authority',
}

export const STOCK_STATUS = {
  IN_STOCK: 'in_stock',
  LOW: 'low',
  OUT: 'out',
}

export const ALERT_SEVERITY = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MODERATE: 'moderate',
  LOW: 'low',
}

export const RESERVATION_STATUS = {
  PENDING: 'pending',
  READY: 'ready',
  COLLECTED: 'collected',
  CANCELLED: 'cancelled',
}
