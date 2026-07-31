import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search,
  MapPin,
  CalendarCheck,
  ShoppingBag,
  Navigation,
  FileText,
  Footprints,
  Car,
  Plus,
  CheckCircle2,
  Info,
  Activity,
  CloudSun,
  ArrowRight,
} from 'lucide-react'
import { Button, Card } from '../../components/ui'
import PortalMap from '../../components/portal/PortalMap'
import { patient, portalMeta, pharmacies, reservations, notifications } from '../../data/portal'
import { formatNumber } from '../../utils/format'

const popular = ['Coartem', 'ORS', 'Paracetamol', 'Amoxicillin', 'Zinc tablets']

const AVATARS = {
  'PH-IRIBA': { bg: 'bg-success-600', icon: true },
  'PH-MEDIPLUS': { bg: 'bg-pine-600', label: 'MP' },
  'PH-HOPE': { bg: 'bg-brand-500', label: 'HP' },
  'PH-UMUDURI': { bg: 'bg-pine-500', label: 'UP' },
  'PH-GISARO': { bg: 'bg-warning-500', label: 'GP' },
}

function PharmacyAvatar({ id }) {
  const a = AVATARS[id] || { bg: 'bg-gray-400', label: '?' }
  return (
    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${a.bg}`}>
      {a.icon ? <Plus size={18} /> : a.label}
    </span>
  )
}

function StockText({ stock, count }) {
  const map = {
    in_stock: ['In stock', 'text-success-700'],
    low: ['Low stock', 'text-warning-700'],
    out: ['Out of stock', 'text-danger-700'],
  }
  const [label, color] = map[stock]
  return (
    <div>
      <span className={`inline-block rounded px-1.5 py-0.5 text-xs font-medium ${color} ${
        stock === 'in_stock' ? 'bg-success-50' : stock === 'low' ? 'bg-warning-50' : 'bg-danger-50'
      }`}>{label}</span>
      <p className="mt-1 text-xs text-gray-500">{count} packs</p>
    </div>
  )
}

function MiniStat({ icon: Icon, tone, value, label, link }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${tone}`}>
        <Icon size={17} />
      </span>
      <div>
        <p className="text-xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-xs font-medium text-pine-700">{link}</p>
      </div>
    </div>
  )
}

export default function PatientHome() {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const submit = (e) => {
    e.preventDefault()
    navigate(`/patient/search${q ? `?q=${encodeURIComponent(q)}` : ''}`)
  }

  const nearby = pharmacies.slice(0, 5)
  const activeRes = reservations.filter((r) => r.status === 'ready' || r.status === 'pending').slice(0, 2)

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {/* Greeting + search */}
      <Card className="lg:col-span-2">
        <div className="p-5 sm:p-6">
          <h1 className="text-2xl font-bold text-gray-900">Good morning, {patient.firstName}! 👋</h1>
          <p className="mt-1 text-base text-gray-500">Find medicines near you, reserve stock, and navigate to the pharmacy.</p>
          <form onSubmit={submit} className="mt-4 flex gap-2">
            <div className="relative flex-1">
              <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search medicines (e.g., Coartem, ORS, Paracetamol)"
                className="h-11 w-full rounded-md border border-gray-300 bg-white pl-11 pr-3 text-base placeholder:text-gray-400 focus:border-pine-500 focus:ring-2 focus:ring-pine-100"
              />
            </div>
            <Button type="submit" variant="pine" size="lg">Search</Button>
          </form>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-500">Popular:</span>
            {popular.map((p) => (
              <button
                key={p}
                onClick={() => navigate(`/patient/search?q=${encodeURIComponent(p)}`)}
                className="rounded-md bg-pine-50 px-2.5 py-1 text-sm font-medium text-pine-700 hover:bg-pine-100"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Your location */}
      <Card className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-2">
            <MapPin size={18} className="mt-0.5 text-pine-700" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Your Location</p>
              <p className="text-sm text-gray-500">{patient.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <CloudSun size={22} className="text-warning-500" />
            <div className="text-right leading-tight">
              <p className="text-base font-semibold text-gray-900">{portalMeta.weather.temp}°C</p>
              <p className="text-xs">{portalMeta.weather.condition}</p>
            </div>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3 border-t border-gray-100 pt-4">
          <MiniStat icon={CalendarCheck} tone="bg-pine-50 text-pine-700" value={portalMeta.stats.activeReservations} label="Active Reservations" link="View all" />
          <MiniStat icon={ShoppingBag} tone="bg-brand-50 text-brand-600" value={portalMeta.stats.ordersThisMonth} label="Orders This Month" link="View history" />
          <MiniStat icon={CheckCircle2} tone="bg-success-50 text-success-600" value={portalMeta.stats.healthAlerts} label="Health Alerts" link="No active alerts" />
        </div>
      </Card>

      {/* Nearby pharmacies */}
      <Card className="lg:col-span-2">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3.5">
          <h2 className="text-md font-semibold text-gray-900">Nearby Pharmacies</h2>
          <Link to="/patient/search" className="text-sm font-medium text-pine-700 hover:text-pine-800">See all</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 text-xs font-medium uppercase tracking-wide text-gray-400">
                <th className="px-5 py-2.5">Pharmacy</th>
                <th className="px-3 py-2.5">Distance</th>
                <th className="px-3 py-2.5">Coartem (Stock)</th>
                <th className="px-3 py-2.5">Price (RWF)</th>
                <th className="px-5 py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {nearby.map((p) => (
                <tr key={p.id} className="text-sm">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <PharmacyAvatar id={p.id} />
                      <div>
                        <p className="font-medium text-gray-900">{p.name}</p>
                        <p className="text-xs text-gray-500">{p.area}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <p className="flex items-center gap-1 font-medium text-gray-900">
                      {p.distanceKm} km
                      {p.travel.mode === 'walk' ? <Footprints size={13} className="text-gray-400" /> : <Car size={13} className="text-gray-400" />}
                    </p>
                    <p className="text-xs text-gray-500">{p.travel.mins} min</p>
                  </td>
                  <td className="px-3 py-3"><StockText stock={p.stock} count={p.stockCount} /></td>
                  <td className="px-3 py-3">
                    <p className="font-semibold text-gray-900">{p.price ? formatNumber(p.price) : '—'}</p>
                    <p className="text-xs text-gray-500">{p.price ? 'per pack' : ''}</p>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="secondary">View</Button>
                      <Button size="sm" variant="pine" disabled={p.stock === 'out'}>Reserve</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Link to="/patient/search" className="flex items-center justify-center gap-1.5 border-t border-gray-200 py-3 text-sm font-medium text-pine-700 hover:bg-gray-50">
          View more pharmacies <ArrowRight size={15} />
        </Link>
      </Card>

      {/* Map */}
      <Card className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-md font-semibold text-gray-900">Pharmacies Near You</h2>
          <button className="rounded-md border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50">Fullscreen</button>
        </div>
        <PortalMap height={360} />
      </Card>

      {/* Active reservations */}
      <Card>
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3.5">
          <h2 className="text-md font-semibold text-gray-900">My Active Reservations</h2>
          <Link to="/patient/reservations" className="text-sm font-medium text-pine-700">See all</Link>
        </div>
        <div className="divide-y divide-gray-100">
          {activeRes.map((r) => (
            <div key={r.id} className="flex items-center gap-3 px-5 py-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-gray-100 text-gray-400">
                <ShoppingBag size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900">{r.medicine}</p>
                <p className="truncate text-xs text-gray-500">{r.pharmacy}, {r.area}</p>
                <p className="mt-0.5 text-xs text-gray-400">Reserved {r.reservedLabel}</p>
              </div>
              <div className="text-right">
                {r.status === 'ready' ? (
                  <span className="inline-block rounded bg-success-50 px-1.5 py-0.5 text-xs font-medium text-success-700">Ready for pickup</span>
                ) : (
                  <span className="inline-block rounded bg-warning-50 px-1.5 py-0.5 text-xs font-medium text-warning-700">Expires in {r.expiresIn?.slice(0, 8)}</span>
                )}
                <p className="mt-1 text-xs text-gray-500">{r.packs}</p>
                <p className="text-xs font-semibold text-gray-700">{formatNumber(r.price)} RWF</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick actions */}
      <Card className="p-5">
        <h2 className="mb-4 text-md font-semibold text-gray-900">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Search, label: 'Search Medicines', to: '/patient/search' },
            { icon: CalendarCheck, label: 'My Reservations', to: '/patient/reservations' },
            { icon: Navigation, label: 'Navigate to Pharmacy', to: '/patient/search' },
            { icon: FileText, label: 'Orders History', to: '/patient/orders' },
          ].map((a) => (
            <Link
              key={a.label}
              to={a.to}
              className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 px-3 py-5 text-center transition-colors hover:border-pine-300 hover:bg-pine-50/40"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-pine-50 text-pine-700">
                <a.icon size={19} />
              </span>
              <span className="text-sm font-medium text-gray-700">{a.label}</span>
            </Link>
          ))}
        </div>
      </Card>

      {/* Recent notifications */}
      <Card>
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3.5">
          <h2 className="text-md font-semibold text-gray-900">Recent Notifications</h2>
          <Link to="/patient/notifications" className="text-sm font-medium text-pine-700">See all</Link>
        </div>
        <div className="divide-y divide-gray-100">
          {notifications.slice(0, 3).map((n) => {
            const icon = n.type === 'reservation' ? CheckCircle2 : n.type === 'order' ? Info : Activity
            const tone = n.type === 'reservation' ? 'bg-success-50 text-success-600' : n.type === 'order' ? 'bg-brand-50 text-brand-600' : 'bg-warning-50 text-warning-600'
            const Icon = icon
            return (
              <div key={n.id} className="flex gap-3 px-5 py-3.5">
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${tone}`}>
                  <Icon size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900">{n.title}</p>
                  <p className="text-xs text-gray-500">{n.body}</p>
                </div>
                <span className="whitespace-nowrap text-xs text-gray-400">{n.time.replace('Yesterday ', 'Today ')}</span>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
