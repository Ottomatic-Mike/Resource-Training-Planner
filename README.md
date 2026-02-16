# Training Plan Manager

**AI-Assisted Training Planning for Engineering Teams**

![Version](https://img.shields.io/badge/version-2.0.4-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Docker](https://img.shields.io/badge/docker-ready-blue.svg)
![Node.js](https://img.shields.io/badge/node-20%2B-brightgreen.svg)

Training Plan Manager helps engineering managers build structured, AI-powered training plans for their technical teams. Assess competencies, discover courses, set goals, manage budgets, and track progress — all from a single browser-based tool.

> **New to the project?** Jump straight to the [Quick Start](#-quick-start) or read [START_HERE.md](START_HERE.md) for a guided walkthrough.

---

## Table of Contents

- [Who Is This For?](#-who-is-this-for)
- [Key Features](#-key-features)
- [Quick Start](#-quick-start)
- [How It Works](#-how-it-works)
- [Architecture Overview](#-architecture-overview)
- [AI Integration (Optional)](#-ai-integration-optional)
- [Sample Data](#-sample-data)
- [Documentation](#-documentation)
- [FAQ](#-faq)
- [Contributing](#-contributing)
- [License](#-license)

---

## Who Is This For?

| Audience | What You Get |
|----------|-------------|
| **General Users** | A simple web app to organize training plans, track courses, and manage budgets — no AI required. Load sample data and start exploring in minutes. |
| **Engineering Managers** | A planning tool built for your workflow. Assess team competencies, set development goals, discover relevant courses, allocate budgets across your team, and generate reports showing progress and skill gaps. |
| **Technical Resources (Engineers, Developers, etc.)** | Visibility into your own training plan, learning schedule, and career development goals. See which competencies you're building, what courses are assigned, and how your progress is tracked. |

---

## Key Features

### Core Capabilities (No AI Required)

- **Resource Management** — Add team members with job titles, departments, locations, budgets, and weekly training hours
- **Competency Library** — Define skills across categories (Programming, Cloud, DevOps, Security, Data, Soft Skills) with 5-level proficiency scales
- **Course Catalog** — Maintain a searchable database of training courses with providers, costs, durations, and ratings
- **Training Plan Wizard** — Create plans through a guided 6-step process: select resource, assess competencies, set goals, choose courses, schedule training, and review
- **Regional Calendars** — Manage holiday calendars per region to avoid scheduling conflicts
- **Reports & Analytics** — Budget breakdowns, progress tracking, competency gap analysis, and visual charts
- **Import / Export** — Back up and restore all data as JSON files

### AI-Powered Features (Optional)

When configured with an API key from any supported provider, unlock:

- **Competency Assessment** — AI analyzes a team member's role to suggest relevant skills and proficiency levels
- **Goal Recommendations** — AI-generated career development objectives based on current skill gaps
- **Course Discovery** — Search the web for real courses from major training providers, matched to specific competencies
- **Schedule Optimization** — AI creates balanced learning timelines that respect workload and availability

### Security & Data

- **Browser-Based Storage** — All data stays in your browser's localStorage. Nothing is sent to a server or stored externally (except optional AI API calls you initiate)
- **Encrypted API Keys** — API keys are encrypted locally using AES-256-GCM with PBKDF2 key derivation
- **No Account Required** — No sign-ups, no user databases, no tracking

---

## Quick Start

### Option A: Docker (Recommended)

```bash
git clone https://github.com/Ottomatic-Mike/Resource-Training-Planning.git
cd Resource-Training-Planning/Resource-Training-Planning
docker-compose up -d
```

Open **http://localhost:3000** in your browser.

### Option B: Node.js

Requires [Node.js 20+](https://nodejs.org/) (18+ minimum).

```bash
git clone https://github.com/Ottomatic-Mike/Resource-Training-Planning.git
cd Resource-Training-Planning/Resource-Training-Planning/app
npm install
npm start
```

Open **http://localhost:3000** in your browser.

### First Steps After Launch

1. Click **Settings** (gear icon) and select **Load Sample Data** to populate the app with example team members, competencies, and courses
2. Explore the **Dashboard** to see an overview of your team
3. Navigate through the tabs: Resources, Competencies, Course Catalog, Training Plans, Calendars, Reports
4. When ready, replace sample data with your own team information

> For detailed platform-specific instructions (Windows, macOS, Linux), see [INSTALLATION.md](INSTALLATION.md).

---

## How It Works

### For Engineering Managers

```
1. Add Resources       → Enter your team members and their details
2. Define Competencies → Build a skill library relevant to your org
3. Curate Courses      → Add training courses (manually or with AI discovery)
4. Create Plans        → Use the 6-step wizard to build training plans
5. Track Progress      → Monitor completion, budgets, and skill gaps via Reports
```

The **Training Plan Wizard** walks you through each step:

| Step | What Happens |
|------|-------------|
| **1. Select Resource** | Choose a team member to plan training for |
| **2. Assess Competencies** | Rate current skill levels (1-5 scale), optionally with AI assistance |
| **3. Set Goals** | Define target proficiency levels and development objectives |
| **4. Select Courses** | Choose from your catalog or discover new courses with AI |
| **5. Schedule** | Build a timeline that respects holidays and availability |
| **6. Review & Save** | Confirm the complete plan and save it |

### For Technical Resources

Your manager creates a training plan visible in the app. You can see:

- Your **competency assessment** — where you stand on each skill
- Your **development goals** — what you're working toward
- Your **assigned courses** — what training is lined up
- Your **schedule** — when training is planned
- Your **progress** — how far along you are

---

## Architecture Overview

```
┌─────────────────────────────────────────────┐
│  Browser (http://localhost:3000)             │
│  ┌───────────────────────────────────────┐   │
│  │  Single-Page Application (HTML/JS)    │   │
│  │  - Dashboard, Resources, Competencies │   │
│  │  - Courses, Plans, Calendars, Reports │   │
│  │  - Data stored in localStorage        │   │
│  └────────────────┬──────────────────────┘   │
└───────────────────┼──────────────────────────┘
                    │ HTTP
┌───────────────────┼──────────────────────────┐
│  Node.js + Express Server                    │
│  ┌────────────────┴──────────────────────┐   │
│  │  GET  /        → Serves the SPA       │   │
│  │  GET  /health  → Health check         │   │
│  │  POST /api/proxy → CORS proxy for AI  │   │
│  └────────────────┬──────────────────────┘   │
└───────────────────┼──────────────────────────┘
                    │ HTTPS (optional)
        ┌───────────┼───────────┐
        ▼           ▼           ▼
   Anthropic     OpenAI      Google
    Claude        GPT        Gemini
```

| Component | Technology | Notes |
|-----------|-----------|-------|
| **Backend** | Node.js 20 + Express 4.18 | Lightweight server, CORS proxy for AI API calls |
| **Frontend** | Vanilla HTML/CSS/JavaScript | Single-file SPA (~8,900 lines), no framework dependencies |
| **Charts** | Chart.js 4.4 | Visual analytics in Reports tab |
| **Container** | Docker (Alpine Linux) | Multi-stage build, non-root user, health checks |
| **Orchestration** | Docker Compose | One-command deployment with restart policies |
| **Data Storage** | Browser localStorage | Client-side only; JSON import/export for portability |
| **AI Providers** | Anthropic, OpenAI, Google | Optional; multi-provider adapter pattern |

---

## AI Integration (Optional)

AI features are entirely optional. The app works fully without them. To enable AI assistance, configure an API key from any supported provider:

| Provider | Models | Get an API Key |
|----------|--------|----------------|
| **Anthropic** | Claude Opus 4.6, Claude Sonnet 4.5, Claude Haiku 4.5 | [console.anthropic.com](https://console.anthropic.com/) |
| **OpenAI** | GPT-5.2, o4-mini, o3 | [platform.openai.com](https://platform.openai.com/) |
| **Google** | Gemini 3 Pro, Gemini 3 Flash, Gemini 2.5 Pro | [aistudio.google.com](https://aistudio.google.com/) |

Configure your key in the app under **Settings** > **AI Configuration**. Keys are encrypted locally and never leave your browser except when making API calls through the server's CORS proxy.

For detailed setup and troubleshooting, see [API_INTEGRATION.md](API_INTEGRATION.md).

---

## Sample Data

The app ships with pre-loaded sample data you can activate from **Settings > Load Sample Data**:

- **6 Team Members** — Senior Developer, Security Engineer, DevOps Engineer, QA Lead, Data Engineer, Frontend Developer
- **18 Competencies** — Across Programming, Cloud, DevOps, Security, Data, and Soft Skills categories
- **240 Courses** — Organized by role competencies across 23 providers (Udemy, Coursera, Pluralsight, LinkedIn Learning, ServiceNow University, SANS Institute, CompTIA, ISC2, AWS Training, Microsoft Learn, Google Cloud Training, and more). Each of the 6 sample roles has a dedicated competency track with ServiceNow courses integrated alongside industry providers. Prices range from free to $17,000. Use AI-powered "Search Online" for live course discovery.
- **32 Holiday Calendars** — Worldwide coverage across Americas (7), Europe (9), Asia-Pacific (11), Middle East & Africa (5) with correct 2026 dates for all moveable holidays

This lets you explore every feature immediately without entering any data first.

---

## Documentation

| Document | Description | Best For |
|----------|-------------|----------|
| [**START_HERE.md**](START_HERE.md) | Guided first-time walkthrough | New users |
| [**INSTALLATION.md**](INSTALLATION.md) | Platform-specific setup (Windows, macOS, Linux) | Getting the app running |
| [**USER_GUIDE.md**](USER_GUIDE.md) | Complete feature reference manual | Learning every feature |
| [**API_INTEGRATION.md**](API_INTEGRATION.md) | AI provider setup and troubleshooting | Enabling AI features |
| [**CHANGELOG.md**](CHANGELOG.md) | Full version history and release notes | Tracking changes between versions |

---

## FAQ

<details>
<summary><strong>Do I need an AI API key to use this?</strong></summary>

No. All core features — resource management, competency tracking, course catalogs, training plans, calendars, and reports — work without any AI configuration. AI features are optional enhancements.
</details>

<details>
<summary><strong>Where is my data stored?</strong></summary>

All data is stored in your browser's localStorage. Nothing is sent to a server or saved to a database. Use the **Import/Export** feature in Settings to back up your data as a JSON file.
</details>

<details>
<summary><strong>Can multiple people use the same instance?</strong></summary>

The app is designed for single-user use (typically one engineering manager per browser). Each browser maintains its own independent data. Multiple team members can each run their own instance, or a manager can share exported plans.
</details>

<details>
<summary><strong>How do I back up my data?</strong></summary>

Go to **Settings** > **Data Management** > **Export Data**. This downloads a JSON file with all your resources, competencies, courses, plans, and calendars. To restore, use **Import Data** and select your backup file.
</details>

<details>
<summary><strong>Is my API key safe?</strong></summary>

API keys are encrypted in your browser using AES-256-GCM with PBKDF2 key derivation (100,000 iterations). Keys are only decrypted when making an AI request and are sent through the local server's CORS proxy — they never leave your machine unencrypted.
</details>

<details>
<summary><strong>Can I run this on a shared server for my team?</strong></summary>

The app can be deployed on a shared server and accessed by multiple users over the network. However, each user's data is stored in their own browser, so there is no shared database or collaboration features. Each person sees only their own data.
</details>

<details>
<summary><strong>What if I clear my browser data?</strong></summary>

Clearing browser data (localStorage) will remove all app data. Always export a backup before clearing browser data or switching browsers. You can re-import your backup file to restore everything.
</details>

---

## Contributing

Contributions are welcome! This is a solo-developed project with clear conventions:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Follow existing coding conventions in the codebase
4. Make your changes
5. Test locally with `npm start` or `docker-compose up`
6. Commit using the project format: `<Prefix> v<version> - <Description>` (e.g., `Feature v2.0.5 - Add dark mode toggle`)
7. Open a Pull Request

---

## License

MIT License — Copyright (c) 2026 Training Plan Manager

See the full license in the repository.

---

*Version 2.0.4 — Web Service Architecture with Embedded CORS Proxy*
