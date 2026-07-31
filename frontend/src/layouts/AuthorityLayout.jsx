import { Outlet } from 'react-router-dom'
import { LayoutDashboard, Siren, Map, Activity, Settings, User } from 'lucide-react'
import DashboardLayout from './DashboardLayout'

const nav = [
  { to: '/authority', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/authority/alerts', label: 'Disease Alerts', icon: Siren, badge: 3 },
  { to: '/authority/demand', label: 'Medicine Demand', icon: Activity },
  { to: '/authority/hotspots', label: 'Hotspot Map', icon: Map },
  { section: 'Account' },
  { to: '/authority/profile', label: 'Profile', icon: User },
  { to: '/authority/settings', label: 'Settings', icon: Settings },
]

export default function AuthorityLayout() {
  return (
    <DashboardLayout nav={nav} title="Health Authority">
      <Outlet />
    </DashboardLayout>
  )
}
