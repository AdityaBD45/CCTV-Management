SecureSight CCTV Monitoring Dashboard
A modern, real-time CCTV incident monitoring and management system built with Next.js, featuring an intuitive dashboard for security personnel to monitor, analyze, and resolve security incidents.

🚀 Features
Core Functionality
Real-time Incident Monitoring - Live dashboard displaying unresolved security incidents

Multi-Camera Support - Monitor incidents across 4 CCTV cameras simultaneously

Incident Resolution - One-click incident resolution with optimistic UI updates

Interactive Video Player - Mock video playback with timeline controls and camera switching

Dual-Tab System - Toggle between unresolved and resolved incidents



Technical Highlights
Modern Tech Stack - Next.js 15 App Router, React 18, Tailwind CSS

Database Integration - Prisma ORM with Supabase PostgreSQL

RESTful API - Complete CRUD operations for incidents and cameras

Optimistic Updates - Instant UI responses with backend synchronization

SSR/Hydration Safe - Proper server-side rendering without hydration errors




🛠 Installation & Setup

Prerequisites
Node.js 18+

npm or yarn package manager

Git

Supabase account



Quick Start
# Clone the repository
git clone https://github.com/yourusername/securesight-dashboard.git
cd securesight-dashboard

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Initialize database
npx prisma generate
npx prisma db push

# Seed database with sample data
npm run seed

# Start development server
npm run dev


Environment Configuration
Create a .env.local file in the root directory:
# Supabase Configuration
DIRECT_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"
DATABASE_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"(this is from pool)

# Next.js
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"


