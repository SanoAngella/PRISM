import { mock } from './api'
import {
  authorityKpis,
  categoryDemand,
  demandTrend,
  hotspots,
  topMedicines,
} from '../data/analytics'
import { alerts, alertById } from '../data/alerts'

export const analyticsService = {
  async getDashboard() {
    return mock({
      kpis: authorityKpis,
      demandTrend,
      categoryDemand,
      topMedicines,
      hotspots,
      activeAlerts: alerts.filter((a) => a.status !== 'resolved').slice(0, 3),
    })
  },

  async getDemandTrend() {
    return mock(demandTrend)
  },

  async getHotspots() {
    return mock(hotspots)
  },

  async getAlerts() {
    return mock([...alerts].sort((a, b) => new Date(b.detectedAt) - new Date(a.detectedAt)))
  },

  async getAlert(id) {
    const a = alertById(id)
    if (!a) throw new Error('Alert not found')
    return mock(a)
  },
}
