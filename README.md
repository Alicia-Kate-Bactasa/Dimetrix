# Dimetrix — Metro Cebu & Lapu-Lapu Power Outage Tracker

**Dimetrix** is an independent, real-time power outage tracking and grid monitoring platform specifically built for **Metro Cebu, Lapu-Lapu City, and Mactan Island**.

---

## Key Features

- **Live Interactive Grid Map**: Powered by React-Leaflet with custom incident pins for active power outages, exploded transformers, scheduled brownouts, voltage fluctuations, and fallen poles.
- **Strict Metro Boundary Locking**: Viewport is strictly constrained to Cebu City, Mandaue City, Lapu-Lapu City, Mactan Island, Cordova, Talisay City, Consolacion, Liloan, and Minglanilla (`CEBU_BOUNDS`).
- **Transparent Location & Grid Coverage**: 
  - **Grid Provider Indexing**: Clear distinction between **MECO** (*Mactan Electric Company*) for Lapu-Lapu City, Mactan Island, and Cordova vs. **VECO** (*Visayan Electric Company*) for Cebu City and Metro Cebu mainland.
  - **Barangay & Landmark Breakdown**: Real-time coverage callouts showing covered barangays, hospital hubs, BPO parks, and major highways when filtering locations.
- **Verified Community Incident Reporting**: Interactive modal allowing users to report outages, pin precise map coordinates, attach descriptions, select severity levels, and undergo identity verification.
- **Power Grid Analytics**: Real-time outage statistics, severity breakdown charts, resolution status tracking, and provider metrics powered by Recharts.

---

## Geographical Coverage & Utility Providers

| Region / City | Utility Provider | Key Coverage & Landmarks |
| :--- | :--- | :--- |
| **Lapu-Lapu City** | **MECO** (Mactan Electric Co.) | Basak, Gun-ob, Pajo, Poblacion, Canjulao, Pusok, City Hall, Gaisano Grand Plaza, CLIP Industrial Park |
| **Mactan Island** | **MECO** (Mactan Electric Co.) | Brgy. Mactan, Punta Engano, Maribago, Mactan Newtown, MCIA Airport, JPark & Shangri-La Resorts |
| **Cordova** | **MECO** (Mactan Electric Co.) | All 13 Barangays, CCLEX Tollway Entrance, Pilipog Bridge, Day-as Boardwalk, Gabi Bridge |
| **Cebu City** | **VECO** (Visayan Electric Co.) | Lahug, Banilad, Guadalupe, Mabolo, Cebu IT Park, Ayala Center, Provincial Capitol, Chong Hua |
| **Mandaue City** | **VECO** (Visayan Electric Co.) | Subangdaku, Tipolo, Maguikay, A.S. Fortuna, Oakridge, SM City NRA, Cebu Int'l Port |
| **Talisay City** | **VECO** (Visayan Electric Co.) | Tabunok, Lawaan, Dumlog, SRP Coastal Highway, Gaisano Grand Fiesta Mall |
| **Consolacion** | **VECO** (Visayan Electric Co.) | Pitogo, Tayud, SM City Consolacion, Mendero Medical Center, Tayud Shipyards |
| **Liloan** | **VECO** (Visayan Electric Co.) | Yati, Poblacion Liloan, Liloan Boardwalk, Suba Bridge |
| **Minglanilla** | **VECO** (Visayan Electric Co.) | Poblacion, Calajoan, Tulay, N. Bacalso Highway, Tubod Flowing Waters |

---

## 📜 Attributions & Licenses

- **Map Tiles**: Powered by [CARTO](https://carto.com/) (`&copy; OpenStreetMap &copy; CARTO`).
- **Icons**: [Lucide Icons](https://lucide.dev/) (MIT License).
