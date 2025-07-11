# EduFlow - Learning Management System

## Overview

EduFlow is a modern learning management system built with a full-stack TypeScript architecture. The application provides an interactive educational platform where users can enroll in courses, track progress, complete quizzes, and earn achievements. The system features a React frontend with shadcn/ui components and an Express.js backend with PostgreSQL database integration via Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Build Tool**: Vite for development and build processes

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Session Management**: Connect-pg-simple for PostgreSQL session storage

### Key Design Decisions

**Monorepo Structure**: The application uses a shared folder architecture where database schemas and types are shared between client and server, ensuring type safety across the full stack.

**Component-Based UI**: The frontend leverages a comprehensive design system built on Radix UI primitives, providing accessibility and consistency.

**Type-Safe Database Layer**: Drizzle ORM provides compile-time type safety and schema validation, reducing runtime errors and improving developer experience.

## Key Components

### Database Schema
The system is built around educational entities:
- **Users**: Authentication and profile management with learning statistics
- **Courses**: Structured learning content with difficulty levels and estimated hours
- **Modules**: Individual learning units within courses (video, text, quiz content)
- **Quizzes**: Assessment tools with time limits and passing scores
- **Enrollments**: User-course relationships with progress tracking
- **Progress Tracking**: Module completion and time spent analytics
- **Achievements**: Gamification elements for user engagement

### Core Features
- **Dashboard**: Personal learning overview with statistics and current progress
- **Course Viewer**: Interactive course content consumption with video players
- **Quiz System**: Timed assessments with multiple choice questions
- **Progress Tracking**: Real-time updates of learning progress and achievements
- **Achievement System**: Badges and rewards for learning milestones

### Authentication & Authorization
The system includes user management with secure password handling, though the current implementation appears to be in development with mock user IDs for demonstration purposes.

## Data Flow

### Client-Server Communication
- REST API endpoints handle CRUD operations for all educational entities
- TanStack Query manages client-side caching and synchronization
- Form submissions use React Hook Form with Zod validation schemas
- Real-time progress updates trigger cache invalidation for immediate UI updates

### Database Operations
- Drizzle ORM handles all database interactions with type-safe queries
- Connection pooling via Neon serverless PostgreSQL adapter
- Database migrations managed through Drizzle Kit
- Shared schema definitions ensure consistency between client and server types

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: UI component primitives
- **react-hook-form**: Form handling and validation
- **zod**: Runtime type validation

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety and developer experience
- **Tailwind CSS**: Utility-first styling framework
- **ESBuild**: Production build optimization

### Replit Integration
The application includes Replit-specific tooling for development environment integration and error handling.

## Deployment Strategy

### Development Environment
- Vite development server with HMR for frontend development
- Express server with TypeScript compilation via tsx
- Database migrations handled through Drizzle Kit commands
- Environment variables for database connection configuration

### Production Build
- Frontend builds to static assets via Vite
- Backend compiles to ES modules via ESBuild
- Single Node.js process serves both API and static assets
- PostgreSQL database provisioning required via environment variables

### Environment Configuration
The application expects a `DATABASE_URL` environment variable for PostgreSQL connectivity and uses Neon's serverless PostgreSQL adapter for scalable database operations.