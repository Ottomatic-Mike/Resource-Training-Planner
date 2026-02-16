# Training Plan Manager - Installation Guide

**Complete deployment guide for engineering managers**

This guide covers everything you need to deploy the Training Plan Manager web service on Windows, macOS, or Linux.

---

## 🎯 Quick Overview

**What you're installing:**
- A web service that runs on your local machine
- Accessible via browser at `http://localhost:3000`
- Powered by Docker (recommended) or Node.js (alternative)

**Prerequisites:**
- 10 minutes of setup time
- 2GB free disk space
- Administrator/sudo access on your machine

---

## 📋 Installation Methods

Choose one method:

| Method | Best For | Complexity | Setup Time |
|--------|----------|------------|------------|
| **Docker** (Recommended) | All users | Easy | 5 minutes |
| **Node.js** (Alternative) | Developers | Medium | 10 minutes |

---

## 🐳 Method 1: Docker Installation (Recommended)

Docker provides the simplest, most reliable deployment across all operating systems.

### Step 1: Install Docker Desktop

#### Windows

1. **Download Docker Desktop:**
   - Visit: https://www.docker.com/products/docker-desktop
   - Click "Download for Windows"
   - File: `Docker Desktop Installer.exe` (~500MB)

2. **Install Docker Desktop:**
   - Run the installer
   - Accept the license agreement
   - Choose "Use WSL 2 instead of Hyper-V" (recommended)
   - Click "Install"
   - Restart your computer when prompted

3. **Verify Installation:**
   - Open PowerShell (search for "PowerShell" in Start menu)
   - Run: `docker --version`
   - Expected output: `Docker version 24.x.x, build xxxxxxx`

**Troubleshooting Windows:**
- If you see "WSL 2 installation is incomplete", follow the Microsoft WSL installation instructions at: https://aka.ms/wsl2kernel
- Ensure virtualization is enabled in BIOS (check Task Manager → Performance → CPU → Virtualization: Enabled)

#### macOS

1. **Download Docker Desktop:**
   - Visit: https://www.docker.com/products/docker-desktop
   - Choose your Mac processor:
     - **Apple Silicon (M1/M2/M3):** Download "Mac with Apple chip"
     - **Intel Mac:** Download "Mac with Intel chip"
   - File: `Docker.dmg` (~500MB)

2. **Install Docker Desktop:**
   - Open the downloaded `Docker.dmg`
   - Drag Docker icon to Applications folder
   - Open Docker from Applications
   - Grant permissions when prompted
   - Wait for Docker to start (whale icon in menu bar)

3. **Verify Installation:**
   - Open Terminal (Applications → Utilities → Terminal)
   - Run: `docker --version`
   - Expected output: `Docker version 24.x.x, build xxxxxxx`

**Troubleshooting macOS:**
- If you see "Docker Desktop requires macOS 11 or newer", update your macOS version
- Grant Full Disk Access: System Preferences → Security & Privacy → Privacy → Full Disk Access → Enable Docker

#### Linux (Ubuntu/Debian)

1. **Install Docker Engine:**
   ```bash
   # Update package index
   sudo apt-get update

   # Install prerequisites
   sudo apt-get install ca-certificates curl gnupg

   # Add Docker's official GPG key
   sudo install -m 0755 -d /etc/apt/keyrings
   curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
   sudo chmod a+r /etc/apt/keyrings/docker.gpg

   # Set up the repository
   echo \
     "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
     $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
     sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

   # Install Docker Engine
   sudo apt-get update
   sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
   ```

2. **Add your user to docker group (avoid using sudo):**
   ```bash
   sudo usermod -aG docker $USER
   newgrp docker
   ```

3. **Verify Installation:**
   ```bash
   docker --version
   docker compose version
   ```

**Troubleshooting Linux:**
- If you see "permission denied", run: `sudo usermod -aG docker $USER && newgrp docker`
- For other distributions (Fedora, CentOS, Arch), see: https://docs.docker.com/engine/install/

### Step 2: Install Git

#### Windows

1. **Download Git:**
   - Visit: https://git-scm.com/download/win
   - Download automatically starts (Git-2.x.x-64-bit.exe)

2. **Install Git:**
   - Run the installer
   - Use default options (click "Next" through all screens)
   - Finish installation

3. **Verify Installation:**
   - Open PowerShell
   - Run: `git --version`
   - Expected output: `git version 2.x.x`

#### macOS

1. **Install Git (easiest via Homebrew):**
   ```bash
   # If you don't have Homebrew, install it first:
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

   # Install Git
   brew install git
   ```

   **Alternative (without Homebrew):**
   - Download from: https://git-scm.com/download/mac
   - Run the installer

2. **Verify Installation:**
   ```bash
   git --version
   ```

#### Linux

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install git

# Fedora
sudo dnf install git

# Arch
sudo pacman -S git
```

Verify: `git --version`

### Step 3: Clone the Repository

**Windows (PowerShell):**
```powershell
# Navigate to your preferred directory
cd $HOME\Documents

# Clone the repository
git clone https://github.com/Ottomatic-Mike/Resource-Training-Planning.git

# Navigate into the project
cd Resource-Training-Planning
```

**macOS/Linux (Terminal):**
```bash
# Navigate to your preferred directory
cd ~/Documents

# Clone the repository
git clone https://github.com/Ottomatic-Mike/Resource-Training-Planning.git

# Navigate into the project
cd Resource-Training-Planning
```

### Step 4: Deploy the Application

**Windows (PowerShell):**
```powershell
# From the Resource-Training-Planning directory
cd "Resource-Training-Planning"

# Start the application (builds and runs in background)
docker compose up -d

# Verify it's running
docker compose ps
```

**macOS/Linux (Terminal):**
```bash
# From the Resource-Training-Planning directory
cd Resource-Training-Planning

# Start the application (builds and runs in background)
docker compose up -d

# Verify it's running
docker compose ps
```

**What happens during deployment:**
1. Docker builds the application image (~2-3 minutes first time)
2. Creates a container named `training-plan-manager`
3. Starts the web service on port 3000
4. Runs health checks to ensure it's working

**Expected output:**
```
[+] Running 2/2
 ✔ Network training-manager-network     Created
 ✔ Container training-plan-manager      Started
```

### Step 5: Access the Application

1. **Open your web browser**
2. **Navigate to:** `http://localhost:3000`
3. **You should see:** Training Plan Manager interface

**Health Check:**
- Visit: `http://localhost:3000/health`
- Expected response: `{"status":"healthy","service":"training-plan-manager","version":"2.0.4",...}`

---

## 💻 Method 2: Node.js Installation (Alternative)

If you prefer not to use Docker, you can run the application directly with Node.js.

### Step 1: Install Node.js

#### Windows

1. **Download Node.js:**
   - Visit: https://nodejs.org/
   - Download "LTS" version (Long Term Support)
   - File: `node-v20.x.x-x64.msi`

2. **Install Node.js:**
   - Run the installer
   - Accept license agreement
   - Use default options
   - Click "Finish"

3. **Verify Installation:**
   - Open PowerShell
   - Run: `node --version`
   - Run: `npm --version`

#### macOS

1. **Install Node.js (via Homebrew - recommended):**
   ```bash
   # If you don't have Homebrew, install it first:
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

   # Install Node.js LTS
   brew install node@20
   ```

   **Alternative (direct download):**
   - Visit: https://nodejs.org/
   - Download macOS Installer
   - Run the installer

2. **Verify Installation:**
   ```bash
   node --version
   npm --version
   ```

#### Linux

```bash
# Ubuntu/Debian - Using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Fedora
sudo dnf install nodejs

# Arch
sudo pacman -S nodejs npm
```

Verify:
```bash
node --version
npm --version
```

### Step 2: Install Git (see Docker Method - Step 2)

### Step 3: Clone the Repository (see Docker Method - Step 3)

### Step 4: Install Dependencies and Run

**Windows (PowerShell):**
```powershell
# Navigate to the app directory
cd Resource-Training-Planning\Resource-Training-Planning\app

# Install dependencies
npm install

# Start the application
npm start
```

**macOS/Linux (Terminal):**
```bash
# Navigate to the app directory
cd Resource-Training-Planning/Resource-Training-Planning/app

# Install dependencies
npm install

# Start the application
npm start
```

**Expected output:**
```
============================================================
Training Plan Manager - Web Service
============================================================
Server running on: http://localhost:3000
Health check:      http://localhost:3000/health
Application:       http://localhost:3000
============================================================
```

### Step 5: Access the Application

Open browser and navigate to: `http://localhost:3000`

---

## 🔧 Post-Installation Configuration

### Configure AI Integration (Required for AI Features)

1. **Open the application** at `http://localhost:3000`
2. **Click "Settings"** (gear icon in top-right)
3. **Select AI Provider:**
   - Anthropic Claude (recommended)
   - OpenAI GPT
   - Google Gemini
4. **Enter your API Key:**
   - Get API key from your provider's website:
     - Anthropic: https://console.anthropic.com/
     - OpenAI: https://platform.openai.com/api-keys
     - Google: https://ai.google.dev/
5. **Click "Save Settings"**

### Load Sample Data (Optional)

To explore the application with example data:
1. Click "Settings" → "Data Management"
2. Click "Load Sample Data"
3. Explore pre-configured resources, competencies, and courses

---

## 🎮 Basic Usage

### Starting the Application

**Docker:**
```bash
# From the Resource-Training-Planning/Resource-Training-Planning directory
docker compose up -d
```

**Node.js:**
```bash
# From the app directory
npm start
```

### Stopping the Application

**Docker:**
```bash
docker compose down
```

**Node.js:**
Press `Ctrl+C` in the terminal

### Viewing Logs

**Docker:**
```bash
# View live logs
docker compose logs -f

# View last 50 lines
docker compose logs --tail=50
```

**Node.js:**
Logs appear directly in the terminal

### Updating to Latest Version

**Docker:**
```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker compose down
docker compose up -d --build
```

**Node.js:**
```bash
# Pull latest code
git pull origin main

# Reinstall dependencies (if package.json changed)
cd app
npm install

# Restart
npm start
```

---

## 🔍 Verification Checklist

After installation, verify everything works:

- [ ] Application loads at `http://localhost:3000`
- [ ] Health check shows "healthy" at `http://localhost:3000/health`
- [ ] Dashboard displays without errors
- [ ] Can navigate between all tabs (Dashboard, Resources, Competencies, Courses, etc.)
- [ ] Can create a new resource
- [ ] Can add a competency
- [ ] Settings page opens
- [ ] Data persists after refreshing the page

---

## 🆘 Common Issues

For detailed troubleshooting, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

### Docker Issues

**"docker: command not found"**
- Docker Desktop is not installed or not in PATH
- Solution: Reinstall Docker Desktop, restart terminal

**"Cannot connect to Docker daemon"**
- Docker Desktop is not running
- Solution: Start Docker Desktop application

**"Port 3000 is already in use"**
- Another application is using port 3000
- Solution: Stop the other application or change port in docker-compose.yml

**"Build failed" errors**
- Network issues or corrupted cache
- Solution: `docker compose build --no-cache`

### Node.js Issues

**"node: command not found"**
- Node.js is not installed or not in PATH
- Solution: Reinstall Node.js, restart terminal

**"npm install" fails**
- Network issues or permission problems
- Solution: Clear npm cache: `npm cache clean --force`, then retry

**"EADDRINUSE: Port 3000 already in use"**
- Another application is using port 3000
- Solution: Stop the other application or set PORT environment variable: `PORT=3001 npm start`

### Browser Issues

**Page doesn't load**
- Application hasn't started yet
- Solution: Wait 30 seconds after starting, check logs for errors

**"Cannot GET /"**
- Application started but can't find HTML file
- Solution: Verify `app/public/training-plan-manager.html` exists, restart application

---

## 📚 Next Steps

1. **Read the User Guide:** [USER_GUIDE.md](USER_GUIDE.md)
2. **Configure AI Integration:** [API_INTEGRATION.md](API_INTEGRATION.md)
3. **Review the Changelog:** [CHANGELOG.md](CHANGELOG.md)
4. **Join the Community:** https://github.com/Ottomatic-Mike/Resource-Training-Planning

---

## 💡 Tips for Success

- **Use Docker** if you're not familiar with Node.js - it's simpler and more reliable
- **Keep Docker Desktop running** - the application needs it to work
- **Bookmark** `http://localhost:3000` for easy access
- **Back up your data** regularly using Settings → Export Data
- **Update regularly** with `git pull` to get the latest features and fixes

---

## 📞 Getting Help

If you encounter issues not covered here:

1. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. Review [GitHub Issues](https://github.com/Ottomatic-Mike/Resource-Training-Planning/issues)
3. Open a new issue with:
   - Your operating system and version
   - Installation method (Docker/Node.js)
   - Exact error messages
   - Steps to reproduce

---

**Version:** 2.0.4
**Last Updated:** February 2026
**License:** MIT
