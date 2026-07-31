import { useMemo, useState } from 'react'
import { Search, Plus, Pill } from 'lucide-react'
import { Badge, Button, Card, Input, Modal, PageHeader, PageLoader, Select, Table } from '../../components/ui'
import { useAsync } from '../../hooks/useAsync'
import { pharmacyService } from '../../services/pharmacyService'
import { CATEGORIES } from '../../data/medicines'
import { formatCurrency } from '../../utils/format'
import { useToast } from '../../contexts/ToastContext'

const emptyForm = { name: '', genericName: '', category: CATEGORIES[0], form: 'Tablet', strength: '', unitPrice: '', prescriptionRequired: false }

export default function Medicines() {
  const toast = useToast()
  const { data, loading } = useAsync(() => pharmacyService.getCatalog(), [])
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('All')
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const filtered = useMemo(() => {
    if (!data) return []
    const query = q.trim().toLowerCase()
    return data
      .filter((m) => (category === 'All' ? true : m.category === category))
      .filter((m) => !query || m.name.toLowerCase().includes(query) || m.genericName.toLowerCase().includes(query))
  }, [data, q, category])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    // Mock persistence — in production this POSTs to /api/medicines.
    setTimeout(() => {
      setSaving(false)
      setAdding(false)
      setForm(emptyForm)
      toast.success('Medicine added', `${form.name || 'New medicine'} added to your catalog`)
    }, 500)
  }

  if (loading) return <PageLoader />

  const columns = [
    {
      key: 'name',
      header: 'Medicine',
      render: (m) => (
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 text-gray-500"><Pill size={15} /></span>
          <div>
            <p className="font-medium text-gray-900">{m.name}</p>
            <p className="text-xs text-gray-500">{m.genericName}</p>
          </div>
        </div>
      ),
    },
    { key: 'category', header: 'Category', render: (m) => <Badge tone="gray">{m.category}</Badge> },
    { key: 'form', header: 'Form', render: (m) => <span className="text-gray-600">{m.form}</span> },
    { key: 'strength', header: 'Strength', render: (m) => <span className="text-gray-600">{m.strength}</span> },
    { key: 'unitPrice', header: 'List price', align: 'right', render: (m) => formatCurrency(m.unitPrice) },
    { key: 'rx', header: 'Rx', align: 'center', render: (m) => (m.prescriptionRequired ? <Badge tone="warning">Rx</Badge> : <span className="text-gray-300">—</span>) },
  ]

  return (
    <div>
      <PageHeader
        title="Medicines"
        description="Your medicine catalog and reference pricing."
        actions={<Button icon={Plus} onClick={() => setAdding(true)}>Add medicine</Button>}
      />

      <Card>
        <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-3 sm:flex-row sm:items-center">
          <div className="relative max-w-xs flex-1">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search catalog…"
              className="h-9 w-full rounded-md border border-gray-300 bg-white pl-9 pr-3 text-base focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="h-9 rounded-md border border-gray-300 bg-white px-3 text-base focus:border-brand-500 focus:ring-2 focus:ring-brand-100">
            <option value="All">All categories</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <Table columns={columns} data={filtered} empty="No medicines match your search" />
      </Card>

      <Modal
        open={adding}
        onClose={() => setAdding(false)}
        title="Add medicine"
        description="Add a new medicine to your catalog."
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setAdding(false)}>Cancel</Button>
            <Button onClick={submit} loading={saving}>Add medicine</Button>
          </>
        }
      >
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          <Input label="Brand name" value={form.name} onChange={set('name')} placeholder="e.g. Panadol 500mg" required />
          <Input label="Generic name" value={form.genericName} onChange={set('genericName')} placeholder="e.g. Paracetamol" />
          <Select label="Category" value={form.category} onChange={set('category')}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </Select>
          <Select label="Form" value={form.form} onChange={set('form')}>
            {['Tablet', 'Capsule', 'Injection', 'Inhaler', 'Powder', 'Syrup'].map((f) => <option key={f}>{f}</option>)}
          </Select>
          <Input label="Strength" value={form.strength} onChange={set('strength')} placeholder="e.g. 500mg" />
          <Input label="Unit price (RWF)" type="number" value={form.unitPrice} onChange={set('unitPrice')} placeholder="e.g. 250" />
          <label className="flex items-center gap-2 text-sm text-gray-700 sm:col-span-2">
            <input type="checkbox" checked={form.prescriptionRequired} onChange={(e) => setForm((f) => ({ ...f, prescriptionRequired: e.target.checked }))} className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
            Requires a prescription
          </label>
        </form>
      </Modal>
    </div>
  )
}
