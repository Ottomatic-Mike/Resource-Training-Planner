# Changelog

All notable changes to the Training Plan Manager will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.19] - 2026-01-24

### Added - Multiple Calendar Support for Resources

This release adds the ability for resources to have multiple calendars assigned, allowing for proper aggregation of regional holidays, corporate events, and other calendar-based constraints that impact training availability.

#### Problem Addressed

**Original Limitation:**
- Resources could only have ONE calendar assigned (regional OR corporate)
- Real-world scenario: UK employee with both UK holidays AND corporate-wide events
- No way to aggregate holidays from multiple sources
- Training scheduling didn't account for all applicable non-working days
- Managers had to manually track multiple calendar impacts

**User Request:**
> "It is possible for multiple calendars to be applied to a given resource in terms of what will impact their scheduling. As an example, a user may have UK specific holidays and may also have specific corporate calendars that overlay on their ability to train."

#### New Multi-Calendar Architecture

**Data Model Changes:**
- **Old**: `regionalCalendarId` (single number or null)
- **New**: `regionalCalendarIds` (array of calendar IDs)
- Supports unlimited calendars per resource
- Automatic migration from old format to new format
- Backward compatible with existing data

**Add Resource Form:**
- Changed from dropdown to checkbox list
- Select multiple calendars simultaneously
- Visual container with scrollable list
- Clear labels showing calendar name, region, and year
- Checkboxes for intuitive multi-select
- Help text explains aggregation behavior

**Edit Resource Form:**
- Same checkbox interface for consistency
- Pre-selects all currently assigned calendars
- Easy to add or remove calendars
- Migration happens automatically when editing old resources

**Resource Detail View:**
- Displays ALL assigned calendars (not just one)
- Each calendar is a clickable link to calendar detail
- Multiple calendars shown on separate lines
- Clear "No Calendars Assigned" message if none

#### Calendar Aggregation Logic

**How Multiple Calendars Work:**

1. **Holiday Aggregation**:
   - All holidays from ALL assigned calendars are combined
   - Duplicate dates are automatically handled
   - Total non-working days = union of all calendar holidays
   - Impacts training schedule availability calculations

2. **Example Scenarios**:
   - **UK Employee**: UK National Holidays + Corporate Events = Comprehensive non-working days
   - **US Employee**: US Federal Holidays + Company Shutdown Periods
   - **Remote Team**: Country-specific holidays + Global company events
   - **Department-specific**: Regional calendar + Department training blackout dates

3. **Flexible Configuration**:
   - Choose 0, 1, or unlimited calendars per resource
   - Mix regional, corporate, department, and custom calendars
   - Different resources can have different calendar combinations
   - Easy to update as calendars change

#### User Interface Enhancements

**Checkbox Selection Interface:**
- Clean, scrollable container (max-height: 200px)
- 18px checkboxes for easy clicking
- Full calendar name visible: "UK National Holidays (UK 2024)"
- Visual styling with borders and padding
- Consistent design across add and edit forms

**Help Text Updates:**
- "Select all calendars that apply (regional holidays, corporate events, etc.)"
- Explains aggregation: "Holidays will aggregate to reduce available training days"
- Clear guidance on when to use multiple calendars

**Empty State Handling:**
- Shows helpful message when no calendars exist
- Directs users to Calendars tab to create calendars
- Graceful degradation for resources with no calendars

#### Backend Logic Updates

**Calendar Usage Tracking:**
- Counts resources using each calendar across arrays
- Calendar detail view shows all resources using that calendar
- Delete warnings accurate for multi-calendar usage
- Handles both old single-ID and new array formats

**Display Logic:**
- Resource detail shows all calendar names
- Each calendar is individually linked
- Proper handling of deleted/missing calendars
- Clear visual presentation of multiple calendars

**Migration & Compatibility:**
- Automatic migration on data load
- Converts old `regionalCalendarId` to `regionalCalendarIds` array
- Preserves existing single calendar as single-element array
- No data loss during migration
- Legacy support in all filtering/counting logic

#### Sample Data Updates

**Sample Resources:**
- US locations: [US Federal Holidays]
- UK locations: [UK National Holidays]
- Ready for multi-calendar demonstration
- Consistent with new data model

#### Technical Implementation

**Files Modified:**
- training-plan-manager.html:
  - `showAddResourceForm()` - Checkbox interface instead of dropdown
  - `saveNewResource()` - Collects multiple calendar IDs
  - `editResource()` - Checkbox interface with migration
  - `saveResourceEdits()` - Saves array of calendar IDs
  - `viewResourceDetail()` - Displays multiple calendars
  - `loadFromLocalStorage()` - Migration logic for existing data
  - Calendar usage counting - Updated for array format
  - `viewCalendarDetail()` - Shows resources with array support
  - `deleteCalendar()` - Validates array usage
  - `loadSampleResources()` - Uses new array format

**Migration Strategy:**
- Runs automatically on data load
- Checks for old `regionalCalendarId` field
- Converts to `regionalCalendarIds` array
- Deletes old field to prevent confusion
- Ensures all resources have `regionalCalendarIds` array
- Triggers save to persist migration

**Legacy Support:**
- All filtering logic supports both formats
- Usage counting handles both single ID and arrays
- Graceful fallback for old data
- No breaking changes for existing functionality

#### User Benefits

**For Managers:**
- Accurate training availability calculations
- Account for ALL holidays and events
- No more manual tracking of multiple calendars
- Better scheduling accuracy
- Realistic training timeline planning

**For Resources:**
- All applicable holidays respected
- Regional holidays honored
- Corporate events accounted for
- Department-specific blackout periods included
- Comprehensive work-life balance support

**For Organizations:**
- Support diverse, distributed teams
- Different calendar needs per employee
- Flexible calendar management
- Scalable across regions and departments
- Enterprise-ready holiday tracking

#### Breaking Changes

None - all changes are backward compatible. Existing data automatically migrates.

#### Migration Notes

**Automatic Migration:**
- Happens transparently on first load after upgrade
- Old `regionalCalendarId` converted to `regionalCalendarIds` array
- Single calendar ID becomes single-element array
- Null/undefined becomes empty array
- No user action required

**Data Safety:**
- Original calendar assignments preserved
- No data loss during migration
- Migration is idempotent (safe to run multiple times)
- Automatic save after migration

**Testing Recommendations:**
- Verify all resources show correct calendars in edit form
- Check resource detail view displays all calendars
- Confirm calendar usage counts are accurate
- Test adding/removing multiple calendars
- Validate holiday aggregation in training schedules

---

## [1.0.18] - 2026-01-24

### Fixed - Resources Tab Edit Button Functionality

This release fixes a critical bug where the Edit button for individual resources on the Resources tab did not work.

#### Bug Fix

**Problem Identified:**
- Edit button in Resources tab table called non-existent function `showEditResourceForm()`
- Clicking the Edit button resulted in JavaScript error: "showEditResourceForm is not defined"
- Users unable to edit resource information from the Resources tab table
- Edit functionality was completely broken for the Resources tab

**Root Cause:**
- Function name mismatch in renderResourcesList() function (line 3147)
- Edit button onclick handler called `showEditResourceForm(${resource.id})`
- Correct function name is `editResource(${resource.id})`
- Function `showEditResourceForm` never existed in codebase

**Solution Applied:**
- Changed Edit button onclick handler from `showEditResourceForm(${resource.id})` to `editResource(${resource.id})`
- Edit button now correctly calls the existing `editResource()` function
- Function properly opens modal dialog with edit form
- All resource fields are editable: name, title, department, location, email, calendar, budgets, training hours
- Save functionality working correctly with `saveResourceEdits()` function

#### Impact

**Before Fix:**
- ❌ Edit button completely non-functional on Resources tab
- ❌ JavaScript console error when clicking Edit
- ❌ No way to edit resources from table view
- ❌ Users forced to navigate to resource detail view to edit

**After Fix:**
- ✅ Edit button opens edit modal dialog as expected
- ✅ All resource fields can be modified
- ✅ Changes save correctly and persist
- ✅ Table updates immediately after saving
- ✅ No JavaScript errors
- ✅ Consistent editing experience across application

#### Technical Details

**File Changed:**
- training-plan-manager.html (line 3147)

**Change Made:**
```javascript
// Before (broken):
onclick="event.stopPropagation(); showEditResourceForm(${resource.id})"

// After (fixed):
onclick="event.stopPropagation(); editResource(${resource.id})"
```

**Verified:**
- `editResource()` function exists and is fully functional
- Modal opens with all current resource data pre-populated
- All form fields are editable
- `saveResourceEdits()` function properly saves changes
- No other instances of `showEditResourceForm` found in codebase
- Event propagation correctly stopped to prevent row click

### User Experience

**Improved Workflow:**
- Quick access to edit resource from table view
- No need to click through to detail view for simple edits
- Faster resource management
- Consistent with dashboard edit button behavior
- Streamlined user experience

### Breaking Changes

None - all changes are backward compatible.

### Migration Notes

- No data migration required
- Fix is purely functional - corrects broken button
- All existing features and workflows preserved
- Edit modal functionality identical to before (now accessible)

---

## [1.0.17] - 2026-01-24

### Added - Sortable Dashboard Resources Table

This release adds full sorting capability to the "Resources at a Glance" table on the Dashboard tab, allowing managers to sort by any column with appropriate field-specific sorting rules.

#### Sortable Table Features

**Interactive Column Headers:**
- All column headers are now clickable for sorting
- Visual indicators show current sort column and direction (▲ ascending, ▼ descending)
- Hover effect highlights sortable headers
- Smooth transitions and visual feedback
- User-friendly cursor changes to indicate clickability

**Smart Sorting by Column Type:**

1. **Name** - Alphabetical sorting (case-insensitive, A-Z / Z-A)
2. **Title** - Alphabetical sorting (case-insensitive, handles empty titles)
3. **Location** - Alphabetical sorting (case-insensitive, handles empty locations)
4. **Budget** - Numeric sorting by utilization percentage (0% to 100%+)
5. **Courses** - Numeric sorting by count (low to high / high to low)
6. **Status** - Priority-based sorting (Over Budget > At Risk > Behind > On Track)

**Sorting Behavior:**
- First click: Sort ascending
- Second click on same column: Toggle to descending
- Click different column: Reset to ascending for new column
- Sort state preserved while viewing dashboard
- Visual feedback with arrow indicators
- Smooth, instant sorting with no page reload

**Visual Enhancements:**
- Clickable headers show hover effect with color change
- Cursor changes to pointer on sortable columns
- Sort direction arrows clearly indicate current state
- Color-coded budget status remains visible while sorted
- Clean, professional appearance maintained

#### User Experience Benefits

**For Managers:**
- Quickly identify resources with budget issues (sort by Budget)
- Find resources by name without scrolling (sort by Name)
- Compare workload distribution (sort by Courses)
- Prioritize interventions (sort by Status)
- Analyze by location or department
- Flexible data exploration without losing context

**For Decision Making:**
- Spot trends and patterns at a glance
- Identify outliers quickly (highest/lowest in any category)
- Compare resources side-by-side
- Make data-driven resource allocation decisions
- Dashboard becomes more powerful analytical tool

#### Technical Implementation

**State Management:**
- Added `dashboardSortColumn` state variable (tracks current sort column)
- Added `dashboardSortDirection` state variable ('asc' or 'desc')
- State persists during dashboard session
- Resets when navigating away from dashboard

**Sorting Algorithm:**
- Pre-computes all values needed for sorting
- Efficient in-memory sorting of resource data
- Handles null/undefined values gracefully
- Type-specific comparison logic for each column
- Maintains stable sort

**CSS Enhancements:**
- Added `th[onclick]` selector for sortable header styling
- Hover effects with smooth transitions (0.2s ease)
- Color changes to primary color on hover
- User-select: none prevents text selection
- Consistent with application design system

### Breaking Changes

None - all changes are backward compatible.

### Migration Notes

- No data migration required
- Sort state is session-only (not persisted to localStorage)
- Default view remains unsorted until user clicks a header
- All existing dashboard features work exactly as before

---

## [1.0.16] - 2026-01-24

### Changed - Resources Table View with Alphabetical Sorting

This release transforms the resources display from a card/tile grid layout to a clean, organized table format with alphabetical sorting for improved navigation and usability.

#### Resources Display Improvements

**Previous Design Issues:**
- Resources displayed as cards in a grid layout (tile format)
- No alphabetical ordering - resources appeared in arbitrary order
- Difficult to scan and locate specific resources
- Information spread across multiple card elements
- Inefficient use of screen space for lists

**New Table-Based Design:**
- **Alphabetical Sorting** - All resources automatically sorted A-Z by name
  - Case-insensitive alphabetical ordering
  - Consistent, predictable navigation
  - Easy to locate specific team members

- **Clean Row Format** - Professional table layout with clear columns:
  - **Name** - Full name with email address below
  - **Job Title** - Role/position
  - **Location** - Geographic location with in-person capability badge
  - **Department** - Organizational department
  - **Training Budget** - Budget utilization with progress bar and percentage
  - **Travel Budget** - Travel budget utilization with progress bar and percentage
  - **Competencies** - Count of tracked competencies
  - **Courses** - Count of assigned courses
  - **Actions** - Quick edit button

- **Enhanced Budget Visualization**
  - Inline progress bars for both training and travel budgets
  - Color-coded budget status (green < 80%, orange 80-99%, red ≥ 100%)
  - Shows spent + committed vs. total budget
  - Percentage utilization displayed
  - Easy to identify budget issues at a glance

- **In-Person Training Indicators**
  - Visual badge showing in-person capability
  - "✓ In-Person" badge for resources who can attend in-person training
  - "Remote Only" badge for remote-only resources
  - Helps managers plan training logistics

- **Improved Information Density**
  - All key information visible without clicking
  - Efficient use of screen space
  - Better for teams with many resources
  - Easier to compare resources side-by-side

- **Quick Actions**
  - Edit button directly in table row
  - Click anywhere on row to view full resource details
  - Streamlined workflow

#### User Experience Benefits

**For Managers:**
- Find resources quickly with alphabetical ordering
- Compare budget utilization across team at a glance
- Identify resources nearing budget limits
- See complete team overview on one screen
- Better decision-making with comprehensive view

**For Navigation:**
- Predictable alphabetical order
- Faster scanning of resource lists
- Easy filtering combined with search
- Clear visual hierarchy

**For Scalability:**
- Handles large teams better than card layout
- More resources visible per screen
- Less scrolling required
- Better for printing/exporting

#### Technical Implementation

- Complete redesign of `renderResourcesList()` function
- Added automatic alphabetical sorting using `localeCompare()`
- Replaced grid-auto card layout with table-container table
- Maintained all existing functionality (search, filtering, details view)
- Consistent styling with dashboard resource table
- Responsive design maintained
- No breaking changes to data structure

### Breaking Changes

None - all changes are backward compatible. Existing data, search, filters, and detail views work exactly as before.

### Migration Notes

- No migration required - purely visual/UX improvement
- All existing features and workflows preserved
- Search and filter functionality unchanged
- Resource detail view unchanged

---

## [1.0.15] - 2026-01-24

### Fixed - Critical Dashboard Rendering Bug

This release fixes a critical bug introduced in v1.0.14 that prevented the dashboard from rendering.

#### Bug Fix
- **Dashboard Rendering Error** - Fixed `ReferenceError: budgetTotal is not defined`
  - Error occurred in `renderResourcesTable()` function at line 2848
  - Root cause: Variable name mismatch in dashboard resource table rendering
  - Variables were defined as `trainingBudgetTotal` and `trainingBudgetSpent` but referenced as `budgetTotal` and `budgetSpent`
  - This prevented the entire dashboard from loading and displaying

#### Technical Details
- **Location**: renderResourcesTable function (lines 2848, 2850)
- **Issue**: Incorrect variable names in template literals
  - Line 2848: Changed `budgetTotal` to `trainingBudgetTotal`
  - Line 2850: Changed `budgetSpent` to `trainingBudgetSpent`
- **Impact**: Dashboard now renders correctly with proper budget information display
- **Testing**: Verified all other uses of `budgetSpent` and `budgetTotal` are correctly scoped

### Breaking Changes

None - all changes are backward compatible.

### User Impact

**Before this release:**
- ❌ Dashboard tab completely broken and wouldn't render
- ❌ JavaScript error in browser console
- ❌ No way to view team overview or metrics

**After this release:**
- ✅ Dashboard renders correctly
- ✅ All budget information displays properly
- ✅ Team overview and metrics fully functional

---

## [1.0.14] - 2026-01-24

### Fixed - Search Functionality & Course Discovery

This release fixes critical search functionality issues across all tabs and adds powerful AI-driven online course discovery from all major training providers.

#### Search Functionality Fixes
All search fields now properly filter data in real-time:

- **Resources Search** - Now actively filters by:
  - Name
  - Job title
  - Email
  - Department
  - Location
  - Updates results instantly as you type
  - Works in combination with location dropdown filter
  - Shows "No Matching Resources Found" message when no results
  - Clear empty state messaging to guide users

- **Competencies Search** - Now actively filters by:
  - Competency name
  - Category
  - Subcategory
  - Description
  - Works in combination with category dropdown filter
  - Shows "No Matching Competencies Found" message when no results
  - Instant filtering as you type

- **Course Catalog Search** - Now actively filters by:
  - Course title
  - Provider name
  - Description
  - Skill level
  - Works in combination with provider and format dropdown filters
  - Shows "No Matching Courses Found" message when no results
  - Instant filtering as you type
  - Enhanced empty state message guides users to online search

#### New Feature: AI-Powered Online Course Search

Revolutionary new capability to search across ALL major training provider repositories using AI:

- **Search Online Button** - New prominent button in Course Catalog header
  - Accessible to all users with configured AI API key
  - Clean, intuitive search interface
  - Modal dialog for search criteria input

- **Comprehensive Provider Coverage** - AI searches across:
  - **MOOCs**: Udemy, Coursera, LinkedIn Learning, Pluralsight, O'Reilly Learning
  - **Cloud Platforms**: AWS Training, Microsoft Learn, Google Cloud Skills Boost
  - **Security Training**: SANS Institute, Cybrary, INE
  - **Development**: Frontend Masters, Egghead.io, Codecademy
  - **Certifications**: CompTIA, PMI, ISACA
  - **Universities**: edX, academic programs
  - Many more specialized platforms

- **Advanced Search Filters**:
  - Search query (required) - describe skills or topics
  - Preferred format - Online Self-Paced, Live, In-Person, Hybrid, or Any
  - Skill level - Beginner, Intermediate, Advanced, Expert, or Any
  - Maximum cost - budget limit filter (optional)

- **Rich Search Results**:
  - Returns 6-10 high-quality courses from various providers
  - Each result shows:
    - Course title, provider, rating with review count
    - Cost, duration, skill level, format
    - Certification indicator
    - Course description
    - Direct link to course page (opens in new tab)
    - "Add to Catalog" button for one-click import
  - Results displayed in scrollable grid layout
  - Real-time status updates during search (typically 10-15 seconds)

- **Smart Course Import**:
  - One-click addition to course catalog from search results
  - Duplicate detection - warns if course already exists
  - Full course metadata imported automatically:
    - All standard fields (title, provider, cost, duration, etc.)
    - Travel requirement and estimated travel cost (for in-person)
    - Ratings, review counts, certification status
    - Description and course URL
  - Visual confirmation when course added
  - Button state changes to "Added" after import
  - Success notification with auto-dismiss

- **Error Handling & User Guidance**:
  - Clear messaging when API key not configured
  - Direct link to Settings from error dialog
  - Helpful error messages if search fails
  - "Try Again" option on failures
  - Loading indicators during API calls
  - Disabled buttons prevent duplicate requests

- **Integration with Existing Features**:
  - Imported courses immediately available in wizard course discovery
  - All budget tracking features work with imported courses
  - Travel costs properly tracked for in-person courses
  - Courses appear in filtered catalog views
  - Full compatibility with training plan creation

#### Technical Improvements

- **Optimized Rendering** - Search now updates only the results list, not entire tab
  - Preserves search input and filter selections
  - Faster, smoother user experience
  - No page flicker during filtering

- **Enhanced Filter Logic** - All searches use case-insensitive matching
  - Multiple fields searched simultaneously
  - AND logic for combining search with dropdown filters
  - Null-safe checks prevent errors on missing data

- **AI Integration** - Online course search uses same proven AI integration as wizard
  - Structured JSON response parsing
  - Fallback parsing for markdown-wrapped responses
  - Comprehensive error handling
  - API key validation before requests

- **UI Polish**:
  - Consistent empty state messaging across all tabs
  - Better visual feedback during searches
  - Improved button states and loading indicators
  - Responsive modal layouts for search results

### Benefits

**For Users**:
- Search actually works now - a critical usability fix
- Can discover thousands of real courses without manual data entry
- Saves hours of research time finding appropriate training
- Access to up-to-date course information from all major providers
- One-click import eliminates manual course creation

**For Managers**:
- Build comprehensive course catalogs in minutes, not hours
- Discover courses across all providers from single interface
- Make data-driven training decisions with ratings and reviews
- Find optimal courses matching specific skill requirements and budgets

### Breaking Changes

None - all changes are backward compatible.

### Migration Notes

- Existing search inputs will now work as expected
- No data migration required
- Online course search requires AI API key (optional feature)
- All existing courses remain unchanged

---

## [1.0.13] - 2026-01-24

### Added - In-Person Training & Dual Budget Tracking

This release adds comprehensive support for in-person training courses and separate travel & expense budget tracking, enabling managers to plan and budget for both online and in-person training events.

#### Resource Management Enhancements
- **In-Person Training Capability** - Track which resources can attend in-person classes
  - New field: "Can Attend In-Person Classes" checkbox in resource forms
  - Defaults to checked (yes) for new resources
  - Automatically set based on location for sample data (Remote = No, others = Yes)
  - Visible in resource detail view with clear Yes/No indicator
  - Warning displayed in wizard if resource cannot attend but in-person course selected

- **Dual Budget Tracking** - Separate budgets for training and travel expenses
  - **Training Budget** - For online courses, certifications, and course fees
    - Existing "Annual Training Budget" field (no breaking changes)
    - Tracks course costs separately from travel costs
  - **Travel & Expense Budget** - For in-person training travel costs
    - New "Annual Travel & Expense Budget" field in resource forms
    - Tracks flights, hotels, meals, and other travel expenses
    - Defaults to $0 for new resources
    - Sample data: $3,000 for non-remote resources, $0 for remote
  - **Independent Budget Spent Tracking**
    - Training Budget Spent (existing field)
    - Travel & Expense Budget Spent (new field)
  - Both budgets editable in resource add/edit forms

#### Course Catalog Enhancements
- **Travel Requirement Tracking** - Courses can now indicate if travel is required
  - New checkbox: "Requires Travel (for In-Person or Hybrid courses)"
  - Automatically shows/hides travel cost field based on checkbox
  - Help text explains when to check this option

- **Estimated Travel Cost** - Track expected travel expenses per course
  - New field: "Estimated Travel Cost" (hidden unless travel required)
  - Captures estimated cost for travel, accommodation, and meals
  - Displayed as separate line item in training plans
  - Used for travel budget calculations

- **Enhanced Course Formats** - Existing format field now supports:
  - Online Self-Paced (existing)
  - Online Live (existing)
  - In-Person (updated - now triggers travel options)
  - Hybrid (updated - now triggers travel options)

#### Sample Data Updates
- **Sample Resources** - Updated with new fields
  - All non-remote resources: canAttendInPerson = true, travelBudget = $3,000
  - Bob Wilson (Remote): canAttendInPerson = false, travelBudget = $0

- **Sample Courses** - Updated with travel information
  - OWASP Top 10 Security (SANS Institute): In-Person, requires travel, $2,500 estimated travel cost
  - Leadership for Tech Managers (Coursera): Hybrid, requires travel, $1,800 estimated travel cost
  - All other courses: No travel required

#### Dashboard Enhancements
- **Dual Budget Metric Cards** - Separate tracking for each budget type
  - **Training Budget Card** - Shows team-wide training budget utilization
    - Total training budget across all resources
    - Spent + committed amounts
    - Percentage utilized with color coding (green/yellow/red)
  - **Travel & Expense Budget Card** - Shows team-wide travel budget utilization
    - Total travel budget across all resources
    - Spent + committed amounts
    - Percentage utilized with color coding
  - Both cards displayed side-by-side with Training Plans card

- **Resource Table** - Updated to use new field names (internal consistency)
  - Displays training budget status (primary budget)
  - Detailed dual budget view available in resource detail modal

#### Resource Detail View Enhancements
- **In-Person Capability Display** - Shows at a glance if resource can attend in-person
  - Green checkmark: "✓ Yes" if canAttendInPerson = true
  - Gray X: "✗ No (Remote Only)" if canAttendInPerson = false

- **Dual Budget Status Displays** - Separate progress bars for each budget
  - **Training Budget Status**
    - Badge with status: Within Budget / Near Limit / Over Budget
    - Spent | Committed | Remaining amounts
    - Progress bar with percentage utilization
    - Color-coded: Green (< 80%), Orange (80-99%), Red (≥ 100%)
  - **Travel & Expense Budget Status**
    - Identical layout and logic as training budget
    - Separate tracking and warnings
  - Both sections clearly labeled and visually separated

#### Training Plan Wizard Enhancements
- **Step 6 (Review) - Enhanced Budget Display**
  - **Primary Section** - Training budget overview (4 columns)
    - Resource info with remote-only warning if applicable
    - Training Budget total
    - Available Training Budget (color-coded)
    - Plan Training Cost (color-coded)
  - **Secondary Section** - Travel budget (appears only if travel costs exist)
    - Travel & Expense Budget total
    - Available Travel Budget (color-coded)
    - Plan Travel Cost (separate from training)
    - "For in-person courses" helper text
  - Clean visual separation with border between sections

- **Budget Overrun Warnings** - Separate warnings for each budget type
  - **Training Budget Overrun Warning**
    - Shows if plan exceeds available training budget
    - Displays: plan cost, available amount, spent, committed, overrun amount
    - Orange warning badge with clear messaging
  - **Travel Budget Overrun Warning**
    - Shows if plan exceeds available travel budget
    - Same detailed breakdown as training warning
    - Independent from training budget warning
  - **In-Person Course Warning**
    - Shows if resource marked as remote-only but plan includes in-person/hybrid courses
    - Prompts manager to verify availability or select online alternatives
    - Prevents accidental assignment of in-person courses to remote resources

#### Training Plan Data Model Enhancements
- **Travel Cost Tracking** - Plans now track travel costs separately
  - New field: `totalCost` - Sum of all course costs (training fees)
  - New field: `totalTravelCost` - Sum of all travel costs for courses requiring travel
  - Scheduled courses include: `requiresTravel` and `estimatedTravelCost` fields
  - Budget calculations separate training and travel costs

- **Plan Budget Validation** - Enhanced to check both budgets
  - Checks training budget availability independently
  - Checks travel budget availability independently
  - Shows specific warning badges per budget type in resource detail view
  - Three possible states: "Over Training Budget", "Over Travel Budget", "Over Training & Travel Budget"

### Changed

- **Budget Calculations** - Now separated into training and travel components
  - Dashboard metrics split into two separate calculations
  - Resource detail calculations split into two budget streams
  - Training plans track and validate both budgets independently

- **Resource Forms** - Reorganized for clarity
  - In-person capability field added near calendar selection (logical grouping)
  - Budget fields grouped together with clear labels and help text
  - Training budget labeled: "Budget for online courses, certifications, and self-paced training"
  - Travel budget labeled: "Separate budget for travel, accommodation, and meals for in-person training"

- **Course Forms** - Enhanced for travel tracking
  - Travel required checkbox with dynamic cost field visibility
  - Clear help text explaining when travel is required
  - Estimated travel cost field only shown when needed

### Technical Details
- Version bumped to 1.0.13 in both saveToLocalStorage() and exportToJSON()
- **New Resource Fields**:
  - `canAttendInPerson` (boolean, default: true)
  - `annualTravelBudget` (number, default: 0)
  - `travelBudgetSpent` (number, default: 0)
- **New Course Fields**:
  - `requiresTravel` (boolean, default: false)
  - `estimatedTravelCost` (number, default: 0)
- **New Training Plan Fields**:
  - `totalCost` (number) - Sum of course costs
  - `totalTravelCost` (number) - Sum of travel costs
- **Backward Compatibility**:
  - Existing data without new fields will default appropriately
  - canAttendInPerson defaults to true (existing behavior)
  - Travel budgets default to 0 (no impact on existing workflows)
  - Course travel fields default to false/0 (existing courses remain unchanged)

### User Benefits
- **Accurate Budget Planning** - Training and travel budgets tracked independently
- **In-Person Training Support** - Full lifecycle management of in-person courses
- **Resource Capability Tracking** - Know which team members can attend in-person events
- **Detailed Cost Breakdown** - See exactly where training dollars are allocated
- **Proactive Warnings** - Prevents over-budget plans and misassigned courses
- **Clean, Simple UI** - Dual budget tracking without cluttering the interface
- **Flexible Workflows** - Support both online-only and hybrid training strategies

---

## [1.0.12] - 2026-01-24

### Changed - Improved Provider Labeling

This release corrects misleading provider labels to accurately reflect all supported models.

#### Settings UI Updates
- **AI Provider Dropdown** - Corrected OpenAI label from "OpenAI (GPT-4)" to "OpenAI (GPT)"
  - Previous: "OpenAI (GPT-4)" incorrectly implied only GPT-4 models were available
  - Current: "OpenAI (GPT)" accurately reflects support for all GPT models (GPT-5.2, GPT-5.2 Mini, GPT-4.1, GPT-4.1 Mini, GPT-4o, GPT-3.5, etc.)
  - Matches pattern of other providers: "Anthropic (Claude)" and "Google (Gemini)"

#### Documentation Updates
- **README.md** - Updated provider description to clarify GPT model range
  - Changed from "OpenAI GPT-4" to "OpenAI GPT" with examples (GPT-5.2, GPT-4.1, etc.)
- **API_INTEGRATION.md** - Updated all references for consistency
  - Section header: "OpenAI GPT-4 Setup" → "OpenAI GPT Setup"
  - Comparison matrix header: "OpenAI GPT-4" → "OpenAI GPT"
  - Table of contents link updated
  - Recommendation text updated
- **USER_GUIDE.md** - Updated provider list
  - Changed "OpenAI (GPT-4)" to "OpenAI (GPT)" in settings documentation

### Technical Details
- Version bumped to 1.0.12 in both saveToLocalStorage() and exportToJSON()
- No functional changes - purely labeling improvements
- No breaking changes - fully backward compatible with v1.0.11 data
- Historical CHANGELOG entries preserved (v1.0.0 correctly shows GPT-4 only support at that time)

### User Benefits
- **Clearer Provider Selection** - No confusion about which GPT models are available
- **Accurate Documentation** - All references now correctly reflect full model range
- **Consistent Labeling** - Provider labels follow same pattern across all three providers

---

## [1.0.11] - 2026-01-24

### Added - Secure API Key Encryption

This release implements industry-standard encryption for API key storage, protecting your sensitive credentials with AES-256 encryption and a master password.

#### Security Features
- **Master Password Protection** - Create a master password to encrypt your API key
  - Master password never stored anywhere
  - Required on each application launch to decrypt API key
  - Password protected with PBKDF2 key derivation (100,000 iterations)
  - Prevents unauthorized access even if localStorage is compromised
- **AES-256-GCM Encryption** - Military-grade encryption for API keys
  - API key encrypted using Web Crypto API (native browser security)
  - Unique initialization vector (IV) for each encryption
  - Random salt for password derivation
  - Industry-standard encryption algorithm
- **In-Memory Only Decryption** - Maximum security
  - Decrypted API key stored only in memory (never persisted)
  - API key automatically cleared when browser closes
  - No plain-text storage of API keys when security enabled
- **Password Prompt on Launch** - Secure access control
  - Application prompts for master password before loading
  - Cannot access application without correct password
  - Clean, user-friendly unlock interface
  - Security information displayed during unlock

#### Settings Security Section
- **Security Status Dashboard** - Clear visibility of encryption status
  - Shows whether security is enabled or disabled
  - Visual indicators (✓ Encrypted badge) on API key field
  - One-click enable/disable security
- **Enable Security** - Simple setup workflow
  - Enter API key and create master password (8+ characters)
  - Automatic encryption with password confirmation
  - Immediate protection activation
- **Change Master Password** - Update password anytime
  - Verify current password before change
  - Set new password with confirmation
  - API key automatically re-encrypted with new password
- **Disable Security** - Optional return to plain text
  - Warning dialog explains implications
  - Decrypts API key back to plain text storage
  - Requires explicit confirmation

#### Password Management
- **Password Reset** - Recovery option if password forgotten
  - Available during unlock prompt
  - Warns that API key will be permanently deleted
  - Requires confirmation before proceeding
  - User must re-enter API key after reset
- **Security Best Practices** - User guidance
  - Minimum 8 character password requirement
  - Password strength not enforced (user choice)
  - Clear warnings about password loss consequences
  - Recommendation to enable security in settings

#### Technical Implementation
- **Web Crypto API** - Browser-native cryptography
  - `crypto.subtle.encrypt()` for AES-GCM encryption
  - `crypto.subtle.deriveKey()` for PBKDF2 key derivation
  - `crypto.subtle.digest()` for password hashing (SHA-256)
  - No third-party cryptography libraries required
- **Secure Storage Structure** - Organized encryption data
  ```javascript
  securityConfig: {
    enabled: true,
    version: 1,
    passwordHash: "SHA-256 hash for verification",
    encryptedApiKey: {
      salt: "base64-encoded random salt",
      iv: "base64-encoded initialization vector",
      ciphertext: "base64-encoded encrypted API key"
    }
  }
  ```
- **Helper Functions** - API key access abstraction
  - `getEffectiveApiKey()` - Returns decrypted key if security enabled, otherwise plain text
  - `hasApiKey()` - Checks if API key available (encrypted or plain text)
  - All AI API calls use helper functions (no direct access to storage)

### Changed
- **Settings UI** - Reorganized with security section first
  - Security section appears at top (most important)
  - AI Configuration section moved below security
  - Application Settings remain at bottom
- **API Key Field** - Enhanced with encryption indicator
  - Shows "Encrypted" badge when security enabled
  - Help text changes based on security status
  - Value shows decrypted key when unlocked (for editing)
- **Initialization Flow** - Password prompt before app load
  - Application checks for security configuration on startup
  - Prompts for password if security enabled
  - Normal initialization proceeds only after successful unlock
  - Clean separation of security and application logic
- **Help Documentation** - Updated with security information
  - Getting Started includes security setup recommendation
  - New Security section explains encryption features
  - Privacy note updated with encryption details

### Fixed
- **API Key Security** - No longer stored in plain text
  - Previous: API key stored unencrypted in localStorage
  - Current: API key encrypted with AES-256 when security enabled
  - Plain text storage still available (user choice) but discouraged
- **Unauthorized Access** - Application locked without password
  - Previous: Anyone with browser access could view API key
  - Current: Master password required to decrypt and use API key
  - Password prompt blocks all application access until authenticated

### Security Notes

**What This Protects Against:**
- ✓ Casual inspection of localStorage (API key not readable)
- ✓ Unauthorized access to application on shared computers
- ✓ Accidental exposure through localStorage dumps
- ✓ API key theft from browser developer tools (when encrypted)

**What This Does NOT Protect Against:**
- ✗ Malicious code running in browser (JavaScript has access to decrypted key in memory)
- ✗ Physical access to computer while application is unlocked
- ✗ Man-in-the-middle attacks (HTTPS connection to AI provider required)
- ✗ Compromised browser extensions with localStorage access

**Important:** This is client-side encryption in a browser environment. While it provides significant protection against casual access, it cannot prevent a determined attacker with full system access. Always use HTTPS, keep your browser updated, and use trusted networks when accessing sensitive applications.

### Migration Guide

**For New Users:**
1. Add your API key in Settings
2. Click "Enable Security (Recommended)"
3. Create a master password
4. Remember your password (cannot be recovered!)

**For Existing Users:**
1. Your existing plain-text API key will continue to work
2. Settings will show "⚠️ Security Not Enabled" warning
3. Click "Enable Security" to protect your API key
4. Create a master password when prompted
5. API key will be automatically encrypted
6. You'll be prompted for password on next application load

**To Disable Security:**
1. Open Settings
2. Click "Disable Security" button
3. Confirm the warning
4. API key returns to plain text storage

### Technical Details
- Version bumped to 1.0.11 in both saveToLocalStorage() and exportToJSON()
- Added 9 new security functions for encryption/decryption
- Added 4 new UI functions for security management
- Security configuration stored separately from main application data
- No breaking changes - fully backward compatible with v1.0.10 data
- File size increased by ~8KB due to encryption functions

---

## [1.0.10] - 2026-01-24

### Added - Budget and Time Tracking Enhancements

This release adds comprehensive visual budget status indicators and warnings throughout the application, making it easy to identify when training plans exceed budget allocations or time constraints.

#### Resource Detail View - Budget Status Indicators
- **Budget Status Badge** - Color-coded status indicator for at-a-glance budget health
  - ✓ Green "Within Budget" - Under 80% utilization
  - ⚠️ Orange "Near Limit" - 80-99% utilization
  - ⚠️ Red "Over Budget" - 100%+ utilization
- **Detailed Budget Breakdown** - Complete visibility into budget allocation
  - Shows spent budget, committed budget from training plans, and remaining budget
  - Visual progress bar showing budget utilization percentage
  - Remaining budget highlighted in red if negative, green if positive
  - Total budget and utilization percentage clearly displayed
- **Training Plan Budget Status** - Each plan card shows budget impact
  - "⚠️ Over Budget" badge displayed on plans that exceed remaining budget
  - Helps identify which specific plans are contributing to budget overruns

#### Training Plan Wizard - Step 6 Budget & Time Warnings
- **Comprehensive Budget Validation** - Accounts for all budget allocations
  - Shows total budget, spent budget, and committed budget from existing plans
  - Calculates available budget accurately before plan creation
  - Displays budget after plan creation to show impact
  - Plan cost color-coded (red if over budget, green if within budget)
- **Budget Overrun Warning** - Clear alert when plan exceeds available budget
  - Shows exactly how much the plan costs vs. how much is available
  - Breaks down spent and committed budget amounts
  - Displays the overrun amount (how much over budget)
  - Warning displayed in orange alert box with ⚠️ icon
- **Time/Hours Warning** - Alerts when plan duration exceeds reasonable timeframes
  - Calculates estimated hours from course durations
  - Shows weekly time allocation and estimated duration in weeks
  - Warns if plan will take more than 52 weeks (1 year) to complete
  - Suggests adjusting course selection or weekly time allocation
- **Enhanced Plan Overview** - Comprehensive metrics at a glance
  - Resource name and title
  - Total budget with spent/committed breakdown
  - Available budget with after-plan projection
  - Plan cost with course count
  - Estimated time, weekly allocation, and duration
  - AI assistance status indicator

#### Dashboard - Budget Status Integration
- **Budget Metrics Card** - Enhanced with committed budget tracking
  - Shows total budget used (spent + committed) vs. total budget
  - Color-coded based on utilization (green/orange/red)
  - Displays breakdown: "X% utilized (Y spent + Z committed)"
- **Resources Table** - Budget status for each team member
  - Budget column shows total used (spent + committed) vs. total
  - Color-coded amounts (green if OK, orange if near limit, red if over)
  - Visual badges ("Over" or "Near Limit") for at-risk resources
  - Breakdown showing spent vs. committed amounts when applicable
- **Status Column** - Updated to reflect budget health
  - "Over Budget" status when 100%+ utilized
  - "At Risk" status when 90-99% utilized
  - "On Track" for resources within budget

### Changed
- **Budget Calculations** - Now include committed budget from training plans
  - Previous: Only tracked budgetSpent against annualTrainingBudget
  - Current: Tracks budgetSpent + committedBudget (from all training plans) against annualTrainingBudget
  - Provides accurate view of both actual spending and future obligations
- **Dashboard Metrics** - Budget utilization calculation updated
  - Now includes committed budget from all training plans
  - Shows realistic picture of budget allocation across the team
- **Resource Status Logic** - Enhanced to prioritize budget overruns
  - "Over Budget" status takes precedence when budget exceeded
  - "At Risk" shown when approaching budget limit (90%+)
  - "Behind" status shown for course completion delays

### Technical Details
- Version bumped to 1.0.10 in both saveToLocalStorage() and exportToJSON()
- Enhanced calculateDashboardMetrics() to include totalBudgetCommitted
- Enhanced renderResourcesTable() to show budget status indicators
- Enhanced viewResourceDetail() to calculate and display comprehensive budget status
- Enhanced renderWizardStep6() to validate budget and time constraints
- No breaking changes - fully backward compatible with existing data

### User Benefits
- **Prevent Budget Overruns** - See warnings before creating plans that exceed budget
- **Better Planning** - Understand full budget picture including future commitments
- **At-a-Glance Status** - Quickly identify resources at risk across dashboard
- **Time Management** - Avoid creating unrealistic training schedules
- **Data-Driven Decisions** - Make informed choices with complete budget visibility

---

## [1.0.9] - 2026-01-24

### Added - Latest AI Models from All Providers

This release updates the AI model database with the newest flagship models across all three providers, ensuring users have access to the latest and most capable AI technology.

#### OpenAI GPT-5 Series - NEW
- **GPT-5.2** ⭐ RECOMMENDED - Latest flagship model with revolutionary reasoning capabilities
  - Model ID: `gpt-5.2-2026-01-15`
  - Superior reasoning and advanced analysis for sophisticated training programs
  - Pricing: Input $1.50/1M | Output $6/1M tokens (~$0.0225 for typical 3K token request)
  - 25% lower cost than GPT-4.1 with significantly better performance
- **GPT-5.2 Mini** ⭐ RECOMMENDED - Fast and highly capable cost-effective variant
  - Model ID: `gpt-5.2-mini-2026-01-15`
  - Strong reasoning with excellent cost efficiency
  - Pricing: Input $0.30/1M | Output $1.20/1M tokens (~$0.0045 for typical 3K token request)
  - 25% lower cost than GPT-4.1 Mini with better performance

### Changed
- **OpenAI Model Recommendations** - GPT-5.2 and GPT-5.2 Mini now flagship recommended models
  - GPT-4.1 and GPT-4.1 Mini moved to "previous generation" status (still capable, but upgrade recommended)
  - GPT-4o and GPT-4o Mini marked as legacy models
  - GPT-4 Turbo marked as old generation with strong upgrade recommendation
- **Model Descriptions** - Updated all OpenAI model descriptions to reflect current status
  - Clear upgrade paths specified for all legacy models
  - GPT-5.2 positioned as best choice for sophisticated training programs
  - GPT-5.2 Mini positioned as best choice for cost-effective high-quality planning
- **Pricing Information** - All models reflect accurate January 2026 API pricing
  - GPT-5.2: $1.50/$6 per 1M tokens (25% cheaper than GPT-4.1, significantly more capable)
  - GPT-5.2 Mini: $0.30/$1.20 per 1M tokens (25% cheaper than GPT-4.1 Mini)
- **Example Costs** - Updated to show typical costs for 3K token requests
  - GPT-5.2: ~$0.0225 total
  - GPT-5.2 Mini: ~$0.0045 total

### Model Count
- **Total Models**: 20 (up from 18)
  - Anthropic: 6 models (unchanged)
  - OpenAI: 8 models (increased from 6)
  - Google: 6 models (unchanged)

### Backward Compatibility
- All existing model selections remain valid and functional
- Users with GPT-4.1 or GPT-4.1 Mini will see upgrade suggestions
- Automatic validation ensures smooth operation
- No data migration required

### Technical Details
- Version bumped to 1.0.9 in both saveToLocalStorage() and exportToJSON()
- Model database last updated timestamp: January 24, 2026
- All model IDs validated for API compatibility
- Pricing reflects current OpenAI API rates as of January 2026

---

## [1.0.8] - 2026-01-24

### Added - CRITICAL: Resource-Competency Linking & AI Context Integration

This release resolves the catastrophic issue where competencies and training plans were not visibly linked to resources. The application now provides seamless competency management and AI-powered recommendations that account for resource competencies.

#### Resource Detail View - Completely Enhanced
- **Current Competencies Section** - View and manage all current competencies for a resource
  - Visual level indicators (1-5 dots) showing proficiency
  - Level names displayed (Awareness, Beginner, Intermediate, Advanced, Expert)
  - Competency name, category, and current level clearly shown
  - Quick remove button for each competency
  - Count of current competencies in section header
  - "+ Add Competency" button for easy addition
- **Desired Competencies / Goals Section** - Set and track target competencies
  - Shows both current and target proficiency levels for each competency
  - Visual level indicators for target levels
  - Clear progression path (e.g., "From Level 2 → 4")
  - Competency category and name displayed
  - Quick remove button for each goal
  - Count of desired competencies in section header
  - "+ Add Goal" button for setting new targets
- **Training Plans Section** - View all plans associated with the resource
  - Displays all training plans created for this resource
  - Shows plan title, creation date, number of courses, and budget
  - AI-Assisted badge indicator for plans using AI recommendations
  - Status badge (Draft, Approved, etc.) with color coding
  - Click any plan card to view full details
  - "+ Create Plan" button to start new wizard for this resource
  - Count of training plans in section header
- **Profile Section** - Enhanced layout with better organization
  - Grid layout for basic information
  - Calendar link integration for assigned regional calendar
  - Budget tracking (spent / total)
  - Weekly training hours display

#### Competency Management UI
- **Add Competency Modal** - Comprehensive interface for assigning competencies
  - Dropdown with all available competencies grouped by category
  - Shows competency name and subcategory in selection
  - Proficiency level selector (1-5) with descriptive names
  - Dynamic level definitions display based on selected competency
  - Shows all 5 level definitions with descriptions for context
  - Separate flows for current competencies vs desired competencies
  - Prevents duplicate assignments
  - Validates all required fields before saving
- **Remove Competency** - Clean removal with confirmation
  - Confirmation dialog showing competency name
  - Separate handling for current vs desired competencies
  - Immediate visual update after removal
  - Auto-saves changes to localStorage
  - Reopens resource detail view after removal

#### AI Integration - Competency-Aware Recommendations
- **AI Competency Assessment Enhancement**
  - Now includes resource's existing current competencies in analysis prompt
  - Shows level and category for each existing competency
  - AI builds upon existing knowledge rather than ignoring it
  - Prompts AI to suggest additional relevant competencies not already listed
  - Provides full context: job title, department, location, and existing competencies
- **AI Goal Recommendations Enhancement**
  - Includes both current AND desired competencies in recommendations
  - Shows current levels and target levels for context
  - AI considers existing goals when suggesting new ones
  - Suggests deepening existing skills AND acquiring complementary new competencies
  - Comprehensive context: role, location, current competencies, desired competencies, and AI assessment
- **AI Course Discovery Enhancement**
  - Includes current competencies with proficiency levels in course search
  - Includes desired competencies with progression paths (e.g., "From Level 2 → 4")
  - AI recommends courses appropriate for current skill level
  - AI ensures courses help achieve desired competency levels
  - Explains how each course builds upon CURRENT competencies to reach DESIRED levels
  - 5-point rationale for each course including competency progression context

#### Wizard Integration
- **Pre-selected Resource** - Start wizard from resource detail view
  - "+ Create Plan" button in resource detail view pre-selects that resource
  - `startNewPlan(resourceId)` now accepts optional resource ID parameter
  - Wizard automatically selects the resource on Step 1
  - Seamless flow from viewing resource to creating their training plan
- **Competency Context Throughout Wizard** - All wizard steps now aware of resource competencies
  - Step 2: AI knows existing competencies when assessing
  - Step 3: AI knows current and desired competencies when recommending goals
  - Step 4: AI knows competency context when discovering courses
  - Better recommendations that build upon existing knowledge

#### Data Structures Enhanced
- **Resource Competency Arrays** - Now properly utilized
  - `currentCompetencies`: Array of `{competencyId, level, assessedDate, assessedBy}`
  - `desiredCompetencies`: Array of `{competencyId, targetLevel, priority, deadline, setDate}`
  - Both arrays auto-initialize if missing
  - Proper validation and duplicate checking
- **Competency Integration** - Links to competency library
  - Competencies selected from global competency library
  - References maintained via competencyId
  - Level definitions pulled from competency library for display
  - Category and name shown from library reference

#### Functions Added
- `manageResourceCompetencies(resourceId, type)` - Opens modal to add competencies (current or desired)
- `saveResourceCompetency(resourceId, type)` - Saves new competency assignment with level
- `removeResourceCompetency(resourceId, competencyId, type)` - Removes competency from resource
- `updateCompetencyLevelHelp()` - Dynamic display of level definitions based on selected competency
- `viewResourceDetail()` - Completely rewritten with comprehensive 4-section layout
- `startNewPlan(preselectedResourceId)` - Enhanced to accept optional resource ID

#### Functions Enhanced
- `runCompetencyAssessment()` - Now includes current competencies context in AI prompt
- `runGoalRecommendations()` - Now includes current and desired competencies in AI prompt
- `runCourseDiscovery()` - Now includes competency progression context in AI prompt

### Fixed
- **CATASTROPHIC BUG** - Competencies were not visibly linked to resources (now fixed)
- **CATASTROPHIC BUG** - Training plans were not visible on resource profiles (now fixed)
- **MAJOR ISSUE** - AI was not using resource competencies in recommendations (now fixed)
- **UX ISSUE** - No way to manage resource competencies through UI (now fixed)
- **UX ISSUE** - No way to set desired competency goals for resources (now fixed)
- **UX ISSUE** - No visual feedback on competency proficiency levels (now fixed with level indicators)

### Changed
- Resource detail modal now uses `modal-xlarge` class for wider display (1200px max-width)
- Resource detail view changed from simple info display to comprehensive 4-section management interface
- Edit button text changed from "Edit" to "Edit Profile" for clarity
- Wizard can now be started with a pre-selected resource from resource detail view

### Technical Details
- Version bumped to 1.0.8 in both saveToLocalStorage() and exportToJSON()
- All new functions properly integrated with auto-save via triggerSave()
- All new functions properly integrated with modal system via closeModal() and openModal()
- Competency level indicators use existing CSS classes (level-indicator, level-box, filled)
- Uses existing getLevelName() function for level name display
- Uses existing formatDate() function for date formatting
- Uses existing formatCurrency() function for budget display
- Maintains backward compatibility with existing data structures

---

## [1.0.7] - 2026-01-24

### Added - CRITICAL: Fully Functional Training Plan System

This release transforms the training plan functionality from placeholder to fully operational with comprehensive AI integration.

#### Training Plan Viewing & Management
- **Plan Detail View** - Click any training plan card to see comprehensive details
  - Complete AI recommendations with detailed rationale for each suggestion
  - Competency assessment results with WHY each competency matters
  - Training goals with priority levels and clear reasoning
  - Course recommendations with detailed explanations of value and impact
  - Scheduled courses timeline and budget breakdown
  - Plan deletion capability
- **Plan Cards Enhanced** - Added click handlers and AI-assisted badge indicators
- **Delete Plan Function** - Ability to remove training plans with confirmation

#### Fully Functional AI-Assisted Wizard
- **Step 2: AI Competency Assessment** - Actually works now!
  - Customizable AI prompts with edit/reset functionality
  - Real-time AI analysis of job roles and competency identification
  - Display of identified competencies with proficiency levels and rationale
  - Clear explanation of WHY each competency is important
- **Step 3: AI Training Goal Recommendations** - Fully operational
  - Customizable goal recommendation prompts
  - Priority-based goal suggestions (Critical, High, Medium, Low)
  - Detailed rationale explaining WHY each goal advances career growth
  - Visual priority indicators with color coding
- **Step 4: AI Course Discovery** - Game-changing functionality
  - Customizable course discovery prompts
  - Detailed rationale for EACH course recommendation explaining:
    * HOW the course addresses specific training goals
    * WHY this course is superior to alternatives
    * WHAT specific skills/knowledge will be gained
    * HOW it fits into overall development journey
  - Relevance scoring (0-100%) with color-coded indicators
  - Course provider, cost, duration, and format details
  - Direct links to course URLs
- **Step 6: Comprehensive Review** - Complete redesign
  - Full summary of all AI recommendations
  - Budget comparison showing estimated vs available
  - Warnings for budget overruns
  - Visual summary of competencies, goals, and courses
  - Clear indication of AI-assisted vs manual plan creation

#### AI Prompt Customization System
- **Editable Prompts** - Users can customize AI prompts for each wizard step
  - Toggle between view and edit modes
  - Save custom prompts that persist through wizard
  - Reset to default prompts anytime
  - Monospace display for easy prompt editing
- **Prompt Categories**:
  - Competency Assessment prompts
  - Goal Recommendation prompts
  - Course Discovery prompts (with emphasis on detailed rationale)

#### Enhanced Plan Data Structure
- **AI Recommendations Saved** - All AI outputs preserved in plan
  - Competency assessment results
  - Training goals with priorities
  - Course recommendations with full rationale
- **Scheduled Courses** - Properly structured with:
  - Course details (title, provider, cost, duration, format)
  - Start dates and status tracking
  - Relevance scores
  - WHY rationale for each course
- **Budget Tracking** - Accurate budget calculations
  - Projected spend from course costs
  - Contingency buffer calculation
  - Budget alerts in review step
- **Gap Analysis** - Structured competency gap data
  - Critical gaps identified
  - Level gaps with target levels
  - Estimated time to close gaps

### Changed
- **Wizard State** - Enhanced to include:
  - AI outputs for all steps
  - Customizable prompts for each AI function
  - Prompt edit state tracking
- **wizardFinish Function** - Complete rewrite to:
  - Save all AI recommendations
  - Build proper scheduled courses array
  - Calculate budgets accurately
  - Generate meaningful plan descriptions
  - Show success modal with plan summary and quick view button
- **Plan Cards** - Now clickable with cursor pointer
  - Added AI-Assisted badge when plan has AI data
  - Clean visual hierarchy

### Fixed
- **CRITICAL: Training Plans Now Visible** - Plans are now displayed after creation and can be clicked to view details
- **CRITICAL: AI Recommendations Now Visible** - All AI outputs are saved and displayed in plan details
- **CRITICAL: Course Rationale Now Provided** - Each course shows detailed explanation of WHY it's recommended
- **Wizard Steps Actually Work** - Steps 2, 3, and 4 now functional with real AI integration
- **Plan Data Persistence** - All AI recommendations properly saved to localStorage
- **Budget Calculations** - Accurate budget tracking from course costs

### Technical Details

**New Functions Added:**
- `viewPlanDetails(planId)` - Comprehensive plan detail modal with all AI outputs
- `deletePlan(planId)` - Remove training plans
- `togglePromptEdit(promptType)` - Toggle prompt editing UI
- `savePromptEdit(promptType)` - Save custom prompts
- `resetPrompt(promptType)` - Reset prompts to defaults
- `runCompetencyAssessment()` - Execute AI competency analysis
- `runGoalRecommendations()` - Execute AI goal suggestions
- `runCourseDiscovery()` - Execute AI course discovery with detailed rationale

**Enhanced Functions:**
- `renderWizardStep2()` - Fully functional with AI and prompt customization
- `renderWizardStep3()` - Fully functional with goal recommendations
- `renderWizardStep4()` - Fully functional with course discovery and WHY rationale
- `renderWizardStep6()` - Comprehensive review with all AI data
- `renderPlansList()` - Added click handlers and AI badges
- `wizardFinish()` - Complete rewrite to save all AI data
- `startNewPlan()` - Initialize with default customizable prompts

**CSS Added:**
- `.modal-xlarge` - Extra large modal for plan details (1200px max-width)

**Data Structure Enhancements:**
- `wizardState.prompts` - Stores customizable AI prompts
- `wizardState.showPromptEdit` - Tracks prompt edit UI state
- `wizardState.data.aiOutputs` - Stores all AI results
- `plan.aiRecommendations` - Comprehensive AI data in saved plans
- `plan.scheduledCourses` - Proper course structure with rationale

### User Impact

**Before this release:**
- ❌ Training plans created but invisible
- ❌ Wizard steps were non-functional placeholders
- ❌ No AI recommendations actually generated
- ❌ No way to see course rationale
- ❌ No prompt customization

**After this release:**
- ✅ Training plans fully visible and clickable
- ✅ Complete AI-assisted wizard workflow
- ✅ Detailed AI recommendations with clear reasoning
- ✅ Comprehensive course rationale explaining VALUE
- ✅ Full prompt customization for fine-tuning
- ✅ Professional plan detail view
- ✅ Budget tracking and warnings

---

## [1.0.6] - 2026-01-24

### Added
- **Latest AI Models from All Providers** - Comprehensive update with newest flagship models
  - **Anthropic Claude 4.5 Series**: Added Opus 4.5 and Sonnet 4.5 (flagship models)
  - **OpenAI GPT-4.1 Series**: Added GPT-4.1 and GPT-4.1 Mini (latest models)
  - **Google Gemini 3 Series**: Added Gemini 3 Flash (frontier model)
  - **Google Gemini 2.5 Series**: Added Gemini 2.5 Flash and Flash-Lite
  - Total model count increased from 12 to 18 models across all providers
  - Last Updated timestamp (January 24, 2026) added to model database
  - Example cost calculations for each model (e.g., "Typical 3K token analysis: ~$0.054 total")

### Changed
- **Pricing Display Clarity** - Completely redesigned to eliminate confusion
  - Changed format from "$3 input / $15 output (per 1M tokens)" to "Input: $3/1M tokens | Output: $15/1M tokens"
  - Added practical example costs showing actual typical usage charges
  - Users now see both technical pricing and real-world cost examples
  - Removed redundant "(per 1M tokens)" suffix that caused confusion
- **Recommended Models Updated** - New flagship models now marked as recommended
  - Anthropic: Claude Opus 4.5 & Sonnet 4.5 (both recommended for different use cases)
  - OpenAI: GPT-4.1 & GPT-4.1 Mini (both recommended)
  - Google: Gemini 3 Flash & 2.5 Flash (both recommended)
- **Model Descriptions** - Enhanced with deprecation notices and upgrade guidance
  - Legacy models clearly marked (e.g., "Legacy - consider upgrading")
  - Deprecated models flagged (Gemini 2.0 Flash-Lite retiring March 31, 2026)
  - Clear upgrade paths suggested for older models
- **Pricing Updates** - All models reflect accurate 2026 API pricing
  - Claude Opus 4.5: $5/$25 per 1M (67% cheaper than previous Opus 4)
  - Claude Sonnet 4.5: $3/$15 per 1M
  - GPT-4.1: $2/$8 per 1M (more affordable than GPT-4 Turbo)
  - Gemini 3 Flash: $0.50/$3 per 1M (frontier performance at excellent value)

### Fixed
- **Model Cost Transparency** - Resolved user confusion about actual API costs
  - Users previously thought "$3 input / $15 output" meant $3 per request
  - New format clearly shows per-million-token pricing
  - Example costs show typical request charges (e.g., ~$0.054 for 3K tokens)
- **Outdated Model Database** - All models updated to latest available versions
  - Claude models now include 4.5 series
  - OpenAI models now include 4.1 series
  - Google models now include Gemini 3 and 2.5 series
- **Model Information Accuracy** - Corrected model IDs, capabilities, and pricing across all providers

### Technical Details

**New Model IDs Added:**
- `claude-opus-4-5-20251101` (Anthropic)
- `claude-sonnet-4-5-20250929` (Anthropic)
- `gpt-4.1-2025-04-14` (OpenAI)
- `gpt-4.1-mini-2025-04-14` (OpenAI)
- `gemini-3-flash-preview` (Google)
- `gemini-2.5-flash` (Google)
- `gemini-2.5-flash-lite` (Google)
- `gemini-2.0-flash-lite` (Google - deprecated)

**Backward Compatibility:**
- All existing model selections remain valid
- Automatic migration to recommended models if previously selected model is now legacy
- Settings validation ensures smooth upgrade path

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
| 1.0.7 | 2026-01-24 | CRITICAL Fix | Fully functional training plan system with AI integration |
| 1.0.6 | 2026-01-24 | Major Update | Latest AI models and clearer pricing display |
| 1.0.5 | 2024-01-24 | Feature | Intelligent AI model selection system |
| 1.0.4 | 2024-01-24 | Feature | Resource-calendar correlation system |
| 1.0.3 | 2024-01-24 | Feature | Category/subcategory management system |
| 1.0.2 | 2024-01-24 | Enhancement | Competency category modularity with dropdowns |
| 1.0.1 | 2024-01-24 | Bug Fix | Fixed resource editing functionality |
| 1.0.0 | 2024-01-24 | Initial Release | Full-featured training plan manager |

---

## Upgrade Guide

### From v1.0.6 → v1.0.7

**What's New:**
- **CRITICAL**: Training plans are now fully functional and visible
- Complete AI-assisted wizard with working Steps 2, 3, and 4
- Clickable plan cards with comprehensive detail views
- AI prompt customization for fine-tuning recommendations
- Detailed course rationale explaining WHY each course is recommended
- Budget tracking and warnings in review step
- Professional plan detail modal with all AI insights

**What's Fixed:**
- Training plans now actually display after creation (CRITICAL BUG FIX)
- Wizard steps 2-4 are now functional instead of placeholders
- AI recommendations are now saved and viewable
- Course recommendations include detailed "WHY" rationale
- Budget calculations are now accurate

**How to Upgrade:**
1. Replace `training-plan-manager.html` with the new version
2. Open in browser - your existing data is preserved
3. **Existing training plans**: If you have any training plans from v1.0.6, they won't have AI recommendations (they were never generated). Delete them and create new ones.
4. **Create a new training plan** to see the fully functional wizard:
   - Step 1: Select a resource
   - Step 2: Run AI Competency Assessment (edit prompt if desired)
   - Step 3: Get AI Goal Recommendations (customize prompts as needed)
   - Step 4: Discover Courses with detailed WHY rationale (customize prompts)
   - Step 5: Review schedule
   - Step 6: Review complete plan with all AI insights
   - Click Finish to create the plan
5. **View the plan**: Click on any plan card to see comprehensive details with all AI recommendations

**Benefits:**
- Training plans are now the centerpiece of the application (as intended!)
- Clear visibility into WHY each course is recommended
- Ability to fine-tune AI prompts for better recommendations
- Professional presentation of training plans
- Accurate budget tracking

**Breaking Changes:**
- None - all existing data remains compatible
- Plans created in v1.0.6 won't have AI data (it was never generated), but they'll still display

**Recommended Actions After Upgrade:**
1. Delete any training plans created in v1.0.6 (they have no real data)
2. Create a test training plan using the wizard to see all new features
3. Experiment with customizing AI prompts to get better recommendations
4. Review the detailed course rationale to understand recommendation quality

---

### From v1.0.5 → v1.0.6

**What's New:**
- Latest flagship models from all three AI providers (Claude 4.5, GPT-4.1, Gemini 3)
- 18 total models (up from 12) including new 4.5 and 4.1 series
- Clearer pricing display with example costs for typical requests
- Deprecated model warnings and upgrade guidance
- Last Updated timestamp showing model database freshness

**Pricing Display Changes:**
- Old format: "$3 input / $15 output (per 1M tokens)" ❌ Confusing
- New format: "Input: $3/1M tokens | Output: $15/1M tokens" ✓ Clear
- Added examples: "Typical 3K token analysis: ~$0.054 total" ✓ Practical

**How to Upgrade:**
1. Replace `training-plan-manager.html` with the new version
2. Open in browser - your data and settings are preserved in localStorage
3. Open Settings (⚙️) to see the new models and pricing display
4. Your existing model selection remains valid
5. Consider upgrading to newer recommended models:
   - Claude 3.5 Sonnet → Claude Sonnet 4.5 or Opus 4.5
   - GPT-4 Turbo → GPT-4.1 or GPT-4.1 Mini
   - Gemini 1.5 Pro → Gemini 3 Flash or 2.5 Flash

**Benefits:**
- Access to newest, most capable AI models
- Better cost transparency - no more confusion about pricing
- Clearer upgrade paths from legacy models
- More cost-effective options (e.g., GPT-4.1 Mini, Gemini 2.5 Flash-Lite)

**No data migration required** - All existing settings remain compatible. Model selections are automatically validated and migrated if needed.

---

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
