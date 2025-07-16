# AI Appointment Assistant

## Overview

This is a modern full-stack web application that serves as an AI-powered appointment assistant. The application helps users schedule medical appointments through natural language conversations and integrates with Google Calendar for appointment management. Built with Express.js backend, React frontend, and PostgreSQL database using Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack React Query for server state
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js with middleware for JSON parsing and request logging
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **AI Integration**: Azure OpenAI API for natural language processing
- **External Services**: Google Calendar API for appointment scheduling

### Data Storage
- **Primary Database**: PostgreSQL via Neon Database
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema updates
- **Development Storage**: In-memory storage class for testing/development

## Key Components

### Database Schema
- **Users**: Basic user authentication and identification
- **Conversations**: Chat sessions between users and AI assistant
- **Messages**: Individual messages within conversations (user/assistant)
- **Appointments**: Scheduled appointments with calendar integration

### AI Services
- **OpenAI Service**: Handles natural language processing for appointment requests
- **Calendar Service**: Manages Google Calendar integration (mock implementation)
- **Appointment Processing**: Extracts structured data from user requests

### Chat Interface
- **Real-time Chat**: Interactive conversation interface
- **Message Types**: User and assistant messages with timestamps
- **Appointment Cards**: Visual representation of scheduled appointments
- **Typing Indicators**: Visual feedback during AI processing

### UI Component System
- **Design System**: shadcn/ui with consistent styling
- **Theme Support**: Light/dark mode with CSS custom properties
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: ARIA labels and keyboard navigation support

## Data Flow

1. **User Input**: User types appointment request in chat interface
2. **Message Creation**: Frontend creates user message and sends to backend
3. **AI Processing**: Backend processes request through OpenAI service
4. **Appointment Extraction**: AI extracts structured appointment data
5. **Calendar Integration**: System creates calendar event (simulated)
6. **Database Storage**: Appointment and messages stored in PostgreSQL
7. **Response Generation**: AI generates confirmation response
8. **UI Update**: Frontend displays new messages and appointment card

## External Dependencies

### Production Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **@tanstack/react-query**: Server state management
- **drizzle-orm**: Type-safe ORM for database operations
- **openai**: Azure OpenAI API client
- **googleapis**: Google Calendar API integration
- **express**: Web framework for API routes
- **react**: UI framework
- **tailwindcss**: Utility-first CSS framework

### Development Dependencies
- **vite**: Frontend build tool and dev server
- **typescript**: Type safety and development experience
- **drizzle-kit**: Database schema management
- **tsx**: TypeScript execution for development

### External APIs
- **Azure OpenAI**: Natural language processing and appointment extraction
- **Google Calendar API**: Calendar event creation and management
- **Neon Database**: Serverless PostgreSQL hosting

## Deployment Strategy

### Development Setup
- **Frontend**: Vite dev server with HMR (Hot Module Replacement)
- **Backend**: tsx for TypeScript execution with file watching
- **Database**: Neon Database with environment-based connection
- **Build Process**: Separate frontend (Vite) and backend (esbuild) builds

### Production Build
- **Frontend**: Static files built to `dist/public` directory
- **Backend**: Bundle with esbuild to `dist/index.js`
- **Assets**: Static file serving for production
- **Environment**: NODE_ENV-based configuration

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string
- **AZURE_OPENAI_API_KEY**: API key for OpenAI service
- **AZURE_OPENAI_ENDPOINT**: Azure OpenAI endpoint URL
- **GOOGLE_CLIENT_ID/SECRET**: OAuth credentials for Calendar API

The application follows a modern full-stack architecture with clear separation between frontend and backend concerns, type safety throughout the stack, and integration with external AI and calendar services for a complete appointment scheduling solution.