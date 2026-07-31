import { Download, MapPin, CheckCircle2, Clock, XCircle, ChevronLeft, ChevronRight, Search, Calendar, Plus, ArrowRight } from 'lucide-react'
import { Button, Card } from '../../components/ui'
import { activeOrders, orderHistory } from '../../data/portal'
import { formatNumber } from '../../utils/format'

const AVATARS = {
  'Iriba Pharmacy': { bg: 'bg-success-600', icon: true },
  'MediPlus Kicukiro': { bg: 'bg-pine-600', label: 'MP' },
  'Hope Pharmacy': { bg: 'bg-brand-500', label: 'HP' },
  'Umuduri Pharmacy': { bg: 'bg-pine-500', label: 'UP' },
  'Gisaro Pharmacy': { bg: 'bg-warning-500', label: 'GP' },
}

function Avatar({ name }) {
  const a = AVATARS[name] || { bg: 'bg-gray-400', label: '?' }
  return (
    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white ${a.bg}`}>
      {a.icon ? <Plus size={16} /> : a.label}
    </span>
  )
}

function OrderStatus({ status }) {
  const map = {
    ready: [CheckCircle2, 'Ready for pickup', 'bg-success-50 text-success-700'],
    preparing: [Clock, 'Preparing', 'bg-warning-50 text-warning-700'],
    completed: [CheckCircle2, 'Completed', 'bg-success-50 text-success-700'],
    cancelled: [XCircle, 'Cancelled', 'bg-gray-100 text-gray-600'],
  }
  const [Icon, label, cls] = map[status]
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-medium ${cls}`}>
      <Icon size={13} /> {label}
    </span>
  )
}

export default function Orders() {
  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders &amp; History</h1>
          <p className="mt-1 text-base text-gray-500">Track your medicine orders, reservations, and purchase history.</p>
        </div>
        <Button variant="secondary" icon={Download}>Download History</Button>
      </div>

      {/* Active orders */}
      <Card className="mt-5">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3.5">
          <div className="flex items-center gap-2">
            <h2 className="text-md font-semibold text-gray-900">Active Orders</h2>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">{activeOrders.length}</span>
          </div>
          <button className="flex items-center gap-1 text-sm font-medium text-pine-700">View all active orders <ArrowRight size={14} /></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs font-medium uppercase tracking-wide text-gray-400">
                <th className="px-5 py-2.5">Order ID</th>
                <th className="px-3 py-2.5">Pharmacy</th>
                <th className="px-3 py-2.5">Items</th>
                <th className="px-3 py-2.5">Status</th>
                <th className="px-3 py-2.5">Pickup / Delivery</th>
                <th className="px-3 py-2.5">Total</th>
                <th className="px-3 py-2.5">Placed</th>
                <th className="px-5 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {activeOrders.map((o) => (
                <tr key={o.id}>
                  <td className="px-5 py-4">
                    <p className="font-medium text-pine-700">#{o.id}</p>
                    <p className="text-xs text-gray-500">{o.statusLabel}</p>
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-2">
                      <Avatar name={o.pharmacy} />
                      <div>
                        <p className="font-medium text-gray-900">{o.pharmacy}</p>
                        <p className="text-xs text-gray-500">{o.area}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <p className="font-medium text-gray-900">{o.itemsCount} items</p>
                    <p className="text-xs text-gray-500">{o.items}</p>
                  </td>
                  <td className="px-3 py-4"><OrderStatus status={o.status} /></td>
                  <td className="px-3 py-4">
                    <p className="flex items-center gap-1 font-medium text-gray-900"><MapPin size={13} className="text-gray-400" /> {o.method}</p>
                    <p className="text-xs text-gray-500">{o.methodArea}</p>
                  </td>
                  <td className="px-3 py-4 font-semibold text-gray-900">{formatNumber(o.total)} RWF</td>
                  <td className="px-3 py-4 text-gray-600">{o.placed}</td>
                  <td className="px-5 py-4 text-right"><Button size="sm" variant="secondary">View Details</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Order history */}
      <Card className="mt-5">
        <div className="flex flex-col gap-3 border-b border-gray-200 px-5 py-3.5 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-md font-semibold text-gray-900">Order History</h2>
          <div className="flex flex-wrap items-center gap-2">
            <select className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-600 focus:border-pine-500 focus:ring-2 focus:ring-pine-100">
              <option>All Statuses</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
            <button className="flex h-9 items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-600">
              <Calendar size={14} className="text-gray-400" /> May 1 – May 26, 2025
            </button>
            <div className="relative">
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input placeholder="Search by medicine or pharmacy" className="h-9 w-60 rounded-md border border-gray-300 bg-white pl-9 pr-3 text-sm focus:border-pine-500 focus:ring-2 focus:ring-pine-100" />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs font-medium uppercase tracking-wide text-gray-400">
                <th className="px-5 py-2.5">Order ID</th>
                <th className="px-3 py-2.5">Pharmacy</th>
                <th className="px-3 py-2.5">Items</th>
                <th className="px-3 py-2.5">Status</th>
                <th className="px-3 py-2.5">Total</th>
                <th className="px-3 py-2.5">Method</th>
                <th className="px-3 py-2.5">Date</th>
                <th className="px-5 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orderHistory.map((o) => (
                <tr key={o.id}>
                  <td className="px-5 py-4">
                    <p className="font-medium text-pine-700">#{o.id}</p>
                    <p className="text-xs text-gray-500">{o.statusLabel}</p>
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-2">
                      <Avatar name={o.pharmacy} />
                      <div>
                        <p className="font-medium text-gray-900">{o.pharmacy}</p>
                        <p className="text-xs text-gray-500">{o.area}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <p className="font-medium text-gray-900">{o.itemsCount} item{o.itemsCount > 1 ? 's' : ''}</p>
                    <p className="text-xs text-gray-500">{o.items}</p>
                  </td>
                  <td className="px-3 py-4"><OrderStatus status={o.status} /></td>
                  <td className="px-3 py-4 font-semibold text-gray-900">{o.total ? `${formatNumber(o.total)} RWF` : '—'}</td>
                  <td className="px-3 py-4 text-gray-600">{o.method}</td>
                  <td className="px-3 py-4 text-gray-600">{o.date}</td>
                  <td className="px-5 py-4 text-right">
                    <Button size="sm" variant="secondary">{o.status === 'cancelled' ? 'View Details' : 'View Invoice'}</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 px-5 py-3">
          <p className="text-sm text-gray-500">Showing 1 to 5 of 18 orders</p>
          <div className="flex items-center gap-1">
            <button className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50"><ChevronLeft size={15} /></button>
            {[1, 2, 3, 4].map((n) => (
              <button key={n} className={`flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium ${n === 1 ? 'bg-pine-700 text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}>{n}</button>
            ))}
            <button className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50"><ChevronRight size={15} /></button>
          </div>
        </div>
      </Card>
    </div>
  )
}
