import { Link } from 'react-router-dom'
import { Boxes, AlertTriangle, PackageX, Wallet, ArrowRight, TrendingUp } from 'lucide-react'
import { Card, CardHeader, PageHeader, PageLoader, StatCard, StockBadge, ReservationBadge, Button } from '../../components/ui'
import { SalesAreaChart } from '../../components/charts/Charts'
import { useAuth } from '../../contexts/AuthContext'
import { useAsync } from '../../hooks/useAsync'
import { pharmacyService } from '../../services/pharmacyService'
import { reservationService } from '../../services/reservationService'
import { CURRENT_PHARMACY_ID } from '../../data/pharmacies'
import { formatCurrency, timeAgo } from '../../utils/format'
import { STOCK_STATUS } from '../../utils/constants'

export default function PharmacyDashboard() {
  const { user } = useAuth()
  const pid = user?.pharmacyId || CURRENT_PHARMACY_ID

  const { data: stats } = useAsync(() => pharmacyService.getInventoryStats(pid), [pid])
  const { data: inventory } = useAsync(() => pharmacyService.getInventory(pid), [pid])
  const { data: trend } = useAsync(() => pharmacyService.getSalesTrend(), [])
  const { data: reservations } = useAsync(() => reservationService.list({ pharmacyId: pid }), [pid])

  if (!stats || !inventory || !trend || !reservations) return <PageLoader />

  const lowStock = inventory
    .filter((r) => r.status !== STOCK_STATUS.IN_STOCK)
    .sort((a, b) => a.quantity - b.quantity)
    .slice(0, 6)

  const todayRevenue = trend[trend.length - 1]?.revenue || 0
  const pendingReservations = reservations.filter((r) => r.status === 'pending' || r.status === 'ready')

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.name || 'Pharmacy'}`}
        description="Here’s what’s happening across your pharmacy today."
        actions={<Button as={Link} to="/pharmacy/sales" icon={TrendingUp}>Record sale</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Stock value" value={formatCurrency(stats.stockValue)} icon={Wallet} delta={4} hint="vs last week" tone="brand" />
        <StatCard label="Today’s revenue" value={formatCurrency(todayRevenue)} icon={TrendingUp} delta={9} hint="vs yesterday" tone="success" />
        <StatCard label="Low stock" value={stats.lowStock} icon={AlertTriangle} hint="items to reorder" tone="warning" />
        <StatCard label="Out of stock" value={stats.outOfStock} icon={PackageX} hint="items unavailable" tone="danger" />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        {/* Sales trend */}
        <Card className="lg:col-span-2">
          <CardHeader title="Revenue (last 7 days)" description="Daily sales revenue in RWF" />
          <div className="px-2 py-3">
            <SalesAreaChart data={trend} />
          </div>
        </Card>

        {/* Low stock */}
        <Card>
          <CardHeader
            title="Reorder soon"
            action={<Link to="/pharmacy/inventory" className="text-sm font-medium text-brand-600 hover:text-brand-700">View all</Link>}
          />
          <div className="divide-y divide-gray-100">
            {lowStock.map((r) => (
              <div key={r.id} className="flex items-center justify-between px-4 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900">{r.medicine.name}</p>
                  <p className="text-xs text-gray-500">{r.quantity} in stock · reorder at {r.reorderLevel}</p>
                </div>
                <StockBadge status={r.status} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Reservations */}
      <Card className="mt-5">
        <CardHeader
          title="Open reservations"
          description={`${pendingReservations.length} awaiting fulfilment`}
          action={<Button as={Link} to="/pharmacy/reservations" size="sm" variant="secondary" iconRight={ArrowRight}>Manage</Button>}
        />
        <div className="divide-y divide-gray-100">
          {pendingReservations.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-gray-500">No open reservations right now.</p>
          ) : (
            pendingReservations.map((r) => (
              <div key={r.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <Boxes size={16} className="text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{r.medicineName} <span className="text-gray-400">× {r.quantity}</span></p>
                    <p className="text-xs text-gray-500">{r.patientName} · {r.code} · {timeAgo(r.createdAt)}</p>
                  </div>
                </div>
                <ReservationBadge status={r.status} />
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}
