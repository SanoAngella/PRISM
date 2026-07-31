import { useMemo, useState } from 'react'
import { Check, PackageCheck, X, CalendarClock } from 'lucide-react'
import { Button, Card, EmptyState, PageHeader, PageLoader, ReservationBadge, Table, Tabs } from '../../components/ui'
import { useAuth } from '../../contexts/AuthContext'
import { useAsync } from '../../hooks/useAsync'
import { reservationService } from '../../services/reservationService'
import { CURRENT_PHARMACY_ID } from '../../data/pharmacies'
import { RESERVATION_STATUS } from '../../utils/constants'
import { formatCurrency, formatDateTime } from '../../utils/format'
import { useToast } from '../../contexts/ToastContext'

export default function PharmacyReservations() {
  const { user } = useAuth()
  const toast = useToast()
  const pid = user?.pharmacyId || CURRENT_PHARMACY_ID
  const { data, loading, reload } = useAsync(() => reservationService.list({ pharmacyId: pid }), [pid])
  const [tab, setTab] = useState('open')

  const update = async (id, status, label) => {
    await reservationService.updateStatus(id, status)
    toast.success('Reservation updated', label)
    reload()
  }

  const filtered = useMemo(() => {
    if (!data) return []
    if (tab === 'open') return data.filter((r) => [RESERVATION_STATUS.PENDING, RESERVATION_STATUS.READY].includes(r.status))
    if (tab === 'completed') return data.filter((r) => r.status === RESERVATION_STATUS.COLLECTED)
    return data
  }, [data, tab])

  const counts = useMemo(() => {
    const base = data || []
    return {
      open: base.filter((r) => [RESERVATION_STATUS.PENDING, RESERVATION_STATUS.READY].includes(r.status)).length,
      completed: base.filter((r) => r.status === RESERVATION_STATUS.COLLECTED).length,
      all: base.length,
    }
  }, [data])

  if (loading) return <PageLoader />

  const columns = [
    { key: 'code', header: 'Code', render: (r) => <span className="font-mono text-sm font-medium text-gray-900">{r.code}</span> },
    {
      key: 'medicine',
      header: 'Medicine',
      render: (r) => (
        <div>
          <p className="font-medium text-gray-900">{r.medicineName}</p>
          <p className="text-xs text-gray-500">× {r.quantity} · {formatCurrency(r.quantity * r.unitPrice)}</p>
        </div>
      ),
    },
    {
      key: 'patient',
      header: 'Patient',
      render: (r) => (
        <div>
          <p className="text-gray-900">{r.patientName}</p>
          <p className="text-xs text-gray-500">{r.patientPhone}</p>
        </div>
      ),
    },
    { key: 'created', header: 'Reserved', render: (r) => <span className="text-gray-500">{formatDateTime(r.createdAt)}</span> },
    { key: 'status', header: 'Status', align: 'center', render: (r) => <ReservationBadge status={r.status} /> },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (r) => (
        <div className="flex items-center justify-end gap-1.5">
          {r.status === RESERVATION_STATUS.PENDING && (
            <Button size="sm" variant="secondary" icon={PackageCheck} onClick={() => update(r.id, RESERVATION_STATUS.READY, `${r.code} marked ready`)}>
              Mark ready
            </Button>
          )}
          {r.status === RESERVATION_STATUS.READY && (
            <Button size="sm" variant="success" icon={Check} onClick={() => update(r.id, RESERVATION_STATUS.COLLECTED, `${r.code} collected`)}>
              Collected
            </Button>
          )}
          {[RESERVATION_STATUS.PENDING, RESERVATION_STATUS.READY].includes(r.status) && (
            <Button size="sm" variant="ghost" icon={X} onClick={() => update(r.id, RESERVATION_STATUS.CANCELLED, `${r.code} cancelled`)} className="text-danger-600 hover:bg-danger-50" />
          )}
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader title="Reservations" description="Fulfil medicines patients have reserved for pickup." />

      <Card>
        <div className="border-b border-gray-200 px-4 pt-3">
          <Tabs
            value={tab}
            onChange={setTab}
            tabs={[
              { value: 'open', label: 'Open', count: counts.open },
              { value: 'completed', label: 'Collected', count: counts.completed },
              { value: 'all', label: 'All', count: counts.all },
            ]}
          />
        </div>
        {filtered.length === 0 ? (
          <EmptyState icon={CalendarClock} title="No reservations here" description="Reservations from patients will appear in this list." />
        ) : (
          <Table columns={columns} data={filtered} />
        )}
      </Card>
    </div>
  )
}
