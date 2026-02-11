# CLAUDE.md - Training Plan Manager

> Project intelligence file for Claude Code. This document captures architecture, conventions, lessons learned, and rules for working on this codebase.

## Project Overview

**Training Plan Manager** is a web-based application for engineering managers to create AI-assisted training plans for technical teams. It runs as a Node.js/Express web service with a vanilla JavaScript SPA frontend, containerized with Docker.

- **Current Version:** 2.0.4
- **Repository:** https://github.com/Ottomatic-Mike/Resource-Training-Planning
- **Runtime:** Node.js 20+ / Docker
- **Port:** 3000 (configurable via PORT env var)
- **License:** Solo-developer project

---

## Architecture

### Technology Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | Vanilla JS SPA (single HTML file, ~8,900 lines) | No framework. Chart.js, SortableJS, XLSX via CDN |
| Backend | Node.js 20 + Express 4.18.2 | Lightweight: static serving + CORS proxy only |
| CORS Proxy | node-fetch 2.7.0 | Server-side proxy for AI API calls at `/api/proxy` |
| Container | Docker (Alpine Linux, multi-stage build) | Non-root user, health checks |
| Orchestration | Docker Compose | `restart: unless-stopped` for persistence |
| Storage | Browser localStorage | No server-side database. JSON export/import for backup |
| AI Providers | Anthropic Claude, OpenAI GPT, Google Gemini | Multi-provider with adapter pattern |

### Data Flow

```
Browser (localhost:3000)
  └─→ Express Server (app/server.js, ~181 lines)
       ├─ GET /               → serves training-plan-manager.html
       ├─ GET /health         → health check JSON
       ├─ POST /api/proxy     → CORS proxy to AI providers
       └─ 404 handler
            └─→ AI Provider APIs (Anthropic / OpenAI / Google)
```

All business logic lives in the frontend. The server exists solely for static file serving and CORS proxy. Data persists in browser localStorage, never on the server.

### File Structure

```
Resource-Training-Planning/
├── app/
│   ├── server.js                        # Express server (~181 lines)
│   ├── package.json                     # 3 prod deps: express, cors, node-fetch
│   ├── package-lock.json
│   └── public/
│       └── training-plan-manager.html   # Complete SPA (~8,900 lines)
├── Dockerfile                           # Multi-stage build (node:20-alpine)
├── docker-compose.yml                   # Container orchestration
├── .env.example                         # Environment variable template
├── .dockerignore / .gitignore
├── training-plan-manager.html           # Root-level copy (legacy reference)
├── CLAUDE.md                            # This file
├── README.md                            # Project overview
├── START_HERE.md                        # First-time user guide
├── INSTALLATION.md                      # Platform-specific setup
├── API_INTEGRATION.md                   # AI provider configuration
├── USER_GUIDE.md                        # Feature-by-feature reference
├── CHANGELOG.md                         # Full version history
└── DEPLOYMENT-STANDALONE-ARCHIVED.md    # Archived v1.x deployment docs
```

### Key Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/` | GET | Serves the SPA HTML |
| `/health` | GET | Returns `{ status, service, version, timestamp }` |
| `/api/proxy` | POST | CORS proxy. Body: `{ url, method?, headers?, body? }` |

### Frontend Structure (within the single HTML file)

The SPA is organized in sections within one `<script>` tag:
1. **Global State** - 5 data collections + settings + wizard state
2. **Security & Encryption** - PBKDF2/AES-GCM for API key encryption
3. **Initialization** - App startup, localStorage loading, tab restoration
4. **Tab Navigation** - 7 tabs (Dashboard, Resources, Competencies, Courses, Plans, Calendars, Reports)
5. **Save/Load** - localStorage persistence with auto-save (2s debounce)
6. **Utilities** - Formatting, escaping, ID generation
7. **Modal System** - Single reusable modal (openModal/closeModal)
8. **Settings** - Configuration UI and persistence
9. **Dashboard** - Overview metrics, sortable resource table
10. **Resources** - CRUD for team members
11. **Competencies** - Skill library with 5-level proficiency
12. **Courses** - Course catalog with AI-powered discovery
13. **Training Plans** - 6-step wizard with AI assistance
14. **Calendars** - Regional holiday management
15. **Reports** - Analytics and charts
16. **Import/Export** - JSON backup/restore
17. **AI Integration** - Multi-provider API calls
18. **Sample Data** - 6 resources, 18 competencies, 12 courses, 2 calendars

---

## Coding Conventions

### JavaScript

- **No module system**: All functions are global (window scope)
- **Naming**: Functions use camelCase (`saveNewResource`, `renderDashboard`), constants use UPPER_SNAKE_CASE (`STORAGE_KEY`)
- **Function categories**: `render*()`, `show*()`, `open*()`, `close*()`, `save*()`, `edit*()`, `delete*()`, `filter*()`, `sort*()`
- **HTML generation**: Template literals injected via innerHTML
- **Event binding**: Inline `onclick` attributes (not addEventListener)
- **State mutations**: Direct assignment to global arrays/objects, followed by `triggerSave()` and `render*()` calls
- **ID generation**: Simple incrementing integers (`nextResourceId++`), not UUIDs
- **Section dividers**: `// === SECTION NAME ===` comments

### CSS

- **CSS Variables**: Comprehensive design system in `:root` (colors, spacing, radius, shadows)
- **Color theme**: Teal/green primary (`#044d4b`), 11-shade neutral scale
- **Spacing scale**: xs(4px), sm(8px), md(16px), lg(24px), xl(32px)
- **Classes**: BEM-lite naming (`.card`, `.card-header`, `.btn`, `.btn-primary`, `.form-input`)
- **Grid**: `.grid-2`, `.grid-3`, `.grid-4`, `.grid-auto` utility classes
- **Responsive**: Single breakpoint at 768px
- **Animations**: `fadeIn`, `pulse`, `spin` keyframes

### HTML

- **IDs**: camelCase (`dashboardContent`, `newResourceName`)
- **Classes**: kebab-case (`form-group`, `tab-content`, `btn-primary`)
- **Semantic structure**: Proper heading hierarchy (h1-h4), tables for tabular data
- **Section comments**: `<!-- Tab 1: Dashboard -->`, `<!-- Settings Modal -->`

---

## Commit Message Convention

Format: `<Prefix> v<version> - <Description>`

| Prefix | Usage |
|--------|-------|
| `Fix` | Bug fix |
| `Feature` | New feature |
| `Release` | General release |
| `MAJOR RELEASE` | Breaking/architectural change |
| Verb (`Add`, `Implement`, `Redesign`) | Specific action |

Examples:
```
Fix v2.0.4 - Rewrite START_HERE.md for Web Service Architecture
Feature v2.0.2 - Course categorization via competency selection
MAJOR RELEASE v2.0.0 - Web Service Architecture with Embedded CORS Proxy
```

### Versioning

- **Semantic Versioning** (semver) strictly followed
- **Major**: Breaking architectural changes (v1.x standalone → v2.x web service)
- **Minor**: Currently unused (always 0)
- **Patch**: All features, fixes, enhancements, docs
- **Versions live in commit messages only** (no git tags)
- **Version must be updated in**: package.json, docker-compose.yml, server.js health endpoint, HTML file header, README.md, CHANGELOG.md

---

## Development Patterns & Lessons Learned

### Critical Lessons (from actual bugs and mistakes)

1. **CORS proxy does NOT "bypass" browser security** (v2.0.4)
   - The server-side proxy is a legitimate architectural pattern that works *with* CORS, not against it
   - Never describe it as "eliminating" or "bypassing" restrictions in documentation
   - Inaccurate security language damages credibility

2. **Template literals with `</script>` break HTML parsing** (v1.0.23)
   - Browsers scan for `</script>` before the JS parser runs
   - Always escape as `<\/script>` inside template literals
   - This affects any HTML string containing script tags

3. **HTML5 date inputs require `yyyy-MM-dd` format** (v1.0.23)
   - ISO format (`2025-01-24T00:00:00`) is rejected
   - Always strip time component before populating date inputs

4. **Modal element IDs are fragile** (v1.0.25)
   - Code referenced `modalOverlay` but actual ID was `generalModal`
   - Always verify element IDs match between HTML and JS after refactoring
   - The modal system uses: `generalModal`, `generalModalInner`, `modalTitle`, `modalBody`, `modalFooter`

5. **New optional fields need a defined default for existing data** (v1.0.21)
   - When adding a field like `canAttendInPerson`, `undefined` on legacy data must be handled consistently
   - Choose a default interpretation and apply it everywhere
   - Document the default so future developers understand

6. **Implement all advertised providers, or disable the UI** (v1.0.24)
   - UI offered OpenAI and Google but only Anthropic was implemented
   - Incomplete features create support burden (users think it's a bug)

7. **Documentation drift after architectural changes** (v2.0.4)
   - START_HERE.md still said "just double-click the HTML file" after v2.0.0 moved to web service
   - Architectural changes require documentation rewrites across ALL files, not just CHANGELOG

8. **Smart defaults beat configuration options** (v1.0.26)
   - Try direct API call first, auto-fallback to proxy if CORS error detected
   - 80% of users never need to configure anything

### Error Handling Philosophy

API errors must provide three levels of information:
1. **User-friendly message**: What happened in plain language
2. **Actionable guidance**: What the user should do next
3. **Technical details**: Status codes and raw error for debugging

Status code mappings (in server.js):
- `429` → "Rate limit exceeded" + wait instruction
- `529` → "AI service temporarily overloaded" + retry in 30-60s
- `503` → "Service temporarily unavailable"
- `401` → "Invalid API key" + check Settings
- `400` → "Bad request" + check configuration
- `500/502` → "Internal server error" + retry later
- `504` → "Request timeout (>60s)"
- Network error → "Could not reach API endpoint"

### AI Integration Patterns

Each provider has different request/response formats:

| Provider | Auth | Request Format | Response Path |
|----------|------|---------------|---------------|
| Anthropic | `x-api-key` header | Messages API | `data.content[0].text` |
| OpenAI | `Authorization: Bearer` header | Chat Completions | `data.choices[0].message.content` |
| Google | `?key=` URL param | Contents/Parts | `data.candidates[0].content.parts[0].text` |

AI responses are parsed as JSON with fallback:
1. Try `JSON.parse(response)` directly
2. Try extracting from markdown code block: `` ```json ... ``` ``
3. Try matching raw `[...]` array pattern
4. Throw error if all fail

### Feature Development Cadence

Historical pattern: Feature → Immediate bug fix within 1-2 commits. Always test thoroughly before committing, especially:
- Modal ID references after HTML changes
- Template literal escaping
- Date format compatibility
- All three AI providers (not just Anthropic)

---

## Docker Configuration

### Container Setup
- **Image**: `training-plan-manager:2.0.4`
- **Base**: `node:20-alpine` (multi-stage build)
- **User**: Non-root `nodejs:1001`
- **Port**: 3000
- **Restart**: `unless-stopped` (survives reboots if Docker Desktop auto-starts)
- **Health check**: Every 30s, 3s timeout, 3 retries, 5s startup grace

### Key Commands
```bash
docker compose up -d --build    # Build and start
docker compose logs -f          # View logs
docker compose down             # Stop and remove
docker ps --filter "name=training-plan-manager"  # Check status
```

### Environment Variables
```
PORT=3000           # Server port (default: 3000)
NODE_ENV=production # Environment mode
```

---

## Testing Considerations

- **No automated test suite** exists (package.json: `"test": "echo \"Error: no test specified\" && exit 1"`)
- Manual testing required for: all three AI providers, modal interactions, localStorage save/load, import/export, date formatting
- Health check endpoint (`/health`) confirms server is running
- Browser DevTools (F12) for frontend debugging

---

## Security Notes

- **API keys**: Encrypted with AES-256-GCM, PBKDF2 key derivation (100k iterations), master password required
- **Docker**: Non-root user, security updates applied during build
- **CORS**: Enabled for all origins (single-user local app)
- **Body parser**: 50MB limit for JSON
- **No secrets in code**: API keys stored in browser localStorage (encrypted)
- **Never commit**: `.env` files, API keys, credentials, node_modules

---

## Files to Update When Releasing a New Version

1. `app/package.json` → `version` field
2. `docker-compose.yml` → `image` tag and version labels
3. `app/server.js` → version in `/health` endpoint response
4. `app/public/training-plan-manager.html` → version in page header/footer
5. `CHANGELOG.md` → new version entry with changes
6. `README.md` → version badge/reference if present
7. `START_HERE.md` → version reference at bottom

---

## Subagent Rules

### When to Use Subagents

Use the Task tool to launch subagents when a task genuinely benefits from parallelism or isolation. Do NOT use subagents as a default — they add overhead and should be reserved for specific scenarios.

### Appropriate Subagent Usage

| Scenario | Agent Type | Rationale |
|----------|-----------|-----------|
| Exploring unfamiliar parts of the codebase across many files | `Explore` | Avoids polluting main context with large file reads |
| Running tests or build commands that may produce long output | `Bash` | Isolates verbose output from conversation |
| Researching a topic that requires multiple web searches | `general-purpose` | Keeps main thread focused on implementation |
| Planning a multi-file refactoring | `Plan` | Produces structured plan without cluttering main context |
| Multiple independent research questions at once | Any (parallel) | Genuine parallelism saves time |

### When NOT to Use Subagents

- **Reading 1-3 specific files**: Use Read tool directly
- **Searching for a known file or class name**: Use Glob or Grep directly
- **Running a single short command**: Use Bash directly
- **Simple edits to known files**: Use Edit directly
- **Work that depends on previous results**: Do it sequentially in main context
- **Tasks you already know how to do**: Subagent overhead is wasteful

### Subagent Best Practices

1. **Maximize parallel launches**: If you need information from multiple independent sources, launch all subagents in one message
2. **Be specific in prompts**: Include exact file paths, function names, and what you need returned
3. **Don't duplicate work**: If a subagent is researching something, don't also search for it yourself
4. **Use the right agent type**: `Explore` for codebase discovery, `Bash` for commands, `general-purpose` for research, `Plan` for architecture
5. **Prefer haiku model for simple tasks**: Quick lookups and straightforward commands don't need opus
6. **Keep subagent results out of context when possible**: Summarize findings rather than pasting raw output
7. **Don't chain subagents**: If task A depends on task B, do them sequentially in main context rather than launching A as a subagent of B

### This Project's Specific Subagent Guidance

- **Frontend changes**: Read `app/public/training-plan-manager.html` directly (it's one file, even though it's large). Don't launch an Explore agent for a single-file SPA
- **Server changes**: Read `app/server.js` directly (~181 lines). Never needs a subagent
- **Documentation updates**: Read the specific .md file directly. Only use Explore if you need to cross-reference multiple docs
- **Version bumps**: These touch 5-7 files with known paths. Do it sequentially in main context, not with subagents
- **Docker issues**: Use Bash directly for docker commands. Only use a subagent if debugging requires reading logs AND checking multiple config files simultaneously

---

## Common Pitfalls to Avoid

1. **Don't add a framework** — The project is intentionally vanilla JS. Don't introduce React, Vue, or any framework
2. **Don't split the HTML file** — The monolithic SPA is a deliberate architectural choice. Don't refactor into modules
3. **Don't add a database** — localStorage is the intended storage mechanism for v2.x
4. **Don't change the CORS proxy pattern** — It's a legitimate server-side pattern, not a hack
5. **Don't use `node-fetch` v3** — v3 is ESM-only and would break the CommonJS server. Stay on v2.7.0
6. **Don't add authentication** — Single-user local app by design
7. **Don't modify the root-level `training-plan-manager.html`** — The canonical copy is in `app/public/`. The root copy is a legacy artifact
8. **Escape `</script>` in template literals** — Always use `<\/script>` inside backtick strings
9. **Test all three AI providers** — Don't assume a change to one provider's code path works for the others
10. **Update ALL version references** — See the "Files to Update" section above
