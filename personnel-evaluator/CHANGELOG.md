# SAS Personnel Evaluator Changelog

## v3.2 — Dashboard, Roles, Reminders, and Availability Architecture

### Features added
- Coach dashboard as the default landing page.
- Large **Begin Evaluations** action.
- Evaluation flow: category → position/unit → today's activity → player queue → evaluation.
- Separate **Coach Mode** and **Administrator Mode**.
- Coach reminder inbox with open, dismiss, clear-all, and archive-all actions.
- **Remind Me** action inside an evaluation so a coach can defer a note without stopping practice.
- Administrator availability controls: Available, Limited, and Out.
- Automatic removal of Out players from active evaluation queues.
- Player profile prototype with status, reason/restriction, medical-clearance requirement, administrative note, and document placeholder.
- Automatic safety reminder when medical clearance is required.
- Administrator practice-readiness dashboard and roster-management prototype.

### Design decisions
- Volunteer coaches evaluate; administrators manage.
- Coach Mode is optimized for speed, low cognitive load, and minimal typing.
- Administrative complexity must not leak into the volunteer coach's practice workflow.
- Reminders represent unfinished thoughts, not overdue tasks.
- Dismissing a reminder removes the reminder without deleting the underlying evaluation.
- Player availability is shared system context that affects evaluation queues automatically.

### Product philosophy changes
- The system must respect the time and attention of volunteer coaches.
- The app should never make a coach feel behind.
- The AI should not create work; it should reduce the chance that important information is forgotten.
- Safety and medical-clearance items may be created automatically as reminders.
- The system should know whether a player can participate before asking a coach to evaluate that player.

### Known issues / prototype limitations
- Data is stored only in the browser session and is not connected to a database.
- Voice dictation is represented by a placeholder action.
- Document capture and upload are represented by a placeholder action.
- Permissions are demonstrated by a mode switch rather than authenticated roles.
- Attendance, availability, and evaluation completion are sample data.
- Team and position activity libraries are illustrative rather than configurable.

### Locked TBD modules
1. **Player Status Module** — availability history, injuries/illnesses, restrictions, expected return, and clearance workflow.
2. **Medical and Supporting Documents** — camera capture, attachments, clearance review, private access, and retention rules.
3. **Attendance and Practice Readiness** — expected attendance, check-in/no-show cross-reference, and an availability-aware practice roster.
4. **Reminder Intelligence** — coach reminders, AI suggestions, automatic safety reminders, and recently dismissed/undo behavior.
5. **Role and Permission System** — head coach, coordinators, volunteer position coaches, and fine-grained administrative access.

### Objectives for the next version
- Test the complete dashboard-to-evaluation path on a phone.
- Reduce taps and remove any screen that does not help the coach act immediately.
- Confirm the fastest useful rating model for evaluating an entire position group.
- Define the minimum administrator workflow required before practice.
- Review the locked TBD list and select the next implementation milestone.

---

## v3.1

### Changed
- Replaced the top completion indicators with clickable navigation tabs: Activity, Today's Evaluation, and History.
- Separated drill-specific evaluation from the broader daily player evaluation.
- Limited Reach Block evaluation to criteria that actually belong to the Reach Block activity.
- Moved Core Traits and Athletic Development into Today's Evaluation.
- Added practice-context choices: Individual, Position, Group, Team, and General Practice.
- Added separate drill notes and daily player notes.
- Added a prototype History view that preserves evaluator role and observation context.
- Added visible version labeling in the interface.

### Product reasoning
- Coaches evaluate moments and activities first; the broader player picture emerges from accumulated observations.
- Core traits and athletic observations should be available when relevant, but should not burden every drill evaluation.
- Observation context matters because performance may appear in individual work and fail to translate into team periods.
- Evaluator influence will be determined later, after enough data exists to study role, exposure, consistency, staff agreement, and predictive value.

### Known limitations
- Prototype data is fictional and stored only in the browser session.
- Evaluator profiles and influence logic are represented conceptually but are not yet calculated.
- History entries are demonstration content.

### Next objectives
- Refine evaluator role and authority profiles, including unit authority versus position authority.
- Test the v3.1 workflow on mobile during a realistic practice sequence.
- Refine the daily evaluation so it remains fast and optional rather than becoming another required form.
