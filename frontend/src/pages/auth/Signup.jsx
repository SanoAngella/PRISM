import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { User, Mail, Phone, Lock, ArrowRight, Search, MapPin, Bell, CheckCircle2 } from 'lucide-react'
import Logo from '../../components/Logo'
import { Button, Input } from '../../components/ui'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'

const PERKS = [
  { icon: Search, text: 'Search medicines and see live stock nearby' },
  { icon: MapPin, text: 'Reserve and navigate straight to the pharmacy' },
  { icon: Bell, text: 'Get alerts when your medicines are back in stock' },
]

export default function Signup() {
  const { registerPatient } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.fullName.trim()) e.fullName = 'Your name is required'
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
      const session = await registerPatient(form)
      toast.success('Account created', `Welcome to PRISM, ${session.name}`)
      const dest = location.state?.from?.pathname || '/patient'
      navigate(dest, { replace: true })
    } catch (err) {
      toast.error('Sign up failed', err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Form side */}
      <div className="flex flex-col justify-center px-4 py-10 sm:px-8">
        <div className="mx-auto w-full max-w-sm">
          <Logo />
          <h1 className="mt-8 text-2xl font-semibold text-gray-900">Create your patient account</h1>
          <p className="mt-1.5 text-base text-gray-500">Find medicines, reserve stock and pick up nearby — free for patients.</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <Input
              label="Full name"
              name="fullName"
              icon={User}
              value={form.fullName}
              onChange={set('fullName')}
              error={errors.fullName}
              placeholder="e.g. Jean Mugisha"
              autoComplete="name"
            />
            <Input
              label="Email address"
              name="email"
              type="email"
              icon={Mail}
              value={form.email}
              onChange={set('email')}
              error={errors.email}
              placeholder="you@example.com"
              autoComplete="email"
            />
            <Input
              label="Phone number"
              name="phone"
              icon={Phone}
              value={form.phone}
              onChange={set('phone')}
              placeholder="+250 7XX XXX XXX"
              autoComplete="tel"
            />
            <Input
              label="Password"
              name="password"
              type="password"
              icon={Lock}
              value={form.password}
              onChange={set('password')}
              error={errors.password}
              hint="At least 6 characters"
              placeholder="••••••••"
              autoComplete="new-password"
            />
            <Button type="submit" className="w-full" loading={loading} iconRight={ArrowRight}>
              Create account
            </Button>
          </form>

          <p className="mt-4 flex items-start gap-2 rounded-md bg-gray-50 px-3 py-2.5 text-sm text-gray-600">
            <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-success-600" />
            No account needed to browse the landing page. Sign up to search stock and reserve.
          </p>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">Sign in</Link>
          </p>
          <p className="mt-2 text-center text-sm text-gray-500">
            Are you a pharmacy?{' '}
            <Link to="/register" className="font-medium text-brand-600 hover:text-brand-700">Register your pharmacy</Link>
          </p>
        </div>
      </div>

      {/* Brand side */}
      <div className="relative hidden overflow-hidden border-l border-brand-700 bg-brand-600 lg:block">
        <div className="flex h-full flex-col justify-center px-12 text-white">
          <h2 className="max-w-md text-2xl font-semibold leading-snug">
            Find the medicines you need, faster.
          </h2>
          <p className="mt-3 max-w-md text-brand-100">
            PRISM shows you which nearby pharmacies have your medicine in stock — in real time.
          </p>

          <ul className="mt-8 max-w-md space-y-3">
            {PERKS.map((p) => (
              <li key={p.text} className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-500/40 ring-1 ring-white/10">
                  <p.icon size={17} />
                </span>
                <span className="text-brand-50">{p.text}</span>
              </li>
            ))}
          </ul>

          <p className="mt-10 text-sm text-brand-100">Smarter Early Warning, Stronger Communities</p>
        </div>
      </div>
    </div>
  )
}
