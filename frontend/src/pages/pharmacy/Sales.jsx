import { useMemo, useState } from 'react'
import { Plus, Receipt, TrendingUp, ShoppingCart } from 'lucide-react'
import { Badge, Button, Card, CardHeader, Input, Modal, PageHeader, PageLoader, Select, StatCard, Table } from '../../components/ui'
import { SalesAreaChart } from '../../components/charts/Charts'
import { useAuth } from '../../contexts/AuthContext'
import { useAsync } from '../../hooks/useAsync'
import { pharmacyService } from '../../services/pharmacyService'
import { CURRENT_PHARMACY_ID } from '../../data/pharmacies'
import { medicines } from '../../data/medicines'
import { formatCurrency, formatDateTime } from '../../utils/format'
import { useToast } from '../../contexts/ToastContext'

export default function Sales() {
  const { user } = useAuth()
  const toast = useToast()
  const pid = user?.pharmacyId || CURRENT_PHARMACY_ID

  const { data, loading, setData } = useAsync(() => pharmacyService.getSales(pid), [pid])
  const { data: trend } = useAsync(() => pharmacyService.getSalesTrend(), [])
  const [recording, setRecording] = useState(false)
  const [medId, setMedId] = useState(medicines[0].id)
  const [qty, setQty] = useState(1)
  const [saving, setSaving] = useState(false)

  const stats = useMemo(() => {
    const rows = data || []
    const revenue = rows.reduce((s, r) => s + r.total, 0)
    const units = rows.reduce((s, r) => s + r.quantity, 0)
    return { revenue, units, count: rows.length }
  }, [data])

  const record = (e) => {
    e.preventDefault()
    setSaving(true)
    const med = medicines.find((m) => m.id === medId)
    setTimeout(() => {
      const sale = {
        id: `SL-${Date.now().toString().slice(-4)}`,
        pharmacyId: pid,
        medicineId: med.id,
        medicineName: med.name,
        quantity: Number(qty),
        unitPrice: med.unitPrice,
        total: med.unitPrice * Number(qty),
        soldAt: new Date().toISOString(),
        channel: 'Walk-in',
      }
      setData((prev) => [sale, ...(prev || [])])
      setSaving(false)
      setRecording(false)
      setQty(1)
      toast.success('Sale recorded', `${sale.quantity} × ${med.name} — ${formatCurrency(sale.total)}`)
    }, 450)
  }

  if (loading || !trend) return <PageLoader />

  const columns = [
    { key: 'id', header: 'Receipt', render: (r) => <span className="font-mono text-sm text-gray-500">{r.id}</span> },
    { key: 'medicineName', header: 'Medicine', render: (r) => <span className="font-medium text-gray-900">{r.medicineName}</span> },
    { key: 'quantity', header: 'Qty', align: 'right' },
    { key: 'unitPrice', header: 'Unit price', align: 'right', render: (r) => formatCurrency(r.unitPrice) },
    { key: 'total', header: 'Total', align: 'right', render: (r) => <span className="font-medium text-gray-900">{formatCurrency(r.total)}</span> },
    { key: 'channel', header: 'Channel', align: 'center', render: (r) => <Badge tone={r.channel === 'Reservation' ? 'brand' : 'gray'}>{r.channel}</Badge> },
    { key: 'soldAt', header: 'Time', render: (r) => <span className="text-gray-500">{formatDateTime(r.soldAt)}</span> },
  ]

  const selectedMed = medicines.find((m) => m.id === medId)

  return (
    <div>
      <PageHeader
        title="Sales"
        description="Record and review medicine sales."
        actions={<Button icon={Plus} onClick={() => setRecording(true)}>Record sale</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Revenue (recent)" value={formatCurrency(stats.revenue)} icon={TrendingUp} tone="success" />
        <StatCard label="Units sold" value={stats.units} icon={ShoppingCart} tone="brand" />
        <StatCard label="Transactions" value={stats.count} icon={Receipt} tone="brand" />
      </div>

      <Card className="mt-5">
        <CardHeader title="Revenue trend" description="Last 7 days" />
        <div className="px-2 py-3"><SalesAreaChart data={trend} height={200} /></div>
      </Card>

      <Card className="mt-5">
        <CardHeader title="Recent sales" description={`${stats.count} transactions`} />
        <Table columns={columns} data={data} empty="No sales recorded yet" />
      </Card>

      <Modal
        open={recording}
        onClose={() => setRecording(false)}
        title="Record a sale"
        description="Log a walk-in medicine sale."
        footer={
          <>
            <Button variant="secondary" onClick={() => setRecording(false)}>Cancel</Button>
            <Button onClick={record} loading={saving}>Record sale</Button>
          </>
        }
      >
        <form onSubmit={record} className="space-y-4">
          <Select label="Medicine" value={medId} onChange={(e) => setMedId(e.target.value)}>
            {medicines.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </Select>
          <Input label="Quantity" type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} />
          <div className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2.5 text-sm">
            <span className="text-gray-500">Total</span>
            <span className="text-base font-semibold text-gray-900">{formatCurrency((selectedMed?.unitPrice || 0) * Number(qty || 0))}</span>
          </div>
        </form>
      </Modal>
    </div>
  )
}
