# 🚀 START HERE - Training Plan Manager

**Welcome!** This guide will get you started with the Training Plan Manager web service.

---

## ⚡ Prerequisites - SET UP FIRST

**IMPORTANT:** Before you can use the app, you must install and run the web service.

### 📖 **Step 1: Complete Installation**

**Go to [INSTALLATION.md](INSTALLATION.md) NOW** and follow the setup instructions for your operating system.

Choose one installation method:
- **Docker (Recommended)** - Easiest setup, works on Windows, macOS, and Linux
- **Node.js (Alternative)** - Direct installation for developers

The installation guide provides:
- ✅ Complete prerequisites for your OS
- ✅ Step-by-step installation instructions
- ✅ Docker Desktop or Node.js setup
- ✅ How to start the application server
- ✅ Verification steps

**Estimated time:** 5-10 minutes

---

## ✅ Verify Installation

Before proceeding, confirm the application is running:

1. **Start the application** (if not already running):
   - **Docker:** `docker compose up -d` from the project directory
   - **Node.js:** `npm start` from the `app` directory

2. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

3. **You should see** the Training Plan Manager interface

4. **Check health status** (optional):
   ```
   http://localhost:3000/health
   ```
   Should return: `{"status":"healthy","service":"training-plan-manager","version":"2.0.4"}`

**If the app doesn't load, return to [INSTALLATION.md](INSTALLATION.md) and review the troubleshooting section.**

---

## 🎯 Your First 10 Minutes

Now that the application is running, let's explore!

### Minute 1-2: Load Sample Data

1. Open **http://localhost:3000** in your browser
2. Click the **"Settings"** gear icon (⚙️) in the top-right
3. Click **"Data Management"** section
4. Click **"Load Sample Data"** button
5. Click "OK" to confirm

**You now have:**
- 6 sample team members
- 18 competencies across 5 categories
- 100 training courses (including 88 from ServiceNow University)
- 2 regional calendars

### Minute 3-4: Explore the Dashboard

- Click **Dashboard** (Tab 1)
- See metrics: team overview, budget status, training plans
- Look at the "Resources at a Glance" table
- Notice status indicators (On Track, At Risk, Behind)

### Minute 5-6: View a Resource

- Click **Resources** (Tab 2)
- Click on any resource card (e.g., "John Smith")
- See their profile: budget, competencies, assigned courses
- Explore the sub-tabs: Profile, Competencies, Training Plan, Progress
- Close the detail view

### Minute 7-8: Browse Competencies

- Click **Competencies** (Tab 3)
- See 18 pre-loaded skills (Python, AWS, Kubernetes, etc.)
- Click "View" on any competency
- Notice the 5-level proficiency definitions
- Close the modal

### Minute 9-10: Check Out Courses

- Click **Course Catalog** (Tab 4)
- Browse 100 sample courses (including the full ServiceNow University catalog)
- Notice: provider, cost, duration, rating, relevant competencies
- Click "View Details" on any course
- Try the search and filter features

---

## 📚 What's in the Sample Data?

### 6 Team Members
- **John Smith** - Senior Developer (NYC) - $5,000 budget
- **Jane Doe** - Security Engineer (London) - $4,000 budget
- **Bob Wilson** - DevOps Engineer (Remote) - $3,000 budget
- **Sarah Lee** - QA Lead (Singapore) - $5,000 budget
- **Mike Chen** - Data Engineer (SF) - $4,500 budget
- **Emma Brown** - Frontend Developer (Berlin) - $3,500 budget

### 18 Competencies
Across 5 categories:
- **Programming**: Python, JavaScript, Java, Go
- **Cloud**: AWS, Azure, GCP, Kubernetes
- **DevOps**: Docker, CI/CD, Terraform
- **Security**: OWASP, Security Best Practices
- **Data**: SQL, NoSQL, Data Engineering
- **Soft Skills**: Leadership, Communication

### 100 Training Courses
From providers including:
- **ServiceNow University** (88 courses, Free–$17,000) — Complete Now Learning catalog covering all CIS certification paths (ITSM, CSM, HRSD, SIR, VR, DISCO, SM, EM, HAM, SAM, RC, TPRM, SPM, FSM, SP, PA, Data Foundations), CSA/CAD prep, simulators, micro-certifications, AI/GenAI, and expert programs (ArchX, CTA, CMA). Exam fees included where applicable.
- Udemy ($89–390)
- A Cloud Guru ($299)
- Linux Foundation ($299–395)
- SANS Institute ($1,500)
- HashiCorp ($495)
- Microsoft Learn (Free!)

### 2 Regional Calendars
- **US Federal Holidays 2026** (8 holidays)
- **UK Bank Holidays 2026** (8 holidays)

---

## 🎨 Customize for Your Team

### Step 1: Clear Sample Data (Optional)

If you want to start fresh:
1. Go to **Settings** → **Data Management**
2. Click **"Clear All Data"**
3. Confirm twice (it's permanent!)

### Step 2: Configure Settings

1. Click **Settings ⚙️** in the top-right
2. Set your preferences:
   - **Currency**: USD, EUR, or GBP
   - **Date Format**: MM/DD/YYYY, DD/MM/YYYY, or YYYY-MM-DD
   - **Default Budget**: Your team's typical training budget
   - **Default Weekly Hours**: Hours available for training

3. **Configure AI Integration** (Required for AI features):
   - Select **AI Provider**: Anthropic Claude (recommended), OpenAI GPT, or Google Gemini
   - Enter your **API Key** from the provider
   - See [API_INTEGRATION.md](API_INTEGRATION.md) for detailed setup
   - **Note:** AI features include competency analysis, goal suggestions, course discovery, and schedule optimization

4. Click **"Save Settings"**

### Step 3: Add Your First Real Resource

1. Go to **Resources** tab
2. Click **"+ Add Resource"**
3. Fill in:
   - **Name**: Team member's full name
   - **Job Title**: Their current role
   - **Department**: Team or department
   - **Location**: City, Country
   - **Email**: Work email
   - **Annual Training Budget**: Dollar amount for the year
   - **Weekly Training Hours**: Hours per week they can dedicate
   - **Regional Calendar**: Select holiday calendar

4. Click **"Add Resource"**

### Step 4: Build Your Competency Library

1. Go to **Competencies** tab
2. Click **"+ Add Competency"**
3. Define:
   - **Name**: e.g., "React Development"
   - **Category**: e.g., "Frontend" (or create new category)
   - **Subcategory**: e.g., "JavaScript Frameworks" (or create new)
   - **Description**: What this skill encompasses
   - **Level Definitions**: Customize the 5 proficiency levels (optional)

4. Repeat for your team's key skills

**New in v2.0.3:** You can also create competencies on-the-fly when adding courses!

### Step 5: Add Relevant Courses

1. Go to **Course Catalog** tab
2. Choose how to add courses:

**Option A: Manual Entry**
- Click **"+ Add Course"**
- Fill in course details
- Select relevant competencies (or create new ones inline!)

**Option B: AI Course Discovery** (Requires AI configured)
- Click **"🔍 Search Online"**
- Describe what you're looking for
- AI finds real courses from major providers
- Add courses to catalog with one click
- Affiliate courses with competencies (or create new ones!)

3. Build your course catalog

---

## 🧙 Creating Your First Training Plan

### The 6-Step Wizard

1. **Navigate**: Go to **Training Plans** tab (Tab 5)
2. **Start**: Click **"+ Create Training Plan"**

**Step 1: Select Resource**
- Choose the team member
- See their location, title, budget, and availability

**Step 2: Assess Competencies**
- Review and rate current competencies (1-5 proficiency)
- **With AI**: Click "Analyze Competencies" for AI-suggested ratings based on job title

**Step 3: Define Goals**
- Set target competencies and desired proficiency levels
- Prioritize (Critical, High, Medium, Low)
- Add target dates
- **With AI**: Click "Suggest Goals" for personalized recommendations

**Step 4: Discover Training**
- Browse course catalog filtered by goals
- **With AI**: Click "Discover Courses" for AI-recommended courses matching goals
- Select courses for the plan

**Step 5: Schedule**
- Review resource availability and regional holidays
- Sequence courses (drag to reorder)
- Set start dates
- **With AI**: Click "Optimize Schedule" for intelligent timeline

**Step 6: Review**
- See complete plan summary
- Budget breakdown and remaining budget
- Timeline overview with milestones
- Click **"Finish"** to create the plan

---

## 💾 Protecting Your Data

### Where Data is Stored

Your data is stored in **browser localStorage** on your local machine. This means:
- ✅ Data is private and never leaves your computer (except AI API calls)
- ✅ Works offline (except AI features)
- ⚠️ Data is browser-specific (Chrome and Firefox have separate storage)
- ⚠️ Clearing browser data deletes your training plans
- ⚠️ No automatic cloud sync or backup

**CRITICAL:** Export your data regularly to protect against data loss!

### Auto-Save

Changes save automatically to localStorage every 2 seconds while you work.

### Manual Backup (Highly Recommended)

**Export your data weekly or after major changes:**

1. Go to **Settings** → **Data Management**
2. Click **"Export Data to JSON"**
3. File downloads with timestamp (e.g., `training-data-2026-02-16.json`)
4. Store in:
   - Cloud storage (Dropbox, Google Drive, OneDrive)
   - Version control (Git repository)
   - Local backup drive
   - Multiple locations for redundancy

### Restore from Backup

1. Go to **Settings** → **Data Management**
2. Click **"Import Data from JSON"**
3. Select your backup file
4. Confirm to restore (replaces all current data)

---

## 🤖 Using AI Features (Optional but Powerful)

### What AI Can Do

AI-powered features dramatically improve training plan quality:

- **Competency Assessment**: Analyze job titles/descriptions to suggest relevant competencies and proficiency levels
- **Goal Recommendations**: Suggest career development goals based on role and current skills
- **Course Discovery**: Search the web for real courses from Udemy, Coursera, LinkedIn Learning, etc.
- **Schedule Optimization**: Create optimal timelines considering availability, learning pace, and prerequisites

### Prerequisites

- API key from Anthropic, OpenAI, or Google
- Active API account with credits/billing enabled
- Internet connection for AI calls

### Quick Setup

1. **Get an API key**:
   - **Anthropic Claude** (Recommended): https://console.anthropic.com/
   - **OpenAI GPT**: https://platform.openai.com/api-keys
   - **Google Gemini**: https://ai.google.dev/

2. **Configure in app**:
   - Click **Settings ⚙️** in Training Plan Manager
   - Select **AI Provider**
   - Paste **API Key**
   - **Save Settings**

3. **Test it**:
   - Start creating a training plan
   - Try "Analyze Competencies" or "Discover Courses"
   - Verify AI responses appear

**For detailed setup instructions, see [API_INTEGRATION.md](API_INTEGRATION.md)**

---

## ❓ Common Questions

### Q: Do I need to keep the Docker container running?
**A:** Yes! The application runs as a web service. Keep Docker Desktop running and the container active while using the app.

### Q: Where is my data stored?
**A:** In your browser's localStorage. It's private and local-only. **Export to JSON regularly for backups.**

### Q: Can I access this from another computer?
**A:** No, not by default. The server runs on localhost:3000 (local only). Your data is in your browser's localStorage on one machine.

### Q: Can I use this offline?
**A:** Partially. The app works offline, but AI features require internet connection. The server runs locally.

### Q: Is there a mobile app?
**A:** No. Currently optimized for desktop browsers (Chrome, Firefox, Edge, Safari).

### Q: Can multiple people use the same data?
**A:** Not simultaneously. Each browser has its own localStorage. To share data:
   - Export to JSON from one browser
   - Import JSON in another browser or share the file

### Q: What if I accidentally delete something?
**A:** Restore from your JSON backup. **This is why regular exports are critical!**

### Q: How much data can I store?
**A:** Browser localStorage limit is ~5-10MB. This can handle hundreds of resources and thousands of competencies.

### Q: Is this secure?
**A:** Yes! All data stays on your computer. Only AI API calls go to external servers (Anthropic/OpenAI/Google). API keys are stored in browser localStorage and sent via the backend proxy for secure handling.

### Q: How do I stop the application?
**A:**
- **Docker:** `docker compose down` from project directory
- **Node.js:** Press `Ctrl+C` in the terminal where the server is running

### Q: How do I update to a newer version?
**A:**
1. Export your data to JSON first!
2. Run `git pull origin main` in the project directory
3. Rebuild/restart: `docker compose up -d --build` (Docker) or restart Node.js server
4. Import your data back if needed

---

## 🎓 Next Steps

### Deep Dive Documentation

- **[USER_GUIDE.md](USER_GUIDE.md)** - Comprehensive manual covering every feature in detail
- **[API_INTEGRATION.md](API_INTEGRATION.md)** - Complete AI setup guide with troubleshooting
- **[INSTALLATION.md](INSTALLATION.md)** - Installation instructions for all operating systems
- **[CHANGELOG.md](CHANGELOG.md)** - Version history and release notes
- **[README.md](README.md)** - Project overview and architecture

### Get Help

- **Health Check**: Visit http://localhost:3000/health to verify service is running
- **Logs**:
  - Docker: `docker compose logs -f`
  - Node.js: Check terminal output
- **Issues**: Report bugs at https://github.com/Ottomatic-Mike/Resource-Training-Planning/issues
- **Troubleshooting**: See INSTALLATION.md for common issues

### Share Feedback

- What features would you like?
- What's confusing?
- What works great?

GitHub: https://github.com/Ottomatic-Mike/Resource-Training-Planning

---

## ✨ Pro Tips

1. **Keep Docker/Node.js Running**: Don't close Docker Desktop or the Node.js terminal while using the app
2. **Bookmark the URL**: Save http://localhost:3000 for quick access
3. **Weekly Exports**: Make JSON backups a habit - set a calendar reminder
4. **Use AI Features**: They save significant time in plan creation
5. **Competency Reuse**: Define competencies once, use across entire team
6. **Categories**: Create new competency categories on-the-fly when adding courses
7. **Budget Tracking**: Update spent amounts as courses are purchased
8. **Progress Updates**: Mark courses "Completed" when team members finish
9. **Calendar Templates**: Clone calendars for new years
10. **Browser DevTools**: Press F12 to see console logs if you encounter issues

---

## 🎉 You're Ready!

✅ **Application installed and running** at http://localhost:3000
✅ **Sample data loaded** to explore features
✅ **Know how to customize** for your team
✅ **Understand training plan creation** workflow
✅ **Data backup strategy** in place
✅ **AI features configured** (optional)

**Happy training planning!** 🚀

---

*For detailed documentation, see [USER_GUIDE.md](USER_GUIDE.md)*
*For installation help, see [INSTALLATION.md](INSTALLATION.md)*
*For AI setup, see [API_INTEGRATION.md](API_INTEGRATION.md)*

**Version:** 2.0.4
**Last Updated:** February 2026
