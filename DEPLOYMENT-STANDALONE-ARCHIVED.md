# Deployment Guide - Training Plan Manager

This guide helps you deploy the Training Plan Manager to avoid CORS (Cross-Origin Resource Sharing) issues when using AI features.

## Quick Decision Guide

**Choose your deployment method:**

| **Scenario** | **Best Option** | **Setup Time** | **Cost** |
|-------------|----------------|----------------|----------|
| Team using AI features regularly | GitHub Pages (Option 1) | 5 minutes | Free |
| Quick demo or testing | Local Web Server (Option 4) | 2 minutes | Free |
| Non-technical users | Netlify Drag & Drop (Option 2) | 3 minutes | Free |
| Need custom domain | Vercel (Option 3) | 5 minutes | Free |
| Can't deploy to web | CORS Proxy (Option 5) | 1 minute | Free |

---

## Understanding CORS

### What is CORS?

CORS (Cross-Origin Resource Sharing) is a browser security feature that blocks web pages from making requests to different domains than the one serving the page.

### When Does It Happen?

**CORS Issues Occur When:**
- Opening `training-plan-manager.html` directly from filesystem (`file://` protocol)
- Making AI API calls to Anthropic, OpenAI, or Google from local file

**CORS Issues DO NOT Occur When:**
- Serving the file from any web server (even `localhost`)
- File is accessed via `http://` or `https://` protocol

### Why the Standalone File Still Works

The application is designed to work standalone for all features **except** AI integration:

✅ **Works Without Server:**
- All data management (resources, competencies, courses, calendars)
- Training plan creation (manual)
- Reports and analytics
- Import/Export functionality
- localStorage persistence

⚠️ **Requires Server or Proxy:**
- AI-powered competency assessment
- AI goal suggestions
- AI course discovery
- AI schedule optimization

---

## Option 1: GitHub Pages (Recommended)

**Best for:** Teams, permanent deployments, sharing with others

### Prerequisites
- GitHub account (free)
- Git installed on your computer

### Step-by-Step Setup

#### 1. Create GitHub Repository

```bash
# Navigate to your project directory
cd "d:\OneDrive\gitprojects\Resource-Training-Planning\Resource-Training-Planning"

# If not already a git repo, initialize
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Training Plan Manager"

# Create repo on GitHub (via web or CLI)
gh repo create training-plan-manager --public --source=. --remote=origin --push
```

#### 2. Enable GitHub Pages

1. Go to your GitHub repository
2. Click **Settings** → **Pages** (left sidebar)
3. Under **Source**, select:
   - Branch: `main`
   - Folder: `/ (root)`
4. Click **Save**

#### 3. Access Your Application

After 1-2 minutes, your app will be available at:
```
https://<your-username>.github.io/training-plan-manager/training-plan-manager.html
```

### Benefits
✅ Free hosting forever
✅ Automatic HTTPS
✅ Global CDN (fast worldwide)
✅ Version control built-in
✅ Easy updates (just `git push`)
✅ No server management
✅ **Zero CORS issues**

### Updating Your Deployment

```bash
# Make changes to training-plan-manager.html
# Save your changes

# Commit and push
git add training-plan-manager.html
git commit -m "Update training plan manager"
git push origin main

# Changes appear on GitHub Pages in 1-2 minutes
```

---

## Option 2: Netlify (Easiest)

**Best for:** Non-technical users, drag-and-drop deployment

### Step-by-Step Setup

#### 1. Create Netlify Account
- Go to [netlify.com](https://www.netlify.com/)
- Sign up (free account)

#### 2. Deploy via Drag & Drop

1. Click **"Add new site"** → **"Deploy manually"**
2. **Drag and drop** `training-plan-manager.html` into the upload zone
3. Wait 10 seconds for deployment

#### 3. Access Your Application

Netlify provides instant URL:
```
https://<random-name>.netlify.app/training-plan-manager.html
```

### Benefits
✅ Absolutely no technical knowledge required
✅ Instant deployment (10 seconds)
✅ Free HTTPS
✅ Custom domain support
✅ Automatic CDN
✅ **Zero CORS issues**

### Optional: Custom Domain

1. In Netlify dashboard → **Domain settings**
2. Click **Add custom domain**
3. Enter your domain (e.g., `training.yourcompany.com`)
4. Follow DNS configuration instructions

---

## Option 3: Vercel (Developer-Friendly)

**Best for:** Developers, teams using Git workflows

### Step-by-Step Setup

#### 1. Install Vercel CLI

```bash
npm install -g vercel
```

#### 2. Deploy

```bash
# Navigate to project directory
cd "d:\OneDrive\gitprojects\Resource-Training-Planning\Resource-Training-Planning"

# Deploy (follow prompts)
vercel

# For production deployment
vercel --prod
```

#### 3. Access Your Application

Vercel provides instant URL:
```
https://<project-name>.vercel.app/training-plan-manager.html
```

### Benefits
✅ Zero-config deployment
✅ Instant global CDN
✅ Automatic HTTPS
✅ Preview deployments for testing
✅ Custom domains
✅ **Zero CORS issues**

### Git Integration

Connect your GitHub repo for automatic deployments:

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Import Project"**
3. Select your GitHub repository
4. Every `git push` auto-deploys

---

## Option 4: Local Web Server (Testing)

**Best for:** Quick testing, development, offline use

### Method 1: Python (Simplest)

**If you have Python installed:**

```bash
# Navigate to project directory
cd "d:\OneDrive\gitprojects\Resource-Training-Planning\Resource-Training-Planning"

# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080
```

**Access at:** `http://localhost:8080/training-plan-manager.html`

### Method 2: Node.js

**If you have Node.js installed:**

```bash
# Install http-server globally (one-time)
npm install -g http-server

# Navigate to project directory
cd "d:\OneDrive\gitprojects\Resource-Training-Planning\Resource-Training-Planning"

# Start server
http-server -p 8080
```

**Access at:** `http://localhost:8080/training-plan-manager.html`

### Method 3: PHP

**If you have PHP installed:**

```bash
# Navigate to project directory
cd "d:\OneDrive\gitprojects\Resource-Training-Planning\Resource-Training-Planning"

# Start server
php -S localhost:8080
```

**Access at:** `http://localhost:8080/training-plan-manager.html`

### Benefits
✅ Works offline
✅ No external dependencies
✅ Perfect for development
✅ **Zero CORS issues**

### Limitations
⚠️ Only accessible on your computer
⚠️ Server stops when you close terminal
⚠️ Not suitable for team sharing

---

## Option 5: CORS Proxy (Fallback)

**Best for:** Cannot deploy to web server, quick workaround

### Current Implementation (v1.0.26)

The application **already has smart CORS handling** built-in:

1. **Tries direct API call first** (no proxy)
2. **Falls back to proxy** if CORS error detected
3. **Provides helpful guidance** if proxy not configured

### Setup CORS Proxy

#### 1. Open Settings

In the application:
1. Click **Settings** (⚙️) in header
2. Scroll to **Advanced Settings**
3. Find **CORS Proxy** field

#### 2. Configure Proxy

**Option A: Use Public Proxy (Quick)**

Enter one of these public proxies:
```
https://cors-anywhere.herokuapp.com/
```

**Option B: Run Your Own Proxy (Recommended)**

```bash
# Install cors-anywhere
npm install -g cors-anywhere

# Run proxy server
cors-anywhere

# Use in settings:
http://localhost:8080/
```

#### 3. Save Settings

Click **Save Settings** and retry your AI features.

### Benefits
✅ Quick setup (1 minute)
✅ No deployment required
✅ Works with local file

### Limitations
⚠️ Public proxies may be rate-limited or unavailable
⚠️ Adds latency to API calls
⚠️ Less reliable than web server deployment
⚠️ Not recommended for production use

---

## Comparison Matrix

| Feature | GitHub Pages | Netlify | Vercel | Local Server | CORS Proxy |
|---------|-------------|---------|--------|--------------|------------|
| **Free** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **No Setup** | ❌ | ✅ | ❌ | ❌ | ✅ |
| **Team Access** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Custom Domain** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Offline** | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Reliability** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| **Speed** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |

---

## Troubleshooting

### Still Getting CORS Errors After Deployment

**Check these:**

1. **Verify you're accessing via HTTP/HTTPS** (not `file://`)
   - ✅ Correct: `https://yoursite.com/training-plan-manager.html`
   - ❌ Wrong: `file:///C:/Users/.../training-plan-manager.html`

2. **Clear browser cache**
   - Press `Ctrl+Shift+Delete` (Chrome/Edge)
   - Clear cached files
   - Reload page

3. **Check API key is configured**
   - Settings → AI Configuration
   - Verify API key is entered
   - Verify provider is selected

4. **Test with browser console open**
   - Press `F12` → Console tab
   - Look for specific error messages
   - Share errors if issue persists

### AI Features Not Working

**Verify:**

1. **API Key Valid**
   - Check your provider dashboard (Anthropic/OpenAI/Google)
   - Verify key has credits/quota remaining
   - Regenerate key if needed

2. **Provider Selected Correctly**
   - Settings → AI Provider dropdown
   - Match provider to your API key

3. **Model Name Correct**
   - Anthropic: `claude-3-5-sonnet-20241022`
   - OpenAI: `gpt-4-turbo`, `gpt-4`, `gpt-3.5-turbo`
   - Google: `gemini-pro`

### Deployment Not Updating

**Solutions:**

- **GitHub Pages:** Wait 1-2 minutes after push
- **Netlify:** Check deployment logs in dashboard
- **Vercel:** Check deployment status in dashboard
- **All:** Try hard refresh (`Ctrl+Shift+R`)

---

## Security Considerations

### API Keys

**Where Keys Are Stored:**
- Browser localStorage only
- Never sent to any server except your chosen AI provider
- Stays on user's computer

**Best Practices:**
1. Use API keys with spending limits
2. Rotate keys periodically
3. Don't share keys between users
4. Monitor usage in provider dashboard

### Data Privacy

**All data remains local:**
- Resources, competencies, courses, calendars: localStorage
- Training plans: localStorage
- Backups: User's computer via Export function

**Only AI prompts are sent externally:**
- Sent directly to chosen AI provider (Anthropic/OpenAI/Google)
- No intermediary servers
- Provider's privacy policy applies

---

## Recommended Production Setup

For teams deploying for actual use:

### 1. **Deploy to GitHub Pages or Netlify**
   - Permanent, reliable hosting
   - Free HTTPS
   - Global CDN

### 2. **Configure Custom Domain** (Optional)
   - `training.yourcompany.com`
   - Professional appearance
   - Easy to remember

### 3. **Document Access for Team**
   - Share URL in team wiki
   - Include setup guide (API key configuration)
   - Provide support contact

### 4. **Set Up Backups**
   - Encourage users to export data regularly
   - Store exports in shared drive or version control
   - Schedule monthly export reminders

### 5. **Monitor Usage**
   - Check AI provider dashboards for API usage
   - Set spending alerts
   - Rotate API keys quarterly

---

## Support

### Documentation
- [README.md](README.md) - Application overview
- [USER_GUIDE.md](USER_GUIDE.md) - Complete user manual
- [API_INTEGRATION.md](API_INTEGRATION.md) - AI setup details
- [CHANGELOG.md](CHANGELOG.md) - Version history

### Issues
- GitHub Issues: [Report a problem](https://github.com/Ottomatic-Mike/Resource-Training-Planning/issues)
- Discussions: [Ask questions](https://github.com/Ottomatic-Mike/Resource-Training-Planning/discussions)

---

**Last Updated:** January 24, 2025
**Application Version:** 1.0.26
