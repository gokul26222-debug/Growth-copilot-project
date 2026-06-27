# Growth Copilot

## What is Growth Copilot?

Growth Copilot is an AI-powered tool that helps startup founders and product managers identify and solve their biggest growth problems in just 3 minutes.

**Simply put:** Upload your product metrics → AI finds what's broken → Get actionable experiments to run this week.

---

## The Problem It Solves

When running a SaaS product, you have lots of metrics (signups, activation, conversion, retention, churn) but it's hard to know:
- Which metric is your **biggest problem right now**?
- **Why** is it underperforming?
- **What should you do** to fix it?

Growth Copilot automates this analysis so you don't have to spend hours digging through spreadsheets.

---

## How It Works

### Three Simple Steps

**1. Upload CSV**
- Export your product metrics from your analytics tool
- Upload as a CSV file with: date, users, signups, activated_users, paid_users, retained_users, cancelled_users
- See [sample-saas-metrics.csv](sample-saas-metrics.csv) for the expected format

**2. AI Analysis**
- The app calculates key metrics:
  - **Activation Rate** - % of signups who actually use the product
  - **Conversion Rate** - % of users who become paid customers
  - **Retention Rate** - % of customers who stay active
  - **Churn Rate** - % of customers who leave
  - **Growth Rate** - how fast your user base is growing
- Compares your metrics against SaaS industry benchmarks
- Identifies your 3 biggest growth problems using AI

**3. Get Experiments**
- AI recommends 5 prioritized experiments you can run
- Each experiment includes:
  - Clear hypothesis
  - Expected impact (high/medium/low)
  - Difficulty level (easy/medium/hard)
  - Owner (PM, Engineering, Design, or Marketing)
  - Timeline to run it
  - Key metric to track

You get a downloadable PDF report with everything.

---

## Architecture

### How It's Built

The app is built using modern web technologies:

```
┌─────────────────────────────────────────────────────────────┐
│                    USER'S BROWSER                            │
│  (Next.js React App - Responsive Dashboard UI)              │
└────────────────┬────────────────────────────────────────────┘
                 │ HTTP Requests
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                   WEB SERVER (Next.js)                       │
├─────────────────────────────────────────────────────────────┤
│ ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│ │ /api/analyze │  │ /api/insights│  │/api/experiments
│ │ - Parse CSV  │  │ - AI Problem │  │ - AI Experiment
│ │ - Calculate  │  │   Detection  │  │   Generation
│ │   Metrics    │  │ - Fallback   │  │ - Fallback
│ │              │  │   Analysis   │  │   Generation
│ └──────────────┘  └──────────────┘  └──────────────┘
└────────────────┬────────────────────────────────────────────┘
                 │ AI Requests (when available)
                 ▼
         ┌───────────────────┐
         │   OpenAI API      │
         │  (GPT-3.5/GPT-4)  │
         │  Growth Analysis  │
         └───────────────────┘
```

### Technology Stack

**Frontend:**
- **Next.js 14** - React framework for building the web app
- **React 18** - UI component library
- **Tailwind CSS** - Styling (responsive, modern design)
- **Recharts** - Charts and visualizations
- **React PDF** - PDF report generation

**Backend:**
- **Next.js API Routes** - Serverless backend endpoints
- **OpenAI API** - AI-powered analysis (with fallback)
- **Papa Parse** - CSV file parsing

**Infrastructure:**
- **TypeScript** - Type-safe code (prevents bugs)
- **Tailwind CSS** - Utility-first styling
- **Security headers** - CORS, XSS, and clickjacking protection

---

## Key Features

### 1. CSV Upload & Parsing
- Supports multiple CSV formats
- Validates data integrity
- 5MB file size limit

### 2. Metric Calculation
Automatically computes:
- Activation Rate = (Activated Users / Signups) × 100
- Conversion Rate = (Paid Users / Activated Users) × 100
- Retention Rate = (Retained Users / Total Users) × 100
- Churn Rate = (Cancelled Users / Paid Users) × 100
- Growth Rate = (New Users / Previous Total) × 100

### 3. Growth Score (0-100)
Single number showing overall product health:
- 80-100: Excellent growth trajectory
- 60-79: Good, but opportunities exist
- 40-59: Needs attention
- 0-39: Critical issues to address

### 4. Benchmark Comparison
Automatically compares your metrics against SaaS industry standards:
- Shows if you're above/below benchmark
- Color-coded indicators (good/neutral/needs-work)

### 5. AI Problem Detection
- Identifies 3 biggest growth bottlenecks
- Ranks by business impact
- Provides specific, data-backed insights

### 6. AI Experiment Generation
- Generates 5 prioritized experiments
- Each ranked by impact-to-effort ratio
- Includes implementation guidance

### 7. PDF Report Download
- Professional report with all findings
- Charts and visualizations
- Shareable with team

### 8. Fallback Analysis
If AI is unavailable:
- Uses rule-based analysis instead
- Still delivers actionable insights
- App never breaks

---

## Project Structure

```
growth-copilot/
├── app/                          # Next.js app (pages & API routes)
│   ├── api/
│   │   ├── analyze/             # CSV parsing & metric calculation
│   │   ├── insights/            # AI problem detection
│   │   ├── experiments/         # AI experiment generation
│   │   └── report/              # PDF generation
│   ├── dashboard/               # Main dashboard page
│   ├── page.tsx                 # Landing page
│   ├── layout.tsx               # App layout & metadata
│   └── globals.css              # Global styles
│
├── components/                   # React components
│   ├── dashboard/               # Metric cards, growth score, problem list
│   ├── experiments/             # Experiment cards and list
│   ├── upload/                  # CSV uploader, progress indicator
│   ├── report/                  # PDF download button
│   ├── layout/                  # Navigation bar
│   └── ui/                      # Reusable buttons, badges, cards
│
├── hooks/                        # React custom hooks
│   └── use-upload.ts            # Upload workflow orchestration
│
├── lib/                          # Utility functions & business logic
│   ├── csv-parser.ts            # Parse CSV files
│   ├── metrics.ts               # Calculate metrics
│   ├── openai.ts                # AI API integration
│   ├── fallback-analysis.ts     # Rule-based analysis (no AI needed)
│   ├── rate-limiter.ts          # Prevent API abuse
│   ├── types.ts                 # TypeScript interfaces
│   ├── constants.ts             # SaaS benchmarks, limits
│   └── supabase/                # Database integration (optional)
│
├── public/                       # Static assets
│
├── middleware.ts                # Next.js middleware (security)
├── next.config.mjs              # Next.js configuration
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript configuration
└── tailwind.config.ts           # Styling configuration
```

---

## Data Flow

### When a User Uploads a CSV

1. **User uploads file** → Browser sends to `/api/analyze`

2. **Backend parses CSV** → Extract columns (date, users, signups, etc.)

3. **Calculate metrics** → Compute activation, conversion, retention, churn, growth rates

4. **Send to AI** → `/api/insights` calls OpenAI to detect problems
   - If AI fails → Falls back to rule-based analysis

5. **Generate experiments** → `/api/experiments` calls OpenAI to create action items
   - If AI fails → Falls back to rule-based generation

6. **Display on dashboard** → Show growth score, metrics, problems, experiments

7. **Optional: Download PDF** → Generate professional report with all findings

---

## Security Features

- **HTTPS enforced** - Secure Transport Security header
- **XSS Protection** - Content Security Policy headers
- **Clickjacking Protection** - X-Frame-Options: DENY
- **File validation** - Size limits (5MB max)
- **Rate limiting** - Prevents API abuse
- **Input sanitization** - CSV parsing validates data

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- OpenAI API key (optional - app works without it)

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Set up environment (if using OpenAI)
# Create a .env.local file:
# OPENAI_API_KEY=your_key_here

# 3. Run development server
npm run dev

# 4. Open browser
# http://localhost:3000
```

### Building for Production

```bash
npm run build
npm start
```

---

## Key Numbers

- **Upload limit:** 5MB per file
- **Processing time:** ~30 seconds end-to-end
- **Metric types:** 6 core metrics tracked
- **Problems detected:** 3 major bottlenecks
- **Experiments generated:** 5 prioritized actions
- **Report format:** PDF with charts

---

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/analyze` | POST | Parse CSV, calculate metrics |
| `/api/insights` | POST | AI problem detection |
| `/api/experiments` | POST | AI experiment generation |
| `/api/report` | POST | Generate PDF report |

---

## Example Use Case

**Scenario:** A B2B SaaS startup with 10,000 users

1. **Upload** 6 months of metrics (users, signups, paid conversions, churn)

2. **AI Analysis** finds:
   - Problem #1: Activation rate 35% (benchmark: 45%) - "Too many signups who never activate"
   - Problem #2: Churn rate 8% (benchmark: 4%) - "Customers leaving too quickly"
   - Problem #3: Conversion rate 12% (benchmark: 15%) - "Not enough users buying"

3. **AI Experiments** recommends:
   - P0: Improve onboarding flow (Expected: +15% activation, Timeline: 2 weeks)
   - P1: Add email re-engagement campaign (Expected: -20% churn, Timeline: 1 week)
   - P2: Add payment plan options (Expected: +8% conversion, Timeline: 3 weeks)

4. **Download PDF** and share with team → Everyone knows what to work on

---

## Notes for Non-Developers

- **CSV file:** A spreadsheet exported as plain text (comma-separated values)
- **Metrics:** Numbers that measure how your product is doing
- **Benchmark:** Industry average to compare against
- **Growth Score:** Single number (0-100) representing overall health
- **Experiment:** A specific test/change you can run to improve metrics
- **API:** Communication channel between the app and external services (like AI)
- **Fallback:** Plan B when the main system (AI) isn't available

---

## Future Enhancements

- User authentication & multi-user support
- Database storage for analysis history
- Periodic re-analysis automation
- Slack integration for notifications
- Experiment result tracking
- Custom benchmark creation
- Team collaboration features

---

## License

Private project.

---

## Questions?

For more details about specific features or technical implementation, review the [Project Structure](#project-structure) section above.
