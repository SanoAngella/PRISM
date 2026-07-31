import { useState } from 'react'
import { Mail, Phone, MapPin, Building2, Shield, Save } from 'lucide-react'
import { Avatar, Badge, Button, Card, CardBody, CardHeader, Input, PageHeader } from '../../components/ui'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'
import { ROLES } from '../../utils/constants'
import { pharmacyById, CURRENT_PHARMACY_ID } from '../../data/pharmacies'

const ROLE_LABEL = {
  [ROLES.PHARMACY]: 'Pharmacy',
  [ROLES.AUTHORITY]: 'Health Authority',
  [ROLES.PATIENT]: 'Patient',
}

export default function Profile() {
  const { user } = useAuth()
  const toast = useToast()
  const ph = pharmacyById(user?.pharmacyId || CURRENT_PHARMACY_ID)
  const isPharmacy = user?.role === ROLES.PHARMACY

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: isPharmacy ? ph?.phone : '+250 788 000 000',
    organization: user?.organization || (isPharmacy ? ph?.name : 'Rwanda Biomedical Centre'),
    address: isPharmacy ? ph?.address : 'KG 9 Ave, Kigali',
  })
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const save = (e) => {
    e.preventDefault()
    toast.success('Profile saved', 'Your changes have been updated.')
  }

  return (
    <div>
      <PageHeader title="Profile" description="Manage your account and organisation details." />

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardBody className="text-center">
            <Avatar name={form.name} size="lg" className="mx-auto h-16 w-16 text-lg" />
            <h3 className="mt-3 text-lg font-semibold text-gray-900">{form.name}</h3>
            <p className="text-sm text-gray-500">{form.email}</p>
            <div className="mt-3 flex justify-center">
              <Badge tone="brand" dot>{ROLE_LABEL[user?.role]}</Badge>
            </div>
            <dl className="mt-5 space-y-3 border-t border-gray-100 pt-4 text-left text-sm">
              <div className="flex items-center gap-2 text-gray-600"><Building2 size={15} className="text-gray-400" /> {form.organization}</div>
              <div className="flex items-center gap-2 text-gray-600"><MapPin size={15} className="text-gray-400" /> {form.address}</div>
              <div className="flex items-center gap-2 text-gray-600"><Phone size={15} className="text-gray-400" /> {form.phone}</div>
              {isPharmacy && ph?.licenseNo && (
                <div className="flex items-center gap-2 text-gray-600"><Shield size={15} className="text-gray-400" /> {ph.licenseNo}</div>
              )}
            </dl>
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader title="Account details" description="Update your contact information." />
          <CardBody>
            <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
              <Input label={isPharmacy ? 'Pharmacy name' : 'Full name'} value={form.name} onChange={set('name')} icon={isPharmacy ? Building2 : undefined} />
              <Input label="Email" type="email" value={form.email} onChange={set('email')} icon={Mail} />
              <Input label="Phone" value={form.phone} onChange={set('phone')} icon={Phone} />
              <Input label="Organisation" value={form.organization} onChange={set('organization')} icon={Building2} />
              <Input label="Address" value={form.address} onChange={set('address')} icon={MapPin} className="sm:col-span-2" />
              <div className="sm:col-span-2">
                <Button type="submit" icon={Save}>Save changes</Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
