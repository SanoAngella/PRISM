import { mock } from './api'
import { ROLES } from '../utils/constants'
import { CURRENT_PHARMACY_ID } from '../data/pharmacies'

// Demo accounts. In production these calls hit POST /api/auth/login.
const DEMO_USERS = [
  {
    id: 'U-PH-1',
    name: 'CityMed Pharmacy',
    email: 'pharmacy@prism.rw',
    password: 'password',
    role: ROLES.PHARMACY,
    pharmacyId: CURRENT_PHARMACY_ID,
    avatar: null,
  },
  {
    id: 'U-HA-1',
    name: 'Dr. Claudine Ndayisaba',
    email: 'authority@prism.rw',
    password: 'password',
    role: ROLES.AUTHORITY,
    organization: 'Rwanda Biomedical Centre',
    avatar: null,
  },
  {
    id: 'U-PT-1',
    name: 'Jean-Paul Habimana',
    email: 'patient@prism.rw',
    password: 'password',
    role: ROLES.PATIENT,
    avatar: null,
  },
]

function makeToken(user) {
  // Mock JWT-shaped token so the request interceptor has something to attach.
  return `mock.${btoa(JSON.stringify({ sub: user.id, role: user.role }))}.token`
}

export const authService = {
  async login({ email, password, role }) {
    const found = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === String(email).toLowerCase(),
    )
    if (!found || (password && found.password !== password)) {
      // Allow role-based quick login even if credentials are blank in the demo.
      if (role) {
        const byRole = DEMO_USERS.find((u) => u.role === role)
        if (byRole) {
          const { password: _p, ...safe } = byRole
          return mock({ ...safe, token: makeToken(byRole) })
        }
      }
      await mock(null, 300)
      throw new Error('Invalid email or password')
    }
    const { password: _pw, ...safe } = found
    return mock({ ...safe, token: makeToken(found) })
  },

  async registerPharmacy(payload) {
    const user = {
      id: `U-PH-${Date.now()}`,
      name: payload.pharmacyName,
      email: payload.email,
      role: ROLES.PHARMACY,
      pharmacyId: CURRENT_PHARMACY_ID,
      organization: payload.pharmacyName,
    }
    return mock({ ...user, token: makeToken(user) }, 600)
  },

  async registerPatient(payload) {
    const user = {
      id: `U-PT-${Date.now()}`,
      name: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      role: ROLES.PATIENT,
      avatar: null,
    }
    return mock({ ...user, token: makeToken(user) }, 600)
  },
}
