# 🚀 START HERE - Training Plan Manager

**Welcome!** This guide will get you up and running with the Training Plan Manager in under 5 minutes.

---

## ⚡ Quick Start (60 Seconds)

1. **Open the Application**
   - Double-click `training-plan-manager.html`
   - It opens in your default browser
   - No installation needed!

2. **Load Sample Data**
   - Click the **"Reports"** tab (tab #7)
   - Scroll down to "Data Management"
   - Click **"Load Sample Data"** button
   - Click "OK" to confirm

3. **Explore!**
   - Click through each tab to see examples
   - Dashboard shows your team overview
   - Resources has 6 team members
   - Competencies has 18 skills
   - Course Catalog has 12 courses

**That's it!** You're now ready to explore.

---

## 🎯 Your First 10 Minutes

### Minute 1-2: Explore the Dashboard

- Click **Dashboard** (Tab 1)
- See metrics: 6 resources, budget status, training plans
- Look at the "Resources at a Glance" table
- Notice status indicators (On Track, At Risk, Behind)

### Minute 3-4: View a Resource

- Click **Resources** (Tab 2)
- Click on any resource card (e.g., "John Smith")
- See their profile: budget, competencies, courses
- Close the modal

### Minute 5-6: Browse Competencies

- Click **Competencies** (Tab 3)
- See 18 pre-loaded skills (Python, AWS, Kubernetes, etc.)
- Click "View" on any competency
- Notice the 5-level proficiency definitions
- Close the modal

### Minute 7-8: Check Out Courses

- Click **Course Catalog** (Tab 4)
- Browse 12 sample courses
- Notice: provider, cost, duration, rating
- Click "View Details" on any course

### Minute 9-10: Try the Wizard

- Click **Training Plans** (Tab 5)
- Click **"+ Create Training Plan"**
- Step 1: Select "John Smith"
- Step 2-6: Click "Next →" to see each step
- Click "Cancel" when done exploring

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

### 12 Training Courses
From providers like:
- Udemy ($89-390)
- A Cloud Guru ($299)
- Linux Foundation ($299-395)
- SANS Institute ($1,500)
- HashiCorp ($495)
- Microsoft Learn (Free!)

### 2 Regional Calendars
- **US Federal Holidays 2024** (8 holidays)
- **UK Bank Holidays 2024** (8 holidays)

---

## 🎨 Customize for Your Team

### Step 1: Clear Sample Data (Optional)

If you want to start fresh:
1. Go to **Reports** tab
2. Click **"Clear All Data"**
3. Confirm twice (it's permanent!)

### Step 2: Configure Settings

1. Click **Settings ⚙️** in the top-right
2. Set your preferences:
   - **Currency**: USD, EUR, or GBP
   - **Date Format**: MM/DD/YYYY, DD/MM/YYYY, or YYYY-MM-DD
   - **Default Budget**: Your team's typical training budget
   - **Default Weekly Hours**: Hours available for training

3. **(Optional)** Add AI API Key:
   - If you have an Anthropic/OpenAI/Google API key
   - Enables intelligent features in the wizard
   - See [API_INTEGRATION.md](API_INTEGRATION.md) for details

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

4. Click **"Add Resource"**

### Step 4: Build Your Competency Library

1. Go to **Competencies** tab
2. Click **"+ Add Competency"**
3. Define:
   - **Name**: e.g., "React Development"
   - **Category**: e.g., "Frontend"
   - **Subcategory**: e.g., "JavaScript Frameworks"
   - **Description**: What this skill encompasses

4. Repeat for your team's key skills

### Step 5: Add Relevant Courses

1. Go to **Course Catalog** tab
2. Click **"+ Add Course"**
3. Enter:
   - **Title**: Full course name
   - **Provider**: Udemy, Coursera, etc.
   - **Cost**: Dollar amount
   - **Duration**: Hours
   - **Format**: Online Self-Paced, Live, etc.
   - **Level**: Beginner to Expert
   - **Rating**: 1-5 stars
   - **URL**: Link to course page
   - **Has Certification**: Check if included

4. Add courses your team might take

---

## 🧙 Creating Your First Training Plan

### The 6-Step Wizard

1. **Navigate**: Go to **Training Plans** tab
2. **Start**: Click **"+ Create Training Plan"**

**Step 1: Select Resource**
- Choose the team member
- See their location, title, and budget

**Step 2: Assess Competencies**
- Review current competencies
- (With AI: Click "Analyze" for suggestions)

**Step 3: Define Goals**
- Set target competencies and levels
- Prioritize (Critical, High, Medium, Low)
- (With AI: Click "Suggest Goals")

**Step 4: Discover Training**
- Browse course catalog
- (With AI: Click "Discover Courses" for recommendations)
- Select courses for the plan

**Step 5: Schedule**
- Review availability and holidays
- Sequence courses
- (With AI: Click "Optimize Schedule")

**Step 6: Review**
- See complete plan summary
- Budget breakdown
- Timeline overview
- Click **"Finish"** to create

---

## 💾 Protecting Your Data

### Auto-Save

Everything saves automatically every 2 seconds to your browser's localStorage.

### Manual Backup

**Highly Recommended:**

1. Go to **Reports** tab
2. Click **"Export to JSON"**
3. File downloads with timestamp
4. Store in:
   - Cloud storage (Dropbox, Google Drive)
   - Version control (Git)
   - Local backup drive

Do this weekly or after major changes!

### Restore from Backup

1. Go to **Reports** tab
2. Click **"Import from JSON"**
3. Select your backup file
4. Confirm to restore

---

## 🤖 Using AI Features (Optional)

### Prerequisites

- API key from Anthropic, OpenAI, or Google
- Active API account with credits

### Setup

1. Get API key:
   - **Anthropic**: https://console.anthropic.com/
   - **OpenAI**: https://platform.openai.com/api-keys
   - **Google**: https://makersuite.google.com/

2. Configure:
   - Click **Settings ⚙️**
   - Select AI Provider
   - Paste API Key
   - Save Settings

3. Test:
   - Start a new training plan
   - Try AI features in the wizard
   - Verify responses appear

See [API_INTEGRATION.md](API_INTEGRATION.md) for detailed setup.

---

## ❓ Common First Questions

### Q: Where is my data stored?
**A:** In your browser's localStorage. It's private and local-only. Export to JSON for backups.

### Q: Can I use this offline?
**A:** Yes! Once loaded, everything works offline except AI features.

### Q: Is there a mobile app?
**A:** Not yet. Currently optimized for desktop browsers (Chrome, Firefox, Edge).

### Q: Do I need to install anything?
**A:** No! Just open the HTML file. Zero installation.

### Q: Can multiple people use the same data?
**A:** Not directly. Each browser has its own data. Use Export/Import to share.

### Q: What if I accidentally delete something?
**A:** Restore from your JSON backup. That's why regular exports are important!

### Q: How much data can I store?
**A:** Browser localStorage limit is ~5-10MB. This can handle hundreds of resources.

### Q: Is this secure?
**A:** Yes! All data stays on your computer. Only AI API calls go to external servers.

---

## 🎓 Next Steps

### Learn More

- **[USER_GUIDE.md](USER_GUIDE.md)** - Comprehensive manual with every feature
- **[API_INTEGRATION.md](API_INTEGRATION.md)** - Detailed AI setup guide
- **[README.md](README.md)** - Full documentation and architecture

### Get Help

- Check the **Help** button (❓) in the app
- Read the Troubleshooting section in README
- Open an issue on GitHub

### Share Feedback

- What features would you like?
- What's confusing?
- What works great?

GitHub: https://github.com/Ottomatic-Mike/Resource-Training-Planning

---

## ✨ Pro Tips

1. **Use Tags**: Add tags to resources for filtering (coming in v1.1)
2. **Regular Exports**: Export JSON weekly as a habit
3. **Competency Reuse**: Define competencies once, use across team
4. **Calendar Templates**: Clone calendars for new years
5. **Budget Tracking**: Update spent amounts as courses are purchased
6. **Progress Updates**: Mark courses "Completed" when finished
7. **Notes Field**: Use resource notes for context and reminders

---

## 🎉 You're Ready!

You now know:
- ✅ How to open and explore the app
- ✅ What's in the sample data
- ✅ How to customize for your team
- ✅ How to create training plans
- ✅ How to protect your data
- ✅ Where to get help

**Happy training planning!** 🚀

---

*Questions? See [USER_GUIDE.md](USER_GUIDE.md) for detailed documentation.*
