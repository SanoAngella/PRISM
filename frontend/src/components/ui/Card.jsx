import { cn } from '../../utils/cn'

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'rounded-lg border border-gray-200 bg-white shadow-xs',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ title, description, action, className, children }) {
  return (
    <div
      className={cn(
        'flex items-start justify-between gap-4 border-b border-gray-200 px-4 py-3.5',
        className,
      )}
    >
      {children ?? (
        <div className="min-w-0">
          {title && <h3 className="text-md font-semibold text-gray-900">{title}</h3>}
          {description && <p className="mt-0.5 text-sm text-gray-500">{description}</p>}
        </div>
      )}
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

export function CardBody({ className, children }) {
  return <div className={cn('p-4', className)}>{children}</div>
}

export function CardFooter({ className, children }) {
  return (
    <div className={cn('border-t border-gray-200 px-4 py-3', className)}>{children}</div>
  )
}
