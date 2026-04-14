# ai-review-playground

UI prototype for [ai-review-project](https://github.com/your-org/ai-review-project).

Built for v0.dev UI iteration — **no database, no real AI calls.**
All data comes from `apps/web/lib/dummy-data.ts`.

## What's included

- Full Next.js 14 app with Turborepo monorepo structure
- 3 dummy documents: Tutorial, Commentary (Analysis), Mixed
- Content-type-aware rendering (Tutorial / Analysis / Mixed modes)
- All components from production app — layout, nav, document detail, library, search
- Stubbed API routes — same shape as production, no real logic

## Getting started

```bash
npm install
cd apps/web && npm run dev
```

Visit: http://localhost:3000

## Sample routes

- `/` — Home with document list
- `/library` — Library view
- `/documents/doc_tutorial_001` — Tutorial document
- `/documents/doc_analysis_001` — Analysis/Commentary document
- `/documents/doc_mixed_001` — Mixed document
- `/search` — Search (client-side filter over dummy data)

## Connecting to v0.dev

1. Push this repo to GitHub
2. Go to v0.dev → Import from GitHub
3. Point at `apps/web/app/documents/[id]/page.tsx` for document detail UI
4. Point at `apps/web/app/library/page.tsx` for library UI

## Dummy data

Edit `apps/web/lib/dummy-data.ts` to add more documents or change content.
Schema mirrors production Prisma models exactly.

## Not included (intentional)

- Prisma / DB connection (stubbed)
- Real YouTube ingestion
- Real AI analysis calls
- Real vector search
- Authentication
