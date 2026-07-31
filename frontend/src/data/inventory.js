import { medicines } from './medicines'
import { pharmacies } from './pharmacies'
import { STOCK_STATUS } from '../utils/constants'

// Deterministic pseudo-random so data is stable across reloads.
function seeded(seed) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

function statusFromQty(qty, reorder) {
  if (qty <= 0) return STOCK_STATUS.OUT
  if (qty <= reorder) return STOCK_STATUS.LOW
  return STOCK_STATUS.IN_STOCK
}

// Build a full inventory grid: every pharmacy stocks most medicines.
function build() {
  const rows = []
  pharmacies.forEach((ph, pi) => {
    const rand = seeded((pi + 1) * 137)
    medicines.forEach((med, mi) => {
      // A few medicines are simply not carried by a given pharmacy.
      if (rand() < 0.12) return
      const reorder = med.form === 'Injection' ? 15 : 40
      const base = Math.floor(rand() * 220)
      // Force some realistic out/low situations
      let qty = base
      if (rand() < 0.1) qty = 0
      else if (rand() < 0.18) qty = Math.floor(rand() * reorder)
      // Price varies ±12% between pharmacies
      const priceFactor = 0.94 + rand() * 0.18
      rows.push({
        id: `${ph.id}-${med.id}`,
        pharmacyId: ph.id,
        medicineId: med.id,
        quantity: qty,
        reorderLevel: reorder,
        price: Math.round((med.unitPrice * priceFactor) / 50) * 50,
        status: statusFromQty(qty, reorder),
        updatedAt: new Date(Date.now() - Math.floor(rand() * 72) * 3600_000).toISOString(),
        batchNo: `B${med.id.slice(-3)}-${(pi + 1) * 10 + mi}`,
        expiryDate: new Date(2026, 6 + (mi % 12), 15).toISOString(),
      })
    })
  })
  return rows
}

export const inventory = build()

export const inventoryForPharmacy = (pharmacyId) =>
  inventory.filter((r) => r.pharmacyId === pharmacyId)

export const inventoryForMedicine = (medicineId) =>
  inventory.filter((r) => r.medicineId === medicineId)

export const stockAt = (pharmacyId, medicineId) =>
  inventory.find((r) => r.pharmacyId === pharmacyId && r.medicineId === medicineId)
