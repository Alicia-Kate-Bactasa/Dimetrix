# AGENTS.md

## Project Context

Dimetrix is an independent, standalone Vite + React application for real-time power outage tracking in Metro Cebu, Lapu-Lapu City, and Mactan Island.

## Development Workflow

- `npm run dev`: Starts the local Vite development server at http://localhost:3000.
- `npm run build`: Compiles production build to `dist/`.
- `npm run lint`: Runs ESLint checks.

## Key Directories

- `src/`: Application source code (React components, pages, map views, API client).
- `src/api/apiClient.js`: Local API client and data provider.
- `src/lib/cebuAreas.js`: Location coordinates, provider mapping (MECO / VECO), barangay lists, and landmarks.
- `vite.config.js`: Standard Vite + React configuration.
