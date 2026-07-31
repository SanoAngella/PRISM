import { createContext, useCallback, useContext, useState } from 'react'
import { CheckCircle2, AlertTriangle, Info, X, XCircle } from 'lucide-react'

const ToastContext = createContext(null)

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

const ACCENT = {
  success: 'text-success-600',
  error: 'text-danger-600',
  warning: 'text-warning-600',
  info: 'text-brand-600',
}

let idSeq = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  const push = useCallback(
    (type, title, description) => {
      const id = ++idSeq
      setToasts((t) => [...t, { id, type, title, description }])
      setTimeout(() => dismiss(id), 4200)
    },
    [dismiss],
  )

  const toast = {
    success: (title, description) => push('success', title, description),
    error: (title, description) => push('error', title, description),
    warning: (title, description) => push('warning', title, description),
    info: (title, description) => push('info', title, description),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-4 right-4 z-[1000] flex w-full max-w-sm flex-col gap-2">
        {toasts.map((t) => {
          const Icon = ICONS[t.type]
          return (
            <div
              key={t.id}
              className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-3.5 shadow-md"
              role="status"
            >
              <Icon size={18} className={`mt-0.5 shrink-0 ${ACCENT[t.type]}`} />
              <div className="min-w-0 flex-1">
                <p className="text-base font-semibold text-gray-900">{t.title}</p>
                {t.description && (
                  <p className="mt-0.5 text-sm text-gray-500">{t.description}</p>
                )}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Dismiss"
              >
                <X size={16} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}
