import { useState } from 'react'
import { MapPin, Activity } from 'lucide-react'
import { Badge, Card, CardHeader, PageHeader, PageLoader } from '../../components/ui'
import { HotspotMap } from '../../components/maps/MapView'
import { useAsync } from '../../hooks/useAsync'
import { analyticsService } from '../../services/analyticsService'

function scoreTone(score) {
  if (score >= 70) return 'danger'
  if (score >= 45) return 'warning'
  if (score >= 30) return 'warning'
  return 'success'
}

function scoreLabel(score) {
  if (score >= 70) return 'Critical'
  if (score >= 45) return 'Elevated'
  if (score >= 30) return 'Watch'
  return 'Normal'
}

export default function HotspotMapPage() {
  const { data, loading } = useAsync(() => analyticsService.getHotspots(), [])
  const [active, setActive] = useState(null)

  if (loading) return <PageLoader />

  const sorted = [...data].sort((a, b) => b.score - a.score)

  return (
    <div>
      <PageHeader title="Hotspot map" description="Demand-anomaly intensity across Kigali sectors." />

      <div className="grid gap-5 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Card className="overflow-hidden">
            <HotspotMap hotspots={data} height={540} onSelect={(h) => setActive(h.sector)} />
          </Card>
          <div className="mt-3 flex items-center gap-4 rounded-md border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-600">
            <span className="font-medium text-gray-700">Intensity</span>
            {[['#12b76a', 'Normal'], ['#eab308', 'Watch'], ['#f79009', 'Elevated'], ['#d92d20', 'Critical']].map(([c, l]) => (
              <span key={l} className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: c }} /> {l}
              </span>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader title="Sectors by anomaly score" description="Ranked highest to lowest" />
            <div className="divide-y divide-gray-100">
              {sorted.map((h) => (
                <div key={h.sector} className={`px-4 py-3 ${active === h.sector ? 'bg-brand-50/50' : ''}`}>
                  <div className="flex items-center justify-between">
                    <p className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
                      <MapPin size={14} className="text-gray-400" /> {h.sector}
                      <span className="text-gray-400">· {h.district}</span>
                    </p>
                    <Badge tone={scoreTone(h.score)} dot>{scoreLabel(h.score)}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{h.signal}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${h.score}%`,
                          background: h.score >= 70 ? '#d92d20' : h.score >= 45 ? '#f79009' : h.score >= 30 ? '#eab308' : '#12b76a',
                        }}
                      />
                    </div>
                    <span className="w-10 text-right text-xs font-medium text-gray-600">{h.score}/100</span>
                  </div>
                  <p className="mt-1.5 inline-flex items-center gap-1 text-xs text-gray-400"><Activity size={11} /> ~{h.cases} estimated cases</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
