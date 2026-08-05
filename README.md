# 🚆 RailGaadi — Real-Time Indian Train Tracker

> **RailGaadi (Rail Track)** is a modern, high-performance web application built for live tracking of Indian Railways trains. It integrates interactive vector maps, live weather intelligence, delay analytics, terrain elevation insights, and offline-resilient local database fallbacks.

---

## 📐 Project Architecture Overview

This section provides a complete structural overview designed for developers and AI models (such as ChatGPT, Claude, etc.) to understand the architectural flow, component relationships, data management, and external API integrations.

```
                  ┌──────────────────────────────────────────────────┐
                  │                 User Browser (UI)                │
                  │   Next.js 14 App Router (React 18 + Tailwind)    │
                  └─────────────────────────┬────────────────────────┘
                                            │
               ┌────────────────────────────┼────────────────────────────┐
               │                            │                            │
               ▼                            ▼                            ▼
    ┌────────────────────┐       ┌────────────────────┐       ┌────────────────────┐
    │   Zustand Stores   │       │  TanStack Query    │       │  MapLibre GL Map   │
    │  (Search/Fav/Train)│       │  (Server Fetcher)  │       │  (MapTiler Tiles)  │
    └────────────────────┘       └──────────┬─────────┘       └────────────────────┘
                                            │
                                            ▼
                         ┌────────────────────────────────────┐
                         │   Next.js Server API Routes        │
                         │   (/api/train, /api/weather, etc)  │
                         └──────────────────┬─────────────────┘
                                            │
        ┌───────────────────┬───────────────┼───────────────┬───────────────────┐
        ▼                   ▼               ▼               ▼                   ▼
┌───────────────┐   ┌───────────────┐ ┌───────────┐ ┌───────────────┐ ┌────────────────────┐
│ RailRadar API │   │OpenWeather API│ │ Overpass  │ │OpenTopography │ │ Local Fallback DB  │
│ (Live Status) │   │(Weather Data) │ │(OSM Rail) │ │ (Terrain/DEM) │ │  (trains-db.ts)    │
└───────────────┘   └───────────────┘ └───────────┘ └───────────────┘ └────────────────────┘
```

---

## 📁 Directory & File Architecture

```
RailGaadi/
├── app/                        # Next.js 14 App Router Pages & API Endpoints
│   ├── layout.tsx              # Root HTML Layout with Theme script, QueryProvider & Navbar
│   ├── page.tsx                # Homepage (Hero, SearchBar, Featured Trains, Quick Actions)
│   ├── favorites/              # Saved / Bookmarked Trains Page
│   │   └── page.tsx
│   ├── train/[number]/         # Live Train Detail View (MapView, Journey Timeline, Analytics)
│   │   └── page.tsx
│   ├── share/[id]/             # Shared Journey Link View
│   │   └── page.tsx
│   └── api/                    # Server-side Proxy API Routes
│       ├── train/[number]/     # Live train status & route API proxy
│       ├── search/             # Train lookup search API proxy
│       ├── weather/            # OpenWeather station weather proxy
│       ├── analytics/          # Delay calculation & punctuality analytics
│       └── terrain/            # OpenTopography elevation profile API proxy
│
├── components/                 # Core Presentational & Layout Components
│   ├── layout/
│   │   ├── Navbar.tsx          # Glassmorphism Top Navigation with Day/Dark mode & Links
│   │   └── BottomNav.tsx       # Mobile Floating Bottom Navigation Bar
│   ├── search/
│   │   └── SearchBar.tsx       # Autocomplete Search Bar with Recent History & Dropdown
│   ├── journey/
│   │   ├── JourneyCard.tsx     # Train status card (Delay badge, Speed, Origin/Destination)
│   │   └── StationTimeline.tsx # Vertical station timeline with halt & delay status
│   └── ui/                     # Reusable UI primitives (Buttons, Badges, Modals, Cards)
│
├── features/                   # Feature-specific Modular Components
│   ├── maps/
│   │   ├── MapView.tsx         # MapLibre GL 3D vector map with live train marker & route line
│   │   └── TrainMarker.tsx     # Custom animated train position icon with heading angle
│   ├── analytics/
│   │   └── DelayAnalytics.tsx  # Punctuality metrics, delay breakdown charts & speed stats
│   ├── weather/
│   │   └── WeatherCard.tsx     # Live station temperature, condition & rain probability card
│   ├── terrain/
│   │   └── TerrainProfile.tsx  # Route elevation profile & terrain profile visualization
│   └── favorites/
│       └── FavoriteButton.tsx  # Bookmark/Unbookmark button with Zustand store sync
│
├── lib/                        # Core Service Layer & API Clients
│   ├── config/
│   │   └── env.ts              # Centralized Environment Variables accessor
│   ├── railradar.ts            # RailRadar API Client with error handling & fallback
│   ├── openweather.ts          # OpenWeather API Fetcher & mock weather generator
│   ├── opentopography.ts       # OpenTopography DEM Elevation API Integration
│   ├── overpass.ts             # OpenStreetMap Overpass rail network polyline queries
│   ├── cache.ts                # In-memory LRU caching layer for API responses
│   └── trains-db.ts            # Local offline database of 500+ Indian Trains (Fallback)
│
├── store/                      # Client-Side State Management (Zustand)
│   ├── journey.ts              # Active live journey state & active train store
│   ├── search.ts               # Search history & recent queries persistence
│   └── favorites.ts            # Favorite trains persistence (LocalStorage synced)
│
├── providers/                  # React Context & Service Providers
│   └── query-provider.tsx      # TanStack (React) Query Provider with default cache config
│
├── types/                      # TypeScript Interface Definitions
│   ├── train.ts                # Station, SearchResult, LiveLocation, LiveJourney models
│   └── api.ts                  # Standard API Response wrapper types
│
├── styles/                     # Global CSS & Tailwind Custom Layers
│   └── globals.css             # Glassmorphism utilities, CSS variables & MapLibre overrides
│
├── public/                     # Static Assets & Web Manifest
│   ├── manifest.json           # Progressive Web App (PWA) manifest
│   └── icons/                  # Favicons & PWA icons
│
├── .env.local                  # Local Secret Environment Variables (Git ignored)
├── .env.example                # Blank Template for Environment Variables
├── tailwind.config.ts          # Tailwind CSS design system, dark mode & glass custom colors
├── tsconfig.json               # TypeScript path alias (@/*) configuration
└── package.json                # Project Dependencies & Scripts
```

---

## 🛠️ Technology Stack & Key Dependencies

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | **Next.js 14 (App Router)** | Full-stack React framework with SSR, Server Components & Edge API Routes. |
| **Language** | **TypeScript 5** | Strict type safety for API models, components, and state stores. |
| **Styling & UI** | **Tailwind CSS 3** + **Lucide React** | Utility-first CSS with dark mode, glassmorphism design system, and modern icons. |
| **State Management** | **Zustand 4** | Lightweight, reactive client-side store with `localStorage` persistence. |
| **Data Fetching** | **TanStack React Query 5** | Server-state caching, automatic refetching, and query deduplication. |
| **Maps & Geospatial** | **MapLibre GL 4** + **MapTiler** | Hardware-accelerated 3D vector maps, custom polylines & station markers. |
| **Geospatial Math** | **@turf/turf 7** | Spatial analysis, distance computations, and coordinate interpolation. |
| **Animations** | **Framer Motion 11** | Smooth transitions, modal spring physics, and timeline animations. |

---

## 🌐 API Integrations & Data Sources

RailGaadi aggregates data from 5 distinct data providers to deliver real-time intelligence:

| Service / API | Environment Variable | Functionality |
| :--- | :--- | :--- |
| **RailRadar API** | `RAILRADAR_API_KEY` | Live train tracking, station delays, scheduled vs actual arrival/departure. |
| **MapTiler Vector Maps** | `NEXT_PUBLIC_MAPTILER_API_KEY` | High-resolution map tile rendering for MapLibre GL. |
| **OpenWeather API** | `OPENWEATHER_API_KEY` | Live weather conditions, temperature, and rain chances at stations. |
| **OpenTopography API** | `OPENTOPOGRAPHY_API_KEY` | Terrain elevation profiles (DEM) along the train route. |
| **Overpass OSM API** | *Public Endpoint* | OpenStreetMap railway network polyline geometry queries. |

### 🔄 Fallback Architecture
If the **RailRadar API** key is missing or encounters a rate-limit (`429 Too Many Requests`), RailGaadi automatically seamlessly switches to **`lib/trains-db.ts`**—an internal offline dataset covering popular Indian Railways express trains. This guarantees that the user interface never crashes or displays blank screens.

---

## 🔑 Environment Variables Setup

Create a `.env.local` file in the root directory of `RailGaadi/`:

```env
# RailGaadi Environment Variables

# RailRadar API Key (Server-side only)
RAILRADAR_API_KEY=YOUR_RAILRADAR_API_KEY

# MapTiler API Key (Public - exposed to browser)
NEXT_PUBLIC_MAPTILER_API_KEY=YOUR_MAPTILER_API_KEY

# OpenWeather API Key (Server-side only)
OPENWEATHER_API_KEY=YOUR_OPENWEATHER_API_KEY

# OpenTopography API Key (Server-side only)
OPENTOPOGRAPHY_API_KEY=YOUR_OPENTOPOGRAPHY_API_KEY

# Upstash Redis Cache (Optional Phase 2)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

---

## 🚀 Running the Project Locally

### Prerequisites
- **Node.js**: v18.17.0 or higher
- **npm**: v9.0.0 or higher

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/railgaadi.git
   cd railgaadi/RailGaadi
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## 🌙 Day / Dark Mode Functionality

RailGaadi includes built-in Dark/Day mode toggling:
- Controlled via class `.dark` on `document.documentElement`.
- Theme toggle button with **`Sun`** and **`Moon`** icons located in the top **Navbar** (to the left of the Favorites link).
- User selection is saved in `localStorage` and automatically restored across visits without page flicker.

---

## 📝 License & Attribution
- Built with ❤️ for Indian Railways passengers and rail fans.
- Powered by Next.js, MapLibre GL, and RailRadar.
