import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, MapPin, Minus, Plus, User, Phone, Navigation } from 'lucide-react'
import { Badge, Button, Card, CardBody, CardHeader, Input, PageLoader, StockBadge } from '../../components/ui'
import { catalogService } from '../../services/catalogService'
import { reservationService } from '../../services/reservationService'
import { useAsync } from '../../hooks/useAsync'
import { useToast } from '../../contexts/ToastContext'
import { formatCurrency } from '../../utils/format'
import { STOCK_STATUS } from '../../utils/constants'

export default function Reservation() {
  const { medicineId } = useParams()
  const [params] = useSearchParams()
  const toast = useToast()
  const navigate = useNavigate()

  const { data: med, loading: l1 } = useAsync(() => catalogService.getMedicine(medicineId), [medicineId])
  const { data: rows, loading: l2 } = useAsync(() => catalogService.getMedicineAvailability(medicineId), [medicineId])

  const [pharmacyId, setPharmacyId] = useState(params.get('pharmacy') || '')
  const [qty, setQty] = useState(1)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [confirmation, setConfirmation] = useState(null)

  const available = useMemo(
    () => (rows || []).filter((r) => r.status !== STOCK_STATUS.OUT),
    [rows],
  )

  // Default selection to nearest available pharmacy.
  const selected = available.find((r) => r.pharmacy.id === pharmacyId) || available[0]
  const activePharmacyId = selected?.pharmacy.id

  if (l1 || l2) return <PageLoader />
  if (!med) return <p className="text-gray-500">Medicine not found.</p>

  const unitPrice = selected?.price || med.unitPrice
  const total = unitPrice * qty

  const submit = async (e) => {
    e.preventDefault()
    if (!selected) return
    if (!name.trim() || !phone.trim()) {
      toast.error('Missing details', 'Please provide your name and phone number.')
      return
    }
    setSubmitting(true)
    try {
      const reservation = await reservationService.create({
        medicineId: med.id,
        medicineName: med.name,
        pharmacyId: selected.pharmacy.id,
        pharmacyName: selected.pharmacy.name,
        patientName: name,
        patientPhone: phone,
        quantity: qty,
        unitPrice,
      })
      setConfirmation({ ...reservation, pharmacy: selected.pharmacy })
      toast.success('Reservation confirmed', `Pickup code ${reservation.code}`)
    } catch (err) {
      toast.error('Reservation failed', err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (confirmation) {
    const mapsUrl = `https://www.openstreetmap.org/directions?to=${confirmation.pharmacy.lat},${confirmation.pharmacy.lng}`
    return (
      <div className="mx-auto max-w-lg">
        <Card>
          <CardBody className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success-50 text-success-600">
              <CheckCircle2 size={26} />
            </div>
            <h1 className="mt-4 text-xl font-semibold text-gray-900">Reservation confirmed</h1>
            <p className="mt-1 text-base text-gray-500">Show this code at the pharmacy to collect your medicine.</p>

            <div className="mt-5 rounded-lg border border-dashed border-brand-300 bg-brand-50 py-4">
              <p className="text-xs font-medium uppercase tracking-wider text-brand-600">Pickup code</p>
              <p className="mt-1 text-3xl font-semibold tracking-wide text-brand-700">{confirmation.code}</p>
            </div>

            <dl className="mt-5 space-y-2.5 text-left text-sm">
              <div className="flex justify-between"><dt className="text-gray-500">Medicine</dt><dd className="font-medium text-gray-900">{confirmation.medicineName}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Quantity</dt><dd className="font-medium text-gray-900">{confirmation.quantity}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Pharmacy</dt><dd className="font-medium text-gray-900">{confirmation.pharmacyName}</dd></div>
              <div className="flex justify-between border-t border-gray-100 pt-2.5"><dt className="text-gray-500">Total to pay</dt><dd className="font-semibold text-gray-900">{formatCurrency(confirmation.quantity * confirmation.unitPrice)}</dd></div>
            </dl>

            <div className="mt-6 flex gap-2">
              <Button as="a" href={mapsUrl} target="_blank" rel="noreferrer" className="flex-1" icon={Navigation}>Directions</Button>
              <Button variant="secondary" className="flex-1" onClick={() => navigate('/patient/reservations')}>My reservations</Button>
            </div>
          </CardBody>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <Link to={`/patient/medicine/${med.id}`} className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800">
        <ArrowLeft size={15} /> Back to medicine
      </Link>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          {/* Choose pharmacy */}
          <Card>
            <CardHeader title="Choose a pharmacy" description="Select where you’d like to collect your medicine." />
            <div className="divide-y divide-gray-100">
              {available.map((r) => (
                <label key={r.id} className="flex cursor-pointer items-center gap-3 px-4 py-3.5 hover:bg-gray-50">
                  <input
                    type="radio"
                    name="pharmacy"
                    checked={activePharmacyId === r.pharmacy.id}
                    onChange={() => setPharmacyId(r.pharmacy.id)}
                    className="h-4 w-4 border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-gray-100 text-gray-500">
                    <MapPin size={16} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-medium text-gray-900">{r.pharmacy.name}</p>
                    <p className="text-sm text-gray-500">{r.distance.toFixed(1)} km · {r.pharmacy.sector}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-semibold text-gray-900">{formatCurrency(r.price)}</p>
                    <StockBadge status={r.status} />
                  </div>
                </label>
              ))}
            </div>
          </Card>

          {/* Patient details */}
          <Card>
            <CardHeader title="Your details" description="We’ll notify the pharmacy to prepare your order." />
            <CardBody>
              <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
                <Input label="Full name" icon={User} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Aline Uwase" required />
                <Input label="Phone number" icon={Phone} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+250 7XX XXX XXX" required />
                <div className="sm:col-span-2">
                  <label className="form-label">Quantity</label>
                  <div className="inline-flex items-center rounded-md border border-gray-300">
                    <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-9 w-9 items-center justify-center text-gray-500 hover:bg-gray-50"><Minus size={15} /></button>
                    <span className="w-12 text-center text-base font-medium text-gray-900">{qty}</span>
                    <button type="button" onClick={() => setQty((q) => Math.min(20, q + 1))} className="flex h-9 w-9 items-center justify-center text-gray-500 hover:bg-gray-50"><Plus size={15} /></button>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit" className="w-full" loading={submitting} disabled={!selected}>Confirm reservation</Button>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader title="Order summary" />
            <CardBody>
              <div className="flex items-center gap-2">
                <p className="text-base font-semibold text-gray-900">{med.name}</p>
                {med.prescriptionRequired && <Badge tone="warning">Rx</Badge>}
              </div>
              <p className="text-sm text-gray-500">{med.form} · {med.packSize}</p>

              <dl className="mt-4 space-y-2.5 border-t border-gray-100 pt-4 text-sm">
                <div className="flex justify-between"><dt className="text-gray-500">Pharmacy</dt><dd className="font-medium text-gray-900">{selected?.pharmacy.name || '—'}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">Unit price</dt><dd className="font-medium text-gray-900">{formatCurrency(unitPrice)}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">Quantity</dt><dd className="font-medium text-gray-900">× {qty}</dd></div>
                <div className="flex justify-between border-t border-gray-100 pt-2.5 text-base"><dt className="font-medium text-gray-700">Total</dt><dd className="font-semibold text-gray-900">{formatCurrency(total)}</dd></div>
              </dl>

              <p className="mt-4 rounded-md bg-gray-50 px-3 py-2.5 text-xs text-gray-500">
                Payment is made at the pharmacy on collection. Reservations are held for 24 hours.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
