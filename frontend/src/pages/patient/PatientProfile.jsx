import { useState } from 'react'
import {
  Pencil,
  Camera,
  ShieldCheck,
  Lock,
  ShieldAlert,
  Monitor,
  MapPin,
  Users,
  HeartPulse,
  Pill,
  Trash2,
  ChevronRight,
  Bell,
  ShoppingBag,
  AlertTriangle,
  Settings2,
} from 'lucide-react'
import { Button, Card } from '../../components/ui'
import { patient } from '../../data/portal'

function Toggle({ on, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative h-5 w-9 rounded-full transition-colors ${on ? 'bg-success-500' : 'bg-gray-300'}`}
    >
      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${on ? 'left-[18px]' : 'left-0.5'}`} />
    </button>
  )
}

const FIELDS = [
  ['Full Name', patient.name],
  ['Phone Number', patient.phone],
  ['Email Address', patient.email],
  ['Date of Birth', patient.dob],
  ['District', patient.district],
  ['Sector', patient.sector],
  ['Cell', patient.cell],
  ['Village', patient.village],
]

const COMM = [
  { icon: Bell, label: 'Reservations', desc: 'Updates about your reservations and pickups' },
  { icon: ShoppingBag, label: 'Orders & Stock', desc: 'Updates about your orders and medicine stock' },
  { icon: AlertTriangle, label: 'Health Alerts', desc: 'Important health alerts and outbreak information' },
  { icon: HeartPulse, label: 'Health Tips & Reminders', desc: 'Tips for healthy living and medication reminders' },
]

const SAVED = [
  { icon: MapPin, label: 'Saved Addresses', desc: '1 saved address' },
  { icon: Users, label: 'Family Members', desc: '2 members' },
  { icon: HeartPulse, label: 'Allergies & Medical Conditions', desc: 'No conditions added' },
  { icon: Pill, label: 'Preferred Medicines', desc: '3 medicines' },
]

export default function PatientProfile() {
  const [comm, setComm] = useState(COMM.map(() => ({ sms: true, email: true })))
  const setChan = (i, key) => setComm((c) => c.map((row, idx) => (idx === i ? { ...row, [key]: !row[key] } : row)))

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="mt-1 text-base text-gray-500">Manage your personal information and preferences.</p>
        </div>
        <Button variant="secondary" icon={Pencil}>Edit Profile</Button>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {/* Left column */}
        <div className="space-y-5">
          <Card className="p-5">
            <h2 className="text-md font-semibold text-gray-900">Profile Information</h2>
            <div className="mt-4 flex gap-5">
              <div className="flex flex-col items-center gap-2">
                <span className="flex h-24 w-24 items-center justify-center rounded-full bg-pine-700 text-2xl font-bold text-white">JM</span>
                <button className="flex items-center gap-1.5 rounded-md border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50">
                  <Camera size={13} /> Change Photo
                </button>
              </div>
              <div className="grid flex-1 grid-cols-2 gap-x-4 gap-y-3">
                {FIELDS.map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs text-gray-500">{label}</p>
                    <p className="text-sm font-semibold text-gray-900">{value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-sm">
              <span className="flex items-center gap-2 text-gray-500">Account Type
                <span className="rounded bg-success-50 px-2 py-0.5 text-xs font-medium text-success-700">Patient</span>
              </span>
              <span className="text-gray-500">Member Since <span className="font-medium text-gray-800">{patient.memberSince}</span></span>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-md font-semibold text-gray-900">Communication Preferences</h2>
            <p className="mt-0.5 text-sm text-gray-500">Choose how and when you want to be notified.</p>
            <div className="mt-4">
              <div className="flex items-center justify-end gap-8 pr-1 text-xs font-medium text-gray-500">
                <span className="w-8 text-center">SMS</span>
                <span className="w-8 text-center">Email</span>
              </div>
              <div className="mt-1 divide-y divide-gray-100">
                {COMM.map((row, i) => (
                  <div key={row.label} className="flex items-center gap-3 py-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-md bg-gray-100 text-gray-500"><row.icon size={17} /></span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">{row.label}</p>
                      <p className="text-xs text-gray-500">{row.desc}</p>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="w-8 flex justify-center"><Toggle on={comm[i].sms} onClick={() => setChan(i, 'sms')} /></div>
                      <div className="w-8 flex justify-center"><Toggle on={comm[i].email} onClick={() => setChan(i, 'email')} /></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Button variant="secondary" icon={Settings2} className="mt-4">Manage Notification Settings</Button>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          <Card className="p-5">
            <h2 className="flex items-center gap-2 text-md font-semibold text-gray-900"><ShieldCheck size={17} className="text-pine-700" /> Account Security</h2>
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-3.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-gray-100 text-gray-500"><Lock size={17} /></span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">Password</p>
                  <p className="text-xs text-gray-500">Last changed on {patient.passwordChanged}</p>
                </div>
                <Button size="sm" variant="secondary">Change Password</Button>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-3.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-gray-100 text-gray-500"><ShieldAlert size={17} /></span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">Two-Factor Authentication</p>
                  <p className="text-xs text-gray-500">Add an extra layer of security to your account.</p>
                </div>
                <Button size="sm" variant="secondary">Enable 2FA</Button>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-3.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-gray-100 text-gray-500"><Monitor size={17} /></span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">Login Activity</p>
                  <p className="text-xs text-gray-500">See your recent logins and active sessions.</p>
                </div>
                <Button size="sm" variant="secondary">View Activity</Button>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-md font-semibold text-gray-900">Saved Information</h2>
            <div className="mt-3 divide-y divide-gray-100">
              {SAVED.map((s) => (
                <button key={s.label} className="flex w-full items-center gap-3 py-3 text-left">
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-gray-100 text-gray-500"><s.icon size={17} /></span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{s.label}</p>
                    <p className="text-xs text-gray-500">{s.desc}</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-300" />
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-md font-semibold text-gray-900">Account Actions</h2>
            <div className="mt-3 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-danger-50 text-danger-600"><Trash2 size={17} /></span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-danger-600">Delete Account</p>
                <p className="text-xs text-gray-500">Permanently delete your account and all data.</p>
              </div>
              <Button size="sm" variant="danger">Delete Account</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
