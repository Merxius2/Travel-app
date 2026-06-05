# Location Tracker

A modern location-tracking MVP built with Next.js, TypeScript, and Tailwind CSS. Features a liquid glass / glassmorphism design with local persistence via browser LocalStorage.

## Features

- **Dashboard** — Responsive grid of location quick-check buttons
- **Add Location** — Glassmorphic modal with name, description, color picker, and icon selection
- **Check-ins** — Tap any location to register a visit with ISO timestamp and ripple feedback
- **Reports** — Chronological timeline grouped by day with per-location visit statistics
- **Settings** — Data export, clear all data, and placeholder for future cloud sync

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS 4
- Lucide React icons
- LocalStorage for data persistence
