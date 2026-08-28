import random

# Base realistic companies per sector
COMPANIES = {
    "IT & Software": ["TechNova","Infosys","TCS","Wipro","Cognizant","HCLTech","Persistent","LTIMindtree","Zoho","Freshworks","Capgemini","Accenture India"],
    "Manufacturing": ["Tata Motors","Mahindra & Mahindra","Bharat Forge","Godrej Industries","Kirloskar","Thermax","Siemens India","L&T Manufacturing"],
    "Healthcare": ["Apollo Hospitals","Fortis","Max Healthcare","Dr Lal PathLabs","Cipla","Sun Pharma","Medanta"],
    "Renewable Energy": ["Tata Power Solar","ReNew Power","Adani Green","Suzlon","NTPC Green","Avaada Energy"],
    "Automotive": ["Tata Motors","Mahindra EV","Ola Electric","Ather Energy","Bajaj Auto","Ashok Leyland"],
    "BFSI": ["HDFC Bank","ICICI Bank","Axis Bank","Kotak Mahindra","Bajaj Finserv","SBI","IDFC First"],
    "Retail": ["Reliance Retail","DMart","Future Group","Shoppers Stop","Nykaa","Flipkart Retail"],
    "Logistics": ["Blue Dart","Delhivery","DTDC","Mahindra Logistics","TCI Express","Ecom Express"],
    "Construction": ["L&T Construction","Shapoorji Pallonji","Godrej Properties","Oberoi Realty","Hiranandani"],
    "Tourism & Hospitality": ["Taj Hotels","Oberoi Hotels","MakeMyTrip","OYO","IndiGo Hospitality","Lemon Tree"]
}

ROLE_TEMPLATES = {
    "IT & Software": [
        ("Full Stack Developer", ["React","Node.js","TypeScript","SQL","AWS"], "2-5 years", "8-18 LPA"),
        ("Data Analyst", ["SQL","Python","Power BI","Excel","Data Visualization"], "1-3 years", "5-9 LPA"),
        ("Cloud Engineer", ["AWS","Docker","Kubernetes","Linux Administration"], "2-4 years", "7-15 LPA"),
        ("AI/ML Engineer", ["Python","TensorFlow","PyTorch","Generative AI","SQL"], "2-6 years", "10-22 LPA"),
        ("DevOps Engineer", ["Docker","Kubernetes","AWS","Linux Administration","Python"], "3-6 years", "9-18 LPA"),
        ("UI/UX Designer", ["UI/UX Design","Figma","React"], "1-4 years", "5-12 LPA"),
        ("Cybersecurity Analyst", ["Cybersecurity","Network Administration","Linux Administration"], "2-5 years", "6-14 LPA"),
        ("Backend Developer", ["Node.js","Python","SQL","Docker","AWS"], "2-5 years", "7-16 LPA"),
    ],
    "Manufacturing": [
        ("CNC Machine Operator", ["CNC Programming","AutoCAD","PLC Programming"], "1-3 years", "3-6 LPA"),
        ("Quality Engineer", ["AutoCAD","PLC Programming","Robotics"], "2-5 years", "4-8 LPA"),
        ("Maintenance Technician", ["PLC Programming","Robotics","IoT"], "1-4 years", "3-7 LPA"),
        ("Production Supervisor", ["AutoCAD","CNC Programming","Embedded Systems"], "3-7 years", "5-9 LPA"),
    ],
    "Healthcare": [
        ("Healthcare Assistant", ["Healthcare Assistant Skills","Nursing Care"], "0-2 years", "2.5-5 LPA"),
        ("Staff Nurse", ["Nursing Care","Phlebotomy"], "1-4 years", "3-7 LPA"),
        ("Lab Technician", ["Phlebotomy","Healthcare Assistant Skills"], "1-3 years", "3-6 LPA"),
    ],
    "Renewable Energy": [
        ("Solar PV Technician", ["Solar PV Installation","IoT","Electrical Wiring"], "0-2 years", "3-6 LPA"),
        ("Wind Turbine Technician", ["Wind Turbine Maintenance","PLC Programming"], "1-4 years", "4-8 LPA"),
        ("Energy Auditor", ["Solar PV Installation","IoT","Data Visualization"], "2-5 years", "5-10 LPA"),
    ],
    "Automotive": [
        ("EV Technician", ["EV Battery Management","Embedded Systems","AutoCAD"], "1-3 years", "4-8 LPA"),
        ("Battery Technician", ["EV Battery Management","PLC Programming"], "1-3 years", "4-7 LPA"),
        ("Service Engineer", ["AutoCAD","PLC Programming","IoT"], "2-5 years", "5-9 LPA"),
    ],
    "BFSI": [
        ("Financial Analyst", ["Financial Modelling","Excel","SQL","Power BI"], "2-5 years", "6-12 LPA"),
        ("Risk Analyst", ["Risk Analysis","Financial Modelling","SQL"], "2-6 years", "7-14 LPA"),
        ("Branch Operations Executive", ["BFSI Operations","Excel","Risk Analysis"], "1-3 years", "4-8 LPA"),
    ],
    "Retail": [
        ("Digital Marketing Executive", ["Digital Marketing","Content Strategy","Excel"], "1-3 years", "4-8 LPA"),
        ("Store Manager", ["Logistics Management","Digital Marketing"], "3-7 years", "5-10 LPA"),
    ],
    "Logistics": [
        ("Logistics Executive", ["Logistics Management","Warehouse Operations","Excel"], "1-3 years", "3-7 LPA"),
        ("Supply Chain Analyst", ["Supply Chain Analytics","SQL","Power BI"], "2-5 years", "5-11 LPA"),
        ("Warehouse Supervisor", ["Warehouse Operations","Logistics Management"], "2-5 years", "4-8 LPA"),
    ],
    "Construction": [
        ("Site Engineer", ["Construction Safety","AutoCAD","Quantity Surveying"], "2-5 years", "4-9 LPA"),
        ("Safety Officer", ["Construction Safety","Quantity Surveying"], "1-4 years", "3-7 LPA"),
    ],
    "Tourism & Hospitality": [
        ("Hotel Manager", ["Hospitality Management","Culinary Skills"], "3-8 years", "5-12 LPA"),
        ("Chef", ["Culinary Skills","Hospitality Management"], "2-6 years", "4-9 LPA"),
        ("Travel Consultant", ["Hospitality Management","Digital Marketing"], "1-3 years", "3-7 LPA"),
    ],
}

DISTRICTS = ["Mumbai","Pune","Nagpur","Nashik","Thane","Aurangabad","Surat","Bengaluru","Delhi","Hyderabad","Jaipur","Chennai","Kolkata","Ahmedabad","Indore"]

def generate_jobs(count=150):
    random.seed(42)
    jobs=[]
    job_id=1
    # ensure coverage: each district x sector at least few
    for district in DISTRICTS:
        for sector, roles in ROLE_TEMPLATES.items():
            # probability: IT gets more jobs
            num = 2 if sector=="IT & Software" else 1
            # random sample
            for _ in range(num):
                if len(jobs) >= count:
                    break
                role_name, skills, exp, salary = random.choice(roles)
                company = random.choice(COMPANIES[sector])
                # small skill variation
                extra_pool = ["Python","SQL","Excel","Power BI","AWS","Docker","Communication","Problem Solving"]
                # maybe add one extra
                if random.random() < 0.25:
                    extra = random.choice(extra_pool)
                    if extra not in skills:
                        skills = skills + [extra]
                jobs.append({
                    "id": f"JOB-{job_id:03d}",
                    "title": role_name,
                    "company": company,
                    "district": district,
                    "sector": sector,
                    "skills": skills,
                    "experience": exp,
                    "salary_range": salary,
                    "posted_days_ago": random.randint(1, 60),
                    "employment_type": random.choice(["Full-time","Full-time","Contract","Internship"])
                })
                job_id+=1
    # fill remaining to reach count with random IT/BFSI/Manufacturing skew
    sectors_weighted = ["IT & Software"]*4 + ["Manufacturing"]*2 + ["BFSI"]*2 + ["Automotive","Healthcare","Logistics","Retail","Renewable Energy","Construction","Tourism & Hospitality"]
    while len(jobs) < count:
        sector = random.choice(sectors_weighted)
        roles = ROLE_TEMPLATES[sector]
        role_name, skills, exp, salary = random.choice(roles)
        company = random.choice(COMPANIES[sector])
        district = random.choice(DISTRICTS)
        jobs.append({
            "id": f"JOB-{job_id:03d}",
            "title": role_name,
            "company": company,
            "district": district,
            "sector": sector,
            "skills": list(skills),
            "experience": exp,
            "salary_range": salary,
            "posted_days_ago": random.randint(1,60),
            "employment_type": random.choice(["Full-time","Contract"])
        })
        job_id+=1
    random.shuffle(jobs)
    # reassign IDs sequentially for determinism
    for idx, j in enumerate(jobs):
        j["id"] = f"JOB-{idx+1:03d}"
    return jobs

JOBS = generate_jobs(160)
