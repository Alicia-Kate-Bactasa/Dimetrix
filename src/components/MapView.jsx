import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import { Compass } from "lucide-react";
import "leaflet/dist/leaflet.css";
import { CEBU_CENTER, CEBU_BOUNDS, typeMeta, statusMeta, areaDetails } from "@/lib/cebuAreas";
import { TypeBadge, StatusBadge } from "@/components/IncidentBadge";

// Fly the map to the selected incident whenever it changes.
function FlyController({ selected }) {
  const map = useMap();
  useEffect(() => {
    if (selected) {
      const lat = selected.latitude ?? selected.coordinates?.[0];
      const lng = selected.longitude ?? selected.coordinates?.[1];
      if (lat != null && lng != null && !isNaN(lat) && !isNaN(lng)) {
        map.flyTo([lat, lng], Math.max(map.getZoom(), 13), {
          duration: 0.8
        });
      }
    }
  }, [selected, map]);
  return null;
}

function ResetButton() {
  const map = useMap();
  return (
    <button
      onClick={() => map.flyTo(CEBU_CENTER, 12, { duration: 0.6 })}
      className="absolute top-4 right-4 z-[500] bg-card/90 backdrop-blur px-3 py-1.5 rounded-xl border border-border shadow-md font-hero font-bold text-xs text-foreground hover:bg-muted transition-colors flex items-center gap-1.5"
      title="Reset view to Cebu"
    >
      <Compass className="w-3.5 h-3.5 text-primary" />
      <span>Center Cebu</span>
    </button>
  );
}

export default function MapView({ incidents = [], selected, onSelect, className = "" }) {
  return (
    <div className={`relative w-full h-full ${className}`}>
      <MapContainer
        center={CEBU_CENTER}
        zoom={12}
        minZoom={11.5}
        maxZoom={18}
        maxBounds={CEBU_BOUNDS}
        maxBoundsViscosity={1.0}
        zoomControl={false}
        scrollWheelZoom
        className="w-full h-full z-0"
        style={{ background: "#ededed" }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap &copy; CARTO'
        />
        <FlyController selected={selected} />
        <ResetButton />
        {incidents.map((inc) => {
          const lat = inc.latitude ?? inc.coordinates?.[0];
          const lng = inc.longitude ?? inc.coordinates?.[1];
          if (lat == null || lng == null || isNaN(lat) || isNaN(lng)) return null;

          const t = typeMeta(inc.type);
          const s = statusMeta(inc.status);
          const isSel = selected?.id === inc.id;
          const radius = 6 + (inc.severity === "critical" ? 8 : inc.severity === "high" ? 5 : inc.severity === "medium" ? 2 : 0);
          const dimmed = inc.status === "restored";
          return (
            <CircleMarker
              key={inc.id}
              center={[lat, lng]}
              radius={radius}
              pathOptions={{
                color: dimmed ? "#9ca3af" : t.color,
                weight: isSel ? 4 : 2,
                fillColor: dimmed ? "#cbd5e1" : t.color,
                fillOpacity: dimmed ? 0.25 : 0.55
              }}
              eventHandlers={{ click: () => onSelect(inc) }}
            >
              <Popup className="dim-popup" closeButton>
                <div className="min-w-[220px] max-w-[260px] space-y-1.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <TypeBadge type={inc.type} />
                    <StatusBadge status={inc.status} />
                  </div>
                  <p className="font-hero font-bold text-sm leading-tight text-white">{inc.title}</p>
                  <div className="flex items-center justify-between gap-1 pt-1 border-t border-white/10">
                    <p className="text-[11px] font-hero font-bold text-primary">{inc.area}</p>
                    {areaDetails(inc.area)?.provider && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white/80 font-body">
                        {areaDetails(inc.area).provider.split(" ")[0]} Grid
                      </span>
                    )}
                  </div>
                  {inc.description && (
                    <p className="text-[11px] text-white/80 leading-snug font-body">{inc.description}</p>
                  )}
                  {areaDetails(inc.area)?.coverageDescription && (
                    <p className="text-[10px] text-white/60 leading-tight italic font-body pt-1 border-t border-white/10">
                      Covers: {areaDetails(inc.area).coverageDescription}
                    </p>
                  )}
                  <p className="text-[10px] text-white/40 pt-1 font-body">
                    {inc.affected_households ? `${inc.affected_households} homes affected · ` : ""}
                    {inc.verified ? "Verified" : "Community-reported"}
                  </p>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[500] bg-white/95 backdrop-blur rounded-2xl border border-border shadow-lg px-3.5 py-3 space-y-1.5 pointer-events-none">
        <p className="font-heading text-[11px] tracking-widest text-foreground/70 uppercase">Legend</p>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
          {["power_outage", "exploded_transformer", "scheduled_brownout", "voltage_fluctuation", "fallen_pole", "restored"].map((k) => {
            const m = k === "restored" ? { color: "#9ca3af", short: "Restored" } : typeMeta(k);
            return (
              <span key={k} className="flex items-center gap-1.5 text-[10px] font-body text-foreground/70">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                {m.short}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}