import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const AXIS = { fontSize: 12, fill: '#667085' }
const GRID = '#eef0f3'

const tooltipStyle = {
  contentStyle: {
    borderRadius: 8,
    border: '1px solid #e4e7ec',
    boxShadow: '0 2px 6px rgba(16,24,40,0.08)',
    fontSize: 13,
    padding: '8px 10px',
  },
  labelStyle: { color: '#101828', fontWeight: 600, marginBottom: 2 },
  itemStyle: { padding: 0 },
}

// Multi-series demand trend (outbreak tracers).
export function DemandLineChart({ data, height = 280 }) {
  const lines = [
    { key: 'rehydration', name: 'Rehydration', color: '#d92d20' },
    { key: 'antimalarial', name: 'Antimalarial', color: '#dc6803' },
    { key: 'antibiotic', name: 'Antibiotic', color: '#2649d6' },
    { key: 'analgesic', name: 'Analgesic', color: '#039855' },
  ]
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="label" tick={AXIS} tickLine={false} axisLine={{ stroke: GRID }} />
        <YAxis tick={AXIS} tickLine={false} axisLine={false} width={40} />
        <Tooltip {...tooltipStyle} />
        {lines.map((l) => (
          <Line
            key={l.key}
            type="monotone"
            dataKey={l.key}
            name={l.name}
            stroke={l.color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

// Horizontal-ish category demand bars.
export function CategoryBarChart({ data, height = 280 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="category" tick={{ ...AXIS, fontSize: 11 }} tickLine={false} axisLine={{ stroke: GRID }} interval={0} angle={-12} dy={8} height={44} />
        <YAxis tick={AXIS} tickLine={false} axisLine={false} width={40} />
        <Tooltip {...tooltipStyle} cursor={{ fill: '#f2f4f7' }} />
        <Bar dataKey="units" radius={[4, 4, 0, 0]} maxBarSize={40}>
          {data.map((d) => (
            <Cell key={d.category} fill={d.change > 25 ? '#dc6803' : '#2649d6'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

// Sales revenue area chart.
export function SalesAreaChart({ data, height = 240 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2649d6" stopOpacity={0.16} />
            <stop offset="100%" stopColor="#2649d6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="label" tick={AXIS} tickLine={false} axisLine={{ stroke: GRID }} />
        <YAxis tick={AXIS} tickLine={false} axisLine={false} width={44} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
        <Tooltip {...tooltipStyle} formatter={(v) => [`${v.toLocaleString()} RWF`, 'Revenue']} />
        <Area type="monotone" dataKey="revenue" stroke="#2649d6" strokeWidth={2} fill="url(#revFill)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// Compact sparkline used inside cards.
export function Sparkline({ data, dataKey = 'value', color = '#2649d6', height = 40 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={1.8} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function ChartLegend({ items }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
      {items.map((it) => (
        <span key={it.label} className="inline-flex items-center gap-1.5 text-sm text-gray-600">
          <span className="h-2 w-2 rounded-full" style={{ background: it.color }} />
          {it.label}
        </span>
      ))}
    </div>
  )
}
