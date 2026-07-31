import { mock } from './api'
import { seedReservations } from '../data/reservations'
import { RESERVATION_STATUS } from '../utils/constants'

// In-memory store (survives navigation, resets on reload). Swap for API later.
let store = [...seedReservations]
let seq = 3013

export const reservationService = {
  async list({ pharmacyId } = {}) {
    const rows = pharmacyId ? store.filter((r) => r.pharmacyId === pharmacyId) : store
    return mock([...rows].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
  },

  async create(payload) {
    const id = `RSV-${seq++}`
    const reservation = {
      id,
      code: `PRX-${id.slice(-4)}`,
      status: RESERVATION_STATUS.PENDING,
      createdAt: new Date().toISOString(),
      ...payload,
    }
    store = [reservation, ...store]
    return mock(reservation, 500)
  },

  async updateStatus(id, status) {
    store = store.map((r) => (r.id === id ? { ...r, status } : r))
    return mock(store.find((r) => r.id === id))
  },
}
