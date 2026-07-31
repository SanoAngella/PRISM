import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Building2, Mail, Lock, Phone, MapPin, FileText, ArrowRight, CheckCircle2 } from 'lucide-react'
import Logo from '../../components/Logo'
import { Button, Input, Select } from '../../components/ui'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'

const DISTRICTS = ['Nyarugenge', 'Gasabo', 'Kicukiro']

export default function RegisterPharmacy() {
  const { register } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    pharmacyName: '',
    licenseNo: '',
    email: '',
    phone: '',
    district: 'Gasabo',
    address: '',
    password: '',
  })
  const [errors, setErrors] = useState({})

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.pharmacyName.trim()) e.pharmacyName = 'Pharmacy name is required'
    if (!form.licenseNo.trim()) e.licenseNo = 'License number is required'
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (form.password.length < 6) e.password = 'Minimum 6 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const session = await register(form)
      toast.success('Pharmacy registered', `Welcome to PRISM, ${session.name}`)
      navigate('/pharmacy', { replace: true })
    } catch (err) {
      toast.error('Registration failed', err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-2xl px-4">
        <Logo />
        <div className="mt-6 rounded-lg border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-6 py-5">
            <h1 className="text-2xl font-semibold text-gray-900">Register your pharmacy</h1>
            <p className="mt-1 text-base text-gray-500">
              Join the PRISM network to manage inventory and help detect outbreaks early.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4 px-6 py-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Pharmacy name" name="pharmacyName" icon={Building2} value={form.pharmacyName} onChange={set('pharmacyName')} error={errors.pharmacyName} placeholder="e.g. Kigali Care Pharmacy" />
              <Input label="License number" name="licenseNo" icon={FileText} value={form.licenseNo} onChange={set('licenseNo')} error={errors.licenseNo} placeholder="RW-PHM-2026-XXXX" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Work email" name="email" type="email" icon={Mail} value={form.email} onChange={set('email')} error={errors.email} placeholder="pharmacy@example.com" />
              <Input label="Phone number" name="phone" icon={Phone} value={form.phone} onChange={set('phone')} placeholder="+250 7XX XXX XXX" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Select label="District" name="district" value={form.district} onChange={set('district')}>
                {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
              </Select>
              <Input label="Street address" name="address" icon={MapPin} value={form.address} onChange={set('address')} placeholder="KN 2 Ave, Kigali" />
            </div>
            <Input label="Password" name="password" type="password" icon={Lock} value={form.password} onChange={set('password')} error={errors.password} hint="At least 6 characters" placeholder="••••••••" />

            <div className="flex items-start gap-2 rounded-md bg-gray-50 px-3 py-2.5 text-sm text-gray-600">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-success-600" />
              Only aggregated, anonymised demand data is shared with health authorities. Patient and sale details stay private.
            </div>

            <div className="flex items-center justify-between pt-1">
              <Link to="/login" className="text-sm font-medium text-brand-600 hover:text-brand-700">
                Already registered? Sign in
              </Link>
              <Button type="submit" loading={loading} iconRight={ArrowRight}>Create account</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
