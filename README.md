# Food Menu System

A no-cost-friendly food menu and ordering system built with Next.js, Prisma, and PostgreSQL.

Deployed demo: https://food-menu-ten-iota.vercel.app/

## Typical use case

This project is mainly designed for family parties, shared meals, and small home gatherings.

The usual flow is:

1. The host creates or updates the menu.
2. The host opens an ordering session and shares the session link with family members.
3. Each member browses the menu and submits the dishes they want.
4. The host reviews the incoming orders and prepares the food in advance.

This makes it easier for one person to coordinate the meal while letting everyone choose what they want to eat.

## What this project includes

- Public food menu with filters for:
  - Categories such as `Hot Dish`, `Cold Dish`, `Meat`, and `Vegetarian`
  - Ingredients such as `Cabbage` and `Pork Belly`
  - Complexity
  - Cooking method such as `Stew` and `Stir Fry`
  - Spice level
- Mobile-friendly collapsible filter panel
- Lightweight user identity flow: saved user name or guest checkout
- Admin login protected by signed HttpOnly cookies
- Admin menu management
- Recipe notes per menu item
- Order session creation
- Public ordering page per session with cart flow
- Admin order dashboard with polling-based live refresh and item rejection
- Optional image URL support now, storage upload later

## Recommended stack

- App: Next.js App Router on Vercel
- Database: Neon Postgres free tier
- ORM: Prisma
- Auth: single-admin credentials stored in Vercel environment variables

This keeps the first version low-cost and simple. If you later want multiple admins, audit logs, or invite flows, the next upgrade path is Clerk or Auth0.

## Local setup

1. Install Node.js 20 or newer.
2. If you use `nvm`, run `nvm use`.
3. Install dependencies:

```bash
npm install
```

4. Start the app right away:

```bash
npm run dev
```

Without `DATABASE_URL`, the app now runs in local demo mode and stores data in `.data/local-db.json`.

Demo admin login:
- Email: `admin@example.com`
- Password: `demo123456`

## Full local setup with Postgres

1. Copy `.env.example` to `.env.local`.
2. Create a free Neon database and paste the connection string into `DATABASE_URL`.
3. Set:
   - `AUTH_SECRET`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
4. Create the database schema:

```bash
npm run db:generate
npm run db:push
```

5. Start the app:

```bash
npm run dev
```

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import the repo into Vercel.
3. Add the same environment variables from `.env.local`.
4. Create a free Neon Postgres database and set `DATABASE_URL` in Vercel.
5. After the first deploy, run:

```bash
npm run db:generate
npm run db:push
```

You can run those from your machine against the production `DATABASE_URL`, or wire them into your deployment workflow later.

## Notes

- Image upload is intentionally left as an optional next step. Right now each menu item supports an `imageUrl`.
- The admin order dashboard uses polling every 5 seconds instead of WebSockets so it remains easy to host for free.
- The authentication model is for a single trusted admin. If you need multiple admins, we should add a proper user table plus managed auth.
