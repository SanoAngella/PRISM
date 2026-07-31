import { Link } from 'react-router-dom'
import { Siren, Building2, Activity, Users, ArrowRight, Sparkles, MapPin } from 'lucide-react'
import { Badge, Button, Card, CardHeader, PageHeader, PageLoader, SeverityBadge, StatCard } from '../../components/ui'
import { DemandLineChart, ChartLegend } from '../../components/charts/Charts'
import { HotspotMap } from '../../components/maps/MapView'
import { useAsync } from '../../hooks/useAsync'
import { analyticsService } from '../../services/analyticsService'
import { formatNumber, timeAgo } from '../../utils/format'

export default function AuthorityDashboard() {
  const { data } = useAsync(() => analyticsService.getDashboard(), [])
  if (!data) return <PageLoader />

  const { kpis, demandTrend, activeAlerts, hotspots } = data

  return (
    <div>
      <PageHeader
        title="Surveillance overview"
        description="Network-wide medicine demand and AI-detected outbreak signals."
        actions={<Button as={Link} to="/authority/alerts" icon={Siren}>View alerts</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active alerts" value={kpis.activeAlerts} icon={Siren} tone="danger" hint="need review" />
        <StatCard label="Monitored pharmacies" value={kpis.monitoredPharmacies} icon={Building2} tone="brand" hint="reporting live" />
        <StatCard label="Demand index" value={kpis.demandIndex} icon={Activity} tone="warning" delta={37} hint="vs 100 baseline" />
        <StatCard label="Population covered" value={formatNumber(kpis.populationCovered)} icon={Users} tone="brand" />
      </div>

      {/* AI banner */}
      <div className="mt-5 flex flex-col gap-3 rounded-lg border border-danger-200 bg-danger-50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-danger-100 text-danger-600">
            <Sparkles size={18} />
          </span>
          <div>
            <p className="text-md font-semibold text-danger-800">AI early-warning: possible diarrhoeal outbreak in Nyamirambo</p>
            <p className="mt-0.5 text-sm text-danger-700">ORS +240% and Zinc +190% over 4 days across 3 pharmacies · 91% confidence</p>
          </div>
        </div>
        <Button as={Link} to="/authority/alerts/ALT-2041" variant="danger" size="sm" iconRight={ArrowRight}>Review alert</Button>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        {/* Demand trend */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Network demand — tracer medicines"
            description="14-day trend of outbreak-indicator categories"
          />
          <div className="px-3 pb-2 pt-3">
            <DemandLineChart data={demandTrend} />
            <div className="mt-2 px-2">
              <ChartLegend items={[
                { label: 'Rehydration', color: '#d92d20' },
                { label: 'Antimalarial', color: '#dc6803' },
                { label: 'Antibiotic', color: '#2649d6' },
                { label: 'Analgesic', color: '#039855' },
              ]} />
            </div>
          </div>
        </Card>

        {/* Active alerts */}
        <Card>
          <CardHeader title="Latest alerts" action={<Link to="/authority/alerts" className="text-sm font-medium text-brand-600 hover:text-brand-700">All</Link>} />
          <div className="divide-y divide-gray-100">
            {activeAlerts.map((a) => (
              <Link key={a.id} to={`/authority/alerts/${a.id}`} className="block px-4 py-3 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <p className="pr-2 text-sm font-medium text-gray-900">{a.title}</p>
                  <SeverityBadge severity={a.severity} />
                </div>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                  <MapPin size={12} /> {a.sector}, {a.district} · {timeAgo(a.detectedAt)}
                </p>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      {/* Hotspot preview */}
      <Card className="mt-5">
        <CardHeader
          title="Outbreak hotspot map"
          description="Demand-anomaly intensity by sector"
          action={<Button as={Link} to="/authority/hotspots" size="sm" variant="secondary" iconRight={ArrowRight}>Full map</Button>}
        />
        <div className="p-3">
          <div className="overflow-hidden rounded-md border border-gray-200">
            <HotspotMap hotspots={hotspots} height={340} />
          </div>
        </div>
      </Card>
    </div>
  )
}
