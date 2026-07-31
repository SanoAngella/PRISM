import { Plus, Minus } from 'lucide-react'

const PIN_COLORS = {
  in_stock: '#039855',
  low: '#dc6803',
  out: '#d92d20',
}

function Pin({ x, y, color }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        d="M0 0C-6.6 0-12 5.2-12 11.7-12 20.5 0 31 0 31s12-10.5 12-19.3C12 5.2 6.6 0 0 0z"
        transform="translate(0 -31)"
        fill={color}
        stroke="#ffffff"
        strokeWidth="1.5"
      />
      <circle cx="0" cy="-19.3" r="4" fill="#ffffff" />
    </g>
  )
}

const PINS = [
  { x: 320, y: 120, stock: 'in_stock' },
  { x: 250, y: 175, stock: 'in_stock' },
  { x: 300, y: 205, stock: 'low' },
  { x: 355, y: 200, stock: 'out' },
  { x: 265, y: 250, stock: 'in_stock' },
]

/**
 * Stylised Kigali map used on the dashboard / search screens.
 * Purely decorative — approximates the reference design without live tiles.
 */
export default function PortalMap({ height = 380, legend = true, compact = false }) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-[#eaf0ea]" style={{ height }}>
      <svg viewBox="0 0 480 320" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
        <rect width="480" height="320" fill="#e9efe9" />
        {/* green space blobs */}
        <path d="M-20 40 Q60 20 130 60 T260 70 L260 -20 -20 -20z" fill="#dbe7d8" opacity="0.7" />
        <path d="M330 250 Q400 230 480 260 L480 340 320 340z" fill="#dbe7d8" opacity="0.7" />
        {/* river */}
        <path d="M60 300 C140 240 180 210 240 200 S360 150 470 90" stroke="#bcd4e6" strokeWidth="10" fill="none" opacity="0.8" />
        {/* roads */}
        <g stroke="#f7c87a" strokeWidth="5" fill="none" opacity="0.9">
          <path d="M0 150 H480" />
          <path d="M240 0 V320" />
          <path d="M40 40 L300 260" />
          <path d="M440 40 L180 300" />
        </g>
        <g stroke="#ffffff" strokeWidth="2" fill="none">
          <path d="M0 210 H480" />
          <path d="M120 0 V320" />
          <path d="M360 0 V320" />
          <path d="M0 80 H480" />
        </g>
        {/* district labels */}
        <text x="235" y="40" textAnchor="middle" fontSize="13" fontWeight="700" fill="#5b6b5f">Kigali City</text>
        <text x="130" y="120" fontSize="10" fontWeight="600" fill="#8a988c" letterSpacing="0.5">NYARUGENGE</text>
        <text x="360" y="95" fontSize="10" fontWeight="600" fill="#8a988c" letterSpacing="0.5">GASABO</text>
        <text x="360" y="185" fontSize="10" fontWeight="600" fill="#8a988c" letterSpacing="0.5">KICUKIRO</text>
        <text x="400" y="260" fontSize="10" fontWeight="600" fill="#8a988c" letterSpacing="0.5">KANOMBE</text>
        <text x="120" y="290" fontSize="10" fontWeight="600" fill="#8a988c" letterSpacing="0.5">Gahanga</text>

        {/* your location */}
        <g>
          <circle cx="300" cy="235" r="15" fill="#2563eb" opacity="0.18" />
          <circle cx="300" cy="235" r="7" fill="#2563eb" stroke="#ffffff" strokeWidth="2.5" />
        </g>

        {PINS.map((p, i) => (
          <Pin key={i} x={p.x} y={p.y} color={PIN_COLORS[p.stock]} />
        ))}
      </svg>

      {legend && (
        <div className="absolute right-3 top-3 space-y-1.5 rounded-md border border-gray-200 bg-white/95 px-3 py-2.5 text-xs shadow-sm">
          <p className="flex items-center gap-2 text-gray-600"><span className="h-2.5 w-2.5 rounded-full bg-[#039855]" /> In stock</p>
          <p className="flex items-center gap-2 text-gray-600"><span className="h-2.5 w-2.5 rounded-full bg-[#dc6803]" /> Low stock</p>
          <p className="flex items-center gap-2 text-gray-600"><span className="h-2.5 w-2.5 rounded-full bg-[#d92d20]" /> Out of stock</p>
          <p className="flex items-center gap-2 text-gray-600"><span className="h-2.5 w-2.5 rounded-full bg-[#2563eb]" /> Your location</p>
        </div>
      )}

      {!compact && (
        <div className="absolute bottom-3 right-3 flex flex-col overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm">
          <button className="flex h-7 w-7 items-center justify-center text-gray-600 hover:bg-gray-50"><Plus size={15} /></button>
          <span className="h-px bg-gray-200" />
          <button className="flex h-7 w-7 items-center justify-center text-gray-600 hover:bg-gray-50"><Minus size={15} /></button>
        </div>
      )}
    </div>
  )
}
