import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useEffect } from 'react'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// Fix default marker asset paths under Vite bundling.
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const KIGALI = [-1.9441, 30.0619]
const TILES = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const ATTRIB = '&copy; OpenStreetMap contributors'

function Recenter({ center }) {
  const map = useMap()
  useEffect(() => {
    if (center) map.setView(center, map.getZoom())
  }, [center, map])
  return null
}

export function PharmacyMap({ pharmacies = [], activeId, height = 420, onSelect }) {
  const active = pharmacies.find((p) => p.id === activeId)
  return (
    <MapContainer
      center={active ? [active.lat, active.lng] : KIGALI}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height, width: '100%' }}
    >
      <TileLayer url={TILES} attribution={ATTRIB} />
      {active && <Recenter center={[active.lat, active.lng]} />}
      {pharmacies.map((p) => (
        <Marker
          key={p.id}
          position={[p.lat, p.lng]}
          eventHandlers={{ click: () => onSelect?.(p) }}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-semibold text-gray-900">{p.name}</p>
              <p className="text-gray-500">{p.address}</p>
              {p.distance != null && (
                <p className="mt-1 text-gray-600">{p.distance.toFixed(1)} km away</p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

function heatColor(score) {
  if (score >= 70) return '#d92d20'
  if (score >= 45) return '#f79009'
  if (score >= 30) return '#eab308'
  return '#12b76a'
}

export function HotspotMap({ hotspots = [], height = 440, onSelect }) {
  return (
    <MapContainer center={KIGALI} zoom={12} scrollWheelZoom={false} style={{ height, width: '100%' }}>
      <TileLayer url={TILES} attribution={ATTRIB} />
      {hotspots.map((h) => {
        const color = heatColor(h.score)
        return (
          <CircleMarker
            key={h.sector}
            center={[h.lat, h.lng]}
            radius={10 + (h.score / 100) * 22}
            pathOptions={{ color, fillColor: color, fillOpacity: 0.28, weight: 1.5 }}
            eventHandlers={{ click: () => onSelect?.(h) }}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-semibold text-gray-900">
                  {h.sector}, {h.district}
                </p>
                <p className="text-gray-600">Anomaly score: {h.score}/100</p>
                <p className="text-gray-500">{h.signal}</p>
              </div>
            </Popup>
          </CircleMarker>
        )
      })}
    </MapContainer>
  )
}
