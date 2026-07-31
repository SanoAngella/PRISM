import { Link } from 'react-router-dom'
import {
  Search, MapPin, ShieldCheck, Activity, Boxes, Siren, ArrowRight,
  CheckCircle2, Building2, Stethoscope, User, LineChart, Bell,
} from 'lucide-react'
import { Button, Badge } from '../components/ui'

function Stat({ value, label }) {
  return (
    <div>
      <p className="text-3xl font-semibold text-gray-900">{value}</p>
      <p className="mt-1 text-sm text-gray-500">{label}</p>
    </div>
  )
}

function Feature({ icon: Icon, title, children }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-50 text-brand-600">
        <Icon size={18} />
      </div>
      <h3 className="mt-3.5 text-md font-semibold text-gray-900">{title}</h3>
      <p className="mt-1.5 text-base leading-relaxed text-gray-500">{children}</p>
    </div>
  )
}

const roleCards = [
  {
    icon: User,
    title: 'For Patients',
    points: ['Search medicines instantly', 'See live stock nearby', 'Reserve and pick up', 'Navigate to the pharmacy'],
    cta: { to: '/signup', label: 'Create patient account' },
  },
  {
    icon: Building2,
    title: 'For Pharmacies',
    points: ['Manage inventory', 'Record sales', 'Low-stock alerts', 'Fulfil reservations'],
    cta: { to: '/login', label: 'Pharmacy sign in' },
  },
  {
    icon: Stethoscope,
    title: 'For Health Authorities',
    points: ['Real-time demand analytics', 'AI outbreak alerts', 'Hotspot mapping', 'Response recommendations'],
    cta: { to: '/login', label: 'Authority console' },
  },
]

export default function Landing() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-gray-200 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-20">
          <div>
            <Badge tone="brand" dot>IGAD Husika Hackathon 2026</Badge>
            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-gray-900 sm:text-[42px] sm:leading-[1.1]">
              Find medicines faster. Detect outbreaks earlier.
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-gray-600">
              PRISM connects patients to available medicines in real time, and turns everyday
              pharmacy demand into an early-warning signal for health authorities — days before
              hospitals are overwhelmed.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button as={Link} to="/signup" size="lg" iconRight={ArrowRight}>
                Find a medicine
              </Button>
              <Button as={Link} to="/login" size="lg" variant="secondary">
                Sign in to dashboard
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={15} className="text-success-600" /> Free for patients</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck size={15} className="text-success-600" /> Privacy-first</span>
            </div>
          </div>

          {/* Product preview panel */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <Search size={16} className="text-gray-400" />
              <div className="h-8 flex-1 rounded-md bg-gray-50 px-3 text-sm leading-8 text-gray-500">
                Coartem 20/120mg
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {[
                { name: 'CityMed Pharmacy', dist: '1.2 km', price: '3,200', tone: 'success', label: 'In stock' },
                { name: 'Community Pharmacy', dist: '2.6 km', price: '3,150', tone: 'success', label: 'In stock' },
                { name: 'Royal Pharmacy', dist: '3.1 km', price: '3,300', tone: 'warning', label: 'Low stock' },
              ].map((r) => (
                <div key={r.name} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-50 text-brand-600">
                      <MapPin size={15} />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{r.name}</p>
                      <p className="text-xs text-gray-500">{r.dist} away</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{r.price} RWF</p>
                    <Badge tone={r.tone} className="mt-0.5">{r.label}</Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-1 flex items-center gap-2 rounded-md bg-danger-50 px-3 py-2.5">
              <Siren size={16} className="text-danger-600" />
              <p className="text-sm text-danger-700">
                <span className="font-semibold">AI signal:</span> Antimalarial demand +44% in Kicukiro
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust stats */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 md:grid-cols-4">
          <Stat value="6" label="Pharmacies connected" />
          <Stat value="14" label="Medicines tracked" />
          <Stat value="620k" label="Population covered" />
          <Stat value="3–5 days" label="Earlier outbreak signal" />
        </div>
      </section>

      {/* Problem / solution */}
      <section id="how" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
            <h2 className="text-xl font-semibold text-gray-900">The problem</h2>
            <p className="mt-2 text-base leading-relaxed text-gray-600">
              Patients move from pharmacy to pharmacy searching for medicines with no way to know
              where stock exists. Meanwhile, outbreaks are usually detected only after hospitals
              are overwhelmed — even though pharmacies see unusual demand spikes first.
            </p>
          </div>
          <div className="rounded-lg border border-brand-200 bg-brand-50 p-6">
            <h2 className="text-xl font-semibold text-gray-900">Our solution</h2>
            <p className="mt-2 text-base leading-relaxed text-gray-700">
              One platform: patients locate and reserve medicines in real time, pharmacies manage
              stock and sales, and the AI continuously scans demand patterns to raise outbreak
              alerts with recommended actions for health authorities.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-y border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold text-gray-900">Everything the network needs, in one place</h2>
            <p className="mt-2 text-base text-gray-600">Built for patients, pharmacies and public-health teams alike.</p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Feature icon={Search} title="Real-time medicine search">Search by name or generic and instantly see which nearby pharmacies have stock.</Feature>
            <Feature icon={MapPin} title="Nearby pharmacy finder">Compare distance, price and availability, then navigate straight there.</Feature>
            <Feature icon={Boxes} title="Inventory management">Pharmacies track stock levels, batches and expiry with low-stock alerts.</Feature>
            <Feature icon={Activity} title="Demand analytics">Aggregated, anonymised demand trends across the whole network.</Feature>
            <Feature icon={Siren} title="AI outbreak alerts">Abnormal demand patterns trigger early-warning alerts with confidence scores.</Feature>
            <Feature icon={LineChart} title="Hotspot mapping">Visualise where anomalies concentrate and target the response.</Feature>
          </div>
        </div>
      </section>

      {/* Roles */}
      <section id="roles" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {roleCards.map((r) => (
            <div key={r.title} className="flex flex-col rounded-lg border border-gray-200 bg-white p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-600 text-white">
                <r.icon size={20} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">{r.title}</h3>
              <ul className="mt-3 flex-1 space-y-2">
                {r.points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-base text-gray-600">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-success-600" /> {p}
                  </li>
                ))}
              </ul>
              <Button as={Link} to={r.cta.to} variant="secondary" className="mt-5 w-full" iconRight={ArrowRight}>
                {r.cta.label}
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-200 bg-brand-600">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 py-10 sm:flex-row sm:items-center sm:px-6">
          <div>
            <h2 className="text-2xl font-semibold text-white">Smarter early warning starts with everyday data</h2>
            <p className="mt-1 text-base text-brand-100">Join the pharmacies and health teams building stronger communities.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button as={Link} to="/register" variant="secondary" size="lg">Register your pharmacy</Button>
            <Button as={Link} to="/signup" size="lg" className="border-white bg-white text-brand-700 hover:bg-brand-50">
              Find medicine
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
