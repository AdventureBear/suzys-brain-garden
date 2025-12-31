# Plan: Fix npm start Cleanup Issue

## Problem Statement

When running `npm start`, three concurrent processes are started:
1. Eleventy server (port 8080)
2. PostCSS watcher (compiles Tailwind CSS)
3. Writing prompts server (port 3001)

However, when the user presses Ctrl-C to stop the development server, only the Eleventy server stops properly. The PostCSS watcher and writing prompts server continue running in the background, causing:
- Port 3001 remains occupied
- Invisible background processes
- Testing difficulties
- Need to manually kill processes

## Root Cause Analysis

The issue is in package.json line 6:
```json
"start": "concurrently \"eleventy --serve\" \"postcss styles/tailwind.css --o _tmp/style.css --watch\" \"node tools/writing-prompts/server.js\""
```

`concurrently` is being used to run multiple commands, but the default behavior doesn't properly propagate SIGINT (Ctrl-C) signals to all child processes.

## Solution Options

### Option 1: Add kill-others-on-fail flag (Recommended)
Use concurrently's `--kill-others` flag to ensure all processes terminate when any one terminates.

**Pros:**
- Simple one-line fix
- Built-in concurrently feature
- Clean shutdown of all processes
- No additional dependencies

**Cons:**
- All processes die if any one fails (but this is actually desired behavior)

### Option 2: Custom cleanup script
Create a Node.js script that manages child processes and cleanup.

**Pros:**
- More control over shutdown behavior
- Can add custom cleanup logic

**Cons:**
- More complex
- Additional file to maintain
- Overkill for this use case

### Option 3: Add process management with PM2
Use PM2 for development process management.

**Pros:**
- Professional process management
- Logging and monitoring

**Cons:**
- Heavy dependency for simple use case
- Adds complexity to dev workflow

## Recommended Approach

**Use Option 1**: Modify the npm start script to use concurrently's built-in flags:

```json
"start": "concurrently --kill-others --names \"11ty,css,prompts\" \"eleventy --serve\" \"postcss styles/tailwind.css --o _tmp/style.css --watch\" \"node tools/writing-prompts/server.js\""
```

Flags explained:
- `--kill-others`: When any process exits, kill all other processes
- `--names "11ty,css,prompts"`: Add readable names to console output for easier debugging

Alternative with different behavior:
```json
"start": "concurrently --kill-others-on-fail --names \"11ty,css,prompts\" \"eleventy --serve\" \"postcss styles/tailwind.css --o _tmp/style.css --watch\" \"node tools/writing-prompts/server.js\""
```

Flags explained:
- `--kill-others-on-fail`: Only kill others if a process exits with non-zero code (failure)
- Allows manual Ctrl-C shutdown of all processes while keeping them running if one crashes

## Implementation Steps

1. Update package.json start script with appropriate concurrently flags
2. Test that Ctrl-C properly kills all processes
3. Verify no orphaned processes remain (check with `lsof -i :3001` and `lsof -i :8080`)
4. Test that all three services start correctly
5. Document the change in implementation-summary.md

## Testing Plan

1. Run `npm start`
2. Verify all three services are running:
   - http://localhost:8080 (Eleventy)
   - http://localhost:3001 (Writing prompts)
   - CSS watcher shows in console
3. Press Ctrl-C
4. Verify all processes terminate:
   - `lsof -i :3001` should show nothing
   - `lsof -i :8080` should show nothing
   - No orphaned node processes (`ps aux | grep node`)
5. Run `npm start` again to ensure clean restart

## Edge Cases to Consider

- What if one process crashes? (--kill-others will stop all, which is fine)
- What if ports are already in use? (This is a separate issue, out of scope)
- Different behavior on Windows vs Mac/Linux? (concurrently handles cross-platform)

## Alternative: Create Cleanup Command

As a bonus, we could add a cleanup command to manually kill orphaned processes:

```json
"cleanup": "lsof -ti:3001 | xargs kill -9 2>/dev/null || true && lsof -ti:8080 | xargs kill -9 2>/dev/null || true"
```

This provides a manual way to clean up if needed, but the main fix should prevent the need for this.
