import { forwardRef } from 'react'
import { cn } from '../../utils/cn'

export const Input = forwardRef(function Input(
  { label, hint, error, icon: Icon, className, id, ...props },
  ref,
) {
  const inputId = id || props.name
  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn('form-input', Icon && 'pl-9', error && 'border-danger-500 focus:border-danger-500 focus:ring-danger-100')}
          {...props}
        />
      </div>
      {error ? (
        <p className="mt-1.5 text-sm text-danger-600">{error}</p>
      ) : (
        hint && <p className="mt-1.5 text-sm text-gray-500">{hint}</p>
      )}
    </div>
  )
})

export const Select = forwardRef(function Select(
  { label, error, className, id, children, ...props },
  ref,
) {
  const inputId = id || props.name
  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
        </label>
      )}
      <select ref={ref} id={inputId} className={cn('form-input pr-8', error && 'border-danger-500')} {...props}>
        {children}
      </select>
      {error && <p className="mt-1.5 text-sm text-danger-600">{error}</p>}
    </div>
  )
})

export const Textarea = forwardRef(function Textarea(
  { label, error, className, id, rows = 3, ...props },
  ref,
) {
  const inputId = id || props.name
  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        className={cn('form-input h-auto py-2 leading-relaxed', error && 'border-danger-500')}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-danger-600">{error}</p>}
    </div>
  )
})
