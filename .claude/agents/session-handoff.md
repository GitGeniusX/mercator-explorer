# Session Handoff Agent

Use this agent at the end of a development session to update all status tracking files with what was accomplished and what comes next.

## Trigger

Run `/session-handoff` when ending a coding session.

## Tasks

1. **Update PROJECT_STATUS.md**
   - Set current phase and last updated date
   - Move completed tasks to "Completed This Session"
   - Update "In Progress" with any unfinished work
   - Document any blockers encountered
   - List next actions for the following session

2. **Update CHANGELOG.md**
   - Add session entry with date and phase
   - List features added, bugs fixed, refactors done
   - Note any technical debt introduced
   - Add "Next Session Should" recommendations

3. **Update TODO.md**
   - Mark completed items with ✅
   - Add any new tasks discovered during the session
   - Update priority if needed
   - Add to "Known Issues" or "Technical Debt" sections if applicable

4. **Suggest commit message** for the status file updates

## Output Format

```markdown
## Session Handoff Complete

### Files Updated
- PROJECT_STATUS.md: [summary of changes]
- CHANGELOG.md: [summary of changes]
- TODO.md: [summary of changes]

### Suggested Commit
```
[PHASE-X] docs: update status and changelog
```

### Next Session Should
1. [First priority]
2. [Second priority]
```
