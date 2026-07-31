import { useState } from 'react'
import {
  Search,
  Bug,
  Droplets,
  ShieldCheck,
  Baby,
  Salad,
  ChevronRight,
  ArrowRight,
  AlertTriangle,
  Clock,
  CalendarPlus,
  Pill,
  BedDouble,
  SprayCan,
  Shirt,
  Trash2,
} from 'lucide-react'
import { Button, Card } from '../../components/ui'
import { healthTips, healthTopicTabs } from '../../data/portal'

const POPULAR = [
  { label: 'Malaria', icon: Bug, tone: 'bg-brand-50 text-brand-700' },
  { label: 'Hygiene', icon: Droplets, tone: 'bg-sky-50 text-sky-700' },
  { label: 'Immunization', icon: ShieldCheck, tone: 'bg-success-50 text-success-700' },
  { label: 'Maternal Health', icon: Baby, tone: 'bg-warning-50 text-warning-700' },
  { label: 'Nutrition', icon: Salad, tone: 'bg-pine-50 text-pine-700' },
]

const TIP_ICON = { Malaria: BedDouble, Hygiene: Droplets, Immunization: ShieldCheck, 'Maternal Health': Baby, Nutrition: Salad }

export default function HealthTips() {
  const [tab, setTab] = useState('All Topics')

  return (
    <div className="space-y-5">
      {/* Header row */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <h1 className="text-2xl font-bold text-gray-900">Health Tips</h1>
          <p className="mt-1 text-base text-gray-500">Practical health advice for you and your community.</p>
          <div className="mt-4 flex gap-2">
            <div className="relative flex-1">
              <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                placeholder="Search health topics (e.g., malaria, hygiene, nutrition)"
                className="h-11 w-full rounded-md border border-gray-300 bg-white pl-11 pr-3 text-base focus:border-pine-500 focus:ring-2 focus:ring-pine-100"
              />
            </div>
            <Button variant="pine" size="lg">Search</Button>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="mb-3 text-md font-semibold text-gray-900">Popular Topics</h2>
          <div className="grid grid-cols-5 gap-2">
            {POPULAR.map((t) => (
              <button key={t.label} className="flex flex-col items-center gap-1.5 text-center">
                <span className={`flex h-11 w-11 items-center justify-center rounded-lg ${t.tone}`}>
                  <t.icon size={20} />
                </span>
                <span className="text-[11px] font-medium leading-tight text-gray-600">{t.label}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {healthTopicTabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              tab === t ? 'bg-pine-700 text-white' : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Featured */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3.5">
            <h2 className="text-md font-semibold text-gray-900">Featured Tips</h2>
            <button className="flex items-center gap-1 text-sm font-medium text-pine-700">View all articles <ArrowRight size={14} /></button>
          </div>
          <div className="divide-y divide-gray-100">
            {healthTips.map((tip) => {
              const Icon = TIP_ICON[tip.category] || Pill
              return (
                <div key={tip.id} className="flex items-center gap-4 px-5 py-4">
                  <span
                    className="flex h-16 w-24 shrink-0 items-center justify-center rounded-lg text-white"
                    style={{ backgroundColor: tip.hue }}
                  >
                    <Icon size={26} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="inline-block rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">{tip.category}</span>
                    <p className="mt-1 text-base font-semibold text-gray-900">{tip.title}</p>
                    <p className="mt-0.5 text-sm text-gray-500">{tip.excerpt}</p>
                  </div>
                  <div className="hidden shrink-0 flex-col items-end gap-1 text-right sm:flex">
                    <span className="flex items-center gap-1 text-xs text-gray-500"><Clock size={12} /> {tip.read}</span>
                    <span className="text-xs text-gray-400">{tip.date}</span>
                  </div>
                  <ChevronRight size={18} className="shrink-0 text-gray-300" />
                </div>
              )
            })}
          </div>
        </Card>

        {/* Sidebar */}
        <div className="space-y-5">
          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-md font-semibold text-gray-900">Seasonal Health Alert</h2>
              <button className="flex items-center gap-1 text-sm font-medium text-pine-700">View details <ArrowRight size={13} /></button>
            </div>
            <div className="rounded-lg border border-warning-200 bg-warning-50 p-3.5">
              <p className="flex items-start gap-2 text-sm font-semibold text-warning-800">
                <AlertTriangle size={16} className="mt-0.5 shrink-0 text-warning-600" />
                Malaria risk is high in Kicukiro
              </p>
              <p className="mt-1 pl-6 text-sm text-warning-700">Rainfall has increased. Protect yourself and your family from mosquito bites.</p>
            </div>
            <div className="mt-3 space-y-2.5 text-sm text-gray-600">
              {[
                [BedDouble, 'Sleep under an insecticide-treated net'],
                [SprayCan, 'Use mosquito repellent, especially at night'],
                [Shirt, 'Wear long sleeves and trousers in the evening'],
                [Trash2, 'Remove stagnant water around your home'],
              ].map(([Icon, text]) => (
                <p key={text} className="flex items-center gap-2.5">
                  <Icon size={16} className="shrink-0 text-gray-400" /> {text}
                </p>
              ))}
            </div>
            <button className="mt-3 flex items-center gap-1 text-sm font-medium text-pine-700">Learn more about malaria prevention <ArrowRight size={14} /></button>
          </Card>

          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-md font-semibold text-gray-900">Quick Reminders</h2>
              <button className="flex items-center gap-1 text-sm font-medium text-pine-700">View all reminders <ArrowRight size={13} /></button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-pine-50 text-pine-700"><CalendarPlus size={18} /></span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900">Child vaccination</p>
                  <p className="text-xs text-gray-500">Next dose due in 12 days</p>
                  <p className="text-xs text-gray-400">May 30, 2025</p>
                </div>
                <Button size="sm" variant="secondary">Set Reminder</Button>
              </div>
              <div className="flex items-center gap-3 border-t border-gray-100 pt-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-50 text-brand-600"><Pill size={18} /></span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900">Medicine refill</p>
                  <p className="text-xs text-gray-500">Coartem reservation ready for pickup</p>
                </div>
                <Button size="sm" variant="secondary">View Reservation</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Trust bar */}
      <div className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm sm:flex-row sm:items-center">
        <span className="flex items-center gap-2 text-gray-600">
          <ShieldCheck size={16} className="text-pine-600" />
          <span><span className="font-medium text-gray-800">Information you can trust.</span> All health tips are reviewed by the Rwanda Biomedical Centre (RBC) and Ministry of Health.</span>
        </span>
        <span className="text-xs font-medium text-gray-500 sm:ml-auto">Rwanda Biomedical Centre · Ministry of Health</span>
      </div>
    </div>
  )
}
