# Phase Setup Agent

Use this agent when starting a new development phase to set up tracking and create a GitHub issue.

## Trigger

Run `/phase-setup <phase-number>` when beginning a new phase (e.g., `/phase-setup 1`).

## Tasks

1. **Read phase details** from `mercator-explorer-spec.md`
   - Extract all tasks for the specified phase
   - Note acceptance criteria
   - Identify dependencies on previous phases

2. **Update PROJECT_STATUS.md**
   - Set "Current Phase" to the new phase
   - Reset "Completed This Session" section
   - Populate "In Progress" with first task
   - Clear blockers (or carry over unresolved ones)
   - Set "Next Actions" from phase tasks

3. **Update TODO.md**
   - Move previous phase to completed section
   - Add all tasks for new phase with priorities
   - Add acceptance criteria as checklist

4. **Create GitHub Issue** (if gh CLI available)
   - Title: `Phase X: [Phase Name]`
   - Body: Checklist of all tasks from spec
   - Labels: `phase-X`, `in-progress`

## Output Format

```markdown
## Phase X Setup Complete

### Phase: [Phase Name]
**Goal:** [Goal from spec]
**Quality Gate:** [Quality gate criteria]

### Tasks Created
- [ ] Task 1
- [ ] Task 2
...

### GitHub Issue
Created: #[issue-number] (or "Skipped - gh CLI not available")

### Ready to Start
First task: [Task description]
```
