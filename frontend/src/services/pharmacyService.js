import { mock } from './api'
import { inventoryForPharmacy } from '../data/inventory'
import { medicineById, medicines } from '../data/medicines'
import { sales, salesTrend } from '../data/sales'
import { STOCK_STATUS } from '../utils/constants'

function decorate(rows) {
  return rows.map((r) => ({ ...r, medicine: medicineById(r.medicineId) }))
}

function statusFromQty(qty, reorder) {
  if (qty <= 0) return STOCK_STATUS.OUT
  if (qty <= reorder) return STOCK_STATUS.LOW
  return STOCK_STATUS.IN_STOCK
}

export const pharmacyService = {
  async getInventory(pharmacyId) {
    return mock(decorate(inventoryForPharmacy(pharmacyId)))
  },

  async getInventoryStats(pharmacyId) {
    const rows = inventoryForPharmacy(pharmacyId)
    const lowStock = rows.filter((r) => r.status === STOCK_STATUS.LOW).length
    const outOfStock = rows.filter((r) => r.status === STOCK_STATUS.OUT).length
    const stockValue = rows.reduce((sum, r) => sum + r.price * r.quantity, 0)
    return mock({
      totalItems: rows.length,
      lowStock,
      outOfStock,
      stockValue,
    })
  },

  // Update an inventory item's quantity/price (mock write).
  async updateStock(pharmacyId, itemId, patch) {
    const rows = inventoryForPharmacy(pharmacyId)
    const item = rows.find((r) => r.id === itemId)
    if (!item) throw new Error('Item not found')
    Object.assign(item, patch)
    if (patch.quantity != null) {
      item.status = statusFromQty(patch.quantity, item.reorderLevel)
    }
    item.updatedAt = new Date().toISOString()
    return mock({ ...item, medicine: medicineById(item.medicineId) })
  },

  async getSales(pharmacyId) {
    return mock(sales.filter((s) => s.pharmacyId === pharmacyId))
  },

  async getSalesTrend() {
    return mock(salesTrend)
  },

  async getCatalog() {
    return mock(medicines)
  },
}
