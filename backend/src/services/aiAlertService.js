import Sale from '../models/Sale.js'
import Medicine from '../models/Medicine.js'
import Pharmacy from '../models/Pharmacy.js'
import Alert from '../models/Alert.js'
import env from '../config/env.js'
import logger from '../utils/logger.js'
import { ALERT_SEVERITY, ALERT_STATUS } from '../utils/constants.js'

const DAY = 86400_000

// Category → disease mapping and canned response guidance.
const DISEASE_MAP = {
  Rehydration: {
    disease: 'acute diarrhoeal / cholera',
    recommendation:
      'Deploy rapid-response team, pre-position ORS and IV fluids at affected pharmacies, alert the district hospital to prepare rehydration capacity and test local water sources.',
  },
  Antimalarial: {
    disease: 'malaria transmission',
    recommendation:
      'Intensify vector control and distribute LLINs in affected sectors, ensure antimalarial buffer stock, and expand RDT testing at nearby health centres.',
  },
  Respiratory: {
    disease: 'respiratory illness',
    recommendation:
      'Continue monitoring and correlate with air-quality and seasonal data before escalation.',
  },
  Antibiotic: {
    disease: 'bacterial infection',
    recommendation:
      'Monitor closely, verify against clinical reports, and ensure antibiotic availability.',
  },
}

function severityFor(change) {
  if (change >= env.alerts.criticalThreshold * 1.5) return ALERT_SEVERITY.CRITICAL
  if (change >= env.alerts.criticalThreshold) return ALERT_SEVERITY.HIGH
  if (change >= env.alerts.warningThreshold) return ALERT_SEVERITY.MODERATE
  return ALERT_SEVERITY.LOW
}

/**
 * Core (mocked) detection: for each district, compare category demand in the
 * recent window against the previous window. A large positive swing on a
 * tracer category raises an outbreak alert.
 *
 * This is deterministic and DB-driven so it produces real alerts from seeded
 * sales — a production version would layer in spatial-temporal statistics.
 */
export async function runDetection({ windowDays = 4 } = {}) {
  const now = Date.now()
  const curFrom = new Date(now - windowDays * DAY)
  const prevFrom = new Date(now - 2 * windowDays * DAY)

  const pharmacies = await Pharmacy.find()
  const pharmacyByDistrict = groupBy(pharmacies, 'district')

  const current = await demandByDistrictCategory(curFrom, new Date(now))
  const previous = await demandByDistrictCategory(prevFrom, curFrom)
  const prevMap = keyMap(previous)

  const created = []

  for (const row of current) {
    const key = `${row.district}::${row.category}`
    const before = prevMap[key] || 0
    if (row.units < 20) continue // ignore low-volume noise
    const change = before === 0 ? 100 : Math.round(((row.units - before) / before) * 100)
    if (change < env.alerts.warningThreshold) continue

    const mapping = DISEASE_MAP[row.category]
    if (!mapping) continue

    const severity = severityFor(change)
    const districtPharmacies = pharmacyByDistrict[row.district] || []
    const confidence = Math.min(95, 45 + Math.round(change / 4))

    // Avoid duplicate active alerts for the same district+category.
    const existing = await Alert.findOne({
      district: row.district,
      status: { $ne: ALERT_STATUS.RESOLVED },
      indicators: { $in: [row.category] },
    })
    if (existing) continue

    const alert = await Alert.create({
      code: `ALT-${Date.now().toString().slice(-4)}${Math.floor(Math.random() * 10)}`,
      title: `Possible ${mapping.disease} signal`,
      district: row.district,
      sector: districtPharmacies[0]?.sector || row.district,
      severity,
      status: severity === ALERT_SEVERITY.LOW ? ALERT_STATUS.MONITORING : ALERT_STATUS.ACTIVE,
      confidence,
      signal: `${row.category} demand +${change}% in ${row.district} over ${windowDays} days`,
      indicators: [row.category],
      affectedPharmacies: districtPharmacies.length,
      caseEstimate: Math.round(row.units * 0.6),
      recommendation: mapping.recommendation,
      detectedAt: new Date(),
    })
    created.push(alert)
    logger.info(`AI alert raised: ${alert.code} (${row.district}/${row.category} +${change}%)`)
  }

  return created
}

async function demandByDistrictCategory(from, to) {
  return Sale.aggregate([
    { $match: { soldAt: { $gte: from, $lt: to } } },
    { $lookup: { from: 'pharmacies', localField: 'pharmacy', foreignField: '_id', as: 'ph' } },
    { $unwind: '$ph' },
    { $lookup: { from: 'medicines', localField: 'medicine', foreignField: '_id', as: 'med' } },
    { $unwind: '$med' },
    {
      $group: {
        _id: { district: '$ph.district', category: '$med.category' },
        units: { $sum: '$quantity' },
      },
    },
    { $project: { _id: 0, district: '$_id.district', category: '$_id.category', units: 1 } },
  ])
}

function keyMap(rows) {
  return Object.fromEntries(rows.map((r) => [`${r.district}::${r.category}`, r.units]))
}

function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    ;(acc[item[key]] = acc[item[key]] || []).push(item)
    return acc
  }, {})
}
