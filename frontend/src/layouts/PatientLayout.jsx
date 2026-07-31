import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  Home,
  Search,
  CalendarCheck,
  ShoppingBag,
  HeartPulse,
  Bell,
  UserRound,
  Settings,
  HelpCircle,
  MapPin,
  ChevronDown,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react'
import { cn } from '../utils/cn'
import { patient, portalMeta } from '../data/portal'

const nav = [
  { to: '/patient', label: 'Dashboard', icon: Home, end: true },
  { to: '/patient/search', label: 'Search Medicines', icon: Search },
  { to: '/patient/reservations', label: 'My Reservations', icon: CalendarCheck },
  { to: '/patient/orders', label: 'Orders & History', icon: ShoppingBag },
  { to: '/patient/health-tips', label: 'Health Tips', icon: HeartPulse },
  { to: '/patient/notifications', label: 'Notifications', icon: Bell, badge: 3 },
  { to: '/patient/profile', label: 'Profile', icon: UserRound },
  { to: '/patient/settings', label: 'Settings', icon: Settings },
  { to: '/patient/help', label: 'Help & Support', icon: HelpCircle },
]

function BrandMark() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-pine-700 text-white">
        <svg width="20" height="20" viewBox="0 0 32 32" fill="none" aria-hidden>
          <path d="M16 4l10 5.8v11.6L16 28 6 21.4V9.8L16 4z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          <circle cx="16" cy="13" r="2.1" fill="currentColor" />
          <circle cx="12" cy="19" r="2.1" fill="currentColor" />
          <circle cx="20" cy="19" r="2.1" fill="currentColor" />
          <path d="M16 13l-4 6M16 13l4 6M12 19h8" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
        </svg>
      </span>
      <div className="leading-tight">
        <p className="text-lg font-bold tracking-tight text-pine-800">PRISM</p>
        <p className="text-[10px] font-medium text-gray-400">Seeing outbreaks before hospitals do.</p>
      </div>
    </div>
  )
}

function PromoCard() {
  return (
    <div className="relative mx-3 mb-4 mt-auto overflow-hidden rounded-lg bg-pine-800 p-4 text-white">
      <p className="text-base font-bold">PRISM</p>
      <p className="mt-1.5 text-xs leading-relaxed text-pine-100">
        Early signals.
        <br />
        Faster action.
        <br />
        Healthier communities.
      </p>
      <svg viewBox="0 0 240 70" className="mt-3 w-full text-pine-100/70" fill="none" aria-hidden>
        <g stroke="currentColor" strokeWidth="1" strokeLinejoin="round">
          {/* Eiffel tower */}
          <path d="M120 8l6 54h-12l6-54zM115 30h10M112 46h16M110 62h20" />
          {/* dome building */}
          <path d="M150 62V44a12 12 0 0124 0v18M150 44h24M162 32v6" />
          <circle cx="162" cy="30" r="2" />
          {/* skyscrapers */}
          <path d="M182 62V38h14v24M185 42h8M185 48h8M185 54h8" />
          <path d="M200 62V30h10v32M203 34h4M203 40h4M203 46h4M203 52h4" />
          {/* arch */}
          <path d="M44 62V40a10 10 0 0120 0v22M50 62V48h8v14" />
          {/* tower left */}
          <path d="M78 62V26l4-6 4 6v36M80 34h8M80 44h8M80 54h8" />
          {/* low buildings */}
          <path d="M10 62V46h12v16M14 50h4M14 56h4" />
          <path d="M28 62V52h10v10" />
          <path d="M96 62V50h10v12" />
          <path d="M218 62V48h12v14" />
        </g>
      </svg>
    </div>
  )
}

function StockAlertCard() {
  return (
    <div className="mx-3 mb-4 mt-auto rounded-lg border border-gray-200 bg-white p-4">
      <p className="text-sm font-semibold text-gray-900">Need medicine urgently?</p>
      <p className="mt-1 text-xs leading-relaxed text-gray-500">
        Turn on availability alerts and we&apos;ll notify you when your medicines are in stock near you.
      </p>
      <button className="mt-3 w-full rounded-md border border-pine-600 px-3 py-1.5 text-xs font-semibold text-pine-700 hover:bg-pine-50">
        Set Stock Alert
      </button>
      <svg viewBox="0 0 200 84" className="mx-auto mt-3 h-20" fill="none" aria-hidden>
        <ellipse cx="100" cy="76" rx="66" ry="6" fill="#e9f4ef" />
        {/* location pin */}
        <g transform="translate(60 20)">
          <path d="M10 0C4 0 0 4.6 0 10.3 0 18 10 30 10 30s10-12 10-19.7C20 4.6 16 0 10 0z" fill="#125e47" />
          <circle cx="10" cy="10" r="3.6" fill="#fff" />
        </g>
        {/* bell */}
        <g transform="translate(120 22)" stroke="#3f9379" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" fill="none">
          <path d="M4 16c0-6 2.5-10 8-10s8 4 8 10c0 3 1.4 4.5 2.4 5.4H1.6C2.6 20.5 4 19 4 16z" fill="#e9f4ef" />
          <path d="M10 24.5a2 2 0 004 0" />
          <path d="M12 4V2" />
        </g>
        {/* medicine bottle */}
        <g transform="translate(86 30)">
          <rect x="0" y="10" width="28" height="34" rx="5" fill="#fff" stroke="#125e47" strokeWidth="2.2" />
          <rect x="5" y="2" width="18" height="10" rx="2.5" fill="#125e47" />
          <path d="M14 20v14M7 27h14" stroke="#1c7458" strokeWidth="2.6" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  )
}

function MedicineInfoCard() {
  return (
    <div className="mx-3 mb-4 mt-auto rounded-lg border border-gray-200 bg-white p-4">
      <p className="text-sm font-semibold text-gray-900">Need help choosing?</p>
      <p className="mt-1 text-xs leading-relaxed text-gray-500">
        Talk to a pharmacist or view medicine information and usage guidance.
      </p>
      <button className="mt-3 w-full rounded-md border border-pine-600 px-3 py-1.5 text-xs font-semibold text-pine-700 hover:bg-pine-50">
        View Medicine Info
      </button>
      <svg viewBox="0 0 200 84" className="mx-auto mt-3 h-20" fill="none" aria-hidden>
        <ellipse cx="100" cy="76" rx="60" ry="6" fill="#e9f4ef" />
        {/* sparkles */}
        <g fill="#3f9379">
          <path d="M64 24l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" opacity="0.8" />
          <path d="M138 34l1.5 3.5 3.5 1.5-3.5 1.5-1.5 3.5-1.5-3.5-3.5-1.5 3.5-1.5z" opacity="0.7" />
        </g>
        {/* medicine bottle with cross */}
        <g transform="translate(84 26)">
          <rect x="0" y="12" width="32" height="38" rx="6" fill="#fff" stroke="#125e47" strokeWidth="2.4" />
          <rect x="6" y="2" width="20" height="12" rx="3" fill="#125e47" />
          <g transform="translate(16 31)">
            <rect x="-3" y="-9" width="6" height="18" rx="1.5" fill="#dc6803" />
            <rect x="-9" y="-3" width="18" height="6" rx="1.5" fill="#dc6803" />
          </g>
        </g>
      </svg>
    </div>
  )
}

function SidebarPromo() {
  const { pathname } = useLocation()
  if (pathname.startsWith('/patient/reservations')) return <StockAlertCard />
  if (pathname.startsWith('/patient/search')) return <MedicineInfoCard />
  return <PromoCard />
}

function NavItems({ onNavigate }) {
  return (
    <nav className="flex-1 space-y-1 px-3 py-3">
      {nav.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-md px-3 py-2.5 text-base font-medium transition-colors',
              isActive
                ? 'bg-pine-700 text-white'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
            )
          }
        >
          {({ isActive }) => (
            <>
              <item.icon size={19} className={cn('shrink-0', isActive ? 'text-white' : 'text-gray-500')} />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span
                  className={cn(
                    'flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-semibold',
                    isActive ? 'bg-white/20 text-white' : 'bg-danger-500 text-white',
                  )}
                >
                  {item.badge}
                </span>
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

function TopBar({ onMenu }) {
  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-white">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
        <button className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 lg:hidden" onClick={onMenu}>
          <Menu size={20} />
        </button>

        <button className="flex items-center gap-1.5 text-base font-semibold text-gray-800">
          <MapPin size={16} className="text-pine-700" />
          {portalMeta.city}
          <ChevronDown size={15} className="text-gray-400" />
        </button>

        <div className="ml-auto flex items-center gap-4">
          <span className="hidden items-center gap-1.5 rounded-full bg-success-50 px-2.5 py-1 text-sm font-medium text-success-700 md:inline-flex">
            <span className="h-2 w-2 rounded-full bg-success-500" />
            Live Data
          </span>
          <span className="hidden text-sm text-gray-500 lg:inline">Updated 10m ago</span>
          <span className="hidden text-sm text-gray-500 xl:inline">Connected pharmacies: {portalMeta.connectedPharmacies}</span>

          <button className="relative rounded-md p-1.5 text-gray-500 hover:bg-gray-100">
            <Bell size={20} />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-danger-500 px-1 text-[10px] font-semibold text-white">
              3
            </span>
          </button>

          <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-pine-700 text-sm font-semibold text-white">
              JM
            </span>
            <div className="hidden leading-tight sm:block">
              <p className="text-sm font-semibold text-gray-900">{patient.name}</p>
              <p className="text-xs text-gray-500">{patient.role}</p>
            </div>
            <ChevronDown size={15} className="hidden text-gray-400 sm:block" />
          </div>
        </div>
      </div>
    </header>
  )
}

export default function PatientLayout() {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-gray-200 bg-white lg:flex">
        <div className="px-5 py-4">
          <BrandMark />
        </div>
        <NavItems />
        <SidebarPromo />
      </aside>

      {/* Mobile sidebar */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-gray-900/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col border-r border-gray-200 bg-white">
            <div className="flex items-center justify-between px-5 py-4">
              <BrandMark />
              <button className="rounded-md p-1 text-gray-500 hover:bg-gray-100" onClick={() => setOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <NavItems onNavigate={() => setOpen(false)} />
            <SidebarPromo />
          </aside>
        </div>
      )}

      <div className="flex min-h-screen flex-col lg:pl-64">
        <TopBar onMenu={() => setOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
        <footer className="border-t border-gray-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-sm text-gray-500 sm:flex-row sm:items-center sm:px-6">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={15} className="text-pine-600" />
              Your data is secure and used only to improve community health.
            </span>
            <span className="hidden text-gray-300 sm:inline">·</span>
            <a href="#" className="hover:text-gray-700">Privacy Policy</a>
            <a href="#" className="hover:text-gray-700">Terms of Service</a>
            <span className="sm:ml-auto">© 2025 PRISM. All rights reserved.</span>
          </div>
        </footer>
      </div>
    </div>
  )
}
