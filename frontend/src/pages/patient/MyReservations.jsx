import { useState } from 'react'
import {
  RefreshCw,
  ChevronRight,
  ChevronDown,
  MapPin,
  Pill,
  Navigation,
  Phone,
  Clock,
  Copy,
  CheckCircle2,
  Store,
  Bell,
} from 'lucide-react'
import { Button, Card } from '../../components/ui'
import { reservations } from '../../data/portal'
import { formatNumber } from '../../utils/format'

const TABS = ['All Reservations', 'Pending Pickup', 'Ready for Pickup', 'Completed', 'Cancelled']

const STATUS = {
  ready: ['Ready for pickup', 'bg-success-50 text-success-700'],
  pending: ['Pending', 'bg-warning-50 text-warning-700'],
  completed: ['Completed', 'bg-success-50 text-success-700'],
  cancelled: ['Cancelled', 'bg-gray-100 text-gray-600'],
}

function StatusBadge({ status }) {
  const [label, cls] = STATUS[status]
  return <span className={`inline-block whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-medium ${cls}`}>{label}</span>
}

function tabFilter(tab, r) {
  if (tab === 'All Reservations') return true
  if (tab === 'Pending Pickup') return r.status === 'pending'
  if (tab === 'Ready for Pickup') return r.status === 'ready'
  if (tab === 'Completed') return r.status === 'completed'
  if (tab === 'Cancelled') return r.status === 'cancelled'
  return true
}

export default function MyReservations() {
  const [tab, setTab] = useState('All Reservations')
  const [selectedId, setSelectedId] = useState(reservations[0].id)
  const list = reservations.filter((r) => tabFilter(tab, r))
  const selected = reservations.find((r) => r.id === selectedId) || list[0] || reservations[0]

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Reservations</h1>
          <p className="mt-1 text-base text-gray-500">View and manage all your medicine reservations.</p>
        </div>
        <Button variant="pine" icon={RefreshCw}>Refresh</Button>
      </div>

      <div className="mt-5 flex gap-6 border-b border-gray-200 text-sm">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 pb-2.5 font-medium transition-colors ${
              tab === t ? 'border-pine-700 text-pine-700' : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1.15fr]">
        {/* List */}
        <Card>
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
            <p className="text-sm font-semibold text-gray-900">{list.length} reservations</p>
            <button className="flex items-center gap-1 text-sm text-gray-500">
              Sort by: <span className="font-medium text-gray-700">Most Recent</span> <ChevronDown size={14} />
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {list.map((r) => {
              const active = r.id === selected.id
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedId(r.id)}
                  className={`flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors ${
                    active ? 'bg-pine-50/60 ring-1 ring-inset ring-pine-200' : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="flex h-14 w-12 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-gray-50 text-gray-400">
                    <Pill size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900">{r.medicine}</p>
                    <p className="truncate text-xs text-gray-500">{r.pharmacy}, {r.area}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-gray-400"><MapPin size={12} /> {r.distanceKm} km away</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <StatusBadge status={r.status} />
                    {r.status === 'ready' || r.status === 'pending' ? (
                      <>
                        <p className="text-xs text-gray-500">Reserved: {r.reservedLabel}</p>
                        <p className="text-xs font-medium text-warning-600">Expires in: {r.expiresIn}</p>
                      </>
                    ) : (
                      <p className="text-xs text-gray-500">{r.reservedLabel}</p>
                    )}
                  </div>
                  <ChevronRight size={16} className="mt-1 shrink-0 text-gray-300" />
                </button>
              )
            })}
          </div>
          <button className="flex w-full items-center justify-center gap-1.5 border-t border-gray-200 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50">
            Load more <ChevronDown size={15} />
          </button>
        </Card>

        {/* Detail */}
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <span className="flex h-14 w-12 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-gray-50 text-gray-400">
                <Pill size={20} />
              </span>
              <div>
                <h2 className="text-lg font-bold text-gray-900">{selected.medicine}</h2>
                <p className="text-sm text-gray-500">{selected.generic}</p>
                <p className="mt-1 text-xs text-gray-400">{selected.packs}</p>
              </div>
            </div>
            <StatusBadge status={selected.status} />
          </div>

          <div className="mt-5 grid grid-cols-3 gap-4 border-y border-gray-100 py-4">
            <div>
              <p className="text-xs text-gray-500">Quantity</p>
              <p className="text-sm font-semibold text-gray-900">{selected.quantity}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Reserved At</p>
              <p className="text-sm font-semibold text-gray-900">{selected.reservedLabel.replace('Cancelled: ', '').replace('Picked up: ', '')}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Expires In</p>
              <p className="text-sm font-semibold text-warning-600">{selected.expiresIn || '—'}</p>
            </div>
          </div>

          {selected.status === 'ready' && (
            <div className="mt-4 flex items-center gap-2 rounded-md bg-success-50 px-3 py-2.5 text-sm text-success-700">
              <CheckCircle2 size={16} /> Your reservation is confirmed. Please pick up before the expiry time.
            </div>
          )}
          {selected.status === 'pending' && (
            <div className="mt-4 flex items-center gap-2 rounded-md bg-warning-50 px-3 py-2.5 text-sm text-warning-700">
              <Clock size={16} /> Waiting for the pharmacy to confirm your reservation.
            </div>
          )}
          {selected.status === 'cancelled' && (
            <div className="mt-4 flex items-center gap-2 rounded-md bg-gray-100 px-3 py-2.5 text-sm text-gray-600">
              <Bell size={16} /> This reservation was cancelled.
            </div>
          )}

          <div className="mt-4 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-pine-700 text-white">
                <Store size={18} />
              </span>
              <div>
                <p className="text-base font-semibold text-gray-900">{selected.pharmacy}</p>
                <p className="text-sm text-gray-500">{selected.area}, Kicukiro</p>
                <p className="text-xs text-gray-400">{selected.distanceKm} km away · {selected.walkMins} min walk</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button size="sm" variant="pine" icon={Navigation}>Navigate</Button>
              <Button size="sm" variant="secondary" icon={Phone}>Call Pharmacy</Button>
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-gray-900"><Clock size={14} className="text-gray-400" /> Pharmacy Hours</p>
              <div className="space-y-1">
                {selected.hours.map((h) => (
                  <div key={h.day} className="flex justify-between text-xs text-gray-600">
                    <span>{h.day}</span><span className="font-medium text-gray-800">{h.time}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-gray-900"><Pill size={14} className="text-gray-400" /> Reservation Code</p>
              <div className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
                <span className="font-mono text-sm font-semibold tracking-wide text-gray-900">{selected.code}</span>
                <button className="text-gray-400 hover:text-gray-700"><Copy size={15} /></button>
              </div>
              <p className="mt-1 text-xs text-gray-500">Show this code at the pharmacy</p>
            </div>
          </div>

          <div className="mt-4">
            <p className="mb-2 text-sm font-semibold text-gray-900">Pharmacy Location</p>
            <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-[#eaf0ea]" style={{ height: 150 }}>
              <svg viewBox="0 0 480 150" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
                <rect width="480" height="150" fill="#e9efe9" />
                <g stroke="#f7c87a" strokeWidth="5" fill="none" opacity="0.9"><path d="M0 80 H480" /><path d="M340 0 V150" /></g>
                <g stroke="#ffffff" strokeWidth="2" fill="none"><path d="M0 40 H480" /><path d="M160 0 V150" /></g>
                <text x="90" y="30" fontSize="10" fontWeight="600" fill="#8a988c">KICUKIRO CENTER</text>
                <g transform="translate(255 78)">
                  <path d="M0 0C-7 0-12 5.5-12 12.3-12 21.5 0 33 0 33s12-11.5 12-20.7C12 5.5 7 0 0 0z" transform="translate(0 -33)" fill="#d92d20" stroke="#fff" strokeWidth="1.5" />
                  <circle cx="0" cy="-20.7" r="4" fill="#fff" />
                </g>
              </svg>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
