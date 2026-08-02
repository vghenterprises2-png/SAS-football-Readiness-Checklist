# SAS Personnel Evaluator v4.0 — Shared Pilot Deployment

The repository now contains the production pilot code for all five requested items:

1. Shared database visible to all authorized coaches.
2. Secure coach login using emailed magic links.
3. Permanent roster availability and confirmation status across devices.
4. Shared evaluation history and CSV export.
5. An administrator workflow for confirming the seven unresolved roster records.

## One-time cloud provisioning

GitHub Pages can host the application, but it cannot run a secure shared database. This build uses Supabase for Postgres, authentication, Row Level Security, and shared data.

1. Create a Supabase project.
2. In **SQL Editor**, run `supabase/schema.sql` and then `supabase/seed.sql`.
3. In **Authentication → URL Configuration**, set the Site URL and redirect URL to:
   `https://vghenterprises2-png.github.io/SAS-football-Readiness-Checklist/personnel-evaluator/`
4. Copy the Supabase project URL and publishable key into `config.js`.
5. Commit the completed `config.js` to `main`.

The publishable browser key is designed for client use. Access is protected by the Row Level Security policies in `schema.sql`; never place the Supabase service-role key in GitHub or browser code.

## Coach login

The nine email addresses from the 2026 Coaches worksheet are preapproved in `coach_directory`. A coach enters that email, receives a sign-in link, and is automatically linked to the correct name and role.

## Administrator access

The seed marks the Head Coach and Offensive Coordinator as administrators. Administrators can permanently change Available/Limited/Out status, add restrictions, require medical clearance, and confirm or remove unresolved roster records. Other coaches can read the shared roster and enter evaluations but cannot change administrative status.

## Shared records

Every evaluation stores the authenticated coach, role, date/time, practice, player or unit, criterion, rating, context, team level, and optional note. All authorized coaches can see the shared history, and the app can export it as CSV.

## Files

- `index.html` — application shell
- `styles.css` — mobile interface
- `app.js` — login, shared database, status, history, and export logic
- `config.js` — project connection values
- `supabase/schema.sql` — tables, functions, and security policies
- `supabase/seed.sql` — real 2026 roster and nine coaches
