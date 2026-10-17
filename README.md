# Dimetrix — Metro Cebu Power Outage Tracker

Dimetrix is a real-time power outage tracking platform built specifically for Metro Cebu, Lapu-Lapu City, and Mactan Island. It provides residents, businesses, and local emergency teams with an interactive map of active power outages, scheduled brownouts, voltage issues, and electrical hazards.

## Website

Visit and explore the live web app:
> [dimetrix.vercel.app](https://dimetrix.vercel.app)

## Tech Stack

### Frontend
![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
![Radix UI](https://img.shields.io/badge/Radix_UI-161618?style=for-the-badge&logo=radixui&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-22B5BF?style=for-the-badge&logo=chartdotjs&logoColor=white)
![Lucide Icons](https://img.shields.io/badge/Lucide_Icons-F56565?style=for-the-badge&logo=feather&logoColor=white)

### Backend
![Next.js API Routes](https://img.shields.io/badge/Next.js_API_Routes-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Auth.js](https://img.shields.io/badge/Auth.js_v5-111111?style=for-the-badge&logo=auth0&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
![Google OAuth](https://img.shields.io/badge/Google_OAuth-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Twilio SMS](https://img.shields.io/badge/Twilio_SMS_(Planned)-F22F46?style=for-the-badge&logo=twilio&logoColor=white)

### Database
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Neon Serverless](https://img.shields.io/badge/Neon_Serverless-00E599?style=for-the-badge&logo=neon&logoColor=000000)
![Prisma ORM](https://img.shields.io/badge/Prisma_ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Upstash Redis](https://img.shields.io/badge/Upstash_Redis_(Planned)-FF4438?style=for-the-badge&logo=redis&logoColor=white)

### Tools
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![OpenStreetMap](https://img.shields.io/badge/OpenStreetMap-7EBC6F?style=for-the-badge&logo=openstreetmap&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)

## System Overview

Metro Cebu experiences frequent power interruptions ranging from emergency equipment trips and transformer explosions to scheduled maintenance. Before Dimetrix, residents had to rely on fragmented social media posts, busy customer hotline numbers, or word-of-mouth to find out why the power went out and when it might return.

Dimetrix unifies outage information into a single map and dashboard. Community members can report an outage in seconds by selecting their barangay or picking their exact location on the map. Other residents nearby can confirm the report, increasing confidence in the data. An administrative dashboard allows moderators to verify reports, mark restored areas, and keep the information accurate and up to date.

### Covered Areas & Utility Providers
- Visayan Electric Company (VECO): Cebu City, Mandaue City, Talisay City, Consolacion, Liloan, Minglanilla
- Mactan Electric Company (MECO): Lapu-Lapu City, Mactan Island, Cordova

## Key Features & Integrations

### Key Features
- Live Interactive Outage Map: Visualizes active, ongoing, scheduled, and restored power incidents with color-coded severity markers bounded to Metro Cebu.
- Incident Reporting: Simple form for users to report outages, blown transformers, scheduled brownouts, voltage fluctuations, or fallen poles with optional coordinates and affected household estimates.
- Community Confirmation & Flags: Neighbors can confirm an outage with one click to boost report credibility, or flag false or spam reports for admin moderation.
- Spam Detection & Duplicate Prevention: Automatic checks prevent repetitive reports in the same barangay within short time windows.
- Area & Provider Filtering: Quick filters to view reports by utility provider (VECO / MECO), city, or specific barangay.
- Outage Statistics & Charts: Visual breakdown of outages by area, severity level, incident type, and recovery progress.
- Admin Moderation: Protected dashboard for administrators to verify community reports, change incident statuses, purge restored entries, and manage users.

### Integrations
- OpenStreetMap & Leaflet: Open-source GIS tiles and coordinates without proprietary API limits.
- Neon Serverless PostgreSQL: Cloud SQL database with connection pooling for rapid serverless queries.
- Auth.js v5: Secure session handling, email/password login, and Google OAuth sign-in.
- Planned Integrations:
  - Twilio SMS / WhatsApp: Automated text notifications for urgent power outages in a user's home barangay.
  - Utility Announcement Scraper: Automated ingestion of scheduled brownout advisories from official power company notices.
  - Upstash Redis: High-speed caching for map data and distributed rate limiting.

## Repository Structure

```text
dimetrix/
├── prisma/
│   ├── schema.prisma          # Database schema for users, accounts, and incidents
│   └── seed.mjs               # Seed script with sample incidents and test accounts
├── public/
│   └── dimetrixLogo.svg       # Brand logo asset
├── screenshots/               # Application preview images for documentation
├── src/
│   ├── api/
│   │   └── apiClient.js       # Client-side API fetch wrapper
│   ├── app/
│   │   ├── (auth)/            # Auth routes: login, register, forgot-password, reset-password
│   │   ├── (dashboard)/       # App routes: map dashboard, report incident, analytics, admin
│   │   ├── api/
│   │   │   ├── auth/          # Auth.js NextAuth handler
│   │   │   ├── incidents/     # Incident CRUD, confirm, flag, and seed endpoints
│   │   │   ├── register/      # Account registration endpoint
│   │   │   └── user/          # User profile and password management endpoints
│   │   ├── globals.css        # Global CSS and Tailwind theme tokens
│   │   ├── layout.jsx         # Root HTML layout and providers wrapper
│   │   └── page.jsx           # Public landing page
│   ├── components/
│   │   ├── ui/                # Reusable UI primitives (buttons, dialogs, inputs, selects)
│   │   ├── pages/             # Page view components (Home, Login, Report, Analytics, Admin)
│   │   ├── DashboardShell.jsx # Common layout shell for logged-in pages
│   │   ├── LocationPicker.jsx # Interactive map coordinates picker for incident reporting
│   │   ├── MapView.jsx        # Interactive Leaflet map with incident markers
│   │   ├── ReportModal.jsx    # Quick outage report popup modal
│   │   └── StatCard.jsx       # Reusable KPI and count card
│   ├── hooks/                 # Custom React hooks (use-mobile, use-size)
│   ├── lib/
│   │   ├── auth.js            # Auth.js server configuration and helpers
│   │   ├── cebuAreas.js       # Metro Cebu coordinates, barangays, and provider mapping
│   │   ├── duplicateDetection.js # Heuristics to detect repetitive or spam incident reports
│   │   ├── prisma.js          # Prisma client singleton
│   │   ├── rate-limit.js      # In-memory API rate limiter
│   │   └── validations.js     # Zod validation schemas for forms and API requests
│   └── middleware.js          # Edge route protection and session redirection
├── package.json               # Dependencies and build scripts
└── tailwind.config.js         # Tailwind CSS styling and theme configuration
```

## Future Plans & Projects

- Real-Time Live Map Updates: Connect live updates using WebSockets or Server-Sent Events (SSE) so users see new outages and status changes immediately without refreshing.
- SMS & Push Alerts: Let residents subscribe to their home or business barangay to receive instant SMS (via Twilio) or browser notifications when an outage is reported.
- Utility Scraper Service: Automatically monitor and import scheduled maintenance brownout announcements directly from VECO and MECO public feeds.
- Offline-First PWA: Progressive Web App support enabling users to view recent outage maps and queue reports while cellular connectivity is weak or down.
- Restoration Time Estimator: Calculate historical averages for restoration times by incident type and location to give residents better repair estimates.

## Screenshots

<table>
  <tr>
    <td width="50%" align="center"><strong>Landing Page</strong><br><br><img src="screenshots/landingPage.png" alt="Dimetrix landing page" width="100%"></td>
    <td width="50%" align="center"><strong>Sign In</strong><br><br><img src="screenshots/login.png" alt="Dimetrix sign-in page" width="100%"></td>
  </tr>
  <tr>
    <td width="50%" align="center"><strong>Sign Up</strong><br><br><img src="screenshots/signUp.png" alt="Dimetrix sign-up page" width="100%"></td>
    <td width="50%" align="center"><strong>User Dashboard</strong><br><br><img src="screenshots/mainUserDashboard.png" alt="Dimetrix user dashboard" width="100%"></td>
  </tr>
  <tr>
    <td width="50%" align="center"><strong>Submit an Outage Report</strong><br><br><img src="screenshots/mainUserDashboardReport.png" alt="Outage reporting interface" width="100%"></td>
    <td width="50%" align="center"><strong>Admin Dashboard</strong><br><br><img src="screenshots/mainAdminDashboard.png" alt="Dimetrix admin dashboard" width="100%"></td>
  </tr>
  <tr>
    <td width="50%" align="center"><strong>Analytics</strong><br><br><img src="screenshots/mainAdminAnalytics.png" alt="Dimetrix analytics dashboard" width="100%"></td>
    <td width="50%" align="center"><strong>Management</strong><br><br><img src="screenshots/mainAdminManagement.png" alt="Dimetrix admin management page" width="100%"></td>
  </tr>
</table>

## Credits

- Map data & tiles: [OpenStreetMap](https://www.openstreetmap.org/)
- Icons: [Lucide Icons](https://lucide.dev/)
