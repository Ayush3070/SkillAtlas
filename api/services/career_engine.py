import hashlib
from typing import List
from data.recommendations import CAREER_TEMPLATES
from data.skills import SKILLS
from data.courses import COURSES

def _hash_int(*parts):
    h=hashlib.md5("|".join(map(str, parts)).encode()).hexdigest()
    return int(h[:8],16)

def recommend_careers(location: str, education: str, current_skills: List[str], preferred_sector: str, preferred_role: str=None):
    # normalize skills case-insensitive
    norm_current = set([s.strip().lower() for s in current_skills if s.strip()])
    # map skill name lower -> original
    skill_lookup = {s["name"].lower(): s["name"] for s in SKILLS}
    # normalize current to canonical names where possible
    canonical_current=[]
    for s in current_skills:
        low=s.strip().lower()
        if low in skill_lookup:
            canonical_current.append(skill_lookup[low])
        else:
            canonical_current.append(s.strip())
    norm_canonical=set([s.lower() for s in canonical_current])

    candidates=[]
    for tmpl in CAREER_TEMPLATES:
        # filter by preferred sector boost but still include others with lower score
        sector_match = 1 if tmpl["sector"]==preferred_sector else 0
        req = tmpl["required_skills"]
        owned = [r for r in req if r.lower() in norm_canonical]
        missing = [r for r in req if r.lower() not in norm_canonical]
        match = int(round(len(owned)/len(req)*100)) if req else 0
        # boost if sector match
        if sector_match:
            match = min(96, match+8)
        else:
            match = max(12, match-12)
        # education adjustment
        edu_boost = {"Diploma": -2, "Graduate": 0, "Postgraduate": 3, "12th Pass": -5, "ITI": -3}
        match = max(10, min(96, match + edu_boost.get(education,0)))
        # demand score based on skill demand plus random
        demand_score = 55 + (_hash_int(tmpl["role"], location)%30)  # 55-84
        # if sector match demand higher
        if sector_match:
            demand_score = min(92, demand_score+8)
        # find recommended courses that cover missing skills
        rec_courses=[]
        for course in COURSES:
            overlap = len(set(course["skills"]) & set(missing))
            if overlap>0:
                rec_courses.append((overlap, course["name"]))
        rec_courses.sort(reverse=True)
        rec_courses = [c for _,c in rec_courses[:2]]
        if not rec_courses:
            # fallback: courses in same sector
            fallback = [c["name"] for c in COURSES if c["sector"]==tmpl["sector"]][:2]
            rec_courses = fallback
        # learning path: owned -> missing -> role
        learning_path = owned + missing + [tmpl["role"]]
        # deduplicate preserving order
        seen=set()
        lp=[]
        for x in learning_path:
            if x.lower() not in seen:
                lp.append(x)
                seen.add(x.lower())
        candidates.append({
            "recommended_role": tmpl["role"],
            "match_score": match,
            "demand_score": min(95, demand_score),
            "growth_rate": tmpl["growth"],
            "missing_skills": missing,
            "owned_skills": owned,
            "recommended_courses": rec_courses,
            "learning_path": lp,
            "salary_range": tmpl["salary"],
            "sector": tmpl["sector"]
        })
    # if preferred_role specified, boost it to top
    if preferred_role:
        for c in candidates:
            if c["recommended_role"].lower() == preferred_role.lower():
                c["match_score"] = min(96, c["match_score"]+12)
    candidates.sort(key=lambda x: (x["match_score"], x["demand_score"]), reverse=True)
    return candidates[:3]
