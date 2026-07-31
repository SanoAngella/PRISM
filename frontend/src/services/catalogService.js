import { mock } from './api'
import { medicines, medicineById } from '../data/medicines'
import { pharmacies, pharmacyById } from '../data/pharmacies'
import { inventory, inventoryForMedicine, stockAt } from '../data/inventory'
import { STOCK_STATUS } from '../utils/constants'

// Haversine distance in km between two coordinates.
export function distanceKm(a, b) {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const lat1 = (a.lat * Math.PI) / 180
  const lat2 = (b.lat * Math.PI) / 180
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2)
  return R * 2 * Math.asin(Math.sqrt(h))
}

// Reference "user location" for distance calc (Kigali city centre).
export const USER_LOCATION = { lat: -1.9441, lng: 30.0619 }

export const catalogService = {
  async searchMedicines(query = '') {
    const q = query.trim().toLowerCase()
    const results = medicines
      .filter(
        (m) =>
          !q ||
          m.name.toLowerCase().includes(q) ||
          m.genericName.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q),
      )
      .map((m) => {
        const stock = inventoryForMedicine(m.id)
        const available = stock.filter((s) => s.status !== STOCK_STATUS.OUT)
        const prices = stock.map((s) => s.price)
        return {
          ...m,
          availableCount: available.length,
          pharmacyCount: stock.length,
          fromPrice: prices.length ? Math.min(...prices) : m.unitPrice,
        }
      })
    return mock(results)
  },

  async getMedicine(id) {
    const med = medicineById(id)
    if (!med) throw new Error('Medicine not found')
    return mock(med)
  },

  async getMedicineAvailability(id) {
    const rows = inventoryForMedicine(id)
      .map((r) => {
        const ph = pharmacyById(r.pharmacyId)
        return {
          ...r,
          pharmacy: ph,
          distance: distanceKm(USER_LOCATION, ph),
        }
      })
      .sort((a, b) => a.distance - b.distance)
    return mock(rows)
  },

  async getPharmacies() {
    const withDistance = pharmacies
      .map((p) => ({ ...p, distance: distanceKm(USER_LOCATION, p) }))
      .sort((a, b) => a.distance - b.distance)
    return mock(withDistance)
  },

  async getPharmacy(id) {
    const ph = pharmacyById(id)
    if (!ph) throw new Error('Pharmacy not found')
    const stock = inventory
      .filter((r) => r.pharmacyId === id)
      .map((r) => ({ ...r, medicine: medicineById(r.medicineId) }))
    return mock({ ...ph, distance: distanceKm(USER_LOCATION, ph), stock })
  },

  async compare(medicineId, pharmacyIds) {
    const rows = pharmacyIds
      .map((pid) => {
        const ph = pharmacyById(pid)
        const s = stockAt(pid, medicineId)
        if (!ph || !s) return null
        return { pharmacy: ph, stock: s, distance: distanceKm(USER_LOCATION, ph) }
      })
      .filter(Boolean)
    return mock(rows)
  },
}
