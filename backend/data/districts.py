DISTRICTS = [
    {"name": "Mumbai", "state": "Maharashtra", "population_m": 20.7, "lat": 19.0760, "lng": 72.8777, "top_sector": "IT & Software", "training_centers": 142, "base_demand_multiplier": 1.15, "base_supply_multiplier": 1.05},
    {"name": "Pune", "state": "Maharashtra", "population_m": 7.4, "lat": 18.5204, "lng": 73.8567, "top_sector": "IT & Software", "training_centers": 118, "base_demand_multiplier": 1.12, "base_supply_multiplier": 1.02},
    {"name": "Nagpur", "state": "Maharashtra", "population_m": 2.9, "lat": 21.1458, "lng": 79.0882, "top_sector": "Manufacturing", "training_centers": 62, "base_demand_multiplier": 0.92, "base_supply_multiplier": 0.88},
    {"name": "Nashik", "state": "Maharashtra", "population_m": 2.1, "lat": 19.9975, "lng": 73.7898, "top_sector": "Manufacturing", "training_centers": 54, "base_demand_multiplier": 0.88, "base_supply_multiplier": 0.90},
    {"name": "Thane", "state": "Maharashtra", "population_m": 2.5, "lat": 19.2183, "lng": 72.9781, "top_sector": "Logistics", "training_centers": 48, "base_demand_multiplier": 1.02, "base_supply_multiplier": 0.95},
    {"name": "Aurangabad", "state": "Maharashtra", "population_m": 1.5, "lat": 19.8762, "lng": 75.3433, "top_sector": "Automotive", "training_centers": 44, "base_demand_multiplier": 0.90, "base_supply_multiplier": 0.82},
    {"name": "Surat", "state": "Gujarat", "population_m": 7.2, "lat": 21.1702, "lng": 72.8311, "top_sector": "Retail", "training_centers": 67, "base_demand_multiplier": 1.05, "base_supply_multiplier": 0.93},
    {"name": "Bengaluru", "state": "Karnataka", "population_m": 13.6, "lat": 12.9716, "lng": 77.5946, "top_sector": "IT & Software", "training_centers": 165, "base_demand_multiplier": 1.22, "base_supply_multiplier": 1.10},
    {"name": "Delhi", "state": "Delhi", "population_m": 32.0, "lat": 28.7041, "lng": 77.1025, "top_sector": "BFSI", "training_centers": 180, "base_demand_multiplier": 1.18, "base_supply_multiplier": 1.08},
    {"name": "Hyderabad", "state": "Telangana", "population_m": 10.2, "lat": 17.3850, "lng": 78.4867, "top_sector": "IT & Software", "training_centers": 128, "base_demand_multiplier": 1.14, "base_supply_multiplier": 1.04},
    {"name": "Jaipur", "state": "Rajasthan", "population_m": 4.1, "lat": 26.9124, "lng": 75.7873, "top_sector": "Tourism & Hospitality", "training_centers": 38, "base_demand_multiplier": 0.85, "base_supply_multiplier": 0.87},
    {"name": "Chennai", "state": "Tamil Nadu", "population_m": 11.5, "lat": 13.0827, "lng": 80.2707, "top_sector": "Automotive", "training_centers": 135, "base_demand_multiplier": 1.10, "base_supply_multiplier": 1.01},
    {"name": "Kolkata", "state": "West Bengal", "population_m": 15.0, "lat": 22.5726, "lng": 88.3639, "top_sector": "BFSI", "training_centers": 89, "base_demand_multiplier": 0.95, "base_supply_multiplier": 0.92},
    {"name": "Ahmedabad", "state": "Gujarat", "population_m": 8.4, "lat": 23.0225, "lng": 72.5714, "top_sector": "Manufacturing", "training_centers": 76, "base_demand_multiplier": 1.03, "base_supply_multiplier": 0.96},
    {"name": "Indore", "state": "Madhya Pradesh", "population_m": 3.2, "lat": 22.7196, "lng": 75.8577, "top_sector": "Logistics", "training_centers": 41, "base_demand_multiplier": 0.86, "base_supply_multiplier": 0.84},
]

SECTORS = ["IT & Software","Manufacturing","Healthcare","Renewable Energy","Automotive","BFSI","Retail","Logistics","Construction","Tourism & Hospitality"]

ROLES_BY_SECTOR = {
    "IT & Software": ["Full Stack Developer","Data Analyst","Cloud Engineer","Cybersecurity Analyst","AI/ML Engineer","DevOps Engineer","UI/UX Designer"],
    "Manufacturing": ["CNC Machine Operator","Quality Engineer","Maintenance Technician","Production Supervisor","Robotics Technician"],
    "Healthcare": ["Healthcare Assistant","Staff Nurse","Lab Technician","Phlebotomist","Medical Coder"],
    "Renewable Energy": ["Solar PV Technician","Wind Turbine Technician","Energy Auditor","Grid Engineer"],
    "Automotive": ["EV Technician","Automotive Designer","Service Engineer","Battery Technician"],
    "BFSI": ["Financial Analyst","Risk Analyst","Loan Officer","Insurance Advisor","Branch Operations Executive"],
    "Retail": ["Store Manager","Digital Marketing Executive","E-commerce Associate","Visual Merchandiser"],
    "Logistics": ["Logistics Executive","Warehouse Supervisor","Supply Chain Analyst","Fleet Manager"],
    "Construction": ["Site Engineer","Quantity Surveyor","Safety Officer","Project Coordinator"],
    "Tourism & Hospitality": ["Hotel Manager","Chef","Travel Consultant","Event Coordinator"],
}

TIME_PERIODS = ["Last 3 months","Last 6 months","Last 12 months","Last 24 months"]
TIME_PERIOD_MULTIPLIER = {
    "Last 3 months": 0.85,
    "Last 6 months": 0.92,
    "Last 12 months": 1.0,
    "Last 24 months": 1.08,
}
