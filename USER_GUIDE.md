# 📖 User Guide - Training Plan Manager

**Complete reference documentation for all features and workflows.**

Version 1.0.1 | Last Updated: January 24, 2024

---

## Table of Contents

1. [Introduction](#introduction)
2. [Dashboard](#1-dashboard-tab)
3. [Resource Management](#2-resource-management-tab)
4. [Competency Library](#3-competency-library-tab)
5. [Course Catalog](#4-course-catalog-tab)
6. [Training Plans](#5-training-plans-tab)
7. [Calendar Management](#6-calendar-management-tab)
8. [Reports & Analytics](#7-reports--analytics-tab)
9. [Settings](#settings)
10. [Data Management](#data-management)
11. [Best Practices](#best-practices)
12. [Troubleshooting](#troubleshooting)

---

## Introduction

### Purpose

The Training Plan Manager helps engineering managers:
- Track team member competencies and skill gaps
- Discover and catalog relevant training courses
- Create comprehensive, budget-conscious training plans
- Monitor progress and measure training effectiveness
- Make data-driven decisions about team development

### Core Concepts

**Resource** - A team member who receives training
**Competency** - A skill or knowledge area (e.g., "Python Programming")
**Course** - A training offering from a provider (e.g., "Complete Python Bootcamp")
**Training Plan** - A structured set of courses assigned to a resource
**Proficiency Level** - 1-5 scale from Awareness to Expert

### Navigation

The application has 7 main tabs:
1. **Dashboard** - Overview and quick actions
2. **Resources** - Team member management
3. **Competencies** - Skill library
4. **Course Catalog** - Available training
5. **Training Plans** - Plan creation and management
6. **Calendars** - Holiday and availability management
7. **Reports** - Analytics and data management

---

## 1. Dashboard Tab

### Overview

The Dashboard provides an at-a-glance view of your entire training program with three main metric cards and detailed tables.

### Metric Cards

**Total Resources**
- Count of team members in the system
- Number of unique locations
- Click to navigate to Resources tab

**Budget Status**
- Total allocated budget across all resources
- Amount spent to date
- Utilization percentage
- Visual progress bar

**Training Plans**
- Number of active training plans
- Overall completion rate
- Success indicators

### Resources Table

**Displays:**
- Name and job title
- Location
- Budget used vs. total
- Course progress (completed / total)
- Status indicator (On Track, At Risk, Behind)

**Actions:**
- Click any row to view resource details
- "View All →" to go to Resources tab

### Quick Actions

**+ Add Resource** - Jump to resource creation form
**+ Create Training Plan** - Start the wizard
**Manage Competencies** - Go to competency library
**Browse Courses** - View course catalog

### Upcoming Deadlines

Shows next 5 deadlines from:
- Course completion dates
- Competency target dates
- Training plan milestones

### Recent Activity

Timeline of recent changes:
- Resources added
- Plans created
- Courses completed
- Data imports/exports

---

## 2. Resource Management Tab

### Resource List View

**Search & Filter:**
- Search by name or job title
- Filter by location (dropdown)
- Future: Filter by department, tags

**Resource Cards:**
- Name and job title
- Location
- Budget visualization (progress bar + amounts)
- Competency count
- Assigned course count

### Adding a Resource

1. Click **"+ Add Resource"**
2. Fill in required fields:
   - **Name*** - Full name
   - Annual Training Budget
   - Weekly Training Hours
3. Fill in optional fields:
   - Job Title
   - Department
   - Location
   - Email
4. Click **"Add Resource"**

### Viewing Resource Details

Click any resource card to open a modal with:

**Basic Information:**
- Name, title, department
- Location, email
- Hire date

**Budget:**
- Annual allocation
- Amount spent
- Remaining balance
- Utilization percentage

**Competencies:**
- Current competencies with levels
- Desired competencies (goals)
- Gap analysis

**Assigned Courses:**
- List of courses in their plan
- Status of each (Planned, In Progress, Completed)
- Progress tracking

**Actions:**
- Edit resource details
- Delete resource (with confirmation)

### Editing a Resource

1. Click any resource card to view details
2. Click **"Edit"** button in the modal
3. Modify any field in the edit form:
   - Name, job title, department
   - Location and email
   - Annual training budget
   - **Budget spent** (track actual spending)
   - Weekly training hours
4. Click **"Save Changes"**

**What You Can Edit:**
- All basic information fields
- Budget allocation and spending
- Training time availability
- Contact information

**Important Notes:**
- Changing **Annual Training Budget** affects remaining budget calculations
- Changing **Weekly Training Hours** affects future plan scheduling
- **Budget Spent** field lets you track actual expenditures vs. planned budget
- Last modified timestamp is automatically updated

### Deleting a Resource

1. View resource details
2. Click **"Delete"**
3. Confirm deletion (if enabled in settings)

**Warning:** This removes:
- The resource
- Their training plans
- All assignments

**Does NOT delete:**
- Competencies (shared across resources)
- Courses (in the catalog)

---

## 3. Competency Library Tab

### Purpose

The Competency Library is a centralized, reusable collection of skills and knowledge areas. Define once, use across multiple resources.

### List View

**Display:**
- Competency name
- Category and subcategory
- Number of resources using this competency
- Actions (View, Delete)

**Filtering:**
- Search by name
- Filter by category

### 5-Level Proficiency Framework

Every competency has standardized level definitions:

**Level 1 - Awareness**
- Basic understanding of concepts
- Can follow documentation with guidance
- Needs supervision for any practical work

**Level 2 - Beginner**
- Can perform basic tasks independently
- Understands fundamentals
- Needs help with complex scenarios

**Level 3 - Intermediate**
- Handles most tasks independently
- Good working knowledge
- Can mentor beginners
- Occasional guidance needed for advanced topics

**Level 4 - Advanced**
- Expert-level skills
- Handles complex scenarios confidently
- Mentors others
- Contributes to best practices

**Level 5 - Expert**
- Industry-recognized expertise
- Thought leader
- Drives innovation
- Can architect solutions and set technical direction

### Adding a Competency

1. Click **"+ Add Competency"**
2. Fill in:
   - **Name*** (e.g., "Kubernetes")
   - **Category** (e.g., "Cloud Platforms")
   - **Subcategory** (e.g., "Container Orchestration")
   - **Description** (what it encompasses)
3. Click **"Add Competency"**

**Proficiency definitions are automatically applied.**

### Viewing Competency Details

Click **"View"** to see:
- Full description
- Category hierarchy
- All 5 proficiency level definitions
- Usage count (how many resources)
- Related competencies (future feature)

### Best Practices

**Naming:**
- Use clear, descriptive names
- Be consistent (e.g., "AWS Cloud" not "Amazon Web Services")
- Avoid abbreviations unless universally known

**Categories:**
- Group logically (Programming, Cloud, Security, Data, Soft Skills)
- Use subcategories for specificity
- Keep hierarchy 2-3 levels max

**Reuse:**
- Check if competency exists before creating
- One competency = one skill concept
- Don't create duplicates with slight variations

### Deleting a Competency

1. Click **"Delete"** on competency
2. System checks usage
3. If used, warning shows affected resources
4. Confirm to remove from all resources

**Impact:**
- Removed from all current competency assignments
- Removed from all desired competency goals
- Cannot be undone (unless you restore from backup)

---

## 4. Course Catalog Tab

### Purpose

Centralized database of available training courses from all providers. Track costs, durations, ratings, and competency mappings.

### List View

**Course Cards show:**
- Title and provider
- Rating (stars) and review count
- Cost, duration, skill level
- Format (Online, In-Person, Hybrid)
- Certification badge (if applicable)

**Filtering:**
- Search by title
- Filter by provider
- Filter by format
- Future: Filter by cost range, level

### Adding a Course

1. Click **"+ Add Course"**
2. Fill in details:

**Basic Information:**
- **Title*** (full course name)
- **Provider** (Udemy, Coursera, etc.)
- **URL** (link to course page)
- **Description** (overview)

**Logistics:**
- **Cost** (in your currency)
- **Duration** (hours)
- **Format** (Online Self-Paced, Online Live, In-Person, Hybrid)
- **Skill Level** (Beginner, Intermediate, Advanced, Expert, All Levels)

**Quality:**
- **Rating** (1-5 stars)
- **Has Certification** (checkbox)

3. Click **"Add Course"**

### Viewing Course Details

Click **"View Details"** to see:
- Full description
- Complete metadata
- Competency mappings (which skills this addresses)
- Usage stats (how many times assigned)
- Direct link to course

### Course Properties

**Format Options:**
- **Online Self-Paced** - Anytime, anywhere, go at your pace
- **Online Live** - Scheduled virtual sessions
- **In-Person** - Physical classroom
- **Hybrid** - Mix of online and in-person

**Skill Levels:**
- **Beginner** - No prior knowledge required
- **Intermediate** - Some experience needed
- **Advanced** - Deep expertise required
- **Expert** - For thought leaders and specialists
- **All Levels** - Suitable for anyone

**Certification:**
- Check this box if completing the course includes a certificate
- Useful for tracking formal credentials
- Filters in future versions

### Best Practices

**Accurate Costs:**
- Include ALL fees (course + exam if separate)
- Note if subscription-based (add to notes field)
- Update when prices change

**Duration:**
- Use total learning hours
- Don't include exam time separately
- Be realistic (vendor estimates may be optimistic)

**Ratings:**
- Use average from provider's site
- Update periodically
- Note review count for context

**URLs:**
- Direct link to course page
- Not affiliate links (unless you want to track)
- Check links periodically (courses get retired)

### Deleting a Course

1. Click **"Delete"**
2. System checks if assigned to any resources
3. Confirm deletion

**Impact:**
- Removed from catalog
- Removed from any training plans
- Historical data (if course was completed) may be affected

---

## 5. Training Plans Tab

### Purpose

Create comprehensive, AI-assisted training plans using a 6-step guided wizard. Plans map competency gaps to specific courses with optimized schedules.

### Plan List View

When not in wizard mode, shows all training plans:

**Plan Cards:**
- Plan name
- Resource name
- Status badge (Draft, Active, Completed, etc.)
- Period (start - end dates)
- Budget allocation
- Number of courses

### The 6-Step Wizard

Click **"+ Create Training Plan"** to start.

#### Step 1: Select Resource

**Choose the team member** for this plan.

**Display shows:**
- Resource name
- Job title and location
- Available budget
- Current competencies

**Select by:**
- Clicking on resource card
- Selected resource highlighted
- "Next →" becomes active

**Validation:**
- Must select a resource to proceed

---

#### Step 2: Assess Competencies

**Review current competencies** for the selected resource.

**Manual Assessment:**
- View existing competencies
- Edit levels if needed
- Add new competencies
- Remove irrelevant ones

**AI-Assisted Assessment:** (Requires API key)
- Click **"🤖 Analyze Competencies"**
- AI reviews job title and description
- Suggests 5-8 relevant competencies
- Proposes current proficiency levels
- Provides rationale for each

**Best used when:**
- Adding a new resource
- Resource changed roles
- Annual reassessment

**Tips:**
- Be honest about current levels
- Consider recent projects/work
- Ask resource for self-assessment
- Use specific examples as evidence

---

#### Step 3: Define Goals

**Set training objectives** - what should this resource achieve?

**Manual Goal Setting:**
- Select competency from library
- Set target level (1-5)
- Choose priority (Critical, High, Medium, Low)
- Set target date
- Provide rationale

**AI-Suggested Goals:** (Requires API key)
- Click **"🤖 Suggest Goals"**
- AI analyzes:
  - Current competencies
  - Job role and trajectory
  - Common career paths
  - Team needs
  - Industry trends
- Suggests 3-5 goals with priorities
- Explains rationale for each

**Priority Levels:**
- **Critical** - Required for current role, immediate impact
- **High** - Important for advancement, near-term value
- **Medium** - Beneficial but not urgent
- **Low** - Nice-to-have, long-term growth

**Target Dates:**
- Realistic given budget and time
- Consider course duration
- Account for availability
- Balance multiple goals

---

#### Step 4: Discover Training

**Find courses that address the goals.**

**Manual Discovery:**
- Browse course catalog
- Filter by relevant criteria
- Review competency mappings
- Select courses for plan
- Track total cost

**AI-Powered Discovery:** (Requires API key)
- Click **"🔍 Discover Courses"**
- AI searches based on:
  - Training goals
  - Budget constraints
  - Format preferences
  - Location
  - Schedule
- Returns ranked recommendations
- Shows relevance score (1-10)
- Explains why each course fits

**Course Selection:**
- Click to add to plan
- Basket shows selected courses
- Running total of costs
- Warns if over budget

**AI considers:**
- Competency match
- Cost effectiveness
- Provider reputation
- Review sentiment
- Certification value
- Format suitability

---

#### Step 5: Schedule Optimization

**Create an optimal schedule** considering availability, holidays, and learning pace.

**Inputs:**
- Selected courses
- Resource availability (weekly hours, preferred days)
- Regional calendar (holidays)
- Personal time off
- Blackout periods
- Learning pace (Intensive, Moderate, Relaxed)

**Manual Scheduling:**
- Drag to reorder courses
- Set start/end dates
- Add milestones
- Check for conflicts

**AI-Optimized Schedule:** (Requires API key)
- Click **"🤖 Optimize Schedule"**
- AI creates schedule that:
  - Sequences prerequisites correctly
  - Balances workload
  - Avoids holidays and PTO
  - Provides review time before exams
  - Suggests milestones
  - Identifies potential conflicts

**Schedule Output:**
- Timeline visualization
- Course sequence with dates
- Weekly hour commitments
- Milestone markers
- Buffer time recommendations

---

#### Step 6: Review and Approve

**Final review** before creating the plan.

**Summary Sections:**

**Plan Overview:**
- Resource name
- Plan period (start - end)
- Total duration (weeks)
- Primary objective

**Competency Transformation:**
- Before/after levels for each goal
- Total gap being closed
- Estimated learning hours

**Budget Breakdown:**
- Available budget
- Allocated for selected courses
- Remaining budget
- Utilization percentage

**Schedule Overview:**
- Timeline visualization
- Course sequence
- Key milestones
- Exam dates

**AI Assessment:** (If used)
- Plan viability rating
- Identified risks
- Mitigation suggestions
- Recommendations

**Actions:**
- **← Back** - Revise any step
- **Save as Draft** - Save without activating
- **✓ Approve Plan** - Create and activate

---

### Plan Statuses

**Draft** - Created but not activated
**Active** - Currently being executed
**In Progress** - Resources taking courses
**Completed** - All courses finished
**Paused** - Temporarily on hold
**Cancelled** - Abandoned

### Managing Existing Plans

(Future features - view, edit, track progress)

---

## 6. Calendar Management Tab

### Purpose

Manage regional holiday calendars and resource availability to improve schedule optimization.

### Calendar Templates

**Pre-loaded:**
- US Federal Holidays 2024 (8 holidays)
- UK Bank Holidays 2024 (8 holidays)

**Custom:**
- Create your own
- Company-specific holidays
- Regional variations

### Adding a Calendar

1. Click **"+ Add Calendar"**
2. Fill in:
   - **Name** (e.g., "Canada Statutory Holidays 2024")
   - **Region** (e.g., "CA")
   - **Year** (e.g., 2024)
   - **Description**
3. Click **"Add Calendar"**

### Adding Holidays

Within a calendar:
1. Click **"Add Holiday"**
2. Specify:
   - Date
   - Name
   - Type (Public, Company, Observed, Optional)
   - Is Recurring (yes/no)
   - Recurring Rule (if applicable)
3. Save

**Recurring Rules:**
- "January 1" (specific date)
- "First Monday of September" (relative)
- "Last Thursday of November"

### Using Calendars

**Assignment:**
- Each resource can have one regional calendar
- Set in resource profile
- Used in schedule optimization

**Cloning:**
- Copy a calendar for a new year
- Adjust dates for recurring holidays
- Modify as needed

### Best Practices

**One Calendar Per:**
- Region/country
- Year

**Not Multiple:**
- Don't combine regions
- Don't span years

**Templates:**
- Mark as "template" for reuse
- Clone yearly
- Update dates

---

## 7. Reports & Analytics Tab

### Budget Utilization Report

**Visual:**
- Progress bar showing utilization %
- Color coding (green < 70%, yellow 70-90%, red > 90%)

**Metrics:**
- Total budget across all resources
- Amount spent
- Remaining
- Average per resource

**Future:**
- By department
- By location
- Trend over time

### Training Progress Report

**Metrics:**
- Total courses assigned
- Completed count
- Completion rate %

**Visual:**
- Progress bar
- Course status breakdown

**Future:**
- Completion velocity (courses/month)
- By resource comparison
- Overdue tracking

### Competency Gap Analysis

**Shows:**
- Total competency gaps across team
- Most common gaps
- Critical skills lacking

**Future:**
- Gap heatmap
- By category breakdown
- Projected closure timeline

### Course Effectiveness

**Will track:**
- Completion rates by course
- Average ratings from team
- ROI estimation
- Repeat recommendations

*(Coming in future version)*

### Data Management Tools

**Export to JSON:**
- Complete data backup
- Filename includes timestamp
- Importable for restore

**Import from JSON:**
- Restore from backup
- Replaces all current data
- Validates before import

**Export to Excel:**
- Multi-sheet workbook
- Sheets: Resources, Competencies, Courses, Plans
- Opens in Excel, Google Sheets, etc.

**Load Sample Data:**
- 6 resources, 18 competencies, 12 courses
- For testing and demonstration
- Replaces current data

**Clear All Data:**
- Deletes everything
- Two confirmations required
- Cannot be undone (use backup!)

---

## Settings

Access via **⚙️ Settings** button in header.

### AI Configuration

**Provider:**
- Anthropic (Claude)
- OpenAI (GPT-4)
- Google (Gemini)

**Model:**
- Specific model name
- e.g., `claude-3-5-sonnet-20241022`

**API Key:**
- Stored locally in browser
- Never transmitted except to AI provider
- Type: password (hidden)

**Temperature:**
- 0.0 = Deterministic, focused
- 1.0 = Creative, varied
- Default: 0.7

### Display Preferences

**Currency:**
- USD, EUR, GBP
- Sets symbol and format

**Date Format:**
- MM/DD/YYYY (US)
- DD/MM/YYYY (European)
- YYYY-MM-DD (ISO)

### Default Values

**Weekly Hours:** Default for new resources
**Annual Budget:** Default budget allocation

**Applied to:**
- New resource creation
- Not existing resources

### Behavior

**Auto-Save:**
- Enable/disable
- Interval (default: 2000ms = 2 seconds)

**Confirm Before Delete:**
- Show confirmation dialogs
- Prevents accidental deletions

---

## Data Management

### Storage Mechanism

**localStorage:**
- Browser-specific
- Persists across sessions
- Cleared with cache clear
- Limit: ~5-10MB (varies by browser)

**Storage Key:**
- `trainingPlanManager_autoSave`
- Contains all app data
- JSON format

### Auto-Save

**How it works:**
- Triggers on data changes
- Debounced (waits for pause in activity)
- Shows "Saving..." indicator
- Confirms "Saved" when complete

**Configurable:**
- Settings → Auto-Save Enabled
- Settings → Interval (milliseconds)

### Manual Backup

**Recommended frequency:**
- Weekly minimum
- After significant changes
- Before major updates
- Before clearing data

**Best practices:**
- Timestamp in filename
- Store in multiple locations
- Version control for teams
- Cloud backup for safety

### Data Export Formats

**JSON:**
- Complete fidelity
- Re-importable
- Human-readable
- Version controlled easily

**Excel:**
- For analysis
- Sharing with stakeholders
- Not re-importable
- Each entity type on separate sheet

### Data Import

**JSON Import:**
- Validates structure
- All-or-nothing (replaces everything)
- Preserves IDs and relationships
- Confirms before proceeding

**Compatibility:**
- Same version: Full compatibility
- Different versions: May require migration
- Check CHANGELOG for breaking changes

### Data Migration

**Version updates:**
- Automatic on load
- Preserves data integrity
- Non-destructive
- Logged in console

**Manual migration:**
- Export from old version
- Import to new version
- Verify data integrity

---

## Best Practices

### Resource Management

**Regular Updates:**
- Review competencies quarterly
- Update budget spent when purchases made
- Track course progress weekly

**Consistent Data:**
- Use standardized job titles
- Consistent location names (not "NY" and "New York")
- Standard department names

**Complete Profiles:**
- Fill all fields
- Keep email current
- Update when roles change

### Competency Organization

**Hierarchical:**
- Consistent categories
- Meaningful subcategories
- Clear naming

**Granularity:**
- Not too broad ("Programming")
- Not too specific ("Python list comprehensions")
- Right level ("Python Programming")

**Coverage:**
- All key technical skills
- Essential soft skills
- Domain knowledge areas

### Course Catalog

**Keep Current:**
- Remove deprecated courses
- Update costs annually
- Check URLs quarterly
- Refresh ratings

**Good Descriptions:**
- What you'll learn
- Who it's for
- Prerequisites
- Outcomes

**Metadata:**
- Accurate duration
- Correct skill level
- Provider reputation
- Review sentiment

### Training Plans

**Realistic Goals:**
- Achievable in timeframe
- Budget-constrained
- Time-feasible

**Balanced:**
- Mix of competencies
- Variety of formats
- Sustainable pace

**Tracked:**
- Update progress regularly
- Mark completions promptly
- Gather feedback
- Measure outcomes

### Backup Strategy

**3-2-1 Rule:**
- 3 copies of data
- 2 different storage types
- 1 offsite backup

**Example:**
- 1 in app (auto-save)
- 1 exported JSON on computer
- 1 in cloud storage (Google Drive)

---

## Troubleshooting

### Application Issues

**App won't load:**
- Check browser console (F12)
- Verify CDN libraries loaded (Network tab)
- Try different browser
- Disable browser extensions
- Clear cache and retry

**Blank screen:**
- Check JavaScript errors in console
- Ensure JavaScript is enabled
- Try incognito/private mode
- Update browser to latest version

**Slow performance:**
- Check number of resources (100+ may slow)
- Clear old training plans
- Export and start fresh
- Use modern browser

### Data Issues

**Data not saving:**
- Check localStorage quota (browser limit)
- Disable Private/Incognito mode
- Check auto-save enabled in Settings
- Manually export as backup

**Data disappeared:**
- Cleared browser cache? Data lost.
- Different browser? Data is browser-specific.
- Private mode? Data not persisted.
- Restore from JSON backup

**Import fails:**
- Validate JSON format (JSONLint.com)
- Check file not corrupted
- Ensure same/compatible version
- Try re-exporting from source

### AI Features

**API calls failing:**
- Check API key in Settings
- Verify key is active/valid
- Check account has credits
- Test with different provider
- Check network connectivity
- Review browser console errors

**Unexpected responses:**
- Try different temperature
- Rephrase inputs
- Check model selection
- Verify provider supports features

**Slow responses:**
- Normal for complex requests
- Check API provider status
- Try smaller requests
- Reduce temperature

### UI Issues

**Modal won't close:**
- Click X button
- Click outside modal
- Press Escape key
- Refresh page (data auto-saved)

**Tab won't switch:**
- Refresh page
- Check console for errors
- Clear cache

**Buttons not working:**
- Check console for errors
- Ensure JavaScript enabled
- Try different browser

### Getting Help

1. **Check this guide** - Most questions answered here
2. **Search GitHub Issues** - Maybe already reported
3. **Browser console** - Copy error messages
4. **Create issue** - Provide details:
   - Browser and version
   - Steps to reproduce
   - Expected vs actual
   - Console errors
   - Screenshots helpful

---

## Keyboard Shortcuts

*(Coming in future version)*

---

## Glossary

**Resource** - A team member who receives training
**Competency** - A skill, knowledge area, or expertise domain
**Proficiency Level** - 1-5 rating of skill mastery
**Course** - A training offering (class, certification, bootcamp)
**Training Plan** - Structured set of courses for a resource
**Gap** - Difference between current and desired competency level
**Provider** - Organization offering courses (Udemy, Coursera, etc.)
**Wizard** - Step-by-step guided workflow
**Modal** - Popup dialog overlay
**Auto-save** - Automatic periodic data persistence
**localStorage** - Browser's local data storage
**CDN** - Content Delivery Network (for libraries)

---

## Version History

See [CHANGELOG.md](CHANGELOG.md) for detailed version history.

---

## Additional Resources

- **[README.md](README.md)** - Project overview
- **[START_HERE.md](START_HERE.md)** - Quick start guide
- **[API_INTEGRATION.md](API_INTEGRATION.md)** - AI setup details
- **[CHANGELOG.md](CHANGELOG.md)** - Version history

---

*This guide covers version 1.0.0 of the Training Plan Manager.*
*For the latest version, visit: https://github.com/Ottomatic-Mike/Resource-Training-Planning*
