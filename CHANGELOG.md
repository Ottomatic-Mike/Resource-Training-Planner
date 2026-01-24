# Changelog

All notable changes to the Training Plan Manager will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.5] - 2024-01-24

### Added
- **Intelligent AI Model Selection System** - Comprehensive model selection with guidance and recommendations
  - Model dropdown for each AI provider replacing manual text input
  - Detailed model information cards showing strengths, use cases, and costs
  - Recommended model badges (⭐) for optimal training planning
  - Cost indicators with color coding (low, medium, high, very-high)
  - Key strengths display as badges for each model
  - Use case descriptions specific to training plan creation
  - Cost per 1M tokens for budgeting decisions
  - Model database with 5 Anthropic models, 4 OpenAI models, 3 Google models

### Changed
- **AI Model field** - Changed from text input to intelligent dropdown with model details
- **Settings layout** - Organized into sections (AI Configuration, Application Settings)
- **Model selection** - Automatically updates when changing providers to show relevant models
- **Provider switching** - Automatically selects recommended model when changing providers
- **Default models** - Set to recommended models: Claude 3.5 Sonnet (New), GPT-4 Turbo, Gemini 1.5 Pro

### Fixed
- **Model validation** - Ensures selected model is valid for chosen provider
- **Backward compatibility** - Validates and updates models for existing users on load
- **Provider mismatch** - Automatically corrects invalid model/provider combinations

---

## [1.0.4] - 2024-01-24

### Added
- **Resource-Calendar Correlation System** - Comprehensive relationship management between resources and calendars
  - Calendar dropdown in "Add Resource" form for selecting regional calendar
  - Calendar dropdown in "Edit Resource" form for changing calendar assignment
  - Calendar display in resource detail view with clickable link to calendar
  - Resource list in calendar detail view showing all assigned resources
  - Visual calendar badge indicator on resource cards showing region
  - Cross-navigation between resources and calendars with automatic tab switching
  - "No Calendar" option for resources without calendar assignment

### Changed
- **Resource forms** - Added "Regional Calendar" field with dropdown of available calendars
- **Resource detail view** - Now displays assigned calendar with clickable link to view calendar details
- **Resource cards** - Added calendar region badge next to location for quick identification
- **Calendar detail view** - Enhanced to show table of all resources using that calendar
- **Cross-tab navigation** - Resources can navigate to their calendar, calendars can navigate to their resources

### Fixed
- **Calendar correlation** - Resources and calendars now have clear, bidirectional relationship visibility
- **Calendar selection** - Easy assignment of calendars when adding or editing resources
- **Resource visibility** - Clear indication of which resources use each calendar

---

## [1.0.3] - 2024-01-24

### Added
- **Category and Subcategory Management System** - Comprehensive management interface within Competencies tab
  - "Manage Categories" button in Competencies tab for centralized category management
  - Add, edit, and delete categories independently without creating competencies
  - Add, edit, and delete subcategories with parent category relationships
  - Hierarchical category view showing all subcategories under each category
  - "View Details" function to drill down into individual categories
  - Visual display of competency count per category and subcategory
  - Data integrity checks when deleting categories or subcategories
  - Clear relationship documentation showing category-subcategory-competency hierarchy

### Changed
- **Enhanced openModal() function** - Now accepts optional `modalClass` parameter for sizing (e.g., 'modal-large')
- **Competencies tab header** - Added "Manage Categories" button alongside "Add Competency"
- **Category operations** - Editing or deleting categories now properly updates all associated competencies
- **Subcategory operations** - Full CRUD operations with parent category relationship preservation

### Fixed
- **Category creation workflow** - Categories and subcategories can now be created independently before adding competencies
- **Relationship management** - Clear establishment and maintenance of category-to-subcategory relationships
- **Data consistency** - All category/subcategory changes automatically update associated competencies

---

## [1.0.2] - 2024-01-24

### Fixed
- **Competency category modularity** - Implemented dropdown menus for categories and subcategories
  - Categories and subcategories from existing competencies now available in dropdown menus
  - Prevents mis-categorization and reduces repeat effort
  - Dynamic subcategory filtering based on selected category
  - "Add New" options allow custom categories and subcategories
  - Maintains backward compatibility with existing competency data

### Added
- **Helper functions** for competency management:
  - `getUniqueCategories()` - Extracts all unique category names from competency library
  - `getSubcategoriesForCategory(category)` - Extracts subcategories for a specific category
  - `handleCategoryChange()` - Updates subcategory dropdown when category changes
  - `handleSubcategoryChange()` - Shows/hides custom input when "Add New" is selected

### Changed
- **Add Competency form** now uses dropdown menus instead of plain text inputs for categories and subcategories
- **Enhanced validation** in `saveNewCompetency()` to handle both dropdown selections and custom input values
- **Improved user experience** - Consistent categorization across all competencies

---

## [1.0.1] - 2024-01-24

### Fixed
- **Resource editing functionality** - Implemented missing `editResource()` and `saveResourceEdits()` functions
  - Edit button in resource detail modal now fully functional
  - All resource fields can be edited: name, title, department, location, email, budgets, weekly hours
  - Added **Budget Spent** field to edit form for tracking actual expenditures
  - Form pre-populates with current resource data
  - Validation ensures name field is required
  - Last modified timestamp automatically updates on save
  - Maintains same clean UI/UX as add resource form

### Changed
- **Enhanced budget tracking** - Budget spent can now be edited directly when updating a resource
- **Improved user experience** - Users can now modify resource information after initial creation

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
| 1.0.5 | 2024-01-24 | Feature | Intelligent AI model selection system |
| 1.0.4 | 2024-01-24 | Feature | Resource-calendar correlation system |
| 1.0.3 | 2024-01-24 | Feature | Category/subcategory management system |
| 1.0.2 | 2024-01-24 | Enhancement | Competency category modularity with dropdowns |
| 1.0.1 | 2024-01-24 | Bug Fix | Fixed resource editing functionality |
| 1.0.0 | 2024-01-24 | Initial Release | Full-featured training plan manager |

---

## Upgrade Guide

### From v1.0.4 → v1.0.5

**What's New:**
- Model dropdown with intelligent selection replacing text input
- Model information cards with strengths, costs, and recommendations
- Recommended model badges for easy identification
- Automatic model validation and correction
- Organized settings layout with sections

**How to Upgrade:**
1. Replace `training-plan-manager.html` with the new version
2. Open in browser - your data is preserved in localStorage
3. Your existing AI provider and model selections are validated automatically
4. Open Settings (⚙️) to see the new model selection interface
5. If your current model was invalid, it will be updated to the recommended model

**No data migration required** - All existing settings remain compatible. Invalid model/provider combinations are automatically corrected.

### From v1.0.3 → v1.0.4

**What's New:**
- Calendar dropdown in Add/Edit Resource forms
- Calendar displayed in resource detail view with clickable link
- Calendar badge on resource cards showing region
- Resource list in calendar detail view
- Cross-navigation between resources and calendars

**How to Upgrade:**
1. Replace `training-plan-manager.html` with the new version
2. Open in browser - your data is preserved in localStorage
3. Existing resource-calendar relationships remain unchanged
4. Add a resource or edit an existing one to see the calendar dropdown
5. View any calendar to see the list of resources using it

**No data migration required** - All existing resource and calendar data remains fully compatible.

### From v1.0.2 → v1.0.3

**What's New:**
- "Manage Categories" button in Competencies tab
- Full category and subcategory management system
- View, add, edit, and delete categories independently
- View, add, edit, and delete subcategories with parent relationships
- Hierarchical view showing category-subcategory relationships
- Competency count display for each category and subcategory

**How to Upgrade:**
1. Replace `training-plan-manager.html` with the new version
2. Open in browser - your data is preserved in localStorage
3. Navigate to Competencies tab
4. Click "Manage Categories" to see the new management interface
5. Existing categories and subcategories remain unchanged

**No data migration required** - All existing competency, category, and subcategory data remains fully compatible.

### From v1.0.1 → v1.0.2

**What's New:**
- Category and subcategory dropdowns in Add Competency form
- Existing categories and subcategories now accessible via dropdowns
- Dynamic subcategory filtering based on category selection
- Custom category/subcategory options still available

**How to Upgrade:**
1. Replace `training-plan-manager.html` with the new version
2. Open in browser - your data is preserved in localStorage
3. Test by adding a new competency - you'll see existing categories in dropdown
4. Existing competencies remain unchanged

**No data migration required** - All existing competency data remains compatible.

### From v1.0.0 → v1.0.1

**What's New:**
- Resource editing now fully functional
- Budget spent field added to edit form

**How to Upgrade:**
1. Replace `training-plan-manager.html` with the new version
2. Open in browser - your data is preserved in localStorage
3. Test the edit functionality by clicking any resource card, then "Edit"

**No data migration required** - All existing data remains compatible.

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
