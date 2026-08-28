import type { Course, CourseSkill, CurriculumRequirement } from "../../types/domain";

export const courses: Course[] = [
  {
    id: "cr-ev-tech", name: "EV Service Technician (NSQF L4)",
    sector: "Automotive & EV", durationWeeks: 24, nsqfLevel: 4,
    capacity: 240, enrolled: 232, placementRate: 78,
    status: "Needs Update", alignmentScore: 62,
    description: "Comprehensive EV powertrain, battery diagnostics and HV safety curriculum with OEM-aligned practical labs.",
    trainingCentreIds: ["tc-pune-itc", "tc-pune-tti", "tc-nashik-itc"],
    primaryRoleIds: ["rl-ev-technician", "rl-ev-charging-tech"],
  },
  {
    id: "cr-charging-tech", name: "EV Charging Infrastructure Technician",
    sector: "Automotive & EV", durationWeeks: 12, nsqfLevel: 4,
    capacity: 180, enrolled: 96, placementRate: 71,
    status: "Emerging", alignmentScore: 74,
    description: "Hands-on training for AC/DC charging stations, OCPP, load management and safety protocols.",
    trainingCentreIds: ["tc-mumbai-itc", "tc-pune-itc"],
    primaryRoleIds: ["rl-ev-charging-tech"],
  },
  {
    id: "cr-automotive-diesel", name: "Diesel Mechanic (NSQF L3)",
    sector: "Automotive & EV", durationWeeks: 16, nsqfLevel: 3,
    capacity: 360, enrolled: 312, placementRate: 54,
    status: "Oversupplied", alignmentScore: 38,
    description: "Legacy diesel engine service curriculum. Demand has shifted towards EV / hybrid drivetrains.",
    trainingCentreIds: ["tc-nashik-itc", "tc-nagpur-itc", "tc-aurangabad-itc"],
    primaryRoleIds: ["rl-automotive-diesel"],
  },
  {
    id: "cr-cnc", name: "CNC Machining & Programming",
    sector: "Manufacturing", durationWeeks: 20, nsqfLevel: 4,
    capacity: 220, enrolled: 198, placementRate: 82,
    status: "Aligned", alignmentScore: 88,
    description: "CNC turning/milling setup, G-code programming, metrology, and Six Sigma quality.",
    trainingCentreIds: ["tc-pune-tti", "tc-mumbai-itc"],
    primaryRoleIds: ["rl-cnc-operator"],
  },
  {
    id: "cr-plc", name: "PLC & Industrial Automation",
    sector: "Manufacturing", durationWeeks: 22, nsqfLevel: 5,
    capacity: 180, enrolled: 142, placementRate: 80,
    status: "Aligned", alignmentScore: 84,
    description: "PLC programming (Siemens, Allen-Bradley), SCADA, HMI and basic robotics integration.",
    trainingCentreIds: ["tc-pune-tti", "tc-mumbai-itc"],
    primaryRoleIds: ["rl-plc-engineer"],
  },
  {
    id: "cr-robotics", name: "Robotics Cell Operation",
    sector: "Manufacturing", durationWeeks: 16, nsqfLevel: 4,
    capacity: 140, enrolled: 78, placementRate: 69,
    status: "Emerging", alignmentScore: 71,
    description: "FANUC and ABB programming, end-effector design, safety and integration with PLCs.",
    trainingCentreIds: ["tc-pune-tti"],
    primaryRoleIds: ["rl-robotic-arm"],
  },
  {
    id: "cr-fullstack", name: "Full-Stack Web Development",
    sector: "IT & Software", durationWeeks: 24, nsqfLevel: 5,
    capacity: 600, enrolled: 540, placementRate: 86,
    status: "Aligned", alignmentScore: 90,
    description: "React/TypeScript, Node, REST/GraphQL, Postgres, CI/CD and team workflows.",
    trainingCentreIds: ["tc-pune-tti", "tc-mumbai-itc", "tc-nagpur-itc"],
    primaryRoleIds: ["rl-fullstack", "rl-frontend-dev"],
  },
  {
    id: "cr-cloud-devops", name: "Cloud & DevOps Engineering",
    sector: "IT & Software", durationWeeks: 20, nsqfLevel: 5,
    capacity: 240, enrolled: 188, placementRate: 81,
    status: "Needs Update", alignmentScore: 72,
    description: "AWS, containers, IaC, CI/CD pipelines, observability and security basics.",
    trainingCentreIds: ["tc-pune-tti", "tc-mumbai-itc"],
    primaryRoleIds: ["rl-cloud-engineer"],
  },
  {
    id: "cr-data-eng", name: "Data Engineering",
    sector: "IT & Software", durationWeeks: 22, nsqfLevel: 5,
    capacity: 180, enrolled: 132, placementRate: 78,
    status: "Needs Update", alignmentScore: 70,
    description: "Python, SQL, Spark, Airflow, warehouse modelling on cloud platforms.",
    trainingCentreIds: ["tc-pune-tti", "tc-mumbai-itc"],
    primaryRoleIds: ["rl-data-engineer"],
  },
  {
    id: "cr-genai", name: "Applied Generative AI",
    sector: "IT & Software", durationWeeks: 16, nsqfLevel: 6,
    capacity: 120, enrolled: 96, placementRate: 73,
    status: "Emerging", alignmentScore: 78,
    description: "LLM applications, RAG, evaluation, deployment, MLOps and safety.",
    trainingCentreIds: ["tc-pune-tti"],
    primaryRoleIds: ["rl-genai-engineer"],
  },
  {
    id: "cr-cybersec", name: "Cybersecurity Operations",
    sector: "IT & Software", durationWeeks: 18, nsqfLevel: 5,
    capacity: 200, enrolled: 156, placementRate: 79,
    status: "Aligned", alignmentScore: 82,
    description: "SOC operations, SIEM, threat detection, incident response and cloud security.",
    trainingCentreIds: ["tc-mumbai-itc", "tc-pune-tti"],
    primaryRoleIds: ["rl-soc-analyst"],
  },
  {
    id: "cr-fraud", name: "Fraud Analytics",
    sector: "BFSI & FinTech", durationWeeks: 12, nsqfLevel: 5,
    capacity: 120, enrolled: 64, placementRate: 68,
    status: "Emerging", alignmentScore: 66,
    description: "Anomaly detection, network analysis, AML rules and model explainability.",
    trainingCentreIds: ["tc-mumbai-itc"],
    primaryRoleIds: ["rl-fraud-analyst"],
  },
  {
    id: "cr-credit-risk", name: "Credit Risk Modelling",
    sector: "BFSI & FinTech", durationWeeks: 14, nsqfLevel: 5,
    capacity: 100, enrolled: 48, placementRate: 64,
    status: "Emerging", alignmentScore: 62,
    description: "PD/LGD/EAD modelling, IFRS9, scorecards, governance and validation.",
    trainingCentreIds: ["tc-mumbai-itc"],
    primaryRoleIds: ["rl-credit-risk"],
  },
  {
    id: "cr-mri", name: "MRI Technician (NSQF L5)",
    sector: "Healthcare", durationWeeks: 26, nsqfLevel: 5,
    capacity: 80, enrolled: 64, placementRate: 84,
    status: "Aligned", alignmentScore: 86,
    description: "MRI scan protocols, patient safety, image quality and EMR/EHR workflows.",
    trainingCentreIds: ["tc-mumbai-itc"],
    primaryRoleIds: ["rl-mri-tech"],
  },
  {
    id: "cr-gda", name: "General Duty Assistant",
    sector: "Healthcare", durationWeeks: 12, nsqfLevel: 3,
    capacity: 360, enrolled: 312, placementRate: 72,
    status: "Aligned", alignmentScore: 80,
    description: "Patient care, vitals, hygiene, basic phlebotomy and EMR fundamentals.",
    trainingCentreIds: ["tc-mumbai-itc", "tc-nagpur-itc"],
    primaryRoleIds: ["rl-clinical-assist"],
  },
  {
    id: "cr-bim", name: "BIM Modelling with Revit",
    sector: "Construction & Real Estate", durationWeeks: 20, nsqfLevel: 5,
    capacity: 120, enrolled: 78, placementRate: 70,
    status: "Needs Update", alignmentScore: 68,
    description: "Revit, Navisworks, LOD 300/400 modelling, basic green-building concepts.",
    trainingCentreIds: ["tc-mumbai-itc", "tc-pune-tti"],
    primaryRoleIds: ["rl-bim-modeller"],
  },
  {
    id: "cr-solar", name: "Solar PV Installation",
    sector: "Renewable Energy", durationWeeks: 12, nsqfLevel: 4,
    capacity: 200, enrolled: 168, placementRate: 76,
    status: "Aligned", alignmentScore: 84,
    description: "Rooftop and ground-mount PV, grid-tie, safety, monitoring.",
    trainingCentreIds: ["tc-nashik-itc", "tc-nagpur-itc"],
    primaryRoleIds: ["rl-solar-installer"],
  },
  {
    id: "cr-5g", name: "5G Field Technician",
    sector: "Telecommunications", durationWeeks: 14, nsqfLevel: 4,
    capacity: 160, enrolled: 96, placementRate: 67,
    status: "Emerging", alignmentScore: 70,
    description: "RAN nodes, fibre splicing, OTDR, small cells, field safety.",
    trainingCentreIds: ["tc-mumbai-itc"],
    primaryRoleIds: ["rl-5g-tech"],
  },
  {
    id: "cr-warehouse", name: "Warehouse Operations & WMS",
    sector: "Logistics & Warehousing", durationWeeks: 8, nsqfLevel: 3,
    capacity: 320, enrolled: 248, placementRate: 70,
    status: "Aligned", alignmentScore: 80,
    description: "Inbound/outbound, picking, SAP WMS, safety, forklift basics.",
    trainingCentreIds: ["tc-aurangabad-itc", "tc-nagpur-itc"],
    primaryRoleIds: ["rl-warehouse-sup"],
  },
  {
    id: "cr-soft", name: "Workplace Skills & Digital Literacy",
    sector: "Cross-sector", durationWeeks: 6, nsqfLevel: 3,
    capacity: 800, enrolled: 540, placementRate: 60,
    status: "Obsolete", alignmentScore: 42,
    description: "Generic soft skills curriculum last refreshed in 2021; needs modular redesign.",
    trainingCentreIds: ["tc-nagpur-itc", "tc-aurangabad-itc"],
    primaryRoleIds: [],
  },
];

export const findCourse = (id: string) => courses.find(c => c.id === id);

/** Course → Skill coverage */
export const courseSkills: CourseSkill[] = [
  // EV tech
  { courseId: "cr-ev-tech", skillId: "sk-ev-powertrain",     coverage: "partial",    hours: 24, practicalHours: 12 },
  { courseId: "cr-ev-tech", skillId: "sk-battery-diagnostics",coverage: "partial",    hours: 16, practicalHours: 8 },
  { courseId: "cr-ev-tech", skillId: "sk-bms",               coverage: "partial",    hours: 8,  practicalHours: 4 },
  { courseId: "cr-ev-tech", skillId: "sk-can-bus",           coverage: "missing",    hours: 0,  practicalHours: 0 },
  { courseId: "cr-ev-tech", skillId: "sk-hv-safety",         coverage: "covered",    hours: 18, practicalHours: 10 },
  { courseId: "cr-ev-tech", skillId: "sk-thermal-mgmt",      coverage: "partial",    hours: 6,  practicalHours: 2 },
  { courseId: "cr-ev-tech", skillId: "sk-charging-prot",     coverage: "partial",    hours: 4,  practicalHours: 2 },
  { courseId: "cr-ev-tech", skillId: "sk-adas",              coverage: "missing",    hours: 0,  practicalHours: 0 },
  { courseId: "cr-ev-tech", skillId: "sk-charging-infra",    coverage: "partial",    hours: 6,  practicalHours: 2 },

  // CNC
  { courseId: "cr-cnc", skillId: "sk-cnc", coverage: "covered", hours: 60, practicalHours: 40 },
  { courseId: "cr-cnc", skillId: "sk-quality-6sigma", coverage: "covered", hours: 20, practicalHours: 6 },
  { courseId: "cr-cnc", skillId: "sk-additive", coverage: "missing", hours: 0, practicalHours: 0 },

  // PLC
  { courseId: "cr-plc", skillId: "sk-plc", coverage: "covered", hours: 56, practicalHours: 36 },
  { courseId: "cr-plc", skillId: "sk-robotics", coverage: "partial", hours: 18, practicalHours: 8 },
  { courseId: "cr-plc", skillId: "sk-iot-mfg", coverage: "partial", hours: 8, practicalHours: 2 },

  // Robotics
  { courseId: "cr-robotics", skillId: "sk-robotics", coverage: "covered", hours: 48, practicalHours: 32 },
  { courseId: "cr-robotics", skillId: "sk-plc", coverage: "partial", hours: 16, practicalHours: 6 },
  { courseId: "cr-robotics", skillId: "sk-iot-mfg", coverage: "partial", hours: 8, practicalHours: 2 },

  // Fullstack
  { courseId: "cr-fullstack", skillId: "sk-react", coverage: "covered", hours: 56, practicalHours: 40 },
  { courseId: "cr-fullstack", skillId: "sk-python", coverage: "covered", hours: 36, practicalHours: 24 },
  { courseId: "cr-fullstack", skillId: "sk-sql", coverage: "covered", hours: 28, practicalHours: 16 },
  { courseId: "cr-fullstack", skillId: "sk-devops", coverage: "partial", hours: 16, practicalHours: 8 },
  { courseId: "cr-fullstack", skillId: "sk-genai", coverage: "missing", hours: 0, practicalHours: 0 },

  // Cloud / DevOps
  { courseId: "cr-cloud-devops", skillId: "sk-cloud-aws", coverage: "covered", hours: 48, practicalHours: 32 },
  { courseId: "cr-cloud-devops", skillId: "sk-devops", coverage: "covered", hours: 40, practicalHours: 24 },
  { courseId: "cr-cloud-devops", skillId: "sk-cybersec", coverage: "partial", hours: 16, practicalHours: 4 },
  { courseId: "cr-cloud-devops", skillId: "sk-mlops", coverage: "missing", hours: 0, practicalHours: 0 },

  // Data eng
  { courseId: "cr-data-eng", skillId: "sk-data-eng", coverage: "covered", hours: 56, practicalHours: 32 },
  { courseId: "cr-data-eng", skillId: "sk-sql", coverage: "covered", hours: 28, practicalHours: 16 },
  { courseId: "cr-data-eng", skillId: "sk-cloud-aws", coverage: "partial", hours: 16, practicalHours: 6 },
  { courseId: "cr-data-eng", skillId: "sk-genai", coverage: "missing", hours: 0, practicalHours: 0 },

  // GenAI
  { courseId: "cr-genai", skillId: "sk-genai", coverage: "covered", hours: 40, practicalHours: 24 },
  { courseId: "cr-genai", skillId: "sk-python", coverage: "covered", hours: 24, practicalHours: 12 },
  { courseId: "cr-genai", skillId: "sk-mlops", coverage: "partial", hours: 12, practicalHours: 6 },
  { courseId: "cr-genai", skillId: "sk-cybersec", coverage: "missing", hours: 0, practicalHours: 0 },

  // Cybersec
  { courseId: "cr-cybersec", skillId: "sk-cybersec", coverage: "covered", hours: 56, practicalHours: 30 },
  { courseId: "cr-cybersec", skillId: "sk-cloud-aws", coverage: "partial", hours: 16, practicalHours: 6 },

  // Fraud / Credit
  { courseId: "cr-fraud", skillId: "sk-fraud-analytics", coverage: "covered", hours: 36, practicalHours: 18 },
  { courseId: "cr-fraud", skillId: "sk-sql", coverage: "covered", hours: 16, practicalHours: 8 },
  { courseId: "cr-fraud", skillId: "sk-python", coverage: "partial", hours: 12, practicalHours: 4 },
  { courseId: "cr-credit-risk", skillId: "sk-credit-risk", coverage: "covered", hours: 36, practicalHours: 16 },
  { courseId: "cr-credit-risk", skillId: "sk-rbi-compliance", coverage: "covered", hours: 12, practicalHours: 4 },
  { courseId: "cr-credit-risk", skillId: "sk-sql", coverage: "partial", hours: 12, practicalHours: 4 },

  // Healthcare
  { courseId: "cr-mri", skillId: "sk-mri-op", coverage: "covered", hours: 72, practicalHours: 48 },
  { courseId: "cr-mri", skillId: "sk-patient-care", coverage: "covered", hours: 16, practicalHours: 8 },
  { courseId: "cr-mri", skillId: "sk-emr-ehr", coverage: "partial", hours: 8, practicalHours: 4 },

  { courseId: "cr-gda", skillId: "sk-patient-care", coverage: "covered", hours: 36, practicalHours: 24 },
  { courseId: "cr-gda", skillId: "sk-phlebotomy", coverage: "partial", hours: 8, practicalHours: 4 },
  { courseId: "cr-gda", skillId: "sk-emr-ehr", coverage: "missing", hours: 0, practicalHours: 0 },

  // BIM
  { courseId: "cr-bim", skillId: "sk-revit-bim", coverage: "covered", hours: 56, practicalHours: 32 },
  { courseId: "cr-bim", skillId: "sk-survey-total", coverage: "partial", hours: 12, practicalHours: 4 },
  { courseId: "cr-bim", skillId: "sk-green-building", coverage: "missing", hours: 0, practicalHours: 0 },

  // Solar
  { courseId: "cr-solar", skillId: "sk-solar-install", coverage: "covered", hours: 40, practicalHours: 24 },
  { courseId: "cr-solar", skillId: "sk-hv-safety", coverage: "covered", hours: 16, practicalHours: 8 },

  // 5G
  { courseId: "cr-5g", skillId: "sk-5g-rollout", coverage: "covered", hours: 36, practicalHours: 18 },
  { courseId: "cr-5g", skillId: "sk-fiber-splicing", coverage: "covered", hours: 24, practicalHours: 14 },
  { courseId: "cr-5g", skillId: "sk-iot-mfg", coverage: "partial", hours: 8, practicalHours: 2 },

  // Warehouse
  { courseId: "cr-warehouse", skillId: "sk-sap-mm", coverage: "covered", hours: 18, practicalHours: 6 },
  { courseId: "cr-warehouse", skillId: "sk-forklift", coverage: "covered", hours: 12, practicalHours: 8 },
  { courseId: "cr-warehouse", skillId: "sk-last-mile", coverage: "missing", hours: 0, practicalHours: 0 },

  // Diesel — legacy
  { courseId: "cr-automotive-diesel", skillId: "sk-ic-engine", coverage: "covered", hours: 56, practicalHours: 36 },
  { courseId: "cr-automotive-diesel", skillId: "sk-welding", coverage: "covered", hours: 16, practicalHours: 8 },

  // Soft
  { courseId: "cr-soft", skillId: "sk-communication", coverage: "partial", hours: 8, practicalHours: 0 },
  { courseId: "cr-soft", skillId: "sk-customer-service", coverage: "partial", hours: 8, practicalHours: 0 },
  { courseId: "cr-soft", skillId: "sk-problem-solving", coverage: "partial", hours: 6, practicalHours: 0 },
  { courseId: "cr-soft", skillId: "sk-digital-literacy", coverage: "partial", hours: 8, practicalHours: 2 },
];

export const curriculumRequirements: CurriculumRequirement[] = [
  { id: "curq-001", courseId: "cr-ev-tech", skillId: "sk-battery-diagnostics", requiredLevel: "Advanced", currentLevel: "Intermediate", recommendedAction: "Upgrade module", expectedImpact: "High", employerBacking: 18 },
  { id: "curq-002", courseId: "cr-ev-tech", skillId: "sk-can-bus",            requiredLevel: "Intermediate", currentLevel: "None",        recommendedAction: "Add module",       expectedImpact: "High", employerBacking: 12 },
  { id: "curq-003", courseId: "cr-ev-tech", skillId: "sk-thermal-mgmt",       requiredLevel: "Intermediate", currentLevel: "Basic",        recommendedAction: "Expand practical training", expectedImpact: "High", employerBacking: 9 },
  { id: "curq-004", courseId: "cr-ev-tech", skillId: "sk-adas",               requiredLevel: "Basic",        currentLevel: "None",        recommendedAction: "Add module",       expectedImpact: "Medium", employerBacking: 6 },
  { id: "curq-005", courseId: "cr-ev-tech", skillId: "sk-charging-prot",      requiredLevel: "Intermediate", currentLevel: "Basic",        recommendedAction: "Expand practical training", expectedImpact: "Medium", employerBacking: 7 },

  { id: "curq-010", courseId: "cr-cloud-devops", skillId: "sk-mlops",         requiredLevel: "Intermediate", currentLevel: "None",        recommendedAction: "Add module",       expectedImpact: "Medium", employerBacking: 4 },
  { id: "curq-011", courseId: "cr-cloud-devops", skillId: "sk-cybersec",      requiredLevel: "Intermediate", currentLevel: "Basic",        recommendedAction: "Expand practical training", expectedImpact: "Medium", employerBacking: 6 },

  { id: "curq-020", courseId: "cr-fullstack", skillId: "sk-genai",            requiredLevel: "Basic",        currentLevel: "None",        recommendedAction: "Add module",       expectedImpact: "Medium", employerBacking: 5 },

  { id: "curq-030", courseId: "cr-bim", skillId: "sk-green-building",        requiredLevel: "Basic",        currentLevel: "None",        recommendedAction: "Add module",       expectedImpact: "Medium", employerBacking: 4 },

  { id: "curq-040", courseId: "cr-gda", skillId: "sk-emr-ehr",               requiredLevel: "Basic",        currentLevel: "None",        recommendedAction: "Add module",       expectedImpact: "Low", employerBacking: 2 },

  { id: "curq-050", courseId: "cr-warehouse", skillId: "sk-last-mile",        requiredLevel: "Basic",        currentLevel: "None",        recommendedAction: "Add module",       expectedImpact: "Low", employerBacking: 2 },

  { id: "curq-060", courseId: "cr-automotive-diesel", skillId: "sk-ev-powertrain", requiredLevel: "Basic", currentLevel: "None", recommendedAction: "Add module", expectedImpact: "High", employerBacking: 14 },
];
