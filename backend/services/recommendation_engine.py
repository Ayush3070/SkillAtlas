import hashlib
import re
from data.recommendations import RECOMMENDATION_TEMPLATES
from data.skills import SKILLS
from services.analytics import compute_skill_stats

def _hash_int(*parts):
    h=hashlib.md5("|".join(map(str, parts)).encode()).hexdigest()
    return int(h[:8],16)

def _format_reason(template_reason, skill_stats, district):
    # find skill data for template
    demand_map={s["skill"]: s for s in skill_stats}
    # extract placeholders
    # we need to fill {demand},{supply},{gap},{growth},{district},{eqscore},{sector}
    def repl(m):
        key=m.group(1)
        # we will handle per recommendation; return placeholder for now
        return "{"+key+"}"
    # We'll fill below deterministically
    return template_reason

def generate_recommendations(district: str, sector: str, course_id: str=None, time_period: str="Last 12 months", limit: int=6):
    skill_stats, _ = compute_skill_stats(district, sector, time_period)
    demand_map={s["skill"]: s for s in skill_stats}
    # score templates by relevance: priority = affected_skill gap
    scored=[]
    for tmpl in RECOMMENDATION_TEMPLATES:
        skill_name = tmpl["affected_skill"]
        skill_data = demand_map.get(skill_name, {"demand": 45, "supply": 30, "gap": 15, "growth_rate": 10})
        # relevance scoring
        gap = skill_data["gap"]
        demand = skill_data["demand"]
        # sector relevance boost if skill in sector
        relevance = gap
        # filter out low relevance for critical gaps unless gap big
        # But also ensure diversity of action types
        scored.append((relevance, tmpl, skill_data))
    # sort by relevance descending
    scored.sort(key=lambda x: x[0], reverse=True)
    # deterministic shuffle for same gap ties using hash
    # pick top candidates, then deterministic sample 6
    seed = _hash_int(district, sector, course_id or "", time_period)
    # take top 12 candidates
    top = scored[:14]
    # deterministic selection: sort by hash of id + seed
    def det_key(item):
        return _hash_int(item[1]["id"], seed)
    top.sort(key=det_key)
    selected = top[:limit]
    # Now sort selected by priority order for display
    priority_order = {"Critical":0,"High":1,"Medium":2,"Low":3}
    selected.sort(key=lambda x: priority_order.get(x[1]["priority"],4))
    results=[]
    for relevance, tmpl, sd in selected:
        # format reason
        reason = tmpl["reason"]
        # fill placeholders
        eqscore = 68 + (seed % 15)  # pseudo equipment score variation
        replacements = {
            "demand": sd["demand"],
            "supply": sd["supply"],
            "gap": sd["gap"],
            "growth": sd["growth_rate"],
            "district": district,
            "sector": sector,
            "eqscore": eqscore
        }
        # simple formatting
        try:
            reason_formatted = reason.format(**replacements)
        except:
            reason_formatted = reason
        results.append({
            "id": tmpl["id"],
            "title": tmpl["title"],
            "reason": reason_formatted,
            "priority": tmpl["priority"],
            "affected_skill": tmpl["affected_skill"],
            "estimated_impact": tmpl["estimated_impact"],
            "action_type": tmpl["action_type"]
        })
    return results
