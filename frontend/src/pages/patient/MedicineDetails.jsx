import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Pill, MapPin, Navigation, Clock, ArrowUpDown, Info } from 'lucide-react'
import { Badge, Button, Card, CardBody, CardHeader, PageLoader, StockBadge } from '../../components/ui'
import { catalogService } from '../../services/catalogService'
import { useAsync } from '../../hooks/useAsync'
import { formatCurrency, timeAgo } from '../../utils/format'
import { STOCK_STATUS } from '../../utils/constants'

export default function MedicineDetails() {
  const { id } = useParams()
  const [sort, setSort] = useState('distance')
  const { data: med, loading: l1 } = useAsync(() => catalogService.getMedicine(id), [id])
  const { data: rows, loading: l2 } = useAsync(() => catalogService.getMedicineAvailability(id), [id])

  if (l1 || l2) return <PageLoader />
  if (!med) return <p className="text-gray-500">Medicine not found.</p>

  const sorted = [...(rows || [])].sort((a, b) =>
    sort === 'price' ? a.price - b.price : a.distance - b.distance,
  )

  const infoRows = [
    ['Generic name', med.genericName],
    ['Category', med.category],
    ['Form', med.form],
    ['Strength', med.strength],
    ['Pack size', med.packSize],
    ['Manufacturer', med.manufacturer],
  ]

  return (
    <div>
      <Link to="/patient/search" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800">
        <ArrowLeft size={15} /> Back to search
      </Link>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Medicine info */}
        <div className="lg:col-span-1">
          <Card>
            <CardBody>
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-md bg-brand-50 text-brand-600">
                  <Pill size={22} />
                </span>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">{med.name}</h1>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge tone="brand">{med.category}</Badge>
                    {med.prescriptionRequired ? <Badge tone="warning">Prescription</Badge> : <Badge tone="success">OTC</Badge>}
                  </div>
                </div>
              </div>

              <p className="mt-4 text-base leading-relaxed text-gray-600">{med.description}</p>

              <dl className="mt-4 divide-y divide-gray-100 border-t border-gray-100">
                {infoRows.map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2 text-sm">
                    <dt className="text-gray-500">{k}</dt>
                    <dd className="font-medium text-gray-900">{v}</dd>
                  </div>
                ))}
              </dl>

              {med.prescriptionRequired && (
                <div className="mt-4 flex items-start gap-2 rounded-md bg-warning-50 px-3 py-2.5 text-sm text-warning-700">
                  <Info size={15} className="mt-0.5 shrink-0" />
                  A valid prescription is required to purchase this medicine.
                </div>
              )}

              <Button as={Link} to={`/patient/reserve/${med.id}`} className="mt-4 w-full">
                Reserve at a pharmacy
              </Button>
            </CardBody>
          </Card>
        </div>

        {/* Availability */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Availability near you"
              description={`${sorted.filter((r) => r.status !== STOCK_STATUS.OUT).length} of ${sorted.length} pharmacies have stock`}
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  icon={ArrowUpDown}
                  onClick={() => setSort((s) => (s === 'distance' ? 'price' : 'distance'))}
                >
                  Sort by {sort === 'distance' ? 'distance' : 'price'}
                </Button>
              }
            />
            <div className="divide-y divide-gray-100">
              {sorted.map((r) => (
                <div key={r.id} className="flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-gray-100 text-gray-500">
                      <MapPin size={16} />
                    </span>
                    <div>
                      <Link to={`/patient/pharmacy/${r.pharmacy.id}`} className="text-base font-medium text-gray-900 hover:text-brand-700">
                        {r.pharmacy.name}
                      </Link>
                      <p className="text-sm text-gray-500">{r.pharmacy.sector}, {r.pharmacy.district}</p>
                      <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                        <span className="inline-flex items-center gap-1"><Navigation size={12} /> {r.distance.toFixed(1)} km</span>
                        <span className="inline-flex items-center gap-1"><Clock size={12} /> updated {timeAgo(r.updatedAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:gap-1">
                    <div className="text-right">
                      <p className="text-base font-semibold text-gray-900">{formatCurrency(r.price)}</p>
                      <StockBadge status={r.status} />
                    </div>
                    <Button
                      as={Link}
                      to={`/patient/reserve/${med.id}?pharmacy=${r.pharmacy.id}`}
                      size="sm"
                      disabled={r.status === STOCK_STATUS.OUT}
                    >
                      Reserve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
