import { useState } from 'react'
import {
  UserCog,
  Globe,
  Monitor,
  ShieldCheck,
  MapPin,
  Clock,
  TrendingUp,
  Sun,
  Moon,
  Lock,
  Download,
  Trash2,
  ChevronRight,
  Calendar,
  Sliders,
} from 'lucide-react'
import { Button, Card } from '../../components/ui'
import { patient } from '../../data/portal'

const TABS = ['Account', 'Preferences', 'Notifications', 'Privacy', 'Data & Security', 'Connected Devices']

function Field({ label, value, type = 'input', children }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-600">{label}</label>
      {type === 'select' ? (
        <select defaultValue={value} className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-pine-500 focus:ring-2 focus:ring-pine-100">
          {children}
        </select>
      ) : (
        <input defaultValue={value} className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-pine-500 focus:ring-2 focus:ring-pine-100" />
      )}
    </div>
  )
}

function Toggle({ defaultOn = true }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <button type="button" onClick={() => setOn((v) => !v)} className={`relative h-5 w-9 rounded-full transition-colors ${on ? 'bg-success-500' : 'bg-gray-300'}`}>
      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${on ? 'left-[18px]' : 'left-0.5'}`} />
    </button>
  )
}

const PREFS = [
  { icon: MapPin, label: 'Use current location by default', desc: 'Show pharmacies and results near my current location.' },
  { icon: Clock, label: 'Keep search history', desc: 'Save my recent searches to make it faster next time.' },
  { icon: TrendingUp, label: 'Show price comparison', desc: 'Display medicine prices when searching.' },
]

export default function PatientSettings() {
  const [tab, setTab] = useState('Account')
  const [theme, setTheme] = useState('light')

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      <p className="mt-1 text-base text-gray-500">Manage your account, preferences, and app settings.</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              tab === t ? 'bg-pine-700 text-white' : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {/* Left */}
        <div className="space-y-5">
          <Card className="p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-pine-50 text-pine-700"><UserCog size={18} /></span>
              <div>
                <h2 className="text-md font-semibold text-gray-900">Account Settings</h2>
                <p className="text-sm text-gray-500">Update your personal information and account details.</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <Field label="Full Name" value={patient.name} />
              <Field label="Phone Number" value={patient.phone} />
              <Field label="Email Address" value={patient.email} />
              <Field label="Date of Birth" value={patient.dob} />
              <Field label="District" value={patient.district} type="select">
                <option>Kicukiro</option><option>Gasabo</option><option>Nyarugenge</option>
              </Field>
              <Field label="Sector" value={patient.sector} type="select">
                <option>Kagarama</option><option>Kicukiro</option><option>Gikondo</option>
              </Field>
              <Field label="Cell" value={patient.cell} />
              <Field label="Village" value={patient.village} />
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
              <span className="flex items-center gap-2 text-sm text-gray-500">Account Type
                <span className="rounded bg-success-50 px-2 py-0.5 text-xs font-medium text-success-700">Patient</span>
              </span>
              <span className="text-sm text-gray-500">Member Since <span className="font-medium text-gray-800">{patient.memberSince}</span></span>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="pine">Save Changes</Button>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-pine-50 text-pine-700"><Sliders size={18} /></span>
              <div>
                <h2 className="text-md font-semibold text-gray-900">App Preferences</h2>
                <p className="text-sm text-gray-500">Manage your general app preferences.</p>
              </div>
            </div>
            <div className="mt-3 divide-y divide-gray-100">
              {PREFS.map((p) => (
                <div key={p.label} className="flex items-center gap-3 py-3.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-gray-100 text-gray-500"><p.icon size={17} /></span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{p.label}</p>
                    <p className="text-xs text-gray-500">{p.desc}</p>
                  </div>
                  <Toggle />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right */}
        <div className="space-y-5">
          <Card className="p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-pine-50 text-pine-700"><Globe size={18} /></span>
              <div>
                <h2 className="text-md font-semibold text-gray-900">Language &amp; Region</h2>
                <p className="text-sm text-gray-500">Customize your language and regional preferences.</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <Field label="Language" value="English" type="select"><option>English</option><option>Français</option><option>Kinyarwanda</option></Field>
              <Field label="Timezone" value="(GMT+02:00) Kigali" type="select"><option>(GMT+02:00) Kigali</option><option>(GMT+03:00) Nairobi</option></Field>
              <Field label="Date Format" value="May 26, 2025" type="select"><option>May 26, 2025</option><option>26/05/2025</option><option>2025-05-26</option></Field>
              <Field label="Currency" value="RWF - Rwandan Franc" type="select"><option>RWF - Rwandan Franc</option><option>USD - US Dollar</option></Field>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-pine-50 text-pine-700"><Monitor size={18} /></span>
              <div>
                <h2 className="text-md font-semibold text-gray-900">Appearance</h2>
                <p className="text-sm text-gray-500">Choose how the app looks for you.</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                ['light', Sun, 'Light Mode', 'Use light theme'],
                ['dark', Moon, 'Dark Mode', 'Use dark theme'],
              ].map(([key, Icon, title, desc]) => (
                <button
                  key={key}
                  onClick={() => setTheme(key)}
                  className={`flex items-center gap-3 rounded-lg border p-3.5 text-left transition-colors ${
                    theme === key ? 'border-pine-500 ring-1 ring-pine-200' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <span className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${theme === key ? 'border-pine-600' : 'border-gray-300'}`}>
                    {theme === key && <span className="h-2 w-2 rounded-full bg-pine-600" />}
                  </span>
                  <Icon size={18} className="text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{title}</p>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-pine-50 text-pine-700"><ShieldCheck size={18} /></span>
              <div>
                <h2 className="text-md font-semibold text-gray-900">Data &amp; Security</h2>
                <p className="text-sm text-gray-500">Control your data and keep your account secure.</p>
              </div>
            </div>
            <div className="mt-3 divide-y divide-gray-100">
              {[
                [Lock, 'Change Password', 'Update your account password', false],
                [Download, 'Download My Data', 'Download a copy of your personal data', false],
                [Trash2, 'Delete My Account', 'Permanently delete your account and all data', true],
              ].map(([Icon, title, desc, danger]) => (
                <button key={title} className="flex w-full items-center gap-3 py-3.5 text-left">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-md ${danger ? 'bg-danger-50 text-danger-600' : 'bg-gray-100 text-gray-500'}`}><Icon size={17} /></span>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${danger ? 'text-danger-600' : 'text-gray-900'}`}>{title}</p>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-300" />
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
