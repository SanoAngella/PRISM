import { medicines } from './medicines'
import { CURRENT_PHARMACY_ID } from './pharmacies'

// Recent sales for the logged-in pharmacy (demo: CityMed).
function seeded(seed) {
  let s = seed
  return () => ((s = (s * 9301 + 49297) % 233280) / 233280)
}

function buildSales() {
  const rand = seeded(77)
  const rows = []
  for (let i = 0; i < 48; i++) {
    const med = medicines[Math.floor(rand() * medicines.length)]
    const qty = 1 + Math.floor(rand() * 6)
    rows.push({
      id: `SL-${5200 - i}`,
      pharmacyId: CURRENT_PHARMACY_ID,
      medicineId: med.id,
      medicineName: med.name,
      quantity: qty,
      unitPrice: med.unitPrice,
      total: qty * med.unitPrice,
      soldAt: new Date(Date.now() - i * 5400_000 - Math.floor(rand() * 3600_000)).toISOString(),
      channel: rand() > 0.5 ? 'Walk-in' : 'Reservation',
    })
  }
  return rows
}

export const sales = buildSales()

// 7-day revenue + units for the pharmacy sales chart.
export const salesTrend = Array.from({ length: 7 }).map((_, i) => {
  const date = new Date(Date.now() - (6 - i) * 86400_000)
  const rand = seeded(200 + i)
  const units = 40 + Math.floor(rand() * 60)
  return {
    label: date.toLocaleDateString('en-GB', { weekday: 'short' }),
    date: date.toISOString().slice(0, 10),
    units,
    revenue: units * (900 + Math.floor(rand() * 700)),
  }
})
