# Training Plan Manager

**AI-Assisted Training Planning for Engineering Teams**

A powerful, self-contained web application that enables engineering managers to create comprehensive, AI-assisted training plans for their technical team members. Built as a single HTML file with zero dependencies and no backend required.

![Version](https://img.shields.io/badge/version-1.0.17-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)

---

## 🌟 Features

### Core Capabilities

- **📊 Dashboard** - At-a-glance overview of your entire training program
  - Team metrics and budget utilization
  - Resource overview with status indicators
  - Upcoming deadlines and recent activity

- **👥 Resource Management** - Complete team member profiles
  - Track competencies, budgets, and availability
  - Personal calendars with time-off and blackout periods
  - Individual training plans and progress tracking

- **🎯 Competency Library** - Reusable skill definitions
  - 5-level proficiency framework (Awareness → Expert)
  - Categorized by domain (Programming, Cloud, Security, Data, etc.)
  - Usage tracking across resources

- **📚 Course Catalog** - Centralized course database
  - Multiple providers (Udemy, Coursera, SANS, AWS, etc.)
  - Cost, duration, format, and rating tracking
  - Certification indicators

- **🧙 Training Plan Wizard** - 6-step guided plan creation
  - AI-powered competency assessment
  - Intelligent goal suggestions
  - Course discovery and recommendations
  - Schedule optimization with conflict detection

- **📅 Calendar Management** - Regional holiday templates
  - US Federal Holidays, UK Bank Holidays, and custom calendars
  - Recurring and one-time events
  - Resource assignment tracking

- **📈 Reports & Analytics** - Data-driven insights
  - Budget utilization by resource
  - Training progress and completion rates
  - Competency gap analysis
  - Course effectiveness metrics

### AI Integration

- **Competency Assessment** - Analyze job roles and suggest relevant competencies
- **Goal Recommendations** - Career progression and team-based suggestions
- **Course Discovery** - Search and recommend optimal training courses
- **Schedule Optimization** - Balance availability, holidays, and learning pace

### Data Management

- **Auto-Save** - Automatic localStorage persistence (configurable interval)
- **Import/Export** - JSON backup/restore functionality
- **Excel Export** - Export all data to spreadsheet format
- **Sample Data** - Pre-loaded examples to get started quickly

---

## 🚀 Quick Start

### Option 1: Open Directly (Fastest)

1. **Download** the `training-plan-manager.html` file
2. **Double-click** to open in your default browser
3. **Click** "Load Sample Data" in the Reports tab to see it in action

### Option 2: Clone Repository

```bash
git clone https://github.com/Ottomatic-Mike/Resource-Training-Planning.git
cd Resource-Training-Planning
# Open training-plan-manager.html in your browser
```

### Option 3: Use from Web Server

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Then navigate to http://localhost:8000/training-plan-manager.html
```

---

## 📖 Usage

### First-Time Setup

1. **Open the application** in your browser
2. **Click Settings (⚙️)** in the header
3. **Configure preferences**:
   - Currency (USD, EUR, GBP)
   - Date format
   - Default budget and weekly hours
4. **(Optional)** Add your AI API key for intelligent features
5. **Click "Load Sample Data"** in Reports tab to explore with examples

### Creating Your First Resource

1. Navigate to **Resources** tab
2. Click **+ Add Resource**
3. Fill in details:
   - Name, job title, department
   - Location and email
   - Annual training budget
   - Weekly available hours
4. Click **Add Resource**

### Building a Training Plan

1. Navigate to **Training Plans** tab
2. Click **+ Create Training Plan**
3. Follow the 6-step wizard:
   - **Step 1**: Select team member
   - **Step 2**: Assess current competencies
   - **Step 3**: Define training goals
   - **Step 4**: Discover relevant courses
   - **Step 5**: Optimize schedule
   - **Step 6**: Review and approve

### Managing Competencies

1. Navigate to **Competencies** tab
2. Click **+ Add Competency**
3. Define:
   - Name (e.g., "Python Programming")
   - Category (e.g., "Programming Languages")
   - Subcategory (e.g., "Backend Development")
   - Description
4. Use across multiple resources

### Adding Courses

1. Navigate to **Course Catalog** tab
2. Click **+ Add Course**
3. Enter details:
   - Title, provider, cost
   - Duration, format, skill level
   - Rating and certification status
   - URL for reference

---

## 🤖 AI Integration Setup

### Supported Providers

- **Anthropic Claude** (Recommended) - Best for technical analysis
- **OpenAI GPT** - Strong general-purpose capabilities (GPT-5.2, GPT-4.1, etc.)
- **Google Gemini** - Alternative option

### Configuration Steps

1. **Obtain API Key**:
   - Anthropic: https://console.anthropic.com/
   - OpenAI: https://platform.openai.com/api-keys
   - Google: https://makersuite.google.com/

2. **Configure in Settings**:
   - Click Settings ⚙️
   - Select AI Provider
   - Enter API Key
   - Choose model (e.g., `claude-3-5-sonnet-20241022`)
   - Set temperature (0.0-1.0, default 0.7)

3. **Test Integration**:
   - Create a new training plan
   - Use AI features in the wizard
   - Check for successful responses

**Privacy Note**: Your API key is stored locally in your browser and only sent to your chosen AI provider.

See [API_INTEGRATION.md](API_INTEGRATION.md) for detailed instructions.

---

## 💾 Data Management

### Local Storage

All data is stored in your browser's localStorage:
- **Location**: Browser-specific localStorage
- **Key**: `trainingPlanManager_autoSave`
- **Auto-save**: Every 2 seconds (configurable)
- **Persistence**: Survives browser restarts, not clearing cache

### Backup & Restore

**Export to JSON**:
1. Reports tab → "Export to JSON"
2. File downloads with timestamp
3. Store safely (version control, cloud storage)

**Import from JSON**:
1. Reports tab → "Import from JSON"
2. Select previously exported file
3. Confirms before replacing data

**Export to Excel**:
1. Reports tab → "Export to Excel"
2. Multi-sheet workbook with all data
3. Opens in Excel, Google Sheets, etc.

### Data Security

- **Local-only**: No server uploads (except AI API calls)
- **Private**: Data never leaves your computer
- **Portable**: Copy HTML file + export JSON = full backup
- **No tracking**: No analytics or telemetry

---

## 🏗️ Architecture

### Technical Stack

- **HTML5** - Single-file application
- **CSS3** - Custom design system, no frameworks
- **Vanilla JavaScript** - No frameworks (React, Vue, Angular)
- **localStorage** - Client-side persistence
- **CDN Libraries**:
  - Chart.js v4.4.0 - Radar charts and visualizations
  - SortableJS v1.15.0 - Drag-and-drop functionality
  - XLSX v0.18.5 - Excel export

### Design Patterns

- **Single File Architecture** - Zero build process
- **Global State Management** - Simple, predictable state
- **Tab-based Navigation** - 7 main application sections
- **Dynamic Rendering** - JavaScript-generated HTML
- **Auto-save Pattern** - Debounced persistence
- **Modal Dialogs** - Overlay forms and details

### File Structure

```
training-plan-manager.html (125KB, 3,787 lines)
├── <head>
│   ├── Metadata
│   └── CDN library imports
├── <style>
│   └── Complete CSS design system (~1,000 lines)
├── <body>
│   ├── Header
│   ├── Tab navigation
│   ├── Tab content containers
│   └── Modal overlays
└── <script>
    ├── Global state (~50 lines)
    ├── Initialization (~100 lines)
    ├── Tab management (~50 lines)
    ├── Save/load functions (~100 lines)
    ├── CRUD operations (~500 lines)
    ├── Render functions (~1,500 lines)
    ├── AI integration (~200 lines)
    ├── Wizard logic (~300 lines)
    ├── Import/export (~200 lines)
    └── Sample data (~600 lines)
```

### Data Model

```javascript
// Core entities
resources[]           // Team members
competencyLibrary[]   // Skill definitions
courseCatalog[]       // Available courses
regionalCalendars[]   // Holiday templates
trainingPlans[]       // Generated plans
settings{}            // App configuration
```

See the [specification](Resource-Training-Planning/README.md) for complete data model details.

---

## 🎨 Customization

### Theme Colors

Edit CSS variables in `<style>`:

```css
:root {
    --primary-color: #044d4b;      /* Teal */
    --secondary-color: #81b5a1;    /* Green */
    /* Modify to match your brand */
}
```

### Default Settings

Edit in JavaScript section:

```javascript
let settings = {
    currency: 'USD',               // USD, EUR, GBP
    currencySymbol: '$',
    dateFormat: 'MM/DD/YYYY',      // MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD
    defaultWeeklyHours: 5,
    defaultBudget: 5000,
    defaultLearningPace: 'Moderate',
    autoSaveInterval: 2000,        // Milliseconds
    confirmBeforeDelete: true
};
```

### Sample Data

Modify `loadSampleCompetencies()`, `loadSampleCourses()`, etc. to customize the pre-loaded examples.

---

## 🔧 Troubleshooting

### Application won't load

- **Check browser console** for errors (F12)
- **Verify libraries loaded** - Check network tab for CDN failures
- **Try different browser** - Chrome, Firefox, Edge recommended
- **Disable extensions** - Ad blockers may interfere

### Data not saving

- **Check localStorage quota** - Browser limit ~5-10MB
- **Private/Incognito mode** - May block localStorage
- **Export to JSON** - Manual backup as workaround

### AI features not working

- **Verify API key** - Settings → Check key is entered
- **Check network** - Browser console for API errors
- **Confirm balance** - API provider account has credits
- **Try different provider** - Switch between Claude/GPT/Gemini

### Import fails

- **Validate JSON** - Use JSONLint.com to check format
- **Check version** - Older exports may be incompatible
- **File corruption** - Re-export from source

---

## 📚 Documentation

- **[USER_GUIDE.md](USER_GUIDE.md)** - Comprehensive user manual
- **[API_INTEGRATION.md](API_INTEGRATION.md)** - AI setup and configuration
- **[CHANGELOG.md](CHANGELOG.md)** - Version history
- **[START_HERE.md](START_HERE.md)** - Onboarding guide

---

## 🤝 Contributing

Contributions are welcome! This project follows these principles:

1. **Single-file architecture** - Keep it self-contained
2. **Zero dependencies** - No npm, no build tools
3. **Vanilla JavaScript** - No frameworks
4. **Privacy-first** - Local-only by default

### Reporting Issues

Open an issue on GitHub with:
- Browser and version
- Steps to reproduce
- Expected vs actual behavior
- Console errors (if any)

### Feature Requests

Suggest enhancements via GitHub issues. Please include:
- Use case description
- Why it's valuable
- How it fits the architecture

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

Copyright (c) 2024 Training Plan Manager

---

## 🙏 Acknowledgments

- **Reference Architecture**: [Resource-Budgeting-and-Priorities](https://github.com/Ottomatic-Mike/Resource-Budgeting-and-Priorities)
- **AI Integration**: Anthropic Claude API
- **Libraries**: Chart.js, SortableJS, XLSX
- **Icons**: Unicode emoji (no external dependencies)

---

## 📞 Support

- **Documentation**: This README and linked guides
- **Issues**: [GitHub Issues](https://github.com/Ottomatic-Mike/Resource-Training-Planning/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Ottomatic-Mike/Resource-Training-Planning/discussions)

---

## 🗺️ Roadmap

### v1.1 (Planned)
- [ ] Competency radar charts (Chart.js integration)
- [ ] Timeline/Gantt visualization for training schedules
- [ ] Email export of training plans (mailto: links)
- [ ] Dark mode theme toggle

### v1.2 (Planned)
- [ ] Multi-resource plan comparison
- [ ] Team-wide competency heatmaps
- [ ] Budget forecasting and scenarios
- [ ] Advanced filtering and search

### v2.0 (Future)
- [ ] Collaborative features (optional backend)
- [ ] Mobile-responsive design
- [ ] PDF export of training plans
- [ ] Integration with calendar apps (iCal)

---

**Built with ❤️ for engineering managers who care about team development**

*Last updated: January 24, 2024*
