import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, Building2, Stethoscope, User, ArrowRight } from 'lucide-react'
import Logo from '../../components/Logo'
import { Button, Input } from '../../components/ui'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'
import { ROLES, ROLE_HOME } from '../../utils/constants'
import { cn } from '../../utils/cn'

const roleOptions = [
  { value: ROLES.PHARMACY, label: 'Pharmacy', icon: Building2, email: 'pharmacy@prism.rw' },
  { value: ROLES.AUTHORITY, label: 'Health Authority', icon: Stethoscope, email: 'authority@prism.rw' },
  { value: ROLES.PATIENT, label: 'Patient', icon: User, email: 'patient@prism.rw' },
]

export default function Login() {
  const { login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const [role, setRole] = useState(ROLES.PHARMACY)
  const [email, setEmail] = useState('pharmacy@prism.rw')
  const [password, setPassword] = useState('password')
  const [loading, setLoading] = useState(false)

  const pickRole = (r) => {
    setRole(r.value)
    setEmail(r.email)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const session = await login({ email, password, role })
      toast.success('Signed in', `Welcome back, ${session.name}`)
      const dest = location.state?.from?.pathname || ROLE_HOME[session.role]
      navigate(dest, { replace: true })
    } catch (err) {
      toast.error('Sign in failed', err.message)
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
          <h1 className="mt-8 text-2xl font-semibold text-gray-900">Sign in to PRISM</h1>
          <p className="mt-1.5 text-base text-gray-500">Select your role and enter your credentials.</p>

          <div className="mt-6 grid grid-cols-3 gap-2">
            {roleOptions.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => pickRole(r)}
                className={cn(
                  'flex flex-col items-center gap-1.5 rounded-md border px-2 py-3 text-sm font-medium transition-colors',
                  role === r.value
                    ? 'border-brand-500 bg-brand-50 text-brand-700 ring-1 ring-brand-200'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50',
                )}
              >
                <r.icon size={18} />
                {r.label}
              </button>
            ))}
          </div>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <Input
              label="Email address"
              name="email"
              type="email"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
            <Input
              label="Password"
              name="password"
              type="password"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" defaultChecked />
                Remember me
              </label>
              <a href="#" className="font-medium text-brand-600 hover:text-brand-700">Forgot password?</a>
            </div>
            <Button type="submit" className="w-full" loading={loading} iconRight={ArrowRight}>
              Sign in
            </Button>
          </form>

          <p className="mt-4 rounded-md bg-gray-50 px-3 py-2.5 text-sm text-gray-500">
            Demo accounts are pre-filled per role. Password is <span className="font-medium text-gray-700">password</span>.
          </p>

          <p className="mt-6 text-center text-sm text-gray-500">
            New patient?{' '}
            <Link to="/signup" className="font-medium text-brand-600 hover:text-brand-700">Create an account</Link>
          </p>
          <p className="mt-2 text-center text-sm text-gray-500">
            New pharmacy?{' '}
            <Link to="/register" className="font-medium text-brand-600 hover:text-brand-700">Register here</Link>
          </p>
        </div>
      </div>

      {/* Brand side */}
      <div className="relative hidden overflow-hidden border-l border-brand-700 bg-brand-600 lg:block">
        <div className="flex h-full flex-col justify-center px-12 text-white">
          <blockquote className="max-w-md text-xl font-medium leading-relaxed">
            “Pharmacies see the first ripple of an outbreak — days before hospitals feel the wave.
            PRISM turns that ripple into a warning.”
          </blockquote>
          <p className="mt-4 text-brand-100">Smarter Early Warning, Stronger Communities</p>

          <div className="mt-10 grid max-w-md grid-cols-3 gap-4">
            {[['6', 'Pharmacies'], ['3', 'Active alerts'], ['620k', 'People covered']].map(([v, l]) => (
              <div key={l} className="rounded-md bg-brand-500/40 px-3 py-3 ring-1 ring-white/10">
                <p className="text-2xl font-semibold">{v}</p>
                <p className="mt-0.5 text-sm text-brand-100">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
