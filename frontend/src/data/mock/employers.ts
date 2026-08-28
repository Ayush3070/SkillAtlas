import type { Employer, EmployerRequirement } from "../../types/domain";

export const employers: Employer[] = [
  { id: "emp-tata-motors",    name: "Tata Motors Ltd.",          sector: "Automotive & EV",   districtId: "pune",   size: "Enterprise", hiringVolumeAnnual: 4200, contact: { name: "A. Kulkarni",    designation: "Head — L&D" },      validatedRoles: 14, surveyParticipation: 92, satisfaction: 86, lastUpdated: "2026-08-21" },
  { id: "emp-mahindra-ev",    name: "Mahindra Electric",         sector: "Automotive & EV",   districtId: "pune",   size: "Large",      hiringVolumeAnnual: 1850, contact: { name: "R. Deshmukh",   designation: "Plant HR" },        validatedRoles: 9,  surveyParticipation: 78, satisfaction: 81, lastUpdated: "2026-08-19" },
  { id: "emp-byd",            name: "BYD India",                 sector: "Automotive & EV",   districtId: "thane",   size: "Large",      hiringVolumeAnnual: 1340, contact: { name: "V. Sharma",     designation: "Talent Acquisition" },validatedRoles: 6, surveyParticipation: 64, satisfaction: 74, lastUpdated: "2026-08-15" },
  { id: "emp-ola-electric",   name: "Ola Electric Technologies", sector: "Automotive & EV",   districtId: "pune",   size: "Large",      hiringVolumeAnnual: 2100, contact: { name: "P. Nair",       designation: "L&D Partner" },     validatedRoles: 7,  surveyParticipation: 71, satisfaction: 78, lastUpdated: "2026-08-20" },
  { id: "emp-hero-ev",        name: "Hero Electric",             sector: "Automotive & EV",   districtId: "nashik", size: "Medium",     hiringVolumeAnnual: 880,  contact: { name: "S. Joshi",      designation: "Plant HR" },        validatedRoles: 5,  surveyParticipation: 58, satisfaction: 76, lastUpdated: "2026-08-12" },
  { id: "emp-tata-powers",    name: "Tata Power",                sector: "Renewable Energy",  districtId: "mumbai", size: "Enterprise", hiringVolumeAnnual: 2700, contact: { name: "M. Iyer",       designation: "Capability Lead" },  validatedRoles: 11, surveyParticipation: 84, satisfaction: 83, lastUpdated: "2026-08-22" },
  { id: "emp-statiq",         name: "Statiq",                    sector: "Automotive & EV",   districtId: "mumbai", size: "Medium",     hiringVolumeAnnual: 420,  contact: { name: "D. Mehta",      designation: "Talent" },           validatedRoles: 3,  surveyParticipation: 60, satisfaction: 72, lastUpdated: "2026-08-10" },
  { id: "emp-ather-energy",   name: "Ather Energy",              sector: "Automotive & EV",   districtId: "pune",   size: "Medium",     hiringVolumeAnnual: 620,  contact: { name: "N. Pillai",     designation: "Talent Acquisition" },validatedRoles: 4,  surveyParticipation: 66, satisfaction: 80, lastUpdated: "2026-08-18" },

  { id: "emp-ashok-leyland",  name: "Ashok Leyland",             sector: "Automotive & EV",   districtId: "thane",   size: "Enterprise", hiringVolumeAnnual: 2200, contact: { name: "G. Krishnan",   designation: "Plant HR" },        validatedRoles: 10, surveyParticipation: 80, satisfaction: 79, lastUpdated: "2026-08-16" },

  { id: "emp-skf-india",      name: "SKF India",                 sector: "Manufacturing",    districtId: "pune",   size: "Large",      hiringVolumeAnnual: 720,  contact: { name: "A. Banerjee",   designation: "HRBP" },             validatedRoles: 6,  surveyParticipation: 75, satisfaction: 82, lastUpdated: "2026-08-19" },
  { id: "emp-bosch-india",    name: "Bosch India",               sector: "Manufacturing",    districtId: "pune",   size: "Enterprise", hiringVolumeAnnual: 3100, contact: { name: "K. Rao",        designation: "L&D" },              validatedRoles: 13, surveyParticipation: 88, satisfaction: 85, lastUpdated: "2026-08-23" },
  { id: "emp-siemens-india",  name: "Siemens India",             sector: "Manufacturing",    districtId: "mumbai", size: "Enterprise", hiringVolumeAnnual: 2600, contact: { name: "T. Bose",       designation: "Capability" },        validatedRoles: 12, surveyParticipation: 86, satisfaction: 84, lastUpdated: "2026-08-22" },
  { id: "emp-tata-autocomp",  name: "Tata AutoComp Systems",     sector: "Manufacturing",    districtId: "pune",   size: "Large",      hiringVolumeAnnual: 1480, contact: { name: "R. Kothari",    designation: "Plant HR" },        validatedRoles: 8,  surveyParticipation: 72, satisfaction: 80, lastUpdated: "2026-08-17" },
  { id: "emp-festo",          name: "Festo India",               sector: "Manufacturing",    districtId: "pune",   size: "Medium",     hiringVolumeAnnual: 320,  contact: { name: "S. Patil",      designation: "HR" },               validatedRoles: 3,  surveyParticipation: 64, satisfaction: 79, lastUpdated: "2026-08-14" },

  { id: "emp-infosys",        name: "Infosys",                   sector: "IT & Software",    districtId: "pune",   size: "Enterprise", hiringVolumeAnnual: 11800, contact: { name: "S. Iyengar",   designation: "Head — Early Careers" },validatedRoles: 18, surveyParticipation: 90, satisfaction: 87, lastUpdated: "2026-08-23" },
  { id: "emp-tcs",            name: "Tata Consultancy Services", sector: "IT & Software",    districtId: "mumbai", size: "Enterprise", hiringVolumeAnnual: 14600, contact: { name: "V. Desai",     designation: "L&D" },              validatedRoles: 21, surveyParticipation: 89, satisfaction: 84, lastUpdated: "2026-08-22" },
  { id: "emp-capgemini",      name: "Capgemini India",           sector: "IT & Software",    districtId: "mumbai", size: "Enterprise", hiringVolumeAnnual: 8400, contact: { name: "M. Saxena",    designation: "Talent" },           validatedRoles: 16, surveyParticipation: 84, satisfaction: 81, lastUpdated: "2026-08-21" },
  { id: "emp-wipro",          name: "Wipro",                     sector: "IT & Software",    districtId: "pune",   size: "Enterprise", hiringVolumeAnnual: 7200, contact: { name: "P. Menon",     designation: "Capability" },       validatedRoles: 15, surveyParticipation: 82, satisfaction: 80, lastUpdated: "2026-08-22" },
  { id: "emp-persistent",     name: "Persistent Systems",        sector: "IT & Software",    districtId: "pune",   size: "Large",      hiringVolumeAnnual: 2400, contact: { name: "R. Kulkarni",  designation: "HR" },               validatedRoles: 9,  surveyParticipation: 76, satisfaction: 83, lastUpdated: "2026-08-20" },
  { id: "emp-jio-platforms",  name: "Jio Platforms",             sector: "IT & Software",    districtId: "mumbai", size: "Enterprise", hiringVolumeAnnual: 9800, contact: { name: "A. Khanna",    designation: "L&D" },              validatedRoles: 17, surveyParticipation: 87, satisfaction: 85, lastUpdated: "2026-08-23" },
  { id: "emp-flipkart",       name: "Flipkart",                  sector: "IT & Software",    districtId: "thane",   size: "Enterprise", hiringVolumeAnnual: 5200, contact: { name: "S. Gera",      designation: "Talent" },           validatedRoles: 12, surveyParticipation: 81, satisfaction: 82, lastUpdated: "2026-08-21" },

  { id: "emp-hdfc",           name: "HDFC Bank",                 sector: "BFSI & FinTech",    districtId: "mumbai", size: "Enterprise", hiringVolumeAnnual: 6800, contact: { name: "R. Malhotra",  designation: "Capability" },       validatedRoles: 14, surveyParticipation: 85, satisfaction: 82, lastUpdated: "2026-08-22" },
  { id: "emp-icici",          name: "ICICI Bank",                sector: "BFSI & FinTech",    districtId: "mumbai", size: "Enterprise", hiringVolumeAnnual: 5900, contact: { name: "A. Joshi",     designation: "L&D" },              validatedRoles: 13, surveyParticipation: 82, satisfaction: 81, lastUpdated: "2026-08-20" },
  { id: "emp-bajaj-finserv",  name: "Bajaj Finserv",             sector: "BFSI & FinTech",    districtId: "pune",   size: "Large",      hiringVolumeAnnual: 3400, contact: { name: "V. Kulkarni",  designation: "HR" },               validatedRoles: 9,  surveyParticipation: 74, satisfaction: 80, lastUpdated: "2026-08-18" },
  { id: "emp-paytm",          name: "Paytm",                     sector: "BFSI & FinTech",    districtId: "noida",   size: "Large",      hiringVolumeAnnual: 2900, contact: { name: "S. Roy",       designation: "Talent" },           validatedRoles: 7,  surveyParticipation: 70, satisfaction: 78, lastUpdated: "2026-08-19" },
  { id: "emp-phonepe",        name: "PhonePe",                   sector: "BFSI & FinTech",    districtId: "pune",   size: "Large",      hiringVolumeAnnual: 2100, contact: { name: "A. Chandra",   designation: "L&D" },              validatedRoles: 6,  surveyParticipation: 68, satisfaction: 79, lastUpdated: "2026-08-17" },

  { id: "emp-apollo",         name: "Apollo Hospitals",          sector: "Healthcare",       districtId: "mumbai", size: "Enterprise", hiringVolumeAnnual: 4800, contact: { name: "Dr. M. Khan",  designation: "L&D" },              validatedRoles: 12, surveyParticipation: 80, satisfaction: 83, lastUpdated: "2026-08-20" },
  { id: "emp-fortis",         name: "Fortis Healthcare",         sector: "Healthcare",       districtId: "mumbai", size: "Large",      hiringVolumeAnnual: 3200, contact: { name: "Dr. P. Singh", designation: "Capability" },       validatedRoles: 10, surveyParticipation: 78, satisfaction: 81, lastUpdated: "2026-08-19" },
  { id: "emp-wockhardt",      name: "Wockhardt Hospitals",       sector: "Healthcare",       districtId: "mumbai", size: "Medium",     hiringVolumeAnnual: 1400, contact: { name: "S. D'Souza",   designation: "HR" },               validatedRoles: 6,  surveyParticipation: 70, satisfaction: 79, lastUpdated: "2026-08-15" },

  { id: "emp-lnt-construction", name: "L&T Construction",       sector: "Construction & Real Estate", districtId: "mumbai", size: "Enterprise", hiringVolumeAnnual: 4200, contact: { name: "A. Bhandari", designation: "Plant HR" },         validatedRoles: 11, surveyParticipation: 76, satisfaction: 80, lastUpdated: "2026-08-19" },
  { id: "emp-shapoorji",      name: "Shapoorji Pallonji",       sector: "Construction & Real Estate", districtId: "mumbai", size: "Large",     hiringVolumeAnnual: 2600, contact: { name: "P. Wagh",     designation: "Talent" },           validatedRoles: 8,  surveyParticipation: 70, satisfaction: 78, lastUpdated: "2026-08-17" },

  { id: "emp-adaani-green",   name: "Adani Green Energy",        sector: "Renewable Energy",  districtId: "nagpur", size: "Large",      hiringVolumeAnnual: 1400, contact: { name: "S. Chatterjee", designation: "Plant HR" },        validatedRoles: 6,  surveyParticipation: 72, satisfaction: 79, lastUpdated: "2026-08-18" },

  { id: "emp-vodafone-idea",  name: "Vodafone Idea",             sector: "Telecommunications", districtId: "mumbai", size: "Enterprise", hiringVolumeAnnual: 3200, contact: { name: "R. Tandon",   designation: "L&D" },              validatedRoles: 9,  surveyParticipation: 78, satisfaction: 80, lastUpdated: "2026-08-20" },
  { id: "emp-reliance-retail",name: "Reliance Retail",           sector: "Retail & E-commerce",districtId: "mumbai", size: "Enterprise", hiringVolumeAnnual: 9600, contact: { name: "N. Puri",     designation: "Capability" },       validatedRoles: 14, surveyParticipation: 84, satisfaction: 82, lastUpdated: "2026-08-21" },
  { id: "emp-amazon-in",      name: "Amazon India",              sector: "Logistics & Warehousing", districtId: "thane", size: "Enterprise", hiringVolumeAnnual: 7400, contact: { name: "M. Sen",      designation: "Talent" },          validatedRoles: 12, surveyParticipation: 80, satisfaction: 81, lastUpdated: "2026-08-22" },
  { id: "emp-delhivery",      name: "Delhivery",                 sector: "Logistics & Warehousing", districtId: "gurugram", size: "Large",  hiringVolumeAnnual: 2900, contact: { name: "S. Bahl",     designation: "HR" },               validatedRoles: 6,  surveyParticipation: 70, satisfaction: 78, lastUpdated: "2026-08-16" },
];

export const findEmployer = (id: string) => employers.find(e => e.id === id);

export const employerRequirements: EmployerRequirement[] = [
  {
    id: "er-001", employerId: "emp-tata-motors", roleId: "rl-ev-technician",
    requiredSkills: [
      { skillId: "sk-ev-powertrain", proficiency: "Advanced", critical: true },
      { skillId: "sk-battery-diagnostics", proficiency: "Advanced", critical: true },
      { skillId: "sk-hv-safety", proficiency: "Expert", critical: true },
      { skillId: "sk-can-bus", proficiency: "Intermediate", critical: false },
      { skillId: "sk-thermal-mgmt", proficiency: "Intermediate", critical: false },
    ],
    equipment: ["Insulated tools 1000V", "Hi-pot tester", "Diagnostic tablets"],
    certificationsPreferred: ["cert-nsqf", "EV Service L4"],
    trainerExpectations: ["Industry exp ≥3 yrs", "OEM certified"],
    status: "Validated", submittedAt: "2026-07-04", validatedAt: "2026-07-09",
    notes: "Demand growing on Premium EV platform. Ready to hire 240 in next quarter.",
  },
  {
    id: "er-002", employerId: "emp-mahindra-ev", roleId: "rl-ev-technician",
    requiredSkills: [
      { skillId: "sk-battery-diagnostics", proficiency: "Advanced", critical: true },
      { skillId: "sk-hv-safety", proficiency: "Advanced", critical: true },
      { skillId: "sk-can-bus", proficiency: "Intermediate", critical: true },
    ],
    equipment: ["Cell cycler", "Diagnostic tablet"],
    certificationsPreferred: ["cert-nsqf"],
    trainerExpectations: ["Hands-on OEM exposure"],
    status: "Validated", submittedAt: "2026-07-08", validatedAt: "2026-07-12",
  },
  {
    id: "er-003", employerId: "emp-tata-powers", roleId: "rl-solar-installer",
    requiredSkills: [
      { skillId: "sk-solar-install", proficiency: "Advanced", critical: true },
      { skillId: "sk-hv-safety", proficiency: "Advanced", critical: true },
    ],
    equipment: ["Hot-stick set", "PV array tester"],
    certificationsPreferred: ["cert-nsqf", "Surya Mitra"],
    trainerExpectations: ["Field exp ≥2 yrs"],
    status: "Validated", submittedAt: "2026-07-10", validatedAt: "2026-07-14",
  },
  {
    id: "er-004", employerId: "emp-infosys", roleId: "rl-genai-engineer",
    requiredSkills: [
      { skillId: "sk-genai", proficiency: "Advanced", critical: true },
      { skillId: "sk-python", proficiency: "Advanced", critical: true },
      { skillId: "sk-mlops", proficiency: "Intermediate", critical: false },
    ],
    equipment: ["GPU cloud access"],
    certificationsPreferred: [],
    trainerExpectations: ["Production LLM experience"],
    status: "Needs Review", submittedAt: "2026-08-12", notes: "Proficiency ladder may be too steep for typical ITI cohort.",
  },
  {
    id: "er-005", employerId: "emp-apollo", roleId: "rl-mri-tech",
    requiredSkills: [
      { skillId: "sk-mri-op", proficiency: "Advanced", critical: true },
      { skillId: "sk-patient-care", proficiency: "Intermediate", critical: false },
    ],
    equipment: ["MRI simulator"],
    certificationsPreferred: ["AERB Level 2"],
    trainerExpectations: ["Clinical experience"],
    status: "Validated", submittedAt: "2026-07-22", validatedAt: "2026-07-26",
  },
  {
    id: "er-006", employerId: "emp-ola-electric", roleId: "rl-ev-technician",
    requiredSkills: [
      { skillId: "sk-ev-powertrain", proficiency: "Intermediate", critical: true },
      { skillId: "sk-battery-diagnostics", proficiency: "Advanced", critical: true },
      { skillId: "sk-hv-safety", proficiency: "Advanced", critical: true },
    ],
    equipment: ["Service bay", "OEM tooling"],
    certificationsPreferred: ["cert-nsqf"],
    trainerExpectations: ["Hub-service experience"],
    status: "Validated", submittedAt: "2026-07-18", validatedAt: "2026-07-22",
  },
  {
    id: "er-007", employerId: "emp-bosch-india", roleId: "rl-plc-engineer",
    requiredSkills: [
      { skillId: "sk-plc", proficiency: "Advanced", critical: true },
      { skillId: "sk-robotics", proficiency: "Intermediate", critical: true },
      { skillId: "sk-iot-mfg", proficiency: "Intermediate", critical: false },
    ],
    equipment: ["Siemens S7 lab", "FANUC cell"],
    certificationsPreferred: [],
    trainerExpectations: ["5+ years shop floor"],
    status: "Pending", submittedAt: "2026-08-15",
  },
  {
    id: "er-008", employerId: "emp-jio-platforms", roleId: "rl-cloud-engineer",
    requiredSkills: [
      { skillId: "sk-cloud-aws", proficiency: "Advanced", critical: true },
      { skillId: "sk-devops", proficiency: "Advanced", critical: true },
      { skillId: "sk-cybersec", proficiency: "Intermediate", critical: true },
    ],
    equipment: ["Sandbox accounts"],
    certificationsPreferred: ["AWS SAA"],
    trainerExpectations: ["Production cloud experience"],
    status: "Validated", submittedAt: "2026-07-20", validatedAt: "2026-07-24",
  },
  {
    id: "er-009", employerId: "emp-shapoorji", roleId: "rl-bim-modeller",
    requiredSkills: [
      { skillId: "sk-revit-bim", proficiency: "Advanced", critical: true },
      { skillId: "sk-green-building", proficiency: "Basic", critical: false },
    ],
    equipment: ["Revit + Navisworks licence"],
    certificationsPreferred: [],
    trainerExpectations: ["Live project portfolio"],
    status: "Pending", submittedAt: "2026-08-18",
  },
  {
    id: "er-010", employerId: "emp-ashok-leyland", roleId: "rl-automotive-diesel",
    requiredSkills: [
      { skillId: "sk-ic-engine", proficiency: "Advanced", critical: true },
      { skillId: "sk-welding", proficiency: "Intermediate", critical: false },
    ],
    equipment: ["Service bay"],
    certificationsPreferred: ["cert-nsqf"],
    trainerExpectations: ["CV service experience"],
    status: "Rejected", submittedAt: "2026-06-30",
    notes: "Re-prioritised in favour of EV. Plan to retire in 12 months.",
  },
];
