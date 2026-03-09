# AGENTS.md

## Development Workflow Rule

After completing any applicable code changes, run tests before considering the task done.

### Required test step

- If tests exist, run the relevant test command(s):
  - `npm test` for full suite
  - `npm run test:coverage` when coverage validation is needed
  - `npx vitest run <path-to-test-file>` for targeted verification during focused changes

### Applicability guidance

- Run targeted tests when a change affects a specific file/module.
- Run the full suite when changes are broad, cross-cutting, or touch shared utilities/config.
- If tests cannot be run (missing dependency, environment issue, etc.), explicitly document why.

### Completion gate

A task is not complete until:

1. Applicable tests are executed, and
2. Results are reported (pass/fail and any relevant details).
