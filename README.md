# AI GitHub Project Generator

An AI-powered web application that generates comprehensive, portfolio-worthy GitHub project ideas tailored to your skills and interests.

## Stack
- **Frontend**: Next.js 15 + TypeScript
- **UI**: Tailwind CSS + ShadCN
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Prisma
- **AI**: OpenAI API (GPT-4o)
- **Deployment**: Vercel

## Getting Started

1. Clone the repo
2. Copy `.env.example` to `.env.local` and fill in your credentials
3. Run `npm install`
4. Run `npm run db:push` to sync the database schema
5. Run `npm run dev`

## Environment Variables

```
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```