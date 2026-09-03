import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CEBU_CENTER, CEBU_BOUNDS, areaCoords } from "@/lib/cebuAreas";

const pinIcon = L.divIcon({
  className: "dim-pin",
  html: `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.35));">
    <path d="M12 23c5-5.5 8-9.2 8-13a8 8 0 1 0-16 0c0 3.8 3 7.5 8 13z" fill="#dc2626" stroke="#fff" stroke-width="1.5"/>
    <circle cx="12" cy="10" r="3" fill="#fff"/>
  </svg>`,
  iconSize: [30, 30],
  iconAnchor: [15, 30]
});

function ClickHandler({ onPick }) {
  useMapEvents({ click: (e) => onPick({ lat: e.latlng.lat, lng: e.latlng.lng }) });
  return null;
}

function Recenter({ center, zoom = 14 }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, zoom, { duration: 0.6 });
  }, [center?.[0], center?.[1]]);
  return null;
}

export default function LocationPicker({ area, value, onChange, className = "" }) {
  const center = useMemo(() => {
    if (value) return [value.lat, value.lng];
    if (area) {
      const c = areaCoords(area);
      return [c.lat, c.lng];
    }
    return CEBU_CENTER;
  }, [value, area]);

  // Recenter target when area changes and no pin yet.
  const recenterTarget = !value && area ? center : null;

  return (
    <div className={`relative w-full h-64 rounded-2xl overflow-hidden border border-border ${className}`}>
      <MapContainer
        center={center}
        zoom={13}
        minZoom={11.5}
        maxZoom={18}
        maxBounds={CEBU_BOUNDS}
        maxBoundsViscosity={1.0}
        scrollWheelZoom
        className="w-full h-full"
        style={{ background: "#ededed", cursor: "crosshair" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <ClickHandler onPick={onChange} />
        <Recenter center={recenterTarget} zoom={13} />
        {value && (
          <Marker
            position={[value.lat, value.lng]}
            icon={pinIcon}
            draggable
            eventHandlers={{
              dragend: (e) => {
                const p = e.target.getLatLng();
                onChange({ lat: p.lat, lng: p.lng });
              }
            }}
          />
        )}
      </MapContainer>
      <div className="absolute top-2 left-2 z-[500] bg-white/95 backdrop-blur rounded-lg px-2.5 py-1.5 pointer-events-none">
        <p className="font-body text-[10px] text-muted-foreground">
          {value ? "Drag the pin or click to fine-tune" : "Click the map to drop a pin"}
        </p>
      </div>
    </div>
  );
}