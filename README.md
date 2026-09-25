# AKHIL — INTERACTIVE DEVOPS & CLOUD INFRASTRUCTURE CONTROL PLANE

A production-grade, full-stack personal portfolio and infrastructure control plane platform for **Akhil (Akhil K Anil)**, DevOps Engineer & Cloud Infrastructure Engineer (10+ Years experience, Kochi, Kerala, India).

Designed with the aesthetic and operational philosophy of **"An engineer's infrastructure control plane presented as a portfolio"**.

---

## 🛠️ TECH STACK

- **Framework**: [Next.js](https://nextjs.org/) 16 (App Router, Server Components)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database & ODM**: MongoDB & [Mongoose](https://mongoosejs.com/)
- **Validation**: [Zod](https://zod.dev/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Authentication**: Stateless JWT via [jose](https://github.com/panva/jose) & HttpOnly secure cookies
- **Password Hashing**: [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- **Rate Limiting**: Sliding window token bucket with SHA-256 IP anonymization

---

## 🏗️ SYSTEM ARCHITECTURE & FEATURES

### 1. Public Portfolio Experience
- **01 — System Boot**: High-speed, non-blocking sequence (~500ms) with `prefers-reduced-motion` compliance.
- **02 — Hero**: Technical metadata tags, headline, and real-time database-backed values.
- **03 — System Status**: Visual indicators (Online, Infrastructure, Automation, Monitoring, Deployment).
- **04 — Engineering Timeline**: Dynamic career trajectory derived from Experience records (horizontal on desktop, vertical on mobile).
- **05 — What I Build**: 6 core engineering pillars (Cloud Architecture, IaC, Containers, CI/CD, Security, Observability).
- **06 — Infrastructure Architecture**: Interactive topology graph (Internet -> Cloudflare -> CDN/WAF -> ALB -> EC2/ECS -> App -> RDS -> Redis) with live node inspection.
- **07 — CI/CD Pipeline**: GitOps deployment lifecycle visualization (Code -> GitHub -> Build -> Test -> Package -> Deploy -> AWS -> Monitor).
- **08 — Featured Projects**: Deep technical case studies with AWS services, databases, and CI/CD tools.
- **09 — Technology Stack**: Structured tool matrix with optional proficiency levels. **Zero fake percentage bars.**
- **10 — Experience**: Detailed timeline entries (Iroid Technologies, a2solutions) with expandable responsibilities and verified technology stacks.
- **11 — Command Center (CLI)**: Interactive in-browser terminal (`akhil@portfolio:~$`) with command autocomplete, history, and real-time MongoDB queries for `whoami`, `status`, `skills`, `projects`, `experience`, `about`, `contact`, and `help`.
- **12 — About & Introduction Statement**: Large editorial quote: *"Infrastructure is invisible when it works. My job is to make sure it keeps working."*
- **13 — Engineering Principles**: 4 core reliability tenets (Automate the repeatable, Observe everything, Keep it boring, Security by default).
- **14 — Hobbies**: Maker pursuits (Building Hackintosh Machines, Working with Arduino).
- **15 — Contact**: Rate-limited, validated contact form with SHA-256 IP hashing and optional email notification hooks.
- **16 — Footer**: Real-time metadata, copyright, system status indicator, and control plane access.

### 2. Complete Admin Control Plane (`/admin`)
- **Dashboard**: Live MongoDB counts for Messages, Projects, Skills, and Experience.
- **Site Settings**: Live updates to hero headline, CTAs, contact email, and system status labels.
- **About**: Manage editorial thesis statement and narrative paragraphs.
- **Navigation**: Topbar and mobile drawer route manager with drag/ordering.
- **Skills Matrix**: Category and tool CRUD, optional proficiency level, featured toggle.
- **Experience Timeline**: Career history, current role flag, dynamic responsibilities and technology tag editors.
- **Projects**: Comprehensive case study editor with dynamic tag managers for AWS Services, Databases, Cloud Platforms, and CI/CD tools.
- **Architecture**: Topology visualizer manager with node coordinates and interconnect links.
- **CI/CD Pipeline**: Pipeline stages editor with ordering and descriptions.
- **Terminal CLI**: Custom shell commands and outputs.
- **Messages**: Contact inquiry inbox with server-side search, status filters (`new`, `read`, `archived`), pagination, and safe `mailto:` reply triggers.
- **Social Links**: Manage profiles (GitHub, LinkedIn, Email).
- **SEO**: Meta tags, OpenGraph previews, keywords, and crawler rules.
- **Admin Account**: Email management and secure password change with verification.

> **CRITICAL ARCHITECTURAL GUARANTEE**: No education section, model, route, or schema exists anywhere in this codebase.

---

## 🚀 GETTING STARTED

### 1. Prerequisites
- Node.js 18+ (tested on Node v20+)
- MongoDB (local instance or MongoDB Atlas cluster)

### 2. Installation
```bash
# Clone the repository
git clone <repo-url>
cd portfolio

# Install dependencies
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configure your variables in `.env.local`:
```env
# MongoDB Connection URI
MONGODB_URI=mongodb://localhost:27017/portfolio

# Authentication Secret (min 32 random characters)
AUTH_SECRET=super_secret_devops_auth_key_change_in_production_min32chars

# Initial Admin Credentials
ADMIN_EMAIL=admin@akhil.dev
ADMIN_PASSWORD=DevOpsEngineerAkhil2026!

# Public Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional Contact Form Notification
CONTACT_NOTIFICATION_ENABLED=false
```

### 4. Seed Database & Create Admin
Run the seed scripts to populate initial CV data and initialize the root administrator:
```bash
# 1. Create the initial admin account
npm run create-admin

# 2. Seed initial CV data (Iroid Technologies, a2solutions, SVADHAN, Easy Store, Dent Care, BBT, Bazar One, Alba Clothing, Skills, Architecture, Pipeline)
npm run seed
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) for the public portfolio.
Open [http://localhost:3000/admin](http://localhost:3000/admin) to log in to the administrative control plane.

---

## 🔒 SECURITY & HARDENING

1. **Stateless Server-Side Authentication**:
   - JWT tokens signed with HS256 via `jose`.
   - Stored in `HttpOnly`, `SameSite=Lax`, `Secure` (in production) cookies.
   - Protected route middleware blocks unauthorized access to `/admin/*` and `/api/admin/*`.
2. **Abuse Prevention & Rate Limiting**:
   - Sliding-window rate limiters on `POST /api/contact` (5 req / 10 min) and `POST /api/admin/login` (10 req / 15 min).
   - Client IPs are hashed with SHA-256 and salted. No raw IP addresses are permanently retained.
3. **URL Security**:
   - Strict protocol validation rejects `javascript:`, `data:`, `vbscript:`, and malformed protocols. Only `https://`, `http://`, and `mailto:` are permitted.
4. **Resilient Database Fallbacks**:
   - If MongoDB temporarily disconnects or experiences a latency spike, the public portfolio uses safe initial data fallbacks without crashing.
   - The admin panel displays explicit `DATABASE CONNECTION ERROR` indicators with retry controls.

---

## 📦 PRODUCTION BUILD & DEPLOYMENT

```bash
# Build the production bundle
npm run build

# Start the production server
npm start
```

Deployable to Vercel, AWS ECS, AWS App Runner, or any containerized Docker environment.
When deploying to Vercel or AWS, set `MONGODB_URI`, `AUTH_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` in your hosting platform's environment settings.

---

## 📄 LICENSE
MIT © Akhil K Anil. Built with Next.js and Tailwind CSS.
