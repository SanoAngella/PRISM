import { Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn'
import { initials } from '../../utils/format'

export function Avatar({ name = '', size = 'md', className }) {
  const dim = { sm: 'h-7 w-7 text-xs', md: 'h-9 w-9 text-sm', lg: 'h-11 w-11 text-base' }[size]
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700',
        dim,
        className,
      )}
    >
      {initials(name) || '·'}
    </div>
  )
}

export function Spinner({ className }) {
  return <Loader2 className={cn('animate-spin text-brand-600', className)} />
}

export function PageLoader({ label = 'Loading…' }) {
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-3 text-gray-500">
      <Spinner className="h-6 w-6" />
      <p className="text-sm">{label}</p>
    </div>
  )
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
      {Icon && (
        <div className="mb-1 flex h-11 w-11 items-center justify-center rounded-full bg-white ring-1 ring-gray-200">
          <Icon size={20} className="text-gray-400" />
        </div>
      )}
      <h4 className="text-md font-semibold text-gray-900">{title}</h4>
      {description && <p className="max-w-sm text-sm text-gray-500">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

export function PageHeader({ title, description, actions, breadcrumb }) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {breadcrumb}
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        {description && <p className="mt-1 text-base text-gray-500">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

export function Divider({ className }) {
  return <hr className={cn('border-gray-200', className)} />
}
