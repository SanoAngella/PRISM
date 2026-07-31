import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Navigation, Star, Clock, Phone } from 'lucide-react'
import { Badge, Button, Card, PageHeader, PageLoader } from '../../components/ui'
import { PharmacyMap } from '../../components/maps/MapView'
import { catalogService } from '../../services/catalogService'
import { useAsync } from '../../hooks/useAsync'

export default function NearbyPharmacies() {
  const { data: pharmacies, loading } = useAsync(() => catalogService.getPharmacies(), [])
  const [activeId, setActiveId] = useState(null)

  if (loading) return <PageLoader />

  return (
    <div>
      <PageHeader title="Nearby pharmacies" description="Pharmacies across Kigali, sorted by distance." />

      <div className="grid gap-5 lg:grid-cols-5">
        {/* List */}
        <div className="space-y-3 lg:col-span-2">
          {pharmacies.map((p) => (
            <Card
              key={p.id}
              onClick={() => setActiveId(p.id)}
              className={`cursor-pointer p-4 transition-colors ${activeId === p.id ? 'border-brand-400 ring-1 ring-brand-200' : 'hover:border-brand-300'}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-base font-semibold text-gray-900">{p.name}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-sm text-gray-500">
                    <MapPin size={13} /> {p.address}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                    <span className="inline-flex items-center gap-1 font-medium text-gray-700">
                      <Star size={13} className="fill-warning-400 text-warning-500" /> {p.rating}
                      <span className="font-normal text-gray-400">({p.reviews})</span>
                    </span>
                    <span className="inline-flex items-center gap-1"><Navigation size={12} /> {p.distance.toFixed(1)} km</span>
                    <span className="inline-flex items-center gap-1"><Phone size={12} /> {p.phone}</span>
                  </div>
                </div>
                <Badge tone={p.open ? 'success' : 'gray'} dot>{p.open ? 'Open' : 'Closed'}</Badge>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                <span className="inline-flex items-center gap-1 text-xs text-gray-500"><Clock size={12} /> {p.hours}</span>
                <Button as={Link} to={`/patient/pharmacy/${p.id}`} size="sm" variant="secondary">View pharmacy</Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Map */}
        <div className="lg:col-span-3">
          <div className="sticky top-20 overflow-hidden rounded-lg border border-gray-200 bg-white">
            <PharmacyMap pharmacies={pharmacies} activeId={activeId} onSelect={(p) => setActiveId(p.id)} height={520} />
          </div>
        </div>
      </div>
    </div>
  )
}
