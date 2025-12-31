# Todo List: Fix npm start Cleanup Issue

## Pre-Implementation
- [x] Create branch `6-fix-npm-start-cleanup`
- [x] Create issue folder structure
- [x] Write plan.md
- [x] Write todo.md
- [ ] Get user approval on approach

## Implementation
- [ ] Update package.json start script with concurrently flags
- [ ] Optionally add cleanup script for manual process killing

## Testing
- [ ] Test: Run `npm start` and verify all three services start
- [ ] Test: Verify Eleventy is accessible at http://localhost:8080
- [ ] Test: Verify writing prompts server at http://localhost:3001
- [ ] Test: Verify PostCSS watcher output in console
- [ ] Test: Press Ctrl-C and verify all processes terminate
- [ ] Test: Check port 3001 is free with `lsof -i :3001`
- [ ] Test: Check port 8080 is free with `lsof -i :8080`
- [ ] Test: Verify no orphaned node processes with `ps aux | grep node`
- [ ] Test: Run `npm start` again to ensure clean restart works

## Documentation
- [ ] Update implementation-summary.md with details of fix
- [ ] Document any changes to dev workflow (if applicable)

## Git & PR
- [ ] Stage all changes
- [ ] Commit with descriptive message
- [ ] Push branch to remote
- [ ] Create pull request with summary

## Notes
- Decided on using `--kill-others` vs `--kill-others-on-fail` (pending user input)
- May add optional cleanup script for manual process management
