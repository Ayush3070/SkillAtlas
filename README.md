# SkillSync AI — Labour Market Intelligence & Curriculum Alignment Platform

**SIH 2026 Problem Statement SIH26134**

> *Challenges in aligning skill development programs with industry requirements and emerging job market demands.*

**Tagline:** *From Industry Demand to Job-Ready Skills.*  
**Secondary:** *Connecting Industry Demand, Training Programs and Career Pathways.*

A dark futuristic dashboard that translates **Industry Demand → Skill Demand → Skill Gap → Curriculum Alignment → Training Recommendations → Trainer/Equipment Planning → Candidate Career Guidance**.

> **Prototype Mode:** All data is hardcoded / mock (160 jobs, 53 skills, 30 courses, 15 districts, 10 sectors). Every number comes from the mock dataset or a calculation — never random garbage. Production would replace mock files with PostgreSQL + authorized datasets.

---

## Features

- **Dashboard** — KPIs (Demand Index, Alignment Score, Critical Gaps, Placement Readiness, Emerging Skills, Oversupplied Courses) + Top Skills bar chart + Critical Gap list + District×Skill heatmap + projected impact (before/after)
- **Industry Demand** — Top skills by posting share + emerging high-growth skills + demand vs growth chart
- **Skill Gaps** — gap = demand−supply, classified Critical/Moderate/Healthy, ranked list + heatmap
- **Curriculum Analyzer** — select any course, see alignment score, Relevant / Missing / Low-Demand skills, radar (current vs required), recommendations
- **AI Recommendations** — 30+ templates, deterministic selection (same district+sector+course → same 6, different → different) with priority, reason, impact, action type
- **Career Guidance** — enter location/education/current skills/preferred sector → 3 pathways with match %, missing skills, learning path, recommended courses
- **District Intelligence** — Three.js stylized network (nodes = districts, size = capacity, color = demand, connections = similarity), click to inspect
- **Three.js Hero** — Labour Market Neural Network (glowing central “Industry Demand” sphere, orbiting skill nodes, particles, auto-rotation, OrbitControls)
- **Selectors** — District (12), Sector (10), Role (dynamic), Time Period (4) — every change calls the real REST API
- **Explore Market** (random district+sector+role) + **Run Intelligence Demo** (auto sequence) + loading/error/empty states

---

## Architecture

```
Frontend (React + TS + Vite + Tailwind + Recharts + Three.js)
   ↓ fetch()
FastAPI REST API
   ↓
Services (analytics.py, recommendation_engine.py, career_engine.py)
   ↓
Mock Data (Python files in backend/data/ — swap for PostgreSQL later)
   ↓
JSON → React
```

**Backend data:** `jobs.py` (160 jobs), `skills.py` (53 skills + sector weights), `courses.py` (30 courses), `districts.py` (15 districts, sectors, roles), `recommendations.py` (32 rec templates + 15 career templates), `employers.py`  
**Services:** `analytics.py` (skill stats, KPI, heatmap, curriculum, district snapshot), `recommendation_engine.py`, `career_engine.py`  
**Frontend:** `components/` (Navbar, HeroNetwork, KPIGrid, DemandChart, SkillGapChart, SkillHeatmap, RecommendationCard, DistrictNetwork, LoadingState) + `pages/` (Dashboard, IndustryDemand, SkillGaps, Curriculum, Recommendations, CareerGuidance, DistrictIntelligence, About)

---

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS 4, React Router 7, Three.js + @react-three/fiber + drei, Recharts, Lucide, Framer Motion
- **Backend:** Python, FastAPI, Pydantic, Uvicorn
- **DB (prototype):** Structured Python mock datasets (swap for PostgreSQL)

---

## Folder Structure

```
SIH PS 134/
  backend/
    main.py
    requirements.txt
    data/
      jobs.py, skills.py, courses.py, districts.py, recommendations.py, employers.py
    services/
      analytics.py, recommendation_engine.py, career_engine.py
    models/schemas.py
  frontend/
    src/
      api.ts
      components/
      pages/
      App.tsx, main.tsx, index.css
    vite.config.ts, tailwind.config.js, postcss.config.js
```

---

## How to Run

### Backend (port 8001)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8001
# health: http://127.0.0.1:8001/api/health
# docs:   http://127.0.0.1:8001/docs
```

### Frontend (port 5173 — proxied /api → 8001)

```bash
cd frontend
npm install
npm run dev
# open http://127.0.0.1:5173 (or 5174 if 5173 busy)
```

> If `5173` is occupied, Vite auto-assigns `5174` — check terminal output.

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/health | health |
| GET | /api/dashboard?district=&sector=&time_period= | KPIs + top skills + gaps + heatmap + recs |
| GET | /api/industry-demand?district=&sector=&time_period= | top + emerging |
| GET | /api/skill-gaps?district=&sector=&time_period= | critical/moderate/healthy + heatmap |
| GET | /api/courses?sector=&district= | list courses |
| GET | /api/courses/{course_id} | single course |
| GET | /api/curriculum/{course_id}?district=&sector=&time_period= | alignment + radar + recs |
| GET | /api/recommendations?district=&sector=&course_id=&time_period= | 6 recs |
| GET | /api/districts | districts + sectors + roles |
| GET | /api/districts/{district}?time_period= | district snapshot |
| GET | /api/careers | career templates |
| POST | /api/career-guidance | body: location, education, current_skills[], preferred_sector, preferred_role? |
| GET | /api/market-snapshot?time_period= | random district/sector/role + KPI |
| GET | /api/employers | employers |
| GET | /api/jobs?district=&sector=&skill=&limit= | jobs |

---

## Prototype Limitations

- No auth, no real scraping, no ML training, no payments, no microservices
- Representative mock dataset — **not** live market data (disclosed in UI + About)
- Projections are modelled, not guaranteed
- Three.js is stylized (network/map), not GIS-accurate

---

## Future Production Architecture

- PostgreSQL + ETL from authorized job portals / NSDC / employer feeds
- Real-time ingestion, dedup, skill normalization (aliases), time-series demand
- Training supply from institute MIS, placement records, trainer registry
- ML ranking + gap forecasting, curriculum diff engine, capacity optimizer
- Auth (institute / student / admin), audit log, role-based recommendations
- GIS district intelligence, deployment on gov cloud

---

## Demo Script (2–3 min)

1. **Dashboard** → KPIs + neural network hero
2. **Explore Market** → filters randomize, charts update via API
3. **Run Intelligence Demo** → Mumbai IT → Bengaluru Cloud → Pune Automotive
4. **Skill Gaps** → Critical/Moderate/Healthy + heatmap
5. **Curriculum** → Full Stack Development → radar + Missing (AWS, Docker)
6. **Recommendations** → deterministic per district/sector
7. **Career Guidance** → Diploma + JS/HTML/CSS → Data Analyst 82%
8. **District Intelligence** → click 3D nodes
9. Close on **Projected Impact**: 68%→84% alignment, 7→3 gaps (modelled)

---

## Acceptance Checklist

- [x] Backend + frontend start, health OK, district/sector selectors call API, charts/gaps/curriculum/recommendations/career/Three.js all dynamic, demo mode works, no console errors, no fake buttons, no blank screens
- Build: `npm run build` passes

---

## Exact Commands (copy-paste)

```bash
# backend
cd "SIH PS 134/backend"
pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8001

# frontend (new terminal)
cd "SIH PS 134/frontend"
npm install
npm run dev
```
