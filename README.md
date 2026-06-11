# Plan & Plate

A full-stack meal planning web app where users can browse recipes, save favorites, organize meals into collections, and plan their weekly calendar. Built as a personal portfolio project.

**Live:** [planandplate.vercel.app](https://planandplate.vercel.app)

---

## Features

- **Browse & Search** — Explore recipes by name, category, or sort by latest, trending, or most saved
- **Favorites** — Save meals to your personal favorites list
- **Collections** — Organize meals into named collections
- **Meal Calendar** — Plan your meals across the week
- **My Kitchen** — Add your own custom recipes (rate limited to 10 per day)
- **Authentication** — Email/password auth with PKCE flow, email confirmation, and password reset
- **Inactivity Logout** — Automatically signs out after 10 minutes of inactivity, even across sessions

---

## Tech Stack

| Layer           | Technology                                                                |
| --------------- | ------------------------------------------------------------------------- |
| Framework       | [Next.js 15](https://nextjs.org) (App Router)                             |
| Language        | TypeScript                                                                |
| Database & Auth | [Supabase](https://supabase.com) (PostgreSQL + Row Level Security)        |
| Styling         | [Tailwind CSS v4](https://tailwindcss.com)                                |
| UI Components   | [Radix UI](https://www.radix-ui.com) / [shadcn/ui](https://ui.shadcn.com) |
| Icons           | [Lucide React](https://lucide.dev)                                        |
| Notifications   | [Sonner](https://sonner.emilkowal.ski)                                    |
| Deployment      | [Vercel](https://vercel.com)                                              |

---

## Project Structure

```
src/
├── app/                  # Next.js App Router pages & API routes
│   ├── auth/             # Login, signup, password reset, callback
│   ├── recipes/          # Recipe browsing & detail pages
│   ├── favorites/        # Saved favorites
│   ├── collections/      # User collections
│   ├── calendar/         # Meal planning calendar
│   ├── meals/            # My Kitchen (user-created meals)
│   ├── categories/       # Browse by category
│   └── api/              # Server-side API routes
├── components/           # Shared UI components
├── lib/
│   ├── supabase/         # Database queries & auth helpers
│   └── hooks/            # Custom React hooks
```

---
