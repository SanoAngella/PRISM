import { useState } from 'react'
import {
  Check,
  Store,
  Package,
  AlertTriangle,
  Bell,
  Settings2,
  ChevronRight,
  CalendarCheck,
  ShoppingBag,
  ListChecks,
} from 'lucide-react'
import { Button, Card } from '../../components/ui'
import { notifications } from '../../data/portal'

const META = {
  N1: { icon: Store, ring: 'bg-success-600', dot: 'bg-success-500', tag: ['Reservations', 'bg-success-50 text-success-700'] },
  N2: { icon: Package, ring: 'bg-brand-500', dot: 'bg-brand-500', tag: ['Orders', 'bg-brand-50 text-brand-700'] },
  N3: { icon: AlertTriangle, ring: 'bg-warning-500', dot: 'bg-warning-500', tag: ['Health Alerts', 'bg-warning-50 text-warning-700'] },
  N4: { icon: Bell, ring: 'bg-purple-500', dot: 'bg-purple-500', tag: ['Reservations', 'bg-success-50 text-success-700'] },
  N5: { icon: Settings2, ring: 'bg-gray-400', dot: 'bg-gray-300', tag: ['System', 'bg-gray-100 text-gray-600'] },
}

const TABS = [
  ['All', 3],
  ['Reservations', 1],
  ['Orders', 1],
  ['Health Alerts', 1],
  ['System', 0],
]

const GROUPS = ['Today', 'Yesterday', 'This week']

const SUMMARY = [
  { icon: CalendarCheck, label: 'Reservations', desc: 'Updates about your reservations', tone: 'bg-pine-50 text-pine-700', count: 1 },
  { icon: ShoppingBag, label: 'Orders', desc: 'Updates about orders and stock', tone: 'bg-brand-50 text-brand-600', count: 1 },
  { icon: AlertTriangle, label: 'Health Alerts', desc: 'Important health information', tone: 'bg-warning-50 text-warning-600', count: 1 },
  { icon: Bell, label: 'System', desc: 'System updates and announcements', tone: 'bg-gray-100 text-gray-500', count: 0 },
]

const PREFS = [
  ['Reservations', 'SMS, Email'],
  ['Orders & Stock', 'SMS, Email'],
  ['Health Alerts', 'SMS, Email, Push'],
  ['System Updates', 'Email'],
]

export default function Notifications() {
  const [tab, setTab] = useState('All')

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="mt-1 text-base text-gray-500">Stay updated with your reservations, orders, and health alerts.</p>
        </div>
        <Button variant="secondary" icon={Check}>Mark all as read</Button>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {TABS.map(([label, count]) => (
          <button
            key={label}
            onClick={() => setTab(label)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              tab === label ? 'bg-pine-700 text-white' : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {label} ({count})
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        {/* Feed */}
        <Card className="lg:col-span-2">
          <div className="px-5">
            {GROUPS.map((group) => {
              const rows = notifications.filter((n) => n.group === group)
              if (!rows.length) return null
              return (
                <div key={group}>
                  <p className="border-b border-gray-100 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">{group}</p>
                  <div className="divide-y divide-gray-100">
                    {rows.map((n) => {
                      const m = META[n.id]
                      const [tagLabel, tagCls] = m.tag
                      return (
                        <div key={n.id} className="flex items-start gap-3 py-4">
                          <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${n.unread ? m.dot : 'bg-transparent'}`} />
                          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white ${m.ring}`}>
                            <m.icon size={18} />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <p className="text-sm font-semibold text-gray-900">{n.title}</p>
                              <span className="whitespace-nowrap text-xs text-gray-400">{n.time}</span>
                            </div>
                            <p className="mt-0.5 text-sm text-gray-500">{n.body}</p>
                            <div className="mt-1.5 flex items-center justify-between gap-3">
                              <p className="text-xs text-gray-400">{n.meta}</p>
                              <span className={`rounded px-2 py-0.5 text-xs font-medium ${tagCls}`}>{tagLabel}</span>
                            </div>
                          </div>
                          <ChevronRight size={16} className="mt-1 shrink-0 text-gray-300" />
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
            <p className="py-4 text-center text-xs text-gray-400">You’ve reached the end</p>
          </div>
        </Card>

        {/* Sidebar */}
        <div className="space-y-5">
          <Card className="p-5">
            <h2 className="mb-3 text-md font-semibold text-gray-900">Notification Summary</h2>
            <div className="space-y-3">
              {SUMMARY.map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-md ${s.tone}`}><s.icon size={17} /></span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900">{s.label}</p>
                    <p className="text-xs text-gray-500">{s.desc}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{s.count}</span>
                </div>
              ))}
            </div>
            <Button variant="secondary" icon={ListChecks} className="mt-4 w-full">View all history</Button>
          </Card>

          <Card className="p-5">
            <h2 className="text-md font-semibold text-gray-900">Notification Preferences</h2>
            <p className="mt-0.5 text-sm text-gray-500">Choose how you want to be notified.</p>
            <div className="mt-3 divide-y divide-gray-100">
              {PREFS.map(([label, channels]) => {
                const Icon = label === 'Reservations' ? CalendarCheck : label === 'Orders & Stock' ? ShoppingBag : label === 'Health Alerts' ? AlertTriangle : Settings2
                return (
                  <button key={label} className="flex w-full items-center gap-3 py-3 text-left">
                    <Icon size={17} className="text-gray-400" />
                    <span className="flex-1 text-sm font-medium text-gray-800">{label}</span>
                    <span className="text-sm text-gray-500">{channels}</span>
                    <ChevronRight size={15} className="text-gray-300" />
                  </button>
                )
              })}
            </div>
            <button className="mt-2 flex w-full items-center justify-between text-sm font-medium text-pine-700">
              Manage preferences <ChevronRight size={15} />
            </button>
          </Card>
        </div>
      </div>
    </div>
  )
}
