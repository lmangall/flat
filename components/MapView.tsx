'use client'

import { useEffect, useRef, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { places, FLAT_COORDS, categoryColors, type Place, type Category } from '@/lib/places'

import 'leaflet/dist/leaflet.css'

/* ------------------------------------------------------------------ */
/*  Emoji marker factory                                              */
/* ------------------------------------------------------------------ */

function createEmojiIcon(emoji: string, category: Category, isActive: boolean) {
  const color = categoryColors[category]
  const size = isActive ? 44 : 36
  const ring = isActive ? `box-shadow:0 0 0 3px ${color}44, 0 4px 12px rgba(0,0,0,0.18);` : 'box-shadow:0 2px 8px rgba(0,0,0,0.12);'

  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width:${size}px;height:${size}px;
      display:flex;align-items:center;justify-content:center;
      background:white;border:2px solid ${color};border-radius:50%;
      font-size:${isActive ? 20 : 16}px;
      ${ring}
      transition:all 0.3s cubic-bezier(0.22,1,0.36,1);
      transform:${isActive ? 'scale(1.15)' : 'scale(1)'};
    ">${emoji}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2 - 4],
  })
}

/** Tiny wave-stripe pattern clipped to a circle — mirrors the hero WavePattern */
function createHomeIcon() {
  const size = 40
  const r = size / 2
  const stripeW = 4
  const amp = 1.5
  const waveH = 15

  // Build wavy stripe path data
  let paths = ''
  for (let n = 0; n < Math.ceil(size / stripeW) + 2; n++) {
    if (n % 2 !== 0) continue
    let d = ''
    for (let y = 0; y <= size; y++) {
      const s = (2 * Math.PI * y) / waveH + n * Math.PI
      const xl = n * stripeW + amp * Math.sin(s)
      d += y === 0 ? `M${xl.toFixed(1)} ${y}` : `L${xl.toFixed(1)} ${y}`
    }
    for (let y = size; y >= 0; y--) {
      const s = (2 * Math.PI * y) / waveH + n * Math.PI
      const xr = (n + 1) * stripeW + amp * Math.sin(s + Math.PI)
      d += `L${xr.toFixed(1)} ${y}`
    }
    d += 'Z'
    paths += `<path d="${d}" fill="#1E1C18"/>`
  }

  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;box-shadow:0 0 0 3px rgba(30,28,24,0.12),0 4px 14px rgba(0,0,0,0.18);overflow:hidden;">
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <defs><clipPath id="hc"><circle cx="${r}" cy="${r}" r="${r}"/></clipPath></defs>
        <circle cx="${r}" cy="${r}" r="${r}" fill="#F6F2EB"/>
        <g clip-path="url(#hc)">${paths}</g>
        <circle cx="${r}" cy="${r}" r="${r - 1}" fill="none" stroke="#E8457A" stroke-width="2"/>
        <circle cx="${r}" cy="${r}" r="${r - 2.5}" fill="none" stroke="#F5C842" stroke-width="1"/>
      </svg>
    </div>`,
    iconSize: [size, size],
    iconAnchor: [r, r],
    popupAnchor: [0, -r - 4],
  })
}

/* ------------------------------------------------------------------ */
/*  Map controller — reacts to prop changes                          */
/* ------------------------------------------------------------------ */

function MapController({
  activePlace,
  filter,
}: {
  activePlace: string | null
  filter: string
}) {
  const map = useMap()
  const prevFilter = useRef(filter)

  useEffect(() => {
    if (activePlace) {
      const place = places.find((p) => p.id === activePlace)
      if (place) {
        map.flyTo([place.lat, place.lng], 15, { duration: 0.8 })
      }
    }
  }, [activePlace, map])

  // When filter changes, fit bounds to visible markers
  useEffect(() => {
    if (filter !== prevFilter.current) {
      prevFilter.current = filter
      const visible = filter === 'all' ? places : places.filter((p) => p.category === filter)
      if (visible.length > 0) {
        const bounds = L.latLngBounds(visible.map((p) => [p.lat, p.lng]))
        // Always include the flat
        bounds.extend([FLAT_COORDS.lat, FLAT_COORDS.lng])
        map.flyToBounds(bounds, { padding: [50, 50], duration: 0.8, maxZoom: 15 })
      }
    }
  }, [filter, map])

  return null
}

/* ------------------------------------------------------------------ */
/*  Main MapView                                                      */
/* ------------------------------------------------------------------ */

interface MapViewProps {
  filter: string
  activePlace: string | null
  onMarkerClick: (id: string) => void
}

export default function MapView({ filter, activePlace, onMarkerClick }: MapViewProps) {
  const markerRefs = useRef<Record<string, L.Marker>>({})

  const filtered = useMemo(
    () => (filter === 'all' ? places : places.filter((p) => p.category === filter)),
    [filter]
  )

  // Open popup when activePlace changes
  useEffect(() => {
    if (activePlace && markerRefs.current[activePlace]) {
      markerRefs.current[activePlace].openPopup()
    }
  }, [activePlace])

  return (
    <MapContainer
      center={[FLAT_COORDS.lat, FLAT_COORDS.lng]}
      zoom={16}
      scrollWheelZoom={true}
      className="w-full h-full rounded-2xl"
      zoomControl={false}
      attributionControl={false}
      style={{ background: '#F6F2EB' }}
    >
      {/* CartoDB Voyager — warm, clean aesthetic */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
      />

      <MapController activePlace={activePlace} filter={filter} />

      {/* Home marker */}
      <Marker position={[FLAT_COORDS.lat, FLAT_COORDS.lng]} icon={createHomeIcon()}>
        <Popup className="custom-popup">
          <div style={{ fontFamily: 'var(--font-body), sans-serif', padding: '2px 0' }}>
            <strong style={{ fontSize: '0.85rem', color: '#1E1C18' }}>Your flat</strong>
            <br />
            <span style={{ fontSize: '0.72rem', color: '#8C7A63' }}>{process.env.NEXT_PUBLIC_ADDRESS_SHORT}</span>
          </div>
        </Popup>
      </Marker>

      {/* Place markers */}
      {filtered.map((place) => (
        <Marker
          key={place.id}
          position={[place.lat, place.lng]}
          icon={createEmojiIcon(place.emoji, place.category, activePlace === place.id)}
          ref={(ref) => {
            if (ref) markerRefs.current[place.id] = ref
          }}
          eventHandlers={{
            click: () => onMarkerClick(place.id),
          }}
        >
          <Popup className="custom-popup">
            <div style={{ fontFamily: 'var(--font-body), sans-serif', padding: '2px 0' }}>
              <strong style={{ fontSize: '0.85rem', color: '#1E1C18' }}>
                {place.emoji} {place.name}
              </strong>
              <br />
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 500,
                  color: categoryColors[place.category],
                  textTransform: 'capitalize',
                }}
              >
                {place.category}
              </span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
