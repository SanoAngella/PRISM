import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X, Footprints, Car, Star, Navigation, Plus, Info, Bell } from 'lucide-react'
import { Button, Card } from '../../components/ui'
import PortalMap from '../../components/portal/PortalMap'
import { pharmacies } from '../../data/portal'
import { formatNumber } from '../../utils/format'

const SORTS = ['Distance', 'Price: Low to High', 'Stock: High to Low', 'Rating']

const AVATARS = {
  'PH-IRIBA': { bg: 'bg-success-600', icon: true },
  'PH-MEDIPLUS': { bg: 'bg-pine-600', label: 'MP' },
  'PH-HOPE': { bg: 'bg-brand-500', label: 'HP' },
  'PH-UMUDURI': { bg: 'bg-pine-500', label: 'UP' },
  'PH-GISARO': { bg: 'bg-warning-500', label: 'GP' },
  'PH-ALPHA': { bg: 'bg-brand-600', label: 'AP' },
}

function Avatar({ id }) {
  const a = AVATARS[id] || { bg: 'bg-gray-400', label: '?' }
  return (
    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${a.bg}`}>
      {a.icon ? <Plus size={19} /> : a.label}
    </span>
  )
}

function StockPill({ stock, count }) {
  const map = {
    in_stock: ['In stock', 'bg-success-50 text-success-700'],
    low: ['Low stock', 'bg-warning-50 text-warning-700'],
    out: ['Out of stock', 'bg-danger-50 text-danger-700'],
  }
  const [label, cls] = map[stock]
  return (
    <div>
      <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${cls}`}>{label}</span>
      <p className="mt-1 text-xs text-gray-500">{count} packs</p>
    </div>
  )
}

function Check({ label, color, defaultChecked }) {
  const [on, setOn] = useState(defaultChecked)
  return (
    <button type="button" onClick={() => setOn((v) => !v)} className="flex items-center gap-2 text-sm text-gray-700">
      <span className={`flex h-4 w-4 items-center justify-center rounded ${on ? '' : 'border border-gray-300'}`} style={on ? { backgroundColor: color } : undefined}>
        {on && (
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2.5 6.2l2.2 2.3 4.8-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        )}
      </span>
      {label}
    </button>
  )
}

export default function MedicineSearch() {
  const [params] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') || 'Coartem')
  const [sort, setSort] = useState('Distance')

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Search Results</h1>
        <div className="relative mt-4 flex gap-2">
          <div className="relative flex-1">
            <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-11 w-full rounded-md border border-gray-300 bg-white pl-11 pr-10 text-base focus:border-pine-500 focus:ring-2 focus:ring-pine-100"
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            )}
          </div>
          <Button variant="pine" size="lg">Search</Button>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing results for <span className="font-medium text-gray-700">“{query}”</span> in Kigali, Rwanda</p>
          <p className="text-sm text-gray-500">{pharmacies.length} pharmacies found</p>
        </div>

        <div className="mt-5 flex items-center gap-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          {SORTS.map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                sort === s ? 'bg-pine-700 text-white' : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <Card className="mt-4 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 text-xs font-medium uppercase tracking-wide text-gray-400">
                  <th className="px-5 py-3">Pharmacy</th>
                  <th className="px-3 py-3">Distance</th>
                  <th className="px-3 py-3">Stock</th>
                  <th className="px-3 py-3">Price (RWF)</th>
                  <th className="px-3 py-3">Rating</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pharmacies.map((p) => (
                  <tr key={p.id} className="text-sm">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar id={p.id} />
                        <div>
                          <p className="font-medium text-gray-900">{p.name}</p>
                          <p className="text-xs text-gray-500">{p.area}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <p className="flex items-center gap-1 font-medium text-gray-900">
                        {p.distanceKm} km
                        {p.travel.mode === 'walk' ? <Footprints size={13} className="text-gray-400" /> : <Car size={13} className="text-gray-400" />}
                      </p>
                      <p className="text-xs text-gray-500">{p.travel.mins} min {p.travel.mode}</p>
                    </td>
                    <td className="px-3 py-4"><StockPill stock={p.stock} count={p.stockCount} /></td>
                    <td className="px-3 py-4">
                      <p className="font-semibold text-gray-900">{p.price ? formatNumber(p.price) : '—'}</p>
                      <p className="text-xs text-gray-500">{p.price ? 'per pack' : ''}</p>
                    </td>
                    <td className="px-3 py-4">
                      <p className="flex items-center gap-1 font-medium text-gray-900">
                        <Star size={14} className="fill-warning-400 text-warning-400" /> {p.rating}
                      </p>
                      <p className="text-xs text-gray-500">({p.reviews})</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="secondary" disabled={p.stock === 'out'}>Reserve</Button>
                        <Button size="sm" variant="pine" icon={Navigation}>Navigate</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="mt-4 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
          <p className="flex items-center gap-2 text-sm text-gray-600">
            <Info size={16} className="text-gray-400" />
            <span><span className="font-medium text-gray-800">Can’t find what you need?</span> Set a stock alert and we’ll notify you when {query} is available nearby.</span>
          </p>
          <Button size="sm" variant="secondary" icon={Bell}>Set Stock Alert</Button>
        </div>
      </div>

      {/* Filters + map */}
      <div className="space-y-5">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-md font-semibold text-gray-900">Filters</h2>
            <button className="text-sm font-medium text-pine-700">Clear all</button>
          </div>

          <div className="mt-4">
            <p className="mb-2 text-sm font-medium text-gray-700">Distance</p>
            <div className="relative h-1.5 rounded-full bg-gray-200">
              <div className="absolute inset-y-0 left-0 w-full rounded-full bg-pine-600" />
              <span className="absolute -top-1 left-0 h-3.5 w-3.5 rounded-full border-2 border-pine-600 bg-white" />
              <span className="absolute -top-1 right-0 h-3.5 w-3.5 rounded-full border-2 border-pine-600 bg-white" />
            </div>
            <div className="mt-2 flex justify-between text-xs text-gray-500"><span>0 km</span><span>10 km+</span></div>
          </div>

          <div className="mt-4">
            <p className="mb-2 text-sm font-medium text-gray-700">Price Range (RWF)</p>
            <div className="flex items-center gap-2">
              <input placeholder="Min" className="h-9 w-full rounded-md border border-gray-300 px-3 text-sm focus:border-pine-500 focus:ring-2 focus:ring-pine-100" />
              <span className="text-gray-400">to</span>
              <input placeholder="Max" className="h-9 w-full rounded-md border border-gray-300 px-3 text-sm focus:border-pine-500 focus:ring-2 focus:ring-pine-100" />
            </div>
          </div>

          <div className="mt-4">
            <p className="mb-2 text-sm font-medium text-gray-700">Stock Availability</p>
            <div className="space-y-2">
              <Check label="In stock" color="#039855" defaultChecked />
              <Check label="Low stock" color="#dc6803" defaultChecked />
              <Check label="Out of stock" color="#d92d20" defaultChecked />
            </div>
          </div>

          <div className="mt-4">
            <p className="mb-2 text-sm font-medium text-gray-700">Pharmacy Type</p>
            <select className="h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-sm focus:border-pine-500 focus:ring-2 focus:ring-pine-100">
              <option>All pharmacies</option>
              <option>Open now</option>
              <option>24/7</option>
            </select>
          </div>
        </Card>

        <Card className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-md font-semibold text-gray-900">Map View</h2>
            <button className="text-sm font-medium text-pine-700">See all on map</button>
          </div>
          <PortalMap height={280} legend={false} compact />
        </Card>
      </div>
    </div>
  )
}
