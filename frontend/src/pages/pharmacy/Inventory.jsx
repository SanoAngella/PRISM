import { useMemo, useState } from 'react'
import { Search, Download, Pencil, Boxes } from 'lucide-react'
import { Badge, Button, Card, Input, Modal, PageHeader, PageLoader, StockBadge, Table, Tabs } from '../../components/ui'
import { useAuth } from '../../contexts/AuthContext'
import { useAsync } from '../../hooks/useAsync'
import { pharmacyService } from '../../services/pharmacyService'
import { reservationService } from '../../services/reservationService'
import { CURRENT_PHARMACY_ID } from '../../data/pharmacies'
import { formatCurrency, formatDate, timeAgo } from '../../utils/format'
import { STOCK_STATUS } from '../../utils/constants'
import { useToast } from '../../contexts/ToastContext'

export default function Inventory() {
  const { user } = useAuth()
  const toast = useToast()
  const pid = user?.pharmacyId || CURRENT_PHARMACY_ID

  const { data, loading, reload } = useAsync(() => pharmacyService.getInventory(pid), [pid])
  const [q, setQ] = useState('')
  const [tab, setTab] = useState('all')
  const [editing, setEditing] = useState(null)
  const [qty, setQty] = useState(0)
  const [price, setPrice] = useState(0)
  const [saving, setSaving] = useState(false)

  const filtered = useMemo(() => {
    if (!data) return []
    const query = q.trim().toLowerCase()
    return data
      .filter((r) => r.medicine)
      .filter((r) => (tab === 'all' ? true : r.status === tab))
      .filter((r) => !query || r.medicine.name.toLowerCase().includes(query))
      .sort((a, b) => a.medicine.name.localeCompare(b.medicine.name))
  }, [data, q, tab])

  const counts = useMemo(() => {
    const base = data || []
    return {
      all: base.length,
      [STOCK_STATUS.LOW]: base.filter((r) => r.status === STOCK_STATUS.LOW).length,
      [STOCK_STATUS.OUT]: base.filter((r) => r.status === STOCK_STATUS.OUT).length,
    }
  }, [data])

  const openEdit = (row) => {
    setEditing(row)
    setQty(row.quantity)
    setPrice(row.price)
  }

  const save = async () => {
    setSaving(true)
    try {
      await pharmacyService.updateStock(pid, editing.id, { quantity: Number(qty), price: Number(price) })
      toast.success('Stock updated', `${editing.medicine.name} set to ${qty} units`)
      setEditing(null)
      reload()
    } catch (err) {
      toast.error('Update failed', err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <PageLoader />

  const columns = [
    {
      key: 'name',
      header: 'Medicine',
      render: (r) => (
        <div>
          <p className="font-medium text-gray-900">{r.medicine.name}</p>
          <p className="text-xs text-gray-500">{r.medicine.category} · {r.batchNo}</p>
        </div>
      ),
    },
    { key: 'quantity', header: 'In stock', align: 'right', render: (r) => <span className="font-medium text-gray-900">{r.quantity}</span> },
    { key: 'reorderLevel', header: 'Reorder at', align: 'right', render: (r) => <span className="text-gray-500">{r.reorderLevel}</span> },
    { key: 'price', header: 'Unit price', align: 'right', render: (r) => formatCurrency(r.price) },
    { key: 'expiry', header: 'Expiry', render: (r) => <span className="text-gray-500">{formatDate(r.expiryDate)}</span> },
    { key: 'status', header: 'Status', align: 'center', render: (r) => <StockBadge status={r.status} /> },
    { key: 'updated', header: 'Updated', render: (r) => <span className="text-xs text-gray-400">{timeAgo(r.updatedAt)}</span> },
    {
      key: 'action',
      header: '',
      align: 'right',
      render: (r) => <Button size="sm" variant="ghost" icon={Pencil} onClick={() => openEdit(r)}>Edit</Button>,
    },
  ]

  return (
    <div>
      <PageHeader
        title="Inventory"
        description="Manage stock levels, prices and expiry across your medicines."
        actions={
          <>
            <Button variant="secondary" icon={Download}>Export</Button>
            <Button icon={Boxes} onClick={() => filtered[0] && openEdit(filtered[0])}>Update stock</Button>
          </>
        }
      />

      <Card>
        <div className="border-b border-gray-200 px-4 pt-3">
          <Tabs
            value={tab}
            onChange={setTab}
            tabs={[
              { value: 'all', label: 'All items', count: counts.all },
              { value: STOCK_STATUS.LOW, label: 'Low stock', count: counts[STOCK_STATUS.LOW] },
              { value: STOCK_STATUS.OUT, label: 'Out of stock', count: counts[STOCK_STATUS.OUT] },
            ]}
          />
        </div>
        <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-3">
          <div className="relative max-w-xs flex-1">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search medicines…"
              className="h-9 w-full rounded-md border border-gray-300 bg-white pl-9 pr-3 text-base focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <span className="text-sm text-gray-500">{filtered.length} items</span>
        </div>
        <Table columns={columns} data={filtered} empty="No inventory items match your filters" />
      </Card>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Update stock"
        description={editing?.medicine.name}
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={save} loading={saving}>Save changes</Button>
          </>
        }
      >
        {editing && (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2.5 text-sm">
              <span className="text-gray-500">Current status</span>
              <StockBadge status={editing.status} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Quantity in stock" type="number" min="0" value={qty} onChange={(e) => setQty(e.target.value)} />
              <Input label="Unit price (RWF)" type="number" min="0" step="50" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <p className="text-sm text-gray-500">
              Reorder level is <span className="font-medium text-gray-700">{editing.reorderLevel}</span> units.
              Items at or below this level are flagged as low stock.
            </p>
          </div>
        )}
      </Modal>
    </div>
  )
}
