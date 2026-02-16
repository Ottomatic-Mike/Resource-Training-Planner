# 🤖 AI Integration Guide - Training Plan Manager

**Complete guide to setting up and using AI features in the Training Plan Manager.**

Version 1.0.9 | Last Updated: January 24, 2026

---

## Table of Contents

1. [Overview](#overview)
2. [Supported Providers](#supported-providers)
3. [Anthropic Claude Setup](#anthropic-claude-recommended)
4. [OpenAI GPT Setup](#openai-gpt)
5. [Google Gemini Setup](#google-gemini)
6. [Configuration](#configuration)
7. [AI Features](#ai-features)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)
10. [Privacy & Security](#privacy--security)
11. [Cost Management](#cost-management)

---

## Overview

### What AI Does

The Training Plan Manager integrates with AI providers to offer intelligent assistance throughout the training plan creation process:

1. **Competency Assessment** - Analyzes job roles and suggests relevant skills
2. **Goal Recommendations** - Proposes training objectives based on career paths
3. **Course Discovery** - Searches and recommends optimal training courses
4. **Schedule Optimization** - Creates balanced, conflict-free schedules

### Requirements

- Active API account with a supported provider
- Valid API key
- Available credits/billing enabled
- Internet connection

### Optional vs Required

**AI features are completely optional.** The application works fully without AI:
- Manual competency entry
- Manual goal setting
- Manual course selection from catalog
- Manual schedule creation

AI simply accelerates and enhances these workflows.

---

## Supported Providers

### Comparison Matrix

| Feature | Anthropic Claude | OpenAI GPT | Google Gemini |
|---------|------------------|--------------|---------------|
| **Recommended** | ✅ Yes | ✅ Yes | ⚠️ Alternative |
| **Competency Analysis** | Excellent | Excellent | Very Good |
| **Goal Suggestions** | Excellent | Excellent | Good |
| **Course Discovery** | Very Good | Very Good | Good |
| **Technical Knowledge** | Excellent | Excellent | Good |
| **API Reliability** | Excellent | Excellent | Good |
| **Cost (per request)** | $0.003-0.015 | $0.01-0.03 | $0.0001-0.0004 |
| **Free Tier** | Limited | No | Yes (limited) |

### Recommendation

**For most users:** Anthropic Claude
- Best balance of quality and cost
- Excellent technical knowledge
- Strong structured output
- Good API reliability

**For existing OpenAI users:** OpenAI GPT
- Familiar platform
- Excellent quality
- Slightly higher cost

**For budget-conscious:** Google Gemini
- Very low cost
- Free tier available
- Good for basic use cases

---

## Anthropic Claude (Recommended)

### Step 1: Create Account

1. Visit https://console.anthropic.com/
2. Click **"Sign Up"**
3. Enter email and create password
4. Verify email address
5. Complete profile

### Step 2: Add Credits

1. Go to **Billing** → **Add Credits**
2. Choose amount:
   - $5 minimum
   - $20 recommended for testing
   - $100+ for regular use
3. Enter payment information
4. Confirm purchase

**Note:** Anthropic uses pre-purchased credits, not monthly billing.

### Step 3: Generate API Key

1. Go to **API Keys** section
2. Click **"Create Key"**
3. Name it (e.g., "Training Plan Manager")
4. Copy the key immediately (shown only once!)
5. Store securely (password manager recommended)

**API Key Format:** `sk-ant-api03-...` (starts with sk-ant)

### Step 4: Configure in App

1. Open Training Plan Manager
2. Click **Settings ⚙️**
3. Select **AI Provider**: Anthropic
4. Enter **API Key**: (paste your key)
5. Select **Model**: `claude-opus-4-6` (default, recommended)
6. Set **Temperature**: 0.7 (default)
7. Click **"Save Settings"**

### Step 5: Test Integration

1. Navigate to **Training Plans** tab
2. Click **"+ Create Training Plan"**
3. Select a resource (Step 1)
4. In Step 2, look for AI buttons
5. Try **"🤖 Analyze Competencies"**
6. Should see a loading state, then results

**Success:** AI returns competency suggestions
**Failure:** Check API key, credits, network

### Recommended Models

**claude-opus-4-6** (Premium)
- Latest flagship, highest intelligence
- Cost: ~$0.09 per request
- Use for: Complex enterprise training analysis

**claude-opus-4-6** (Default, Recommended)
- Most capable model for training plan analysis
- Cost: ~$0.15 per request
- Use for: All features

**claude-haiku-4-5-20251001** (Budget)
- Fast and cost-effective
- Cost: ~$0.018 per request
- Use for: Quick suggestions and simple tasks

### Cost Estimates

**Typical Usage (per month):**
- 10 competency analyses: ~$0.50
- 20 goal suggestions: ~$1.00
- 15 course discoveries: ~$2.00
- 10 schedule optimizations: ~$0.75

**Total: ~$4-5/month for moderate use**

### Links

- Console: https://console.anthropic.com/
- API Docs: https://docs.anthropic.com/
- Pricing: https://www.anthropic.com/pricing
- Status: https://status.anthropic.com/

---

## OpenAI GPT

### Step 1: Create Account

1. Visit https://platform.openai.com/
2. Click **"Sign Up"**
3. Use email or Google/Microsoft account
4. Verify email
5. Complete phone verification

### Step 2: Add Payment Method

1. Go to **Billing** → **Payment methods**
2. Click **"Add payment method"**
3. Enter credit card details
4. Set usage limits (recommended):
   - Soft limit: $20/month
   - Hard limit: $50/month

**Note:** OpenAI bills monthly based on usage, not pre-purchased credits.

### Step 3: Generate API Key

1. Go to **API keys** section
2. Click **"Create new secret key"**
3. Name it (e.g., "Training Plan Manager")
4. Click **"Create secret key"**
5. Copy immediately (shown only once!)
6. Store securely

**API Key Format:** `sk-...` (starts with sk-)

### Step 4: Configure in App

1. Open Training Plan Manager
2. Click **Settings ⚙️**
3. Select **AI Provider**: OpenAI
4. Enter **API Key**: (paste your key)
5. Select **Model**: `gpt-5.2` (recommended)
6. Set **Temperature**: 0.7
7. Click **"Save Settings"**

### Step 5: Test Integration

Same as Anthropic (see above).

### Recommended Models

**gpt-5.2** (Recommended)
- Latest flagship with revolutionary reasoning
- Cost: ~$0.047 per request
- Use for: All features

**o4-mini** (Reasoning)
- Fast reasoning model, great value
- Cost: ~$0.017 per request
- Use for: Complex analysis with structured output

**o3** (Premium Reasoning)
- Most powerful reasoning model
- Cost: ~$0.03 per request
- Use for: Deep multi-step competency analysis

### Cost Estimates

**Typical Usage (per month):**
- 10 competency analyses: ~$1.50
- 20 goal suggestions: ~$3.00
- 15 course discoveries: ~$6.00
- 10 schedule optimizations: ~$2.25

**Total: ~$12-15/month for moderate use**

### Links

- Platform: https://platform.openai.com/
- API Docs: https://platform.openai.com/docs/
- Pricing: https://openai.com/pricing
- Status: https://status.openai.com/

---

## Google Gemini

### Step 1: Get API Access

1. Visit https://makersuite.google.com/
2. Sign in with Google account
3. Accept terms and conditions
4. Activate API access

### Step 2: Create API Key

1. Click **"Get API key"**
2. Choose project or create new
3. Click **"Create API key"**
4. Copy the key
5. Store securely

**API Key Format:** Alphanumeric string

### Step 3: Configure in App

1. Open Training Plan Manager
2. Click **Settings ⚙️**
3. Select **AI Provider**: Google
4. Enter **API Key**: (paste your key)
5. Select **Model**: `gemini-3-flash-preview` (recommended)
6. Set **Temperature**: 0.7
7. Click **"Save Settings"**

### Step 4: Test Integration

Same as Anthropic (see above).

### Recommended Models

**gemini-3-pro-preview** (Premium)
- Latest flagship, advanced reasoning
- Cost: ~$0.042 per request
- Use for: Complex enterprise analysis

**gemini-3-flash-preview** (Recommended)
- Frontier performance at excellent value
- Cost: ~$0.011 per request
- Use for: All features, best value

**gemini-2.5-flash** (Budget)
- Fast and very affordable
- Cost: ~$0.003 per request
- Use for: Budget-conscious usage

### Cost Estimates

**Free Tier:**
- 60 requests per minute
- Likely sufficient for individual use

**Paid (if exceeded):**
- ~$0.0001-0.0004 per request
- Very affordable

### Links

- MakerSuite: https://makersuite.google.com/
- API Docs: https://ai.google.dev/docs
- Pricing: https://ai.google.dev/pricing

---

## Configuration

### In-App Settings

Access via **Settings ⚙️** button.

**AI Provider:**
- Dropdown: Anthropic, OpenAI, Google
- Choose your preferred provider
- Models update automatically when provider changes

**AI Model:**
- **Intelligent Dropdown** with model information (NEW in v1.0.5)
- Displays all available models for selected provider
- Shows recommended models with ⭐ badge
- Automatically selects recommended model when changing providers

**Model Information Card:**
Each model displays:
- **Name and Recommendation Badge** - Clearly marked recommended models
- **Description** - What the model is best for
- **Key Strengths** - Capabilities as badges (e.g., "Complex reasoning", "Cost-effective")
- **Best For** - Specific use case for training planning
- **Pricing** - Clear format showing input/output costs per 1M tokens
- **Example Cost** - Typical actual cost for a 3K token analysis (NEW in v1.0.6)

**Available Models:** *(Updated February 2026)*

*Anthropic Claude:*
- **Claude Opus 4.6** ⭐ RECOMMENDED - Latest flagship, highest intelligence ($5/$25 per 1M tokens)
- **Claude Sonnet 4.5** ⭐ RECOMMENDED - Best balance of capability and cost ($3/$15 per 1M tokens)
- Claude Haiku 4.5 - Fast and cost-effective ($1/$5 per 1M tokens)
- Claude Opus 4.5 - Previous flagship, still excellent ($5/$25 per 1M tokens)
- Claude 3.5 Sonnet (Legacy) - Previous generation ($3/$15 per 1M tokens)
- Claude 3.5 Haiku (Legacy) - Previous generation fast model ($0.80/$4 per 1M tokens)

*OpenAI:*
- **GPT-5.2** ⭐ RECOMMENDED - Latest flagship, revolutionary reasoning ($1.75/$14 per 1M tokens)
- **o4-mini** ⭐ RECOMMENDED - Fast reasoning model, great value ($1.10/$4.40 per 1M tokens)
- o3 - Most powerful reasoning model ($2/$8 per 1M tokens)
- GPT-4.1 - Previous generation, still capable ($2/$8 per 1M tokens)
- GPT-4.1 Mini - Previous generation, cost-effective ($0.40/$1.60 per 1M tokens)
- GPT-4o (Legacy) - Multimodal capabilities ($2.50/$10 per 1M tokens)
- GPT-4o Mini (Legacy) - Fast multimodal ($0.15/$0.60 per 1M tokens)

*Google Gemini:*
- **Gemini 3 Pro** ⭐ RECOMMENDED - Latest flagship, advanced reasoning ($2/$12 per 1M tokens)
- **Gemini 3 Flash** ⭐ RECOMMENDED - Frontier performance at excellent value ($0.50/$3 per 1M tokens)
- Gemini 2.5 Pro - Previous gen pro model, large context ($1.25/$10 per 1M tokens)
- Gemini 2.5 Flash - Fast and capable ($0.15/$0.60 per 1M tokens)
- Gemini 2.5 Flash-Lite - Ultra cost-effective ($0.10/$0.40 per 1M tokens)
- Gemini 1.5 Pro (Legacy) - Consider Gemini 3 Pro ($3.50/$10.50 per 1M tokens)

**Pricing Note:** Costs shown are per 1 million tokens. Example: A typical 3,000 token request with Claude Sonnet 4.5 costs approximately $0.054 total (not $3!).

**API Key:**
- Password field (hidden)
- Paste your key
- Stored in localStorage
- Never transmitted except to AI provider

**Temperature:**
- Number: 0.0 to 1.0
- 0.0 = Most deterministic
- 0.7 = Balanced (recommended)
- 1.0 = Most creative

### Advanced Settings

**Temperature Guide:**

| Value | Behavior | Use Case |
|-------|----------|----------|
| 0.0 | Deterministic, focused | Repeatable results |
| 0.3 | Mostly consistent | Structured analysis |
| 0.7 | Balanced | General use (default) |
| 1.0 | Creative, varied | Brainstorming, ideas |

**Recommendations:**
- Competency analysis: 0.3-0.5
- Goal suggestions: 0.7
- Course discovery: 0.7-0.9
- Schedule optimization: 0.3

### Choosing the Right Model

**For Most Users (Recommended ⭐):**
- **Claude Sonnet 4.5** - Best overall balance of capability and cost ($3/$15 per 1M)
- **GPT-5.2** - Revolutionary reasoning and analytical capabilities ($1.50/$6 per 1M)
- **Gemini 3 Flash** - Frontier performance at excellent value ($0.50/$3 per 1M)

**For Maximum Quality:**
- **Claude Opus 4.5** - Highest intelligence, best for complex frameworks ($5/$25 per 1M)
- **GPT-5.2** - Superior reasoning for sophisticated training programs ($1.50/$6 per 1M)
- Use when accuracy is paramount and cost is secondary

**For Cost-Effectiveness:**
- **GPT-5.2 Mini** - Excellent quality at very low cost ($0.30/$1.20 per 1M)
- **Gemini 2.5 Flash** - Fast and capable for most tasks ($0.15/$0.60 per 1M)
- **Gemini 2.5 Flash-Lite** - Ultra low cost for simple queries ($0.10/$0.40 per 1M)
- **Claude 3.5 Haiku** - Fast Claude model for quick suggestions ($1/$5 per 1M)

**Legacy Models (Consider Upgrading):**
- Claude 3 Opus → Upgrade to **Claude Opus 4.5** (better + cheaper)
- GPT-4.1 → Upgrade to **GPT-5.2** (better + cheaper)
- GPT-4 Turbo → Upgrade to **GPT-5.2** (significantly better + cheaper)
- Gemini 1.5 Pro → Upgrade to **Gemini 3 Flash** (better + cheaper)

**Selection Tips:**
1. **Start with recommended models** - They're optimized for training planning
2. **Check the example cost** - See actual typical request charges (e.g., ~$0.054 for 3K tokens)
3. **Review key strengths** - Match capabilities to your needs
4. **Read the use case** - Specific guidance for training plan creation
5. **Consider newer models** - Latest flagships offer better value than legacy options
6. **Switch if needed** - All models work with your existing data

### Switching Providers

1. Go to Settings
2. Change AI Provider dropdown
3. Model automatically updates to recommended model for new provider
4. Update API Key for new provider
5. Save

**Automatic Model Selection:**
- Switching providers automatically selects the recommended model
- Invalid model/provider combinations are corrected automatically
- Your existing data is preserved and provider-agnostic

---

## AI Features

### 1. Competency Assessment

**Location:** Training Plan Wizard → Step 2

**What it does:**
- Analyzes job title and description
- Suggests 5-8 relevant competencies
- Proposes current proficiency levels (1-5)
- Provides rationale for each

**Input:**
- Job title
- Department
- Optional context

**Output:**
```json
[
  {
    "name": "Python Programming",
    "category": "Programming Languages",
    "currentLevel": 3,
    "rationale": "Senior developers typically have intermediate Python skills"
  },
  ...
]
```

**Best for:**
- New hires
- Role changes
- Annual reviews

### 2. Goal Recommendations

**Location:** Training Plan Wizard → Step 3

**What it does:**
- Reviews current competencies
- Analyzes job role and career path
- Suggests 3-5 training goals
- Prioritizes based on impact
- Sets realistic target dates

**Input:**
- Current competencies
- Job title and role
- Career aspirations (optional)

**Output:**
```json
[
  {
    "competencyName": "Kubernetes",
    "targetLevel": 4,
    "priority": "High",
    "rationale": "Critical for cloud-native development",
    "estimatedMonths": 6
  },
  ...
]
```

**Best for:**
- Career development planning
- Skill gap identification
- Team capability building

### 3. Course Discovery

**Location:** Training Plan Wizard → Step 4

**What it does:**
- Searches for courses matching goals
- Evaluates providers and options
- Ranks by relevance and quality
- Considers budget and format
- Explains recommendations

**Input:**
- Training goals
- Budget constraints
- Format preferences
- Location

**Output:**
```json
[
  {
    "title": "Kubernetes for Developers",
    "provider": "Linux Foundation",
    "cost": 299,
    "duration": 40,
    "relevanceScore": 9.5,
    "rationale": "Industry-recognized certification, hands-on labs"
  },
  ...
]
```

**Best for:**
- Finding optimal courses
- Comparing options
- Budget optimization

### 4. Schedule Optimization

**Location:** Training Plan Wizard → Step 5

**What it does:**
- Sequences courses logically
- Balances workload
- Avoids holidays and conflicts
- Provides buffer time
- Suggests milestones

**Input:**
- Selected courses
- Availability (hours/week, days)
- Holidays and time off
- Learning pace

**Output:**
```json
{
  "schedule": [
    {
      "courseId": 1,
      "startDate": "2026-03-01",
      "endDate": "2026-05-15",
      "weeklyHours": 5,
      "milestones": [...]
    },
    ...
  ],
  "risks": ["Exam overlaps with Q2 launch"],
  "recommendations": ["Add 2-week buffer before exam"]
}
```

**Best for:**
- Realistic planning
- Conflict avoidance
- Sustainable pacing

---

## Best Practices

### API Key Management

**DO:**
- Store in password manager
- Keep confidential
- Rotate periodically (every 6-12 months)
- Use separate keys for different apps
- Monitor usage on provider dashboard

**DON'T:**
- Commit to Git
- Share with others
- Email or message
- Store in plain text files
- Reuse across apps

### Prompt Engineering

**Be Specific:**
- Provide context
- Specify constraints
- Give examples
- State preferences

**Good Example:**
```
Job Title: Senior Backend Engineer
Department: Payments Team
Context: Working on high-transaction payment processing,
need to improve system scalability and fault tolerance.
```

**Bad Example:**
```
Job Title: Engineer
```

### Cost Optimization

**Reduce Costs:**
- Use lower-cost models for simple tasks
- Cache results where possible
- Batch similar requests
- Set usage limits on provider dashboard
- Monitor spending weekly

**When to Use AI:**
- New resources (high value)
- Annual reviews (periodic)
- Major role changes (rare)
- Complex planning (as needed)

**When to Skip AI:**
- Minor updates (low value)
- Well-known scenarios (manual faster)
- Repetitive tasks (cache previous)

### Quality Assurance

**Always Review:**
- AI suggestions are starting points, not gospel
- Verify competency levels with resource
- Check course details on provider site
- Confirm schedules with resource's calendar

**Red Flags:**
- Hallucinated courses (verify URLs)
- Unrealistic timelines
- Off-target competencies
- Inconsistent priorities

**Improve Results:**
- Provide more context
- Adjust temperature
- Try different phrasing
- Use examples
- Iterate

---

## Troubleshooting

### API Key Issues

**"API key not configured"**
- Go to Settings
- Enter valid API key
- Save settings

**"Invalid API key"**
- Check key copied correctly
- No extra spaces
- Correct provider selected
- Key not revoked

**"Insufficient quota"**
- Anthropic: Add credits
- OpenAI: Check billing
- Google: Check limits
- Top up account

### Request Failures

**"Network error"**
- Check internet connection
- Check provider status page
- Try different network
- Disable VPN/proxy

**"Rate limit exceeded"**
- Wait 1 minute
- Reduce frequency
- Upgrade tier (if available)

**"Context length exceeded"**
- Reduce input size
- Simplify prompt
- Use smaller model
- Split into multiple requests

### Response Quality

**Generic/unhelpful responses:**
- Add more context
- Be more specific
- Provide examples
- Increase temperature

**Inaccurate information:**
- Cross-check facts
- Lower temperature
- Verify sources
- Report if persistent

**Incomplete responses:**
- Check token limits
- Simplify request
- Split into parts

### Provider-Specific

**Anthropic:**
- Check credits balance
- Verify model name exact
- Check status.anthropic.com

**OpenAI:**
- Verify payment method
- Check usage limits
- Check status.openai.com

**Google:**
- Check quota limits
- Verify project enabled
- Check console.cloud.google.com

---

## Privacy & Security

### Data Transmission

**What's sent to AI:**
- Job titles
- Competency names
- Course titles
- Context you provide

**What's NOT sent:**
- Resource names
- Email addresses
- Budget amounts (unless you include in context)
- Personal notes
- Other sensitive PII

### Local Storage

**API Key:**
- Stored in localStorage
- Browser-specific
- Not encrypted (browser limitation)
- Never transmitted except to AI provider

**Risk Mitigation:**
- Use dedicated API keys (not account-wide)
- Set low usage limits
- Rotate regularly
- Don't use shared computers

### Compliance

**GDPR:**
- Minimal data transmission
- User controls data
- Can delete anytime
- Check provider's GDPR status

**SOC 2:**
- Anthropic: SOC 2 Type II
- OpenAI: SOC 2 Type II
- Google: SOC 2 Type II

### Best Practices

1. **Minimal Data:** Only send what's necessary
2. **Anonymize:** Use generic titles ("Senior Engineer" not "Jane Doe")
3. **Regular Review:** Check API usage logs
4. **Key Rotation:** Change keys every 6 months
5. **Access Control:** Don't share the HTML file with your API key

---

## Cost Management

### Setting Budgets

**Anthropic:**
1. Console → Billing
2. No built-in limits (use pre-purchase)
3. Buy small amounts initially
4. Monitor usage dashboard

**OpenAI:**
1. Platform → Billing → Usage limits
2. Set soft limit (email alert)
3. Set hard limit (stops requests)
4. Recommended: $20 soft, $50 hard

**Google:**
1. Free tier usually sufficient
2. Cloud Console → Billing
3. Set budget alerts

### Tracking Costs

**Monitor:**
- Provider dashboard (weekly)
- Usage patterns
- Cost per feature
- Unexpected spikes

**Optimize:**
- Use cheaper models where possible
- Reduce temperature for deterministic tasks
- Cache common queries
- Batch similar requests

### Cost Alerts

**Set up:**
1. Provider dashboard
2. Billing alerts
3. Email notifications
4. Weekly reports

**Thresholds:**
- 50% of budget
- 80% of budget
- 100% of budget

---

## FAQ

**Q: Can I use multiple providers?**
A: Yes, switch in Settings anytime. Data is provider-agnostic.

**Q: What if I don't have an API key?**
A: All features work manually. AI is optional enhancement.

**Q: How much does AI cost per training plan?**
A: ~$0.50-2.00 depending on provider and complexity.

**Q: Is my data private?**
A: Yes. Only job-related context sent to AI. Names, emails stay local.

**Q: Can I use free tiers?**
A: Google Gemini has generous free tier. Anthropic and OpenAI require payment.

**Q: What if API is down?**
A: Use manual features. Data unaffected. Try again later.

**Q: Can I use my organization's API key?**
A: If allowed by policy. Check with IT/security first.

**Q: How do I cancel AI service?**
A: Remove API key from Settings. Stop provider billing on their site.

---

## Additional Resources

- **[README.md](README.md)** - Project overview
- **[USER_GUIDE.md](USER_GUIDE.md)** - Complete feature guide
- **[START_HERE.md](START_HERE.md)** - Quick start

---

*This guide covers version 1.0.0 of the Training Plan Manager.*
*For provider-specific help, consult their documentation.*
