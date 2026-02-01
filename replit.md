# Portfolio Website

## Overview

A personal portfolio web application built with React frontend and Express backend. The application allows users to create accounts, manage their professional portfolio (experience, education, skills, projects, certifications, languages), and display it publicly. Features smooth animations, a luxury light-blue theme, and session-based authentication.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: TanStack Query for server state, React Context for auth state
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Animations**: Framer Motion for scroll reveals and transitions
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **API Style**: RESTful JSON API under `/api/*` routes
- **Session Management**: express-session with connect-pg-simple for PostgreSQL session storage
- **Password Hashing**: bcryptjs

### Data Layer
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with drizzle-zod for schema validation
- **Schema Location**: `shared/schema.ts` (shared between frontend and backend)
- **Migrations**: Drizzle Kit (`db:push` command)

### Build System
- **Frontend Build**: Vite with React plugin
- **Backend Build**: esbuild for production bundling
- **Development**: Vite dev server with HMR proxied through Express

### Project Structure
```
client/           # React frontend
  src/
    components/   # UI components (shadcn/ui + custom)
    pages/        # Route components (Home, Login, Signup, Settings)
    hooks/        # Custom React hooks (auth, portfolio data)
    lib/          # Utilities (queryClient, utils)
server/           # Express backend
  index.ts        # Server entry point
  routes.ts       # API route definitions
  storage.ts      # Database access layer
  db.ts           # Database connection
shared/           # Shared code
  schema.ts       # Drizzle schema + Zod validators
  routes.ts       # API route type definitions
```

### Authentication Flow
- Session-based auth stored in PostgreSQL
- Protected routes check `req.session.userId`
- Frontend auth context wraps the app and provides login/logout/signup functions

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **Session Storage**: PostgreSQL table `session` (auto-created by connect-pg-simple)

### Key npm Packages
- **@tanstack/react-query**: Data fetching and caching
- **drizzle-orm / drizzle-kit**: Database ORM and migrations
- **framer-motion**: Animation library
- **react-scroll**: Smooth scrolling for single-page navigation
- **shadcn/ui components**: Full set of Radix UI primitives with Tailwind styling

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Secret key for session encryption (optional, has default)