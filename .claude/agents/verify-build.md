# Verify Build Agent

Use this agent to run all verification checks and provide a summary of project health.

## Trigger

Run `/verify-build` to check project health, or automatically before commits.

## Tasks

1. **Run TypeScript check**
   ```bash
   npm run typecheck
   ```
   - Report any type errors with file:line references
   - Summarize error categories if multiple

2. **Run tests**
   ```bash
   npm run test:run
   ```
   - Report pass/fail count
   - List any failing tests with descriptions
   - Note test coverage if available

3. **Run production build**
   ```bash
   npm run build
   ```
   - Report success/failure
   - Note bundle sizes (JS, CSS)
   - Flag any build warnings

4. **Verify dev server** (optional, quick check)
   - Start dev server briefly
   - Confirm it responds on expected port

## Output Format

```markdown
## Build Verification Results

| Check | Status | Details |
|-------|--------|---------|
| TypeScript | ✅/❌ | [error count or "No errors"] |
| Tests | ✅/❌ | [X/Y passed] |
| Build | ✅/❌ | [bundle size or error] |
| Dev Server | ✅/❌ | [port or error] |

### Issues Found
- [List any problems that need attention]

### Bundle Sizes
- JS: XX KB (gzip: XX KB)
- CSS: XX KB (gzip: XX KB)

### Recommendation
[Ready to commit / Fix issues first]
```
