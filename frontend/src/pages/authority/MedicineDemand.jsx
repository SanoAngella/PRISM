import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Badge, Card, CardHeader, PageHeader, PageLoader, Table } from '../../components/ui'
import { DemandLineChart, CategoryBarChart, ChartLegend } from '../../components/charts/Charts'
import { useAsync } from '../../hooks/useAsync'
import { analyticsService } from '../../services/analyticsService'
import { categoryDemand, topMedicines } from '../../data/analytics'
import { formatNumber } from '../../utils/format'

export default function MedicineDemand() {
  const { data: trend } = useAsync(() => analyticsService.getDemandTrend(), [])
  if (!trend) return <PageLoader />

  const columns = [
    { key: 'name', header: 'Medicine', render: (m) => <span className="font-medium text-gray-900">{m.name}</span> },
    { key: 'category', header: 'Category', render: (m) => <Badge tone="gray">{m.category}</Badge> },
    { key: 'units', header: 'Units (7d)', align: 'right', render: (m) => formatNumber(m.units) },
    {
      key: 'change',
      header: 'Change',
      align: 'right',
      render: (m) => (
        <span className={`inline-flex items-center gap-0.5 font-medium ${m.change >= 25 ? 'text-danger-700' : m.change >= 0 ? 'text-success-700' : 'text-gray-500'}`}>
          {m.change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}{Math.abs(m.change)}%
        </span>
      ),
    },
    {
      key: 'signal',
      header: 'Signal',
      align: 'center',
      render: (m) => (m.change >= 40 ? <Badge tone="danger" dot>Anomaly</Badge> : m.change >= 20 ? <Badge tone="warning" dot>Watch</Badge> : <Badge tone="success" dot>Normal</Badge>),
    },
  ]

  return (
    <div>
      <PageHeader title="Medicine demand" description="Monitor demand patterns that signal emerging health events." />

      <Card>
        <CardHeader title="Tracer medicine demand" description="14-day network trend" />
        <div className="px-3 pb-2 pt-3">
          <DemandLineChart data={trend} height={300} />
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

      <div className="mt-5 grid gap-5 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader title="Demand by category" description="Last 7 days" />
          <div className="px-2 py-3"><CategoryBarChart data={categoryDemand} height={300} /></div>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader title="Top medicines by demand" description="Ranked with anomaly signals" />
          <Table columns={columns} data={topMedicines} keyField="name" />
        </Card>
      </div>
    </div>
  )
}
