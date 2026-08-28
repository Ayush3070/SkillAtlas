import sys, os
# Ensure api folder is in path for Vercel serverless (api/data, api/services)
sys.path.insert(0, os.path.dirname(__file__))

from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import random
from data.districts import DISTRICTS, SECTORS, ROLES_BY_SECTOR
from data.skills import SKILLS
from data.courses import COURSES
from data.jobs import JOBS
from data.employers import EMPLOYERS
from services.analytics import compute_skill_stats, kpi_summary, top_skills_in_demand, heatmap_data, curriculum_analysis, district_snapshot
from services.recommendation_engine import generate_recommendations
from services.career_engine import recommend_careers
from models.schemas import CareerPathwayRequest

app = FastAPI(title="SkillSync AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health():
    return {"status": "ok", "service": "SkillSync AI", "version": "1.0.0", "mode": "Prototype (mock data)"}

@app.get("/api/districts")
def get_districts():
    return {"districts": DISTRICTS, "sectors": SECTORS, "roles_by_sector": ROLES_BY_SECTOR}

@app.get("/api/districts/{district}")
def get_district_detail(district: str, time_period: str = Query("Last 12 months")):
    snap = district_snapshot(district, time_period)
    names=[d["name"] for d in DISTRICTS]
    if district not in names:
        raise HTTPException(status_code=404, detail="District not found")
    return snap

@app.get("/api/dashboard")
def dashboard(
    district: str = Query("Mumbai"),
    sector: str = Query("IT & Software"),
    time_period: str = Query("Last 12 months")
):
    skill_stats, jobs = compute_skill_stats(district, sector, time_period)
    kpi = kpi_summary(skill_stats, district, sector, time_period)
    top = top_skills_in_demand(skill_stats, 7)
    gaps = sorted(skill_stats, key=lambda x: x["gap"], reverse=True)[:7]
    heat = heatmap_data(skill_stats)
    recs = generate_recommendations(district, sector, None, time_period, limit=4)
    before_alignment=kpi["alignment_score"]
    before_gaps=kpi["critical_gaps"]
    after_alignment=min(94, before_alignment+16)
    after_gaps=max(0, before_gaps-4)
    return {
        "filters": {"district": district, "sector": sector, "time_period": time_period},
        "summary": kpi,
        "top_skills": top,
        "skill_gaps": gaps,
        "heatmap": heat,
        "recommendations": recs,
        "projected_impact": {
            "before_alignment": before_alignment,
            "after_alignment": after_alignment,
            "before_gaps": before_gaps,
            "after_gaps": after_gaps
        },
        "jobs_count": len(jobs)
    }

@app.get("/api/industry-demand")
def industry_demand(
    district: str = Query("Mumbai"),
    sector: str = Query("IT & Software"),
    time_period: str = Query("Last 12 months")
):
    skill_stats, jobs = compute_skill_stats(district, sector, time_period)
    top = top_skills_in_demand(skill_stats, 12)
    emerging = [s for s in skill_stats if s["growth_rate"]>18][:8]
    return {
        "filters": {"district": district, "sector": sector, "time_period": time_period},
        "top_skills": top,
        "emerging_skills": emerging,
        "jobs_analyzed": len(jobs)
    }

@app.get("/api/skill-gaps")
def skill_gaps(
    district: str = Query("Mumbai"),
    sector: str = Query("IT & Software"),
    time_period: str = Query("Last 12 months")
):
    skill_stats, jobs = compute_skill_stats(district, sector, time_period)
    kpi = kpi_summary(skill_stats, district, sector, time_period)
    gaps_sorted = sorted(skill_stats, key=lambda x: x["gap"], reverse=True)
    critical = [s for s in gaps_sorted if s["severity"]=="Critical"]
    moderate = [s for s in gaps_sorted if s["severity"]=="Moderate"]
    healthy = [s for s in gaps_sorted if s["severity"]=="Healthy"]
    heat = heatmap_data(skill_stats)
    return {
        "filters": {"district": district, "sector": sector, "time_period": time_period},
        "summary": kpi,
        "critical": critical,
        "moderate": moderate,
        "healthy": healthy,
        "all_gaps": gaps_sorted,
        "heatmap": heat
    }

@app.get("/api/courses")
def get_courses(sector: Optional[str]=None, district: Optional[str]=None):
    filtered=COURSES
    if sector:
        filtered=[c for c in filtered if c["sector"]==sector]
    if district:
        filtered=[c for c in filtered if c["district"]==district]
    return {"courses": filtered, "total": len(filtered)}

@app.get("/api/courses/{course_id}")
def get_course(course_id: str):
    course=next((c for c in COURSES if c["id"]==course_id), None)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

@app.get("/api/curriculum/{course_id}")
def curriculum(
    course_id: str,
    district: str = Query("Mumbai"),
    sector: str = Query("IT & Software"),
    time_period: str = Query("Last 12 months")
):
    result = curriculum_analysis(course_id, district, sector, time_period)
    if not result:
        raise HTTPException(status_code=404, detail="Course not found")
    recs = generate_recommendations(district, sector, course_id, time_period, limit=5)
    result["recommendations"] = recs
    result["projected_alignment"] = min(94, result["alignment_score"]+16)
    return result

@app.get("/api/recommendations")
def recommendations(
    district: str = Query("Mumbai"),
    sector: str = Query("IT & Software"),
    course_id: Optional[str]=None,
    time_period: str = Query("Last 12 months")
):
    recs = generate_recommendations(district, sector, course_id, time_period, limit=6)
    skill_stats,_=compute_skill_stats(district, sector, time_period)
    kpi = kpi_summary(skill_stats, district, sector, time_period)
    return {
        "filters": {"district": district, "sector": sector, "course_id": course_id, "time_period": time_period},
        "summary": kpi,
        "recommendations": recs
    }

@app.get("/api/jobs")
def get_jobs(
    district: Optional[str]=None,
    sector: Optional[str]=None,
    skill: Optional[str]=None,
    limit: int=Query(20, ge=1, le=100)
):
    filtered=JOBS
    if district:
        filtered=[j for j in filtered if j["district"]==district]
    if sector:
        filtered=[j for j in filtered if j["sector"]==sector]
    if skill:
        filtered=[j for j in filtered if skill in j["skills"]]
    return {"jobs": filtered[:limit], "total": len(filtered)}

@app.get("/api/employers")
def get_employers():
    return {"employers": EMPLOYERS}

@app.get("/api/careers")
def get_careers():
    from data.recommendations import CAREER_TEMPLATES
    return {"careers": CAREER_TEMPLATES}

@app.post("/api/career-guidance")
def career_guidance(req: CareerPathwayRequest):
    results = recommend_careers(req.location, req.education, req.current_skills, req.preferred_sector, req.preferred_role)
    return {
        "input": req.model_dump(),
        "recommendations": results
    }

@app.get("/api/market-snapshot")
def market_snapshot(time_period: str=Query("Last 12 months")):
    district = random.choice([d["name"] for d in DISTRICTS])
    sector = random.choice(SECTORS)
    roles = ROLES_BY_SECTOR.get(sector, ["Analyst"])
    role = random.choice(roles)
    skill_stats,_=compute_skill_stats(district, sector, time_period)
    kpi = kpi_summary(skill_stats, district, sector, time_period)
    top = top_skills_in_demand(skill_stats, 5)
    return {
        "district": district,
        "sector": sector,
        "role": role,
        "time_period": time_period,
        "summary": kpi,
        "top_skills": top
    }
