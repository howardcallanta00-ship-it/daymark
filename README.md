# Daymark — Tasks for Today

A responsive four-page task management system built with Express, EJS, and MySQL. Daymark's Today page deliberately shows only tasks scheduled for the current date, while Task list shows every database record ordered by date.

## Features

- **Today (`/`)** — queries `task_date = CURDATE()` and shows only today's tasks, completion progress, and status counts.
- **All tasks (`/tasks`)** — retrieves every task ordered by date, groups records by day, and adds browser-side search and status filters.
- **Profile (`/profile`)** — displays the single demo user from the `users` table.
- **About (`/about`)** — explains the product and identifies OpenAI Codex as the developer.
- Responsive, keyboard-friendly interface with clear empty and error states.
- MVC separation across routes, controllers, models, and EJS views.

## Project structure

```text
tasks-for-today-system/
├── config/          # MySQL connection pool
├── controllers/     # Page request handling and view data
├── database/        # Exact schema and repeatable sample seed
├── models/          # TaskModel and UserModel database queries
├── public/          # Styles and browser interactions
├── routes/          # URL definitions
├── scripts/         # Database initialization helper
├── tests/           # Model and route checks
├── views/           # EJS pages and reusable partials
└── app.js            # Express application entry point
```

## Requirements

- Node.js 20 or newer
- MySQL 8 or a compatible MySQL service

## Setup

1. Install the packages:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and enter your MySQL credentials.

   Windows PowerShell:

   ```powershell
   Copy-Item .env.example .env
   ```

3. Create the database, tables, and sample records:

   ```bash
   npm run db:init
   ```

   This command is repeatable. It resets only the sample rows inside `tasks_today_db`, then loads eight tasks over three dates and exactly one user. If you prefer the MySQL client, run `database/schema.sql` followed by `database/seed.sql`.

4. Start the application:

   ```bash
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000).

## Quick preview without MySQL

To review the interface before configuring a database, run:

```bash
npm run preview
```

Preview mode uses an in-memory copy of the same sample records. Normal `npm start` always uses `TaskModel`, `UserModel`, and MySQL.

## Verification

Run the automated model and route checks:

```bash
npm test
```

The tests verify the `CURDATE()` filter, all-task date ordering, single-user lookup, all four required pages, today-only page behavior, and the 404 response. Static syntax checks are also available with `npm run check`.

## Deployment notes

Set the same environment variables from `.env.example` on the hosting platform. A managed MySQL connection can be supplied either with the individual `DB_*` settings or a single `DATABASE_URL`. Set `DB_SSL=true` when the provider requires TLS, keep `DEMO_MODE=false`, initialize the database once, and start the service with `npm start`.

## Database records

The seed always creates:

- 2 tasks for yesterday
- 4 tasks for today
- 2 tasks for tomorrow
- 1 demo user: Alex Morgan (`alex.morgan@example.com`)

Because the seed uses `CURDATE()`, today's page remains valid whenever the database is initialized.
