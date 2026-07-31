import { Outlet } from 'react-router-dom'
import { LayoutDashboard, Boxes, PillBottle, Receipt, BarChart3, CalendarClock, Settings, User } from 'lucide-react'
import DashboardLayout from './DashboardLayout'

const nav = [
  { to: '/pharmacy', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/pharmacy/inventory', label: 'Inventory', icon: Boxes },
  { to: '/pharmacy/medicines', label: 'Medicines', icon: PillBottle },
  { to: '/pharmacy/reservations', label: 'Reservations', icon: CalendarClock, badge: 2 },
  { to: '/pharmacy/sales', label: 'Sales', icon: Receipt },
  { to: '/pharmacy/analytics', label: 'Analytics', icon: BarChart3 },
  { section: 'Account' },
  { to: '/pharmacy/profile', label: 'Profile', icon: User },
  { to: '/pharmacy/settings', label: 'Settings', icon: Settings },
]

export default function PharmacyLayout() {
  return (
    <DashboardLayout nav={nav} title="Pharmacy">
      <Outlet />
    </DashboardLayout>
  )
}
