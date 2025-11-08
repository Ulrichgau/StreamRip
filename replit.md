# MP3 Stream Extractor

## Overview

MP3 Stream Extractor is a web-based utility tool that extracts MP3 audio URLs from any webpage. Users paste a URL, and the application scrapes the page to find all MP3 links from various sources (audio tags, source elements, and href attributes). The extracted URLs are presented in a clean, copyable list optimized for use with command-line tools like wget.

This is a productivity-focused tool with a Material Design aesthetic, prioritizing efficiency and clarity over visual complexity. The core workflow is: input URL → extract → copy results.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18+ with TypeScript, built using Vite as the build tool and development server.

**UI Component Library**: shadcn/ui (Radix UI primitives) with Tailwind CSS for styling. This provides accessible, composable components following the "New York" style variant with neutral base colors.

**Routing**: Wouter for client-side routing (lightweight React Router alternative).

**State Management**: 
- TanStack Query (React Query) for server state and API data fetching
- Local React state for form inputs and UI interactions
- No global state management needed (stateless utility tool)

**Design System**:
- Tailwind CSS with custom design tokens defined in CSS variables
- Typography: Inter/Roboto for UI, monospace fonts for URLs and code
- Color scheme: HSL-based with support for light/dark modes
- Spacing: Tailwind's standard scale (2, 4, 6, 8 units)
- Component structure follows Material Design principles with card-based layouts

### Backend Architecture

**Framework**: Express.js with TypeScript running on Node.js.

**API Design**: REST endpoints serving JSON responses.

**Key Endpoint**:
- `POST /api/extract-mp3`: Accepts URL, returns array of MP3 results with metadata

**Web Scraping**:
- Axios for HTTP requests with custom User-Agent headers
- Cheerio for HTML parsing and DOM traversal
- Extracts MP3s from: `<audio>` tags, `<source>` elements, and `<a href>` attributes
- Deduplication logic to prevent duplicate URLs in results

**Error Handling**: 
- Zod schema validation for request payloads
- HTTP error codes (400 for validation, 500 for server errors)
- Timeout protection (10 second limit) and redirect limits (max 5)

**Rendering Strategy**: Server-side rendering via Vite in development, static file serving in production.

### Data Storage Solutions

**Current State**: No persistent database. This is a stateless application—no user data, history, or session information is stored.

**Schema Definition**: Drizzle ORM is configured with PostgreSQL dialect, but database features are not currently utilized. The schema file and migration setup exist for potential future expansion (e.g., saving extraction history, user accounts).

**Rationale**: The tool's core functionality (URL extraction) requires no data persistence. Each request is independent and ephemeral.

### External Dependencies

**NPM Packages**:
- **UI/Components**: Radix UI primitives (@radix-ui/*), shadcn/ui components
- **Styling**: Tailwind CSS, clsx, class-variance-authority, tailwind-merge
- **Data Fetching**: Axios (backend), TanStack Query (frontend)
- **Web Scraping**: Cheerio for HTML parsing
- **Validation**: Zod for runtime type checking and schema validation
- **Forms**: React Hook Form with Zod resolvers
- **Utilities**: date-fns, nanoid, lucide-react (icons)
- **Development**: Vite plugins for Replit integration, TypeScript, ESBuild

**Database Provider**: @neondatabase/serverless (configured but not actively used).

**API Integrations**: None. The application only makes outbound HTTP requests to user-provided URLs for scraping.

**Build & Deployment**:
- Vite for frontend bundling and development server
- ESBuild for backend compilation
- Environment: Designed for Replit deployment with specific Vite plugins for Replit features