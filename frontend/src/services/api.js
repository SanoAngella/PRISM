import axios from 'axios'

// Central axios instance. When the backend is wired up, services can switch
// from the mock resolvers to real calls through this client with no page changes.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// Attach JWT from the persisted session on every request.
api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem('prism.auth')
    if (raw) {
      const { token } = JSON.parse(raw)
      if (token) config.headers.Authorization = `Bearer ${token}`
    }
  } catch {
    /* ignore malformed session */
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('prism.auth')
    }
    return Promise.reject(error)
  },
)

// Simulate network latency for the mock layer.
export const mock = (data, ms = 320) =>
  new Promise((resolve) => setTimeout(() => resolve(structuredClone(data)), ms))

export default api
