# Changelog

All notable changes to the Training Plan Manager will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2024-01-24

### Added - Initial Release

#### Core Application
- **Single-file HTML architecture** (125KB, 3,787 lines)
- **Tab-based navigation** with 7 main sections
- **Auto-save functionality** with localStorage persistence
- **Comprehensive data models** for resources, competencies, courses, calendars, and plans
- **Modal dialog system** for forms and details
- **Settings management** with user preferences
- **Help system** with in-app documentation

#### Dashboard (Tab 1)
- At-a-glance metrics cards (resources, budget, training plans)
- Resources overview table with status indicators
- Quick actions for common tasks
- Upcoming deadlines widget
- Recent activity timeline

#### Resource Management (Tab 2)
- Full CRUD operations for team members
- Resource profiles with budget tracking
- Competency assignments (current and desired)
- Course assignments and progress tracking
- Search and filter capabilities
- Card-based layout for easy browsing

#### Competency Library (Tab 3)
- Centralized, reusable skill definitions
- 5-level proficiency framework (Awareness to Expert)
- Category and subcategory organization
- Usage tracking across resources
- Detailed proficiency level descriptions
- Data integrity checks on deletion
- Pre-loaded sample: 18 competencies across 5 categories

#### Course Catalog (Tab 4)
- Comprehensive course database
- Multiple provider support (Udemy, Coursera, SANS, etc.)
- Cost, duration, format, and skill level tracking
- Rating and review count display
- Certification indicators
- Provider and format filtering
- Pre-loaded sample: 12 courses from various providers

#### Training Plans (Tab 5)
- 6-step wizard for guided plan creation
- Step 1: Resource selection with profile view
- Step 2: Competency assessment (manual and AI-assisted)
- Step 3: Goal definition with priorities and target dates
- Step 4: Course discovery and selection
- Step 5: Schedule optimization with conflict detection
- Step 6: Comprehensive plan review and approval
- Plan status management (Draft, Active, Completed, etc.)

#### Calendar Management (Tab 6)
- Regional holiday calendar templates
- Holiday management (recurring and one-time)
- Calendar cloning for new years
- Resource calendar assignment
- Pre-loaded: US Federal Holidays 2024, UK Bank Holidays 2024

#### Reports & Analytics (Tab 7)
- Budget utilization report with visualizations
- Training progress tracking
- Competency gap analysis
- Course effectiveness metrics (framework for future data)
- Data management tools (import/export)

#### AI Integration
- **Anthropic Claude support** - Competency analysis, goal suggestions, course discovery
- **OpenAI GPT-4 support** - All AI features
- **Google Gemini support** - Alternative AI provider
- Configurable AI settings (provider, model, API key, temperature)
- Privacy-focused implementation (minimal data transmission)
- Error handling and fallback to manual mode

#### Data Management
- **Export to JSON** - Complete data backup with timestamp
- **Import from JSON** - Full data restore with validation
- **Export to Excel** - Multi-sheet workbook (Resources, Competencies, Courses, Plans)
- **Sample data loader** - Pre-configured examples for testing
- **Clear all data** - Reset with double confirmation
- Auto-save with configurable interval (default: 2 seconds)
- Save indicator with status feedback

#### Design & UX
- **Custom CSS design system** - Teal/green professional theme
- **Responsive grid layouts** - 2, 3, and 4-column grids
- **Card-based components** - Consistent visual language
- **Progress bars and indicators** - Visual status feedback
- **Badge system** - Status, priority, and category labels
- **Empty states** - Helpful guidance when no data
- **Loading states** - User feedback during operations
- **Smooth animations** - Fade-in transitions for tab switching

#### External Libraries (CDN)
- Chart.js v4.4.0 - For radar charts and visualizations (framework in place)
- SortableJS v1.15.0 - Drag-and-drop functionality (ready for future use)
- XLSX v0.18.5 - Excel export functionality

#### Sample Data
- 6 sample resources (engineers across 6 locations)
- 18 sample competencies (Programming, Cloud, DevOps, Security, Data, Soft Skills)
- 12 sample courses (various providers, costs, and formats)
- 2 regional calendars (US, UK)
- Realistic budget allocations and spending

#### Documentation
- Comprehensive README.md with quick start
- START_HERE.md - 5-minute onboarding guide
- USER_GUIDE.md - Complete feature documentation
- API_INTEGRATION.md - AI setup and configuration
- CHANGELOG.md - Version history tracking

### Technical Details

#### Architecture
- Vanilla JavaScript (no frameworks)
- Global state management with localStorage
- Dynamic HTML rendering
- Event-driven updates
- Debounced auto-save
- Client-side only (no backend)

#### Data Model
- Resources with competencies, budgets, and availability
- Competencies with 5-level proficiency definitions
- Courses with provider, cost, and quality metrics
- Regional calendars with recurring holiday support
- Training plans with scheduling and budget tracking
- Settings with AI configuration and preferences

#### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Modern browser with JavaScript and localStorage support

#### Performance
- File size: 125KB (uncompressed)
- Initial load: < 1 second on modern hardware
- Data operations: Instant for < 100 resources
- Auto-save: Debounced, non-blocking

### Security & Privacy

- All data stored locally in browser
- No external data transmission (except AI API calls)
- API keys stored in localStorage (user responsibility)
- No analytics or tracking
- No cookies
- HTTPS recommended but not required

### Known Limitations

- **Radar charts not yet implemented** - Chart.js loaded but competency radar charts coming in v1.1
- **Timeline visualization pending** - Gantt charts for training schedules planned
- **Limited mobile support** - Optimized for desktop browsers
- **No collaboration features** - Single-user per browser instance
- **localStorage size limit** - ~5-10MB browser-dependent
- **No offline AI** - AI features require internet connection
- **Manual course discovery** - AI course search uses provider API (not web scraping)

### Future Roadmap

See README.md for planned features in v1.1, v1.2, and v2.0.

---

## [Unreleased]

### Planned for v1.1
- [ ] Competency radar charts (Chart.js integration)
- [ ] Timeline/Gantt visualization for training schedules
- [ ] Email export of training plans (mailto: links)
- [ ] Dark mode theme toggle
- [ ] Keyboard shortcuts
- [ ] Improved search with fuzzy matching
- [ ] Resource tagging system

### Planned for v1.2
- [ ] Multi-resource plan comparison
- [ ] Team-wide competency heatmaps
- [ ] Budget forecasting and scenarios
- [ ] Advanced filtering (multiple criteria)
- [ ] Course recommendation engine (without AI)
- [ ] Training plan templates
- [ ] Progress notifications

### Planned for v2.0
- [ ] Optional backend for collaboration
- [ ] Mobile-responsive design
- [ ] PDF export of training plans
- [ ] iCalendar export
- [ ] Email reminders for deadlines
- [ ] Integration with calendar apps
- [ ] Role-based access (manager vs resource views)
- [ ] Audit trail and change history

---

## Version History

| Version | Date | Type | Description |
|---------|------|------|-------------|
| 1.0.0 | 2024-01-24 | Initial Release | Full-featured training plan manager |

---

## Upgrade Guide

### From No Previous Version → v1.0.0

This is the initial release. Simply:
1. Download `training-plan-manager.html`
2. Open in browser
3. Load sample data or start fresh

---

## Breaking Changes

None (initial release).

---

## Contributors

- Training Plan Manager Development Team
- Built with assistance from Claude (Anthropic)
- Inspired by Resource-Budgeting-and-Priorities architecture

---

## Support

- **Documentation**: See README.md, USER_GUIDE.md, API_INTEGRATION.md
- **Issues**: https://github.com/Ottomatic-Mike/Resource-Training-Planning/issues
- **Discussions**: https://github.com/Ottomatic-Mike/Resource-Training-Planning/discussions

---

*For detailed upgrade instructions and migration guides, see individual version sections above.*

*This changelog follows [Keep a Changelog](https://keepachangelog.com/) format.*
