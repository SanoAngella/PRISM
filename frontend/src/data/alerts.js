import { ALERT_SEVERITY } from '../utils/constants'

// AI-generated outbreak alerts derived from abnormal pharmacy demand.
export const alerts = [
  {
    id: 'ALT-2041',
    title: 'Possible cholera / acute diarrhoeal outbreak',
    district: 'Nyarugenge',
    sector: 'Nyamirambo',
    severity: ALERT_SEVERITY.CRITICAL,
    confidence: 91,
    detectedAt: new Date(Date.now() - 3 * 3600_000).toISOString(),
    signal: 'ORS demand +240% and Zinc Sulphate +190% over 4 days across 3 pharmacies',
    indicators: ['ORS Sachets', 'Zinc Sulphate 20mg'],
    affectedPharmacies: 3,
    caseEstimate: 138,
    status: 'active',
    recommendation:
      'Deploy rapid response team to Nyamirambo. Pre-position ORS and IV fluids at CityMed and Community Pharmacy. Alert Nyarugenge District Hospital to prepare rehydration capacity and test water sources.',
  },
  {
    id: 'ALT-2039',
    title: 'Malaria transmission spike',
    district: 'Kicukiro',
    sector: 'Kicukiro',
    severity: ALERT_SEVERITY.HIGH,
    confidence: 78,
    detectedAt: new Date(Date.now() - 11 * 3600_000).toISOString(),
    signal: 'Coartem demand +44% week-over-week, concentrated in Kicukiro and Gikondo',
    indicators: ['Coartem 20/120mg', 'Paracetamol 500mg'],
    affectedPharmacies: 2,
    caseEstimate: 52,
    status: 'active',
    recommendation:
      'Intensify vector control and distribute LLINs in affected sectors. Ensure antimalarial buffer stock at Royal and Community Pharmacy. Notify Kicukiro health centres to expand RDT testing.',
  },
  {
    id: 'ALT-2036',
    title: 'Respiratory illness uptick',
    district: 'Gasabo',
    sector: 'Remera',
    severity: ALERT_SEVERITY.MODERATE,
    confidence: 64,
    detectedAt: new Date(Date.now() - 26 * 3600_000).toISOString(),
    signal: 'Salbutamol and Cetirizine demand +18% over baseline',
    indicators: ['Salbutamol Inhaler', 'Cetirizine 10mg'],
    affectedPharmacies: 2,
    caseEstimate: 41,
    status: 'monitoring',
    recommendation:
      'Continue monitoring. Correlate with air-quality and seasonal allergy data before escalation. No field deployment required yet.',
  },
  {
    id: 'ALT-2030',
    title: 'Typhoid signal — resolved',
    district: 'Gasabo',
    sector: 'Kacyiru',
    severity: ALERT_SEVERITY.LOW,
    confidence: 52,
    detectedAt: new Date(Date.now() - 5 * 86400_000).toISOString(),
    signal: 'Ceftriaxone demand normalised after brief 3-day elevation',
    indicators: ['Ceftriaxone 1g'],
    affectedPharmacies: 1,
    caseEstimate: 9,
    status: 'resolved',
    recommendation:
      'No further action. Demand returned to baseline. Case logged for seasonal trend analysis.',
  },
]

export const alertById = (id) => alerts.find((a) => a.id === id)
