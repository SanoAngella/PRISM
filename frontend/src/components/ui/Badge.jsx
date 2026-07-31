import { cn } from '../../utils/cn'

const TONES = {
  gray: 'bg-gray-100 text-gray-700 ring-gray-200',
  brand: 'bg-brand-50 text-brand-700 ring-brand-200',
  success: 'bg-success-50 text-success-700 ring-success-100',
  warning: 'bg-warning-50 text-warning-700 ring-warning-100',
  danger: 'bg-danger-50 text-danger-700 ring-danger-100',
}

export default function Badge({ tone = 'gray', dot = false, className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
        TONES[tone],
        className,
      )}
    >
      {dot && (
        <span
          className={cn('h-1.5 w-1.5 rounded-full', {
            'bg-gray-500': tone === 'gray',
            'bg-brand-500': tone === 'brand',
            'bg-success-500': tone === 'success',
            'bg-warning-500': tone === 'warning',
            'bg-danger-500': tone === 'danger',
          })}
        />
      )}
      {children}
    </span>
  )
}
