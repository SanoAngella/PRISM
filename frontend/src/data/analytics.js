// Aggregated analytics + AI signals for the Health Authority dashboards.

// 14-day demand trend across the network (units sold per day),
// split into a few tracer medicines that indicate outbreaks.
const days = 14
function series(base, spike = null, noise = 0.15) {
  const out = []
  for (let i = 0; i < days; i++) {
    const date = new Date(Date.now() - (days - 1 - i) * 86400_000)
    let value = base * (1 + (Math.sin(i / 2) * noise))
    if (spike && i >= spike.from) {
      const ramp = Math.min(1, (i - spike.from) / (spike.to - spike.from || 1))
      value *= 1 + ramp * spike.factor
    }
    out.push({
      date: date.toISOString().slice(0, 10),
      label: date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      value: Math.round(value),
    })
  }
  return out
}

export const demandTrend = series(320).map((d, i) => ({
  ...d,
  antimalarial: series(90, { from: 8, to: 13, factor: 1.9 })[i].value,
  rehydration: series(70, { from: 9, to: 13, factor: 2.4 })[i].value,
  antibiotic: series(110)[i].value,
  analgesic: series(140, { from: 8, to: 13, factor: 0.6 })[i].value,
}))

// Demand by therapeutic category (last 7 days, units).
export const categoryDemand = [
  { category: 'Analgesic', units: 4820, change: 6 },
  { category: 'Antimalarial', units: 3110, change: 41 },
  { category: 'Rehydration', units: 2640, change: 58 },
  { category: 'Antibiotic', units: 2980, change: 9 },
  { category: 'Respiratory', units: 1740, change: 12 },
  { category: 'Antidiabetic', units: 1210, change: -3 },
  { category: 'Antihypertensive', units: 990, change: 1 },
]

// Top demanded medicines this week.
export const topMedicines = [
  { name: 'ORS Sachets', category: 'Rehydration', units: 1980, change: 62 },
  { name: 'Coartem 20/120mg', category: 'Antimalarial', units: 1710, change: 44 },
  { name: 'Zinc Sulphate 20mg', category: 'Rehydration', units: 1240, change: 51 },
  { name: 'Paracetamol 500mg', category: 'Analgesic', units: 2940, change: 8 },
  { name: 'Amoxicillin 500mg', category: 'Antibiotic', units: 1120, change: 7 },
]

// District hotspots: demand anomaly score 0–100 drives the heat colour.
export const hotspots = [
  { district: 'Nyarugenge', sector: 'Nyamirambo', lat: -1.9706, lng: 30.0456, score: 84, signal: 'Rehydration + Antimalarial surge', cases: 138 },
  { district: 'Kicukiro', sector: 'Gikondo', lat: -1.9781, lng: 30.0761, score: 72, signal: 'Rehydration surge (ORS/Zinc)', cases: 96 },
  { district: 'Gasabo', sector: 'Remera', lat: -1.9578, lng: 30.1127, score: 38, signal: 'Mild antimalarial uptick', cases: 41 },
  { district: 'Gasabo', sector: 'Kacyiru', lat: -1.9412, lng: 30.0912, score: 22, signal: 'Within normal range', cases: 18 },
  { district: 'Gasabo', sector: 'Kimironko', lat: -1.9503, lng: 30.1246, score: 29, signal: 'Within normal range', cases: 24 },
  { district: 'Kicukiro', sector: 'Kicukiro', lat: -1.9889, lng: 30.1024, score: 46, signal: 'Antimalarial uptick', cases: 52 },
]

// KPI snapshot for the authority dashboard.
export const authorityKpis = {
  activeAlerts: 3,
  monitoredPharmacies: 6,
  demandIndex: 137, // vs 100 baseline
  populationCovered: 620000,
}
