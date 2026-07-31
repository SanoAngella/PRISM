import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, MapPin, Phone, Clock, Star, Navigation, Search } from 'lucide-react'
import { Badge, Button, Card, CardHeader, PageLoader, StockBadge, Table } from '../../components/ui'
import { PharmacyMap } from '../../components/maps/MapView'
import { catalogService } from '../../services/catalogService'
import { useAsync } from '../../hooks/useAsync'
import { formatCurrency } from '../../utils/format'
import { STOCK_STATUS } from '../../utils/constants'

export default function PharmacyDetails() {
  const { id } = useParams()
  const { data: ph, loading } = useAsync(() => catalogService.getPharmacy(id), [id])
  const [q, setQ] = useState('')

  const stock = useMemo(() => {
    if (!ph) return []
    const query = q.trim().toLowerCase()
    return ph.stock
      .filter((s) => s.medicine && (!query || s.medicine.name.toLowerCase().includes(query)))
      .sort((a, b) => a.medicine.name.localeCompare(b.medicine.name))
  }, [ph, q])

  if (loading) return <PageLoader />
  if (!ph) return <p className="text-gray-500">Pharmacy not found.</p>

  const mapsUrl = `https://www.openstreetmap.org/directions?to=${ph.lat},${ph.lng}`

  const columns = [
    {
      key: 'name',
      header: 'Medicine',
      render: (r) => (
        <div>
          <Link to={`/patient/medicine/${r.medicine.id}`} className="font-medium text-gray-900 hover:text-brand-700">
            {r.medicine.name}
          </Link>
          <p className="text-xs text-gray-500">{r.medicine.category} · {r.medicine.form}</p>
        </div>
      ),
    },
    { key: 'price', header: 'Price', align: 'right', render: (r) => <span className="font-medium text-gray-900">{formatCurrency(r.price)}</span> },
    { key: 'status', header: 'Availability', align: 'center', render: (r) => <StockBadge status={r.status} /> },
    {
      key: 'action',
      header: '',
      align: 'right',
      render: (r) => (
        <Button as={Link} to={`/patient/reserve/${r.medicine.id}?pharmacy=${ph.id}`} size="sm" disabled={r.status === STOCK_STATUS.OUT}>
          Reserve
        </Button>
      ),
    },
  ]

  return (
    <div>
      <Link to="/patient/pharmacies" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800">
        <ArrowLeft size={15} /> Back to pharmacies
      </Link>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-1">
          <Card className="p-5">
            <div className="flex items-start justify-between">
              <h1 className="text-lg font-semibold text-gray-900">{ph.name}</h1>
              <Badge tone={ph.open ? 'success' : 'gray'} dot>{ph.open ? 'Open now' : 'Closed'}</Badge>
            </div>
            <div className="mt-3 space-y-2 text-sm text-gray-600">
              <p className="flex items-center gap-2"><MapPin size={15} className="text-gray-400" /> {ph.address}</p>
              <p className="flex items-center gap-2"><Phone size={15} className="text-gray-400" /> {ph.phone}</p>
              <p className="flex items-center gap-2"><Clock size={15} className="text-gray-400" /> {ph.hours}</p>
              <p className="flex items-center gap-2"><Navigation size={15} className="text-gray-400" /> {ph.distance.toFixed(1)} km away</p>
              <p className="flex items-center gap-2">
                <Star size={15} className="fill-warning-400 text-warning-500" />
                <span className="font-medium text-gray-800">{ph.rating}</span> ({ph.reviews} reviews)
              </p>
            </div>
            <Button as="a" href={mapsUrl} target="_blank" rel="noreferrer" className="mt-4 w-full" icon={Navigation}>
              Get directions
            </Button>
          </Card>

          <div className="overflow-hidden rounded-lg border border-gray-200">
            <PharmacyMap pharmacies={[ph]} activeId={ph.id} height={240} />
          </div>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader title="Stock at this pharmacy" description={`${ph.stock.length} medicines listed`} />
            <div className="border-b border-gray-200 px-4 py-3">
              <div className="relative max-w-xs">
                <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Filter medicines…"
                  className="h-9 w-full rounded-md border border-gray-300 bg-white pl-9 pr-3 text-base focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
              </div>
            </div>
            <Table columns={columns} data={stock} empty="No matching medicines" />
          </Card>
        </div>
      </div>
    </div>
  )
}
