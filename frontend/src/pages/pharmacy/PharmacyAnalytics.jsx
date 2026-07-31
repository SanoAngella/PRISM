import { Info, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Badge, Card, CardHeader, PageHeader, PageLoader } from '../../components/ui'
import { CategoryBarChart, SalesAreaChart } from '../../components/charts/Charts'
import { useAsync } from '../../hooks/useAsync'
import { pharmacyService } from '../../services/pharmacyService'
import { categoryDemand, topMedicines } from '../../data/analytics'
import { formatNumber } from '../../utils/format'

export default function PharmacyAnalytics() {
  const { data: trend } = useAsync(() => pharmacyService.getSalesTrend(), [])
  if (!trend) return <PageLoader />

  return (
    <div>
      <PageHeader title="Analytics" description="Understand what’s moving and how your pharmacy contributes to early warning." />

      <div className="flex items-start gap-2.5 rounded-lg border border-brand-200 bg-brand-50 px-4 py-3">
        <Info size={17} className="mt-0.5 shrink-0 text-brand-600" />
        <p className="text-sm text-brand-800">
          Your anonymised demand data helps health authorities spot outbreaks early. Only aggregated
          quantities are shared — never patient or transaction details.
        </p>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Demand by category" description="Units dispensed in the last 7 days" />
          <div className="px-2 py-3"><CategoryBarChart data={categoryDemand} /></div>
        </Card>

        <Card>
          <CardHeader title="Top medicines" description="Fastest-moving this week" />
          <div className="divide-y divide-gray-100">
            {topMedicines.map((m, i) => (
              <div key={m.name} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gray-100 text-xs font-semibold text-gray-500">{i + 1}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{m.name}</p>
                    <p className="text-xs text-gray-500">{formatNumber(m.units)} units</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-0.5 text-sm font-medium ${m.change >= 0 ? 'text-success-700' : 'text-danger-700'}`}>
                  {m.change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}{Math.abs(m.change)}%
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-5">
        <CardHeader title="Your revenue trend" description="Last 7 days" action={<Badge tone="success" dot><TrendingUp size={12} className="mr-0.5" /> Trending up</Badge>} />
        <div className="px-2 py-3"><SalesAreaChart data={trend} /></div>
      </Card>
    </div>
  )
}
