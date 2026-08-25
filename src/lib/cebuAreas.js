// Cebu area reference data — coordinates, transparent location coverage, and friendly labels.
export const CEBU_CENTER = [10.3157, 123.9054];

// Strictly locks map view to Cebu City & Lapu-Lapu / Mactan Island only
export const CEBU_BOUNDS = [
  [10.15, 123.70],
  [10.50, 124.12]
];

export const CEBU_AREAS = [
  {
    name: "Lapu-Lapu City",
    lat: 10.3103,
    lng: 124.0144,
    provider: "MECO (Mactan Electric Company)",
    barangays: ["Basak", "Gun-ob", "Pajo", "Poblacion", "Canjulao", "Pusok", "Ibo", "Bankal", "Pajac", "Agus", "Marigondon", "Suba Masulog"],
    landmarks: ["Lapu-Lapu City Hall", "Gaisano Grand Plaza", "City Time Square", "Hoopsdome", "Super Metro", "Mactan Town Center", "Mactan Doctor's Hospital", "MactanMed", "CLIP Industrial Park"],
    coverageDescription: "Urban & commercial Lapu-Lapu City center, MV Patalinghug Highway, Sangi Rd, Basak Marigondon corridor, City Hall civic hub, and Cebu Light Industrial Park (CLIP)."
  },
  {
    name: "Mactan",
    lat: 10.2883,
    lng: 124.0144,
    provider: "MECO (Mactan Electric Company)",
    barangays: ["Brgy. Mactan", "Punta Engano", "Maribago", "Soong", "Buaya"],
    landmarks: ["Mactan Shrine", "Mactan Newtown Cyberpark", "Shangri-La Mactan", "JPark Island Resort", "Plantation Bay Resort", "Bigfoot Studios", "Mactan-Cebu Int'l Airport (MCIA)", "Marina Mall"],
    coverageDescription: "Eastern Mactan island resort strip, Mactan Newtown tech township, Punta Engano luxury peninsula, Mactan Shrine heritage area, and airport access roads."
  },
  {
    name: "Cordova",
    lat: 10.2520,
    lng: 123.9480,
    provider: "MECO (Mactan Electric Company)",
    barangays: ["Poblacion", "Ibabao", "San Miguel", "Pilipog", "Catarman", "Buagsong", "Day-as", "Bangbang", "Dapitan", "Cogon", "Alegria", "Gabi", "Suba-Basbas"],
    landmarks: ["Cordova Municipal Hall", "CCLEX Expressway Tollway Entrance", "Pilipog Bridge", "Day-as Boardwalk", "Gabi Bridge", "Pacific Grand Villas"],
    coverageDescription: "Supplies all 13 barangays of Cordova island municipality, CCLEX bridge expressway connection corridor, Gabi bridge link, and coastal fishing communities."
  },
  {
    name: "Cebu City",
    lat: 10.3157,
    lng: 123.8854,
    provider: "VECO (Visayan Electric Company)",
    barangays: ["Lahug", "Banilad", "Guadalupe", "Mabolo", "Capitol Site", "Colon", "Labangon", "Tisa", "Banawa", "Apas", "Luz", "San Nicolas"],
    landmarks: ["Cebu IT Park", "Ayala Center Cebu", "Cebu Business Park", "Provincial Capitol", "Chong Hua Hospital", "Colon St", "Carbon Market", "Fuente Osmeña", "USJR Main"],
    coverageDescription: "Metropolitan capital grid covering IT Park BPO district, Ayala business center, Capitol medical cluster, historic Colon commercial strip, and Guadalupe/Banawa residential blocks."
  },
  {
    name: "Mandaue City",
    lat: 10.3301,
    lng: 123.9392,
    provider: "VECO (Visayan Electric Company)",
    barangays: ["Subangdaku", "Tipolo", "Maguikay", "Bakilid", "Banilad Mandaue", "Umapad", "Looc Mandaue", "Paknaan", "Cabancalan"],
    landmarks: ["A.S. Fortuna St", "Oakridge Business Park", "SM City Cebu / NRA Access", "Cebu Int'l Port (CIP)", "San Miguel Brewery", "MC Briones Highway", "SM J Mall"],
    coverageDescription: "Industrial & commercial logistics hub covering A.S. Fortuna highway, North Reclamation Area, international shipping port access, and manufacturing industrial corridors."
  },
  {
    name: "Talisay City",
    lat: 10.2476,
    lng: 123.8489,
    provider: "VECO (Visayan Electric Company)",
    barangays: ["Tabunok", "Lawaan I & II", "Dumlog", "Poblacion Talisay", "Bulacao Talisay", "Mohon"],
    landmarks: ["Tabunok Flyover Commercial District", "Gaisano Grand Fiesta Mall", "South Road Properties (SRP) Coastal Highway Segment", "Talisay City Hall"],
    coverageDescription: "Southern gateway covering Tabunok market trade junction, N. Bacalso Ave highway corridor, SRP coastal expressway link, and Lawaan residential developments."
  },
  {
    name: "Consolacion",
    lat: 10.3228,
    lng: 123.9642,
    provider: "VECO (Visayan Electric Company)",
    barangays: ["Pitogo", "Poblacion Consolacion", "Tayud", "Casili", "Jugan", "Nangka"],
    landmarks: ["SM City Consolacion", "Pitogo Industrial Corridor", "Tayud Coastal Shipyard Road", "Mendero Medical Center", "Consolacion Public Market"],
    coverageDescription: "Northern suburban growth area covering Cebu North Road, SM Consolacion retail center, Mendero Hospital, and Tayud coastal maritime freight routes."
  },
  {
    name: "Liloan",
    lat: 10.4036,
    lng: 123.9886,
    provider: "VECO (Visayan Electric Company)",
    barangays: ["Yati", "Poblacion Liloan", "Tayud Liloan", "Catarman", "San Vicente", "Calero"],
    landmarks: ["Liloan Church & Plaza", "Titan Baguio / Yati Commercial Corner", "Liloan Boardwalk", "Suba Bridge Liloan"],
    coverageDescription: "Northern coastal sector powering Yati commercial junction, Liloan municipal center, craft pottery works, and coastal residential barangays."
  },
  {
    name: "Minglanilla",
    lat: 10.2447,
    lng: 123.7869,
    provider: "VECO (Visayan Electric Company)",
    barangays: ["Poblacion Minglanilla", "Calajoan", "Tulay", "Pakigne", "Tungkop", "Vito", "Linao"],
    landmarks: ["Minglanilla Church & Plaza", "Gaisano Grand Mall Minglanilla", "Antero Soriano Highway", "Tubod Flowing Waters Resort"],
    coverageDescription: "Southern residential & suburban connector spanning N. Bacalso south national highway from Talisay border to Naga boundary."
  }
];

export const INCIDENT_TYPES = [
  { key: "power_outage", label: "Power Outage", color: "#dc2626", short: "Outage" },
  { key: "exploded_transformer", label: "Exploded Transformer", color: "#ea580c", short: "Transformer" },
  { key: "scheduled_brownout", label: "Scheduled Brownout", color: "#f59e0b", short: "Brownout" },
  { key: "voltage_fluctuation", label: "Voltage Fluctuation", color: "#9333ea", short: "Voltage" },
  { key: "fallen_pole", label: "Fallen Pole", color: "#475569", short: "Pole" },
  { key: "other", label: "Other", color: "#2563eb", short: "Other" }
];

export const STATUS_OPTIONS = [
  { key: "active", label: "Active", color: "#dc2626" },
  { key: "ongoing", label: "Ongoing", color: "#ea580c" },
  { key: "scheduled", label: "Scheduled", color: "#f59e0b" },
  { key: "restored", label: "Restored", color: "#16a34a" },
  { key: "verified", label: "Verified", color: "#2563eb" }
];

export const SEVERITY_OPTIONS = [
  { key: "low", label: "Low", weight: 1 },
  { key: "medium", label: "Medium", weight: 2 },
  { key: "high", label: "High", weight: 3 },
  { key: "critical", label: "Critical", weight: 4 }
];

export const typeMeta = (key) => INCIDENT_TYPES.find((t) => t.key === key) || INCIDENT_TYPES[0];
export const statusMeta = (key) => STATUS_OPTIONS.find((s) => s.key === key) || STATUS_OPTIONS[0];
export const severityMeta = (key) => SEVERITY_OPTIONS.find((s) => s.key === key) || SEVERITY_OPTIONS[1];
export const areaCoords = (name) => CEBU_AREAS.find((a) => a.name === name) || { lat: CEBU_CENTER[0], lng: CEBU_CENTER[1] };
export const areaDetails = (name) => CEBU_AREAS.find((a) => a.name === name || a.name.toLowerCase() === (name || "").toLowerCase());