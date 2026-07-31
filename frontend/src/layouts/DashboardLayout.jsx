import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Bell, ChevronDown, LogOut, Menu, Search, Settings, User, X } from 'lucide-react'
import Logo from '../components/Logo'
import { Avatar } from '../components/ui/Misc'
import { useAuth } from '../contexts/AuthContext'
import { cn } from '../utils/cn'

function SidebarContent({ nav, title, onNavigate }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b border-gray-200 px-4">
        <Logo />
      </div>
      <div className="px-3 pt-4">
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          {title}
        </p>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
        {nav.map((item) =>
          item.section ? (
            <p
              key={item.section}
              className="px-3 pb-1.5 pt-4 text-xs font-semibold uppercase tracking-wider text-gray-400"
            >
              {item.section}
            </p>
          ) : (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn('nav-link', isActive && 'nav-link-active')
              }
            >
              <item.icon size={18} className="shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.badge != null && (
                <span className="rounded-full bg-danger-50 px-1.5 py-0.5 text-xs font-semibold text-danger-700">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ),
        )}
      </nav>
    </div>
  )
}

export default function DashboardLayout({ nav, title, children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 border-r border-gray-200 bg-white lg:block">
        <SidebarContent nav={nav} title={title} />
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-gray-900/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-white shadow-lg">
            <button
              className="absolute right-3 top-3 rounded-md p-1 text-gray-400 hover:bg-gray-100"
              onClick={() => setMobileOpen(false)}
            >
              <X size={18} />
            </button>
            <SidebarContent nav={nav} title={title} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-60">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-gray-200 bg-white/95 px-4 backdrop-blur">
          <button
            className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={20} />
          </button>

          <div className="relative hidden max-w-md flex-1 sm:block">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Search medicines, pharmacies, alerts…"
              className="h-9 w-full rounded-md border border-gray-300 bg-gray-50 pl-9 pr-3 text-base placeholder:text-gray-400 focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-100"
            />
          </div>

          <div className="ml-auto flex items-center gap-1.5">
            <button className="relative rounded-md p-2 text-gray-500 hover:bg-gray-100" aria-label="Notifications">
              <Bell size={18} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger-500 ring-2 ring-white" />
            </button>

            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-md py-1 pl-1 pr-2 hover:bg-gray-100"
              >
                <Avatar name={user?.name} size="sm" />
                <span className="hidden text-left sm:block">
                  <span className="block max-w-[140px] truncate text-sm font-medium text-gray-800">
                    {user?.name}
                  </span>
                </span>
                <ChevronDown size={15} className="text-gray-400" />
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 z-20 mt-1.5 w-56 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-md">
                    <div className="border-b border-gray-100 px-3 py-2.5">
                      <p className="truncate text-sm font-semibold text-gray-900">{user?.name}</p>
                      <p className="truncate text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Link to="profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-base text-gray-700 hover:bg-gray-50">
                      <User size={16} className="text-gray-400" /> Profile
                    </Link>
                    <Link to="settings" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-base text-gray-700 hover:bg-gray-50">
                      <Settings size={16} className="text-gray-400" /> Settings
                    </Link>
                    <button onClick={handleLogout} className="flex w-full items-center gap-2.5 border-t border-gray-100 px-3 py-2 text-base text-danger-600 hover:bg-danger-50">
                      <LogOut size={16} /> Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
  )
}
