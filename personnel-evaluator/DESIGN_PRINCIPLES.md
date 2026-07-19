# SAS Personnel Evaluator — Core Design Principles

## 1. Evidence, not just grades
The system is a coaching evidence system. Ratings are one form of evidence, but observations, context, evaluator role, frequency of exposure, and translation across practice periods are equally important.

## 2. Every observation has an observer
Each evaluation should preserve:
- Evaluator identity
- Staff role
- Practice context
- Position group or unit observed
- Date and activity
- Whether the evaluator is acting in a primary, secondary, or supplemental domain

## 3. Role authority and position authority are distinct
A staff member can hold broad unit authority while also having a primary position assignment.

Examples:
- Offensive Coordinator: primary authority over team offense; may also have a primary position group.
- Defensive Coordinator: primary authority over team defense; may also have a primary position group.
- Head Coach: primary authority over the total team picture, including how offense, defense, and special teams fit together.
- Position Coach: primary authority over that position group and its technical development.

These forms of authority should not be collapsed into one label.

## 4. Influence will be learned from accumulated data
Do not hard-code permanent evaluator weights too early.

The system should first collect enough data about:
- Who evaluates whom
- How often they evaluate that player or position
- The context of those observations
- Agreement and disagreement across staff
- Predictive usefulness over time
- Whether drill observations translate into group and team periods

Once the data is sufficient, the program can help determine how much influence different evaluator perspectives should carry. This is a major product idea and should remain central to future scoring-model development.

## 5. Coaches should not manage math
The interface should use understandable concepts such as:
- Primary evaluator
- Unit authority
- Position authority
- Secondary evaluator
- Supplemental observation

Any weighting or confidence model should operate behind the scenes and remain explainable.

## 6. Activity evaluation and daily player evaluation are separate
A drill screen should evaluate only the skills that belong to that drill.

Broader information belongs in a separate daily player layer:
- Core traits
- Athletic development
- General observations
- Standouts
- Daily summary

Those observations may be entered from any practice context without being forced into every drill form.

## 7. Translation across contexts matters
The system should distinguish where performance was observed:
- Individual
- Position
- Group
- Team
- Special teams
- General practice

A player may display a trait in drills without it translating into team play. The system should preserve that distinction and help coaches discuss it clearly.

## 8. AI output must sound human and coach-like
The spreadsheet and rating data can remain objective and mechanical. The generated discussion should not.

AI summaries should:
- Read like a thoughtful staff conversation
- Preserve nuance and disagreement
- Explain improvement, concern, and context
- Avoid robotic grade recitations
- Use direct, practical coaching language
- Retain the evaluator's intent and voice without becoming artificial or sentimental

The goal is not to make data emotional. The goal is to turn evidence into a meaningful coaching conversation with substance, judgment, and human understanding.

## 9. Example of desired output
Avoid:

> Player grade: 4.2. Core traits: 3.8. Athletic score: 4.0.

Prefer:

> The offensive staff has consistently seen better footwork and assignment discipline during individual and group periods. That progress is real, but it has not shown up as reliably during team work. The next step is carrying the same pace and confidence into live, moving situations.

## 10. Product identity
The evaluator is not merely a ratings application. It is a coaching evidence and conversation system that helps a staff understand:
- What was observed
- Who observed it
- Where it happened
- How often it has appeared
- Whether it translates
- How much confidence the staff should place in the conclusion
