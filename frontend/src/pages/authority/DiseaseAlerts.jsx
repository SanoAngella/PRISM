import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Building2, Activity, ArrowRight, Siren } from 'lucide-react'
import { Badge, Card, EmptyState, PageHeader, PageLoader, SeverityBadge, Tabs } from '../../components/ui'
import { useAsync } from '../../hooks/useAsync'
import { analyticsService } from '../../services/analyticsService'
import { timeAgo } from '../../utils/format'

const STATUS_TONE = { active: 'danger', monitoring: 'warning', resolved: 'gray' }

export default function DiseaseAlerts() {
  const { data, loading } = useAsync(() => analyticsService.getAlerts(), [])
  const [tab, setTab] = useState('all')

  const filtered = useMemo(() => {
    if (!data) return []
    if (tab === 'all') return data
    return data.filter((a) => a.status === tab)
  }, [data, tab])

  const counts = useMemo(() => {
    const base = data || []
    return {
      all: base.length,
      active: base.filter((a) => a.status === 'active').length,
      monitoring: base.filter((a) => a.status === 'monitoring').length,
      resolved: base.filter((a) => a.status === 'resolved').length,
    }
  }, [data])

  if (loading) return <PageLoader />

  return (
    <div>
      <PageHeader title="Disease alerts" description="AI-generated outbreak signals from pharmacy demand anomalies." />

      <div className="mb-5">
        <Tabs
          value={tab}
          onChange={setTab}
          tabs={[
            { value: 'all', label: 'All', count: counts.all },
            { value: 'active', label: 'Active', count: counts.active },
            { value: 'monitoring', label: 'Monitoring', count: counts.monitoring },
            { value: 'resolved', label: 'Resolved', count: counts.resolved },
          ]}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Siren} title="No alerts in this view" description="Signals will appear here as demand anomalies are detected." />
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => (
            <Card key={a.id} className="p-4 transition-colors hover:border-brand-300">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3">
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${a.status === 'active' ? 'bg-danger-50 text-danger-600' : 'bg-gray-100 text-gray-500'}`}>
                    <Siren size={18} />
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Link to={`/authority/alerts/${a.id}`} className="text-base font-semibold text-gray-900 hover:text-brand-700">{a.title}</Link>
                      <SeverityBadge severity={a.severity} />
                      <Badge tone={STATUS_TONE[a.status]} dot>{a.status}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{a.signal}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1"><MapPin size={12} /> {a.sector}, {a.district}</span>
                      <span className="inline-flex items-center gap-1"><Building2 size={12} /> {a.affectedPharmacies} pharmacies</span>
                      <span className="inline-flex items-center gap-1"><Activity size={12} /> ~{a.caseEstimate} est. cases</span>
                      <span>{timeAgo(a.detectedAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                  <div className="text-right">
                    <p className="text-xs text-gray-500">AI confidence</p>
                    <p className="text-lg font-semibold text-gray-900">{a.confidence}%</p>
                  </div>
                  <Link to={`/authority/alerts/${a.id}`} className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700">
                    Details <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
