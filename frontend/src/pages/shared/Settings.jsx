import { useState } from 'react'
import { Bell, Lock, Globe, Trash2, Save } from 'lucide-react'
import { Button, Card, CardBody, CardHeader, Input, PageHeader, Select } from '../../components/ui'
import { useToast } from '../../contexts/ToastContext'

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-5 w-9 rounded-full transition-colors ${checked ? 'bg-brand-600' : 'bg-gray-300'}`}
      role="switch"
      aria-checked={checked}
    >
      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${checked ? 'left-[18px]' : 'left-0.5'}`} />
    </button>
  )
}

function Row({ title, description, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div>
        <p className="text-base font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      {children}
    </div>
  )
}

export default function Settings() {
  const toast = useToast()
  const [prefs, setPrefs] = useState({
    lowStock: true,
    outbreak: true,
    weekly: false,
    reservations: true,
  })
  const set = (k) => (v) => setPrefs((p) => ({ ...p, [k]: v }))

  return (
    <div>
      <PageHeader title="Settings" description="Manage notifications, security and preferences." />

      <div className="space-y-5">
        <Card>
          <CardHeader title={<span className="flex items-center gap-2"><Bell size={16} className="text-gray-400" /> Notifications</span>} />
          <CardBody className="divide-y divide-gray-100 py-0">
            <Row title="Low-stock alerts" description="Notify when items fall to reorder level."><Toggle checked={prefs.lowStock} onChange={set('lowStock')} /></Row>
            <Row title="Outbreak alerts" description="Receive AI early-warning signals."><Toggle checked={prefs.outbreak} onChange={set('outbreak')} /></Row>
            <Row title="New reservations" description="Alert on new patient reservations."><Toggle checked={prefs.reservations} onChange={set('reservations')} /></Row>
            <Row title="Weekly summary" description="Email digest every Monday."><Toggle checked={prefs.weekly} onChange={set('weekly')} /></Row>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title={<span className="flex items-center gap-2"><Globe size={16} className="text-gray-400" /> Preferences</span>} />
          <CardBody>
            <div className="grid gap-4 sm:grid-cols-2">
              <Select label="Language" defaultValue="en"><option value="en">English</option><option value="fr">Français</option><option value="rw">Kinyarwanda</option></Select>
              <Select label="Timezone" defaultValue="kigali"><option value="kigali">Africa/Kigali (CAT)</option><option value="nairobi">Africa/Nairobi (EAT)</option></Select>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title={<span className="flex items-center gap-2"><Lock size={16} className="text-gray-400" /> Security</span>} />
          <CardBody>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Current password" type="password" placeholder="••••••••" />
              <div />
              <Input label="New password" type="password" placeholder="••••••••" />
              <Input label="Confirm new password" type="password" placeholder="••••••••" />
            </div>
            <Button className="mt-4" variant="secondary" icon={Save} onClick={() => toast.success('Password updated', 'Your password has been changed.')}>Update password</Button>
          </CardBody>
        </Card>

        <Card className="border-danger-200">
          <CardHeader title={<span className="flex items-center gap-2 text-danger-700"><Trash2 size={16} /> Danger zone</span>} />
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-medium text-gray-900">Delete account</p>
                <p className="text-sm text-gray-500">Permanently remove this account and its data.</p>
              </div>
              <Button variant="danger" onClick={() => toast.warning('Action restricted', 'Account deletion requires admin approval.')}>Delete account</Button>
            </div>
          </CardBody>
        </Card>

        <div className="flex justify-end">
          <Button icon={Save} onClick={() => toast.success('Settings saved', 'Your preferences have been updated.')}>Save all changes</Button>
        </div>
      </div>
    </div>
  )
}
