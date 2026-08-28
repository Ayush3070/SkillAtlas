import hashlib
from typing import List, Dict, Tuple
from data.skills import SKILLS, SECTOR_SKILL_WEIGHTS
from data.districts import DISTRICTS, TIME_PERIOD_MULTIPLIER
from data.jobs import JOBS
from data.courses import COURSES

def _seed(district: str, sector: str, time_period: str = "Last 12 months", extra: str = "") -> int:
    h = hashlib.md5(f"{district}|{sector}|{time_period}|{extra}".encode()).hexdigest()
    return int(h[:8], 16)

def _district_meta(district: str):
    for d in DISTRICTS:
        if d["name"] == district:
            return d
    return DISTRICTS[0]

def _sector_skills(sector: str):
    return SECTOR_SKILL_WEIGHTS.get(sector, [s["name"] for s in SKILLS[:8]])

def filtered_jobs(district: str, sector: str, time_period: str = "Last 12 months"):
    # filter by district & sector, but also include some cross-district if small
    jobs = [j for j in JOBS if j["district"]==district and j["sector"]==sector]
    if len(jobs) < 8:
        # add sector jobs from other districts
        extra = [j for j in JOBS if j["sector"]==sector and j["district"]!=district][:8-len(jobs)]
        jobs = jobs + extra
    # time period affects recency filter: Last 3 months => posted <= 25 days etc
    tp_cutoff = {"Last 3 months": 25, "Last 6 months": 40, "Last 12 months": 60, "Last 24 months": 90}
    cutoff = tp_cutoff.get(time_period, 60)
    jobs = [j for j in jobs if j["posted_days_ago"] <= cutoff]
    if not jobs:
        jobs = [j for j in JOBS if j["sector"]==sector][:10]
    return jobs

def compute_skill_stats(district: str, sector: str, time_period: str = "Last 12 months"):
    district_meta = _district_meta(district)
    dm = district_meta["base_demand_multiplier"]
    sm = district_meta["base_supply_multiplier"]
    tp_mult = TIME_PERIOD_MULTIPLIER.get(time_period, 1.0)
    sector_skills = set(_sector_skills(sector))
    # Add some emerging skills always
    emerging_pool = [s for s in SKILLS if s["growth_rate"] > 20]
    seed = _seed(district, sector, time_period)
    # Build per-skill demand/supply with deterministic pseudo-random variance
    results=[]
    jobs = filtered_jobs(district, sector, time_period)
    # count skill frequency in jobs
    from collections import Counter
    counter=Counter()
    for j in jobs:
        for sk in j["skills"]:
            counter[sk]+=1
    max_count = max(counter.values()) if counter else 1
    for skill in SKILLS:
        base_d = skill["base_demand"]
        base_s = skill["base_supply"]
        # sector boost
        sector_boost = 1.18 if skill["name"] in sector_skills else 0.92
        # demand with district & time
        # hash-based jitter -5..+7
        jitter = ((_seed(district, sector, time_period, skill["name"])%13)-5)
        demand = int(round(base_d * dm * sector_boost * tp_mult + jitter))
        # supply with district multiplier
        supply_jitter = ((_seed(district, sector, time_period, skill["name"]+"supply")%9)-4)
        supply = int(round(base_s * sm * (0.95 if skill["name"] in sector_skills else 1.02) + supply_jitter))
        # job frequency boost
        if skill["name"] in counter:
            freq_boost = int((counter[skill["name"]]/max_count)*6)
            demand = min(95, demand + freq_boost)
        demand = max(8, min(95, demand))
        supply = max(5, min(92, supply))
        gap = demand - supply
        # severity
        if gap >=30: severity="Critical"
        elif gap >=15: severity="Moderate"
        else: severity="Healthy"
        # growth adjusted slightly by district
        growth = round(skill["growth_rate"] * (0.95 + (seed%10)/100), 1)
        results.append({
            "skill": skill["name"],
            "demand": demand,
            "supply": supply,
            "gap": gap,
            "category": skill["category"],
            "growth_rate": growth,
            "severity": severity
        })
    # sort by gap descending then demand
    results.sort(key=lambda x: (x["gap"], x["demand"]), reverse=True)
    return results, jobs

def kpi_summary(skill_stats, district, sector, time_period):
    # demand index: weighted avg of top 10 demands normalized 0-100
    top10 = sorted(skill_stats, key=lambda x: x["demand"], reverse=True)[:10]
    avg_demand = sum(s["demand"] for s in top10)/len(top10) if top10 else 50
    # add district multiplier effect for presentation
    demand_index = round(avg_demand * 0.92 + 8, 1)
    demand_index = max(42, min(94, demand_index))
    # deterministic YoY
    yoy = round(6 + (_seed(district, sector, time_period, "yoy")%140)/10,1)  # 6-20
    # alignment: how many gaps healthy?
    healthy_ratio = len([s for s in skill_stats if s["severity"]=="Healthy"])/len(skill_stats)
    alignment = int(round(55 + healthy_ratio*25 + (_seed(district, sector, time_period, "align")%7)))
    alignment = max(42, min(88, alignment))
    critical = len([s for s in skill_stats if s["severity"]=="Critical"])
    placement = int(round(62 + (_seed(district, sector, time_period, "placement")%18) + healthy_ratio*10))
    placement = max(55, min(86, placement))
    emerging = len([s for s in skill_stats if s["growth_rate"]>18 and s["demand"]>40])
    oversupplied = len([s for s in skill_stats if s["gap"] < -5])
    return {
        "demand_index": demand_index,
        "demand_yoy": yoy,
        "alignment_score": alignment,
        "critical_gaps": critical,
        "placement_readiness": placement,
        "emerging_skills": emerging,
        "oversupplied_courses": oversupplied
    }

def top_skills_in_demand(skill_stats, n=8):
    # sort by demand
    sorted_by_demand = sorted(skill_stats, key=lambda x: x["demand"], reverse=True)
    return sorted_by_demand[:n]

def heatmap_data(skill_stats, districts_subset=None):
    if districts_subset is None:
        districts_subset = ["Mumbai","Pune","Nagpur","Nashik","Thane","Aurangabad","Surat","Bengaluru"]
    skills_for_heatmap = [s["skill"] for s in sorted(skill_stats, key=lambda x: x["gap"], reverse=True)[:8]]
    rows=[]
    for skill_name in skills_for_heatmap:
        row={"skill": skill_name, "cells": []}
        for d in districts_subset:
            # compute per-district gap deterministically
            base_skill = next((s for s in SKILLS if s["name"]==skill_name), None)
            if not base_skill:
                gap=10
            else:
                dm = _district_meta(d)["base_demand_multiplier"]
                sm = _district_meta(d)["base_supply_multiplier"]
                sector_hint = "IT & Software"  # generic fallback for heatmap seed
                # use actual district+generic
                jitter = ((_seed(d, sector_hint, "heatmap", skill_name)%11)-5)
                demand = int(round(base_skill["base_demand"]*dm + jitter))
                supply = int(round(base_skill["base_supply"]*sm + ((_seed(d, sector_hint, "heatmap2", skill_name)%7)-3)))
                gap = demand-supply
            if gap>=30: sev="Critical"
            elif gap>=15: sev="Moderate"
            else: sev="Healthy"
            row["cells"].append({"district": d, "gap": gap, "severity": sev})
        rows.append(row)
    return rows

def curriculum_analysis(course_id: str, district: str, sector: str, time_period: str="Last 12 months"):
    course = next((c for c in COURSES if c["id"]==course_id), None)
    if not course:
        return None
    skill_stats, _ = compute_skill_stats(district, sector, time_period)
    # required skills are top demanded skills in sector
    _sorted = sorted(skill_stats, key=lambda x: x["demand"], reverse=True)
    required_skills = [s["skill"] for s in _sorted if s["demand"]>42][:12]
    # also union with sector skills
    # compute alignment
    course_skills = set(course["skills"])
    covered = [s for s in required_skills if s in course_skills]
    missing = [s for s in required_skills if s not in course_skills]
    # low-demand: skills in course but not in required and demand<35
    demand_map = {s["skill"]: s["demand"] for s in skill_stats}
    low_demand = [s for s in course["skills"] if s not in required_skills and demand_map.get(s, 50) < 35]
    # legacy detection: PHP special
    if "PHP" in course_skills:
        low_demand.append("PHP (Legacy)")
        low_demand = list(set(low_demand))
    alignment_score = int(round(len(covered)/len(required_skills)*100)) if required_skills else 50
    # adjust with equipment/trainer factors
    adj = (course["equipment_score"]-70)//10
    alignment_score = max(38, min(92, alignment_score + adj))
    # radar: current vs required for 6 axes
    axes=[]
    # pick 6 top required skills
    for sk in required_skills[:6]:
        axes.append({"skill": sk, "required": demand_map.get(sk, 50), "current": 75 if sk in course_skills else 18})
    # also if course has extra, we still show 6
    return {
        "course": course,
        "alignment_score": alignment_score,
        "required_skills": required_skills,
        "relevant": covered,
        "missing": missing,
        "low_demand": low_demand,
        "radar": axes,
        "demand_map": demand_map
    }

def district_snapshot(district: str, time_period: str="Last 12 months"):
    meta = _district_meta(district)
    # compute aggregated across sectors
    all_stats, _ = compute_skill_stats(district, meta["top_sector"], time_period)
    kpi = kpi_summary(all_stats, district, meta["top_sector"], time_period)
    top_skills = top_skills_in_demand(all_stats, 5)
    critical = [s for s in all_stats if s["severity"]=="Critical"][:4]
    return {
        "district": meta,
        "kpi": kpi,
        "top_skills": top_skills,
        "critical_gaps": critical,
        "training_capacity": meta["training_centers"]* 45,  # approx seats
        "placement_readiness": kpi["placement_readiness"]
    }
