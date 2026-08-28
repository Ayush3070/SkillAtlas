import type { LabourSignal } from "../../types/domain";

export const labourSignals: LabourSignal[] = [
  // Pune EV surge
  { id: "ls-001", source: "Employer Survey",   sector: "Automotive & EV", districtId: "pune",   roleId: "rl-ev-technician",    skillIds: ["sk-battery-diagnostics", "sk-can-bus"],          strength: 5, date: "2026-08-12", description: "Tata Motors reports 31% YoY growth in EV service roles at Pune plant." },
  { id: "ls-002", source: "Job Portal",        sector: "Automotive & EV", districtId: "pune",   roleId: "rl-ev-technician",    skillIds: ["sk-battery-diagnostics"],                            strength: 5, date: "2026-08-09", description: "Pune-region EV technician postings up 28% MoM on aggregated job portals." },
  { id: "ls-003", source: "Industry Body",     sector: "Automotive & EV", districtId: "pune",   roleId: "rl-ev-technician",    skillIds: ["sk-hv-safety"],                                       strength: 4, date: "2026-08-04", description: "SIAM Pune chapter highlights HV-safety as critical for 2-wheeler and 4-wheeler EV." },
  { id: "ls-004", source: "Employer Survey",   sector: "Automotive & EV", districtId: "pune",   roleId: "rl-ev-technician",    skillIds: ["sk-battery-diagnostics", "sk-can-bus", "sk-thermal-mgmt"], strength: 4, date: "2026-08-02", description: "Mahindra EV reports gap in BMS and thermal management readiness among fresh hires." },
  { id: "ls-005", source: "Placement Cell",    sector: "Automotive & EV", districtId: "pune",   roleId: "rl-ev-technician",    skillIds: ["sk-can-bus"],                                         strength: 3, date: "2026-07-29", description: "Government ITI Pune requests CAN-bus curriculum refresh." },
  { id: "ls-006", source: "Employer Survey",   sector: "Automotive & EV", districtId: "pune",   roleId: "rl-ev-charging-tech", skillIds: ["sk-charging-infra", "sk-charging-prot"],              strength: 4, date: "2026-08-14", description: "Statiq and Tata Power hiring 240+ charging technicians across Pune metro." },
  { id: "ls-007", source: "Training Centre",   sector: "Automotive & EV", districtId: "pune",   roleId: "rl-ev-technician",    skillIds: ["sk-battery-diagnostics", "sk-hv-safety"],             strength: 4, date: "2026-08-06", description: "ATI Pune reports placement of only 62% in EV stream vs 84% overall due to skill gaps." },

  // IT Cloud / GenAI
  { id: "ls-010", source: "Job Portal",        sector: "IT & Software",   districtId: "pune",   roleId: "rl-cloud-engineer",   skillIds: ["sk-cloud-aws", "sk-devops"],                          strength: 4, date: "2026-08-18", description: "Cloud engineer postings in Pune up 22% YoY." },
  { id: "ls-011", source: "Employer Survey",   sector: "IT & Software",   districtId: "mumbai", roleId: "rl-genai-engineer",   skillIds: ["sk-genai", "sk-mlops"],                               strength: 4, date: "2026-08-20", description: "Jio Platforms and TCS to onboard 280+ applied GenAI engineers in next 6 months." },
  { id: "ls-012", source: "Job Portal",        sector: "IT & Software",   districtId: "pune",   roleId: "rl-data-engineer",    skillIds: ["sk-data-eng", "sk-sql"],                              strength: 3, date: "2026-08-11", description: "Data engineering roles steadily rising in Pune; 19% YoY." },

  // Manufacturing automation
  { id: "ls-020", source: "Employer Survey",   sector: "Manufacturing",   districtId: "pune",   roleId: "rl-plc-engineer",     skillIds: ["sk-plc", "sk-robotics"],                              strength: 4, date: "2026-08-08", description: "Bosch India hiring 180 PLC / automation engineers in Pune; 18% YoY growth." },
  { id: "ls-021", source: "Industry Body",     sector: "Manufacturing",   districtId: "mumbai", roleId: "rl-robotic-arm",      skillIds: ["sk-robotics"],                                         strength: 3, date: "2026-08-12", description: "Maharashtra industrial automation cluster reports 22% YoY growth in robotic cell roles." },

  // Renewable
  { id: "ls-030", source: "Government Portal", sector: "Renewable Energy",districtId: "nashik", roleId: "rl-solar-installer",  skillIds: ["sk-solar-install", "sk-hv-safety"],                   strength: 4, date: "2026-08-03", description: "PM Surya Ghar push drives 21% YoY demand for rooftop PV installers in Nashik district." },
  { id: "ls-031", source: "Employer Survey",   sector: "Renewable Energy",districtId: "nagpur", roleId: "rl-solar-installer",  skillIds: ["sk-solar-install"],                                    strength: 3, date: "2026-07-30", description: "Adani Green plans 2.4 GW capacity additions in Vidarbha; needs local PV workforce." },

  // Healthcare
  { id: "ls-040", source: "Employer Survey",   sector: "Healthcare",      districtId: "mumbai", roleId: "rl-mri-tech",         skillIds: ["sk-mri-op"],                                          strength: 3, date: "2026-08-05", description: "Apollo Hospitals report MRI tech hiring constraint; AERB-L2 cert pipeline thin." },
  { id: "ls-041", source: "Placement Cell",    sector: "Healthcare",      districtId: "mumbai", roleId: "rl-clinical-assist",  skillIds: ["sk-patient-care", "sk-emr-ehr"],                      strength: 3, date: "2026-07-28", description: "EMR/EHR adoption rising; new graduates lack system familiarity." },

  // BFSI
  { id: "ls-050", source: "Employer Survey",   sector: "BFSI & FinTech",  districtId: "mumbai", roleId: "rl-fraud-analyst",    skillIds: ["sk-fraud-analytics", "sk-genai"],                     strength: 3, date: "2026-08-17", description: "UPI-scale fraud analytics: PhonePe & Paytm build applied GenAI detection teams." },

  // Construction
  { id: "ls-060", source: "Employer Survey",   sector: "Construction & Real Estate", districtId: "mumbai", roleId: "rl-bim-modeller", skillIds: ["sk-revit-bim", "sk-green-building"],                strength: 3, date: "2026-08-10", description: "L&T projects add IGBC-aligned BIM modellers; green-building familiarity becoming a hiring differentiator." },

  // Telecom
  { id: "ls-070", source: "Industry Body",     sector: "Telecommunications", districtId: "mumbai", roleId: "rl-5g-tech",        skillIds: ["sk-5g-rollout", "sk-fiber-splicing"],                  strength: 3, date: "2026-08-13", description: "5G rollout in MMR continues; demand for 5G field technicians up 17%." },

  // Declining signals
  { id: "ls-080", source: "Job Portal",        sector: "Automotive & EV", districtId: "nashik", roleId: "rl-automotive-diesel",skillIds: ["sk-ic-engine"],                                       strength: 3, date: "2026-08-07", description: "Diesel mechanic postings in Nashik down 8% YoY as fleets electrify." },
];
