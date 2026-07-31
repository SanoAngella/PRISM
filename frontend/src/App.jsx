import { Routes, Route, Navigate } from 'react-router-dom'
import { ROLES } from './utils/constants'
import ProtectedRoute from './components/ProtectedRoute'

// Layouts
import PublicLayout from './layouts/PublicLayout'
import PatientLayout from './layouts/PatientLayout'
import PharmacyLayout from './layouts/PharmacyLayout'
import AuthorityLayout from './layouts/AuthorityLayout'

// Public / auth
import Landing from './pages/Landing'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import RegisterPharmacy from './pages/auth/RegisterPharmacy'
import NotFound from './pages/NotFound'

// Patient
import PatientHome from './pages/patient/PatientHome'
import MedicineSearch from './pages/patient/MedicineSearch'
import MedicineDetails from './pages/patient/MedicineDetails'
import NearbyPharmacies from './pages/patient/NearbyPharmacies'
import PharmacyDetails from './pages/patient/PharmacyDetails'
import Reservation from './pages/patient/Reservation'
import MyReservations from './pages/patient/MyReservations'
import Orders from './pages/patient/Orders'
import HealthTips from './pages/patient/HealthTips'
import Notifications from './pages/patient/Notifications'
import HelpSupport from './pages/patient/HelpSupport'
import PatientProfile from './pages/patient/PatientProfile'
import PatientSettings from './pages/patient/PatientSettings'

// Pharmacy
import PharmacyDashboard from './pages/pharmacy/PharmacyDashboard'
import Inventory from './pages/pharmacy/Inventory'
import Medicines from './pages/pharmacy/Medicines'
import PharmacyReservations from './pages/pharmacy/PharmacyReservations'
import Sales from './pages/pharmacy/Sales'
import PharmacyAnalytics from './pages/pharmacy/PharmacyAnalytics'

// Authority
import AuthorityDashboard from './pages/authority/AuthorityDashboard'
import DiseaseAlerts from './pages/authority/DiseaseAlerts'
import AlertDetails from './pages/authority/AlertDetails'
import MedicineDemand from './pages/authority/MedicineDemand'
import HotspotMapPage from './pages/authority/HotspotMap'

// Shared account pages
import Profile from './pages/shared/Profile'
import Settings from './pages/shared/Settings'

export default function App() {
  return (
    <Routes>
      {/* Public marketing */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
      </Route>

      {/* Auth (full-screen) */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/register" element={<RegisterPharmacy />} />

      {/* Patient portal (requires patient sign-in) */}
      <Route
        path="/patient"
        element={
          <ProtectedRoute role={ROLES.PATIENT}>
            <PatientLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<PatientHome />} />
        <Route path="search" element={<MedicineSearch />} />
        <Route path="medicine/:id" element={<MedicineDetails />} />
        <Route path="pharmacies" element={<NearbyPharmacies />} />
        <Route path="pharmacy/:id" element={<PharmacyDetails />} />
        <Route path="reserve/:medicineId" element={<Reservation />} />
        <Route path="reservations" element={<MyReservations />} />
        <Route path="orders" element={<Orders />} />
        <Route path="health-tips" element={<HealthTips />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="help" element={<HelpSupport />} />
        <Route path="profile" element={<PatientProfile />} />
        <Route path="settings" element={<PatientSettings />} />
      </Route>

      {/* Pharmacy portal */}
      <Route
        path="/pharmacy"
        element={
          <ProtectedRoute role={ROLES.PHARMACY}>
            <PharmacyLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<PharmacyDashboard />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="medicines" element={<Medicines />} />
        <Route path="reservations" element={<PharmacyReservations />} />
        <Route path="sales" element={<Sales />} />
        <Route path="analytics" element={<PharmacyAnalytics />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Health Authority portal */}
      <Route
        path="/authority"
        element={
          <ProtectedRoute role={ROLES.AUTHORITY}>
            <AuthorityLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AuthorityDashboard />} />
        <Route path="alerts" element={<DiseaseAlerts />} />
        <Route path="alerts/:id" element={<AlertDetails />} />
        <Route path="demand" element={<MedicineDemand />} />
        <Route path="hotspots" element={<HotspotMapPage />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}
