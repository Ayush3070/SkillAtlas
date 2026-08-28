from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class Filters(BaseModel):
    district: str
    sector: str
    role: Optional[str] = None
    time_period: Optional[str] = "Last 12 months"

class SkillDemand(BaseModel):
    skill: str
    demand: int
    supply: int
    gap: int
    category: str
    growth_rate: float
    severity: str

class KPISummary(BaseModel):
    demand_index: float
    demand_yoy: float
    alignment_score: int
    critical_gaps: int
    placement_readiness: int
    emerging_skills: int
    oversupplied_courses: int

class Recommendation(BaseModel):
    id: str
    title: str
    reason: str
    priority: str
    affected_skill: str
    estimated_impact: str
    action_type: str

class CareerPathwayRequest(BaseModel):
    location: str
    education: str
    current_skills: List[str]
    preferred_sector: str
    preferred_role: Optional[str] = None

class CareerResult(BaseModel):
    recommended_role: str
    match_score: int
    demand_score: int
    growth_rate: float
    missing_skills: List[str]
    owned_skills: List[str]
    recommended_courses: List[str]
    learning_path: List[str]
    salary_range: str
    sector: str
