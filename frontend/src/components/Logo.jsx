import { Link } from 'react-router-dom'
import { cn } from '../utils/cn'

export default function Logo({ to = '/', showText = true, className, textClass }) {
  return (
    <Link to={to} className={cn('inline-flex items-center gap-2', className)}>
      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-600 text-white">
        <svg width="18" height="18" viewBox="0 0 32 32" fill="none" aria-hidden>
          <path d="M16 5l9 5.2v10.4L16 26l-9-5.4V10.2L16 5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M16 5v21M7 10.2l18 10.4M25 10.2L7 20.6" stroke="currentColor" strokeWidth="1.1" opacity="0.55" />
        </svg>
      </span>
      {showText && (
        <span className={cn('text-lg font-semibold tracking-tight text-gray-900', textClass)}>
          PRISM
        </span>
      )}
    </Link>
  )
}
