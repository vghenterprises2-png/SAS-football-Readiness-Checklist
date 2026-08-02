# SAS Personnel Evaluator — v4.x

## v4.1 — Complete Player Profile

### Added
- Administrator and coach roster rows now open the player's full profile instead of acting only as availability toggles.
- Player profile Overview with jersey, grade, height, weight, offensive positions, defensive positions, roster confirmation, and roster notes.
- Athletic Testing tab with push-ups, squats, 3-cone, 4-cone, and shuttle results.
- Player-specific Evaluation History showing criterion, rating, context, evaluator name and role, date, and notes.
- Evaluation summary counts for total ratings, Plus, Check, and Minus.
- Direct **Evaluate Player** action from the profile.
- Availability and confirmation controls remain inside the Status tab for administrators.
- Non-administrators may view player status but cannot modify it.
- Player-specific availability status history.

### Design correction
The player record is the central personnel page. Availability is one part of that record, not the purpose of the roster row. Tapping a player must lead to the player's demographics, testing information, evaluations, notes, and status.

---

## v4.0 — Shared Multi-Coach Architecture

### Major architecture change
v4.0 converts the local single-device prototype into a shared multi-coach application architecture.

### Added
- Supabase Postgres shared database schema.
- Email magic-link coach authentication.
- Automatic coach identity and role attribution.
- Real 2026 roster and nine-coach seed data.
- Permanent Available / Limited / Out roster status across devices.
- Administrator-only roster status and roster confirmation changes.
- Medical-clearance safety reminder creation.
- Shared evaluation history visible to authorized coaches.
- CSV export of the centralized evaluation history.
- Row Level Security policies separating team access and administrator writes.
- Administrator workflow for confirming, removing, or retaining the seven unresolved roster records.

### Reason for major version
This is a material backend and security overhaul rather than a screen refinement, so the project advances from v3.x to v4.0.

### Deployment dependency
GitHub Pages hosts the interface but cannot provide a secure writable database. A Supabase project must be provisioned once, the included schema and seed SQL must be run, and the project URL and publishable key must be entered in `config.js`.

### Remaining future work
- Offline synchronization for weak practice-field connectivity.
- Medical document camera capture and secure storage.
- Rich reports, trend charts, and AI coaching summaries.
- Expanded attendance and practice planning.
