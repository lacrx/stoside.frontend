---
name: visual-verify
description: "Visual verification of frontend changes using Playwright MCP (headless) or Playwriter (your Chrome). Use after modifying components, pages, layout, or CSS."
alwaysApply: false
---

# Visual Verification

Use browser MCP tools to verify frontend changes visually. Not every change needs this. CSS, layout, component rendering, and anything with visual output does. Type-only refactors, GraphQL query changes, build config, and utility functions do not.

## Which Tool

**Playwright MCP** (`mcp__playwright__*`): default choice. Headless, autonomous, rich tool surface (navigate, snapshot, screenshot, click, type, resize). Use for all standard verification.

**Playwriter** (`mcp__playwriter__*`): use when you need the user's real Chrome session (authenticated pages, cookies, extensions) or when the user says to use their browser. Single `execute` tool that runs Playwright code.

## Dev Server

Before browser interaction, confirm the dev server is running:

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/
```

If not running (non-200 or connection refused):

```bash
cd /home/thomas/repos/stoside.frontend && npm run dev &
```

Gatsby dev startup takes 15-30 seconds. Poll with `curl` every 3 seconds until 200.

After file changes, wait 5 seconds for Gatsby HMR before screenshotting. For large changes touching many files, wait longer.

## Snapshot vs Screenshot

**Prefer `browser_snapshot`** (DOM accessibility tree, structured text, cheap) for:
- Verifying elements exist, text content, page structure
- Checking interactive state (disabled buttons, selected tabs)
- Confirming navigation worked

**Use `browser_screenshot`** (pixel image, expensive) only for:
- Visual spacing, alignment, padding, margins
- Color, typography, visual hierarchy
- Image/poster rendering
- Chart and map visualization rendering (D3, Observable Plot, MapLibre, deck.gl)
- Overall page composition

## Verification Workflow

1. Save file(s)
2. Wait 5 seconds for HMR
3. `browser_navigate` to `http://localhost:8000/<path>`
4. `browser_snapshot` to confirm page loaded and elements exist
5. If change is visual: one `browser_screenshot`
6. Evaluate. If wrong, fix code and repeat from step 1
7. If layout change: test responsive (see below)

## Page Routes

- `/` (home)
- `/about/`
- `/articles/` (list) and `/articles/<slug>/` (individual)
- `/data/` (dashboards)
- `/events/`
- `/report/`
- `/sign-in/`

## Responsive Testing

Only when the change touches layout, grid, flexbox, or elements near breakpoint boundaries.

Two breakpoints: 600px (nav collapse, mobile layout) and 800px (dashboard split-pane).

```
browser_resize to 375x812    # mobile
browser_screenshot
browser_resize to 800x1024   # tablet
browser_screenshot
browser_resize to 1280x720   # restore desktop
```

## Maps and Visualizations

Dashboard and article pages contain MapLibre GL maps, deck.gl overlays, and Observable Plot charts. These render asynchronously.

1. `browser_snapshot` to check for loading indicators
2. Wait up to 10 seconds for map tiles and data
3. Then `browser_screenshot`

Headless Chrome renders WebGL via software (SwiftShader). Expect 5-10 second load times for map pages. Blank canvas = headless rendering issue, not a code bug.

## No Dark Mode

This project uses a light-only theme. Do not test for dark mode.

## Token Budget

- One screenshot per logical verification point, not per CSS property
- Use snapshots when you only need structure or text content
- Don't screenshot pages unrelated to your change
- If a component appears on multiple pages, pick the most representative one
- For iterative CSS tweaks: batch 2-3 changes, then screenshot once
