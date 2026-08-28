import type { Skill } from "../../types/domain";

export const skills: Skill[] = [
  // ----- Automotive & EV -----
  { id: "sk-ev-powertrain",  name: "EV Powertrain & Drivetrain",  category: "Technical", lifecycle: "critical",   description: "Electric drive units, transmissions, regenerative braking." },
  { id: "sk-ev-bms",         name: "Battery Management Systems",  category: "Technical", lifecycle: "critical",   description: "Cell balancing, thermal management, BMS diagnostics." },
  { id: "sk-battery-diagnostics", name: "Battery Diagnostics",     category: "Technical", lifecycle: "critical",   description: "Pack testing, SoH, SoC, fault isolation." },
  { id: "sk-can-bus",        name: "CAN Bus & Vehicle Networking", category: "Technical", lifecycle: "critical",   description: "CAN, LIN, Ethernet diagnostics and protocols." },
  { id: "sk-hv-safety",      name: "High-Voltage Safety",         category: "Process",    lifecycle: "critical",   description: "Lockout-tagout, PPE, isolation procedures." },
  { id: "sk-adas",           name: "ADAS Calibration",            category: "Technical", lifecycle: "emerging",   description: "Sensor calibration, lane-keep, AEB tuning." },
  { id: "sk-thermal-mgmt",   name: "Battery Thermal Management",  category: "Technical", lifecycle: "critical",   description: "Liquid cooling, heat dissipation, climate control." },
  { id: "sk-charging-infra", name: "EV Charging Infrastructure",  category: "Domain",     lifecycle: "critical",   description: "AC/DC chargers, OCPP, load management." },
  { id: "sk-charging-prot",  name: "Charging Protocols (CCS2, OCPP)", category: "Tool",   lifecycle: "critical",   description: "CCS2, CHAdeMO, OCPP 1.6/2.0.1." },
  { id: "sk-ic-engine",      name: "Internal Combustion Engines", category: "Technical", lifecycle: "declining",  description: "Legacy ICE service and repair." },

  // ----- Manufacturing -----
  { id: "sk-cnc",            name: "CNC Machining",               category: "Technical", lifecycle: "stable",     description: "Programming, tooling, metrology." },
  { id: "sk-plc",            name: "PLC & Industrial Automation", category: "Technical", lifecycle: "critical",   description: "Siemens, Allen-Bradley, ladder logic." },
  { id: "sk-robotics",       name: "Industrial Robotics",         category: "Technical", lifecycle: "critical",   description: "FANUC, ABB, KUKA programming and integration." },
  { id: "sk-welding",        name: "Advanced Welding (MIG/TIG)",  category: "Technical", lifecycle: "stable",     description: "MIG/TIG welding, weld inspection." },
  { id: "sk-quality-6sigma", name: "Six Sigma & Quality",         category: "Process",    lifecycle: "stable",     description: "DMAIC, SPC, root cause analysis." },
  { id: "sk-iot-mfg",        name: "IoT in Manufacturing",        category: "Technical", lifecycle: "emerging",   description: "Sensors, MQTT, edge analytics." },
  { id: "sk-additive",       name: "Additive Manufacturing",      category: "Technical", lifecycle: "emerging",   description: "3D printing, DfAM, post-processing." },

  // ----- IT & Software -----
  { id: "sk-python",         name: "Python",                      category: "Technical", lifecycle: "stable",     description: "Core Python, OOP, scripting." },
  { id: "sk-react",          name: "React",                       category: "Technical", lifecycle: "stable",     description: "React 18+, hooks, state management." },
  { id: "sk-cloud-aws",      name: "AWS Cloud",                   category: "Technical", lifecycle: "critical",   description: "EC2, S3, Lambda, IAM, VPC." },
  { id: "sk-devops",         name: "DevOps (CI/CD)",              category: "Process",    lifecycle: "critical",   description: "Pipelines, GitHub Actions, ArgoCD." },
  { id: "sk-data-eng",       name: "Data Engineering",            category: "Technical", lifecycle: "critical",   description: "ETL, Spark, Airflow, warehousing." },
  { id: "sk-mlops",          name: "MLOps",                       category: "Technical", lifecycle: "emerging",   description: "Model deployment, monitoring, retraining." },
  { id: "sk-cybersec",       name: "Cybersecurity Operations",    category: "Technical", lifecycle: "critical",   description: "SOC, SIEM, threat detection." },
  { id: "sk-genai",          name: "Applied GenAI & LLMs",        category: "Technical", lifecycle: "emerging",   description: "Prompting, RAG, fine-tuning, evals." },
  { id: "sk-sql",            name: "SQL & Data Modelling",        category: "Technical", lifecycle: "stable",     description: "SQL, window functions, modelling." },

  // ----- BFSI -----
  { id: "sk-fraud-analytics",name: "Fraud Analytics",             category: "Domain",     lifecycle: "critical",   description: "Anomaly detection, AML rules." },
  { id: "sk-rbi-compliance", name: "RBI Compliance",              category: "Process",    lifecycle: "stable",     description: "KYC, AML, regulatory reporting." },
  { id: "sk-credit-risk",    name: "Credit Risk Modelling",       category: "Domain",     lifecycle: "critical",   description: "PD, LGD, EAD, IFRS9." },

  // ----- Healthcare -----
  { id: "sk-phlebotomy",     name: "Phlebotomy",                  category: "Technical", lifecycle: "stable",     description: "Venipuncture, sample handling." },
  { id: "sk-mri-op",         name: "MRI Operation",               category: "Technical", lifecycle: "critical",   description: "Scan protocols, patient safety." },
  { id: "sk-emr-ehr",        name: "EMR/EHR Systems",             category: "Tool",       lifecycle: "critical",   description: "Hospital information systems." },
  { id: "sk-patient-care",   name: "Patient Care (GNM)",          category: "Domain",     lifecycle: "stable",     description: "Bedside care, vitals, hygiene." },

  // ----- Construction -----
  { id: "sk-revit-bim",      name: "Revit / BIM",                 category: "Tool",       lifecycle: "critical",   description: "BIM modelling, LOD 200-400." },
  { id: "sk-survey-total",   name: "Total Station Surveying",     category: "Technical", lifecycle: "stable",     description: "Surveying instruments and layouts." },
  { id: "sk-green-building", name: "Green Building (IGBC)",       category: "Domain",     lifecycle: "emerging",   description: "IGBC, GRIHA, energy modelling." },

  // ----- Retail / Logistics -----
  { id: "sk-sap-mm",         name: "SAP MM / WMS",                category: "Tool",       lifecycle: "stable",     description: "Inventory, warehouse management." },
  { id: "sk-forklift",       name: "Forklift Operation",          category: "Technical", lifecycle: "stable",     description: "Safe operation and certification." },
  { id: "sk-last-mile",      name: "Last-Mile Routing",           category: "Domain",     lifecycle: "emerging",   description: "Route optimization, dispatch." },

  // ----- Renewable / Telecom -----
  { id: "sk-solar-install",  name: "Solar PV Installation",       category: "Technical", lifecycle: "critical",   description: "Rooftop & utility-scale PV install." },
  { id: "sk-wind-tech",      name: "Wind Turbine Tech",           category: "Technical", lifecycle: "stable",     description: "O&M for utility wind turbines." },
  { id: "sk-5g-rollout",     name: "5G Network Rollout",          category: "Domain",     lifecycle: "emerging",   description: "RAN, small cells, fibre backhaul." },
  { id: "sk-fiber-splicing", name: "Optical Fibre Splicing",      category: "Technical", lifecycle: "stable",     description: "FTTH, OTDR, fusion splicing." },

  // ----- Cross-cutting / soft -----
  { id: "sk-communication",  name: "Workplace Communication",     category: "Soft",       lifecycle: "stable",     description: "Verbal, written, stakeholder." },
  { id: "sk-customer-service",name: "Customer Service",           category: "Soft",       lifecycle: "stable",     description: "Issue resolution, empathy." },
  { id: "sk-problem-solving",name: "Analytical Problem Solving",  category: "Soft",       lifecycle: "stable",     description: "Structured analysis, root cause." },
  { id: "sk-teamwork",       name: "Teamwork & Collaboration",    category: "Soft",       lifecycle: "stable",     description: "Cross-functional collaboration." },
  { id: "sk-digital-literacy",name:"Digital Literacy",            category: "Soft",       lifecycle: "stable",     description: "Comfort with workplace software." },

  // ----- Certifications -----
  { id: "cert-nsqf",         name: "NSQF Alignment",              category: "Certification", lifecycle: "stable", description: "National Skills Qualifications Framework." },
  { id: "cert-iso-9001",     name: "ISO 9001 Awareness",          category: "Certification", lifecycle: "stable", description: "Quality management systems." },
];

export const findSkill = (id: string) => skills.find(s => s.id === id);
