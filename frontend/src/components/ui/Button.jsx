import { cn } from '../../utils/cn'
import { Loader2 } from 'lucide-react'

const VARIANTS = {
  primary:
    'bg-brand-600 text-white border border-brand-600 hover:bg-brand-700 hover:border-brand-700 shadow-xs',
  pine:
    'bg-pine-700 text-white border border-pine-700 hover:bg-pine-800 hover:border-pine-800 shadow-xs',
  secondary:
    'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-xs',
  ghost: 'bg-transparent text-gray-600 border border-transparent hover:bg-gray-100',
  danger:
    'bg-danger-600 text-white border border-danger-600 hover:bg-danger-700 shadow-xs',
  success:
    'bg-success-600 text-white border border-success-600 hover:bg-success-700 shadow-xs',
  link: 'bg-transparent text-brand-600 border border-transparent hover:text-brand-700 hover:underline px-0',
}

const SIZES = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-9 px-3.5 text-base gap-2',
  lg: 'h-10 px-4 text-base gap-2',
}

export default function Button({
  as: Comp = 'button',
  variant = 'primary',
  size = 'md',
  className,
  children,
  loading = false,
  icon: Icon,
  iconRight: IconRight,
  disabled,
  ...props
}) {
  return (
    <Comp
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1',
        'disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        Icon && <Icon size={16} />
      )}
      {children}
      {IconRight && !loading && <IconRight size={16} />}
    </Comp>
  )
}
