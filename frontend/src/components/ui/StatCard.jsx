import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { cn } from '../../utils/cn'
import { Card } from './Card'

export default function StatCard({ label, value, delta, icon: Icon, hint, tone = 'brand' }) {
  const positive = delta != null && delta >= 0
  const toneBg = {
    brand: 'bg-brand-50 text-brand-600',
    success: 'bg-success-50 text-success-600',
    warning: 'bg-warning-50 text-warning-600',
    danger: 'bg-danger-50 text-danger-600',
  }[tone]

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-1.5 text-2xl font-semibold text-gray-900">{value}</p>
        </div>
        {Icon && (
          <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-md', toneBg)}>
            <Icon size={18} />
          </div>
        )}
      </div>
      {(delta != null || hint) && (
        <div className="mt-3 flex items-center gap-2 text-sm">
          {delta != null && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 font-medium',
                positive ? 'text-success-700' : 'text-danger-700',
              )}
            >
              {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {Math.abs(delta)}%
            </span>
          )}
          {hint && <span className="text-gray-500">{hint}</span>}
        </div>
      )}
    </Card>
  )
}
