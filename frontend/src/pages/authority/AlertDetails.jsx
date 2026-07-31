import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Sparkles, MapPin, Building2, Activity, Pill, CheckCircle2, Send, Printer } from 'lucide-react'
import { Badge, Button, Card, CardBody, CardHeader, PageLoader, SeverityBadge } from '../../components/ui'
import { HotspotMap } from '../../components/maps/MapView'
import { useAsync } from '../../hooks/useAsync'
import { analyticsService } from '../../services/analyticsService'
import { hotspots } from '../../data/analytics'
import { formatDateTime } from '../../utils/format'
import { useToast } from '../../contexts/ToastContext'

export default function AlertDetails() {
  const { id } = useParams()
  const toast = useToast()
  const { data: alert, loading } = useAsync(() => analyticsService.getAlert(id), [id])

  if (loading) return <PageLoader />
  if (!alert) return <p className="text-gray-500">Alert not found.</p>

  const spot = hotspots.filter((h) => h.district === alert.district)

  const facts = [
    { icon: MapPin, label: 'Location', value: `${alert.sector}, ${alert.district}` },
    { icon: Building2, label: 'Affected pharmacies', value: alert.affectedPharmacies },
    { icon: Activity, label: 'Estimated cases', value: `~${alert.caseEstimate}` },
    { icon: Sparkles, label: 'AI confidence', value: `${alert.confidence}%` },
  ]

  return (
    <div>
      <Link to="/authority/alerts" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800">
        <ArrowLeft size={15} /> Back to alerts
      </Link>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold text-gray-900">{alert.title}</h1>
            <SeverityBadge severity={alert.severity} />
          </div>
          <p className="mt-1 text-sm text-gray-500">Detected {formatDateTime(alert.detectedAt)} · Alert {alert.id}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" icon={Printer}>Export</Button>
          <Button icon={Send} onClick={() => toast.success('Response dispatched', 'District rapid-response team notified.')}>Dispatch response</Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {facts.map((f) => (
          <Card key={f.label} className="p-4">
            <div className="flex items-center gap-2 text-gray-500"><f.icon size={15} /><span className="text-sm">{f.label}</span></div>
            <p className="mt-1.5 text-xl font-semibold text-gray-900">{f.value}</p>
          </Card>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          {/* AI recommendation */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-brand-600" />
                <h3 className="text-md font-semibold text-gray-900">AI recommendation</h3>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-base leading-relaxed text-gray-700">{alert.recommendation}</p>
              <div className="mt-4 space-y-2">
                {['Notify district health office', 'Pre-position buffer stock', 'Expand testing capacity'].map((step) => (
                  <div key={step} className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700">
                    <CheckCircle2 size={15} className="text-success-600" /> {step}
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Signal */}
          <Card>
            <CardHeader title="Detection signal" description="Why this alert was raised" />
            <CardBody>
              <p className="text-base text-gray-700">{alert.signal}</p>
              <div className="mt-4">
                <p className="mb-2 text-sm font-medium text-gray-500">Indicator medicines</p>
                <div className="flex flex-wrap gap-2">
                  {alert.indicators.map((m) => (
                    <Badge key={m} tone="brand"><Pill size={12} className="mr-1" /> {m}</Badge>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Map */}
        <Card>
          <CardHeader title="Affected area" />
          <div className="p-3">
            <div className="overflow-hidden rounded-md border border-gray-200">
              <HotspotMap hotspots={spot.length ? spot : hotspots} height={300} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
