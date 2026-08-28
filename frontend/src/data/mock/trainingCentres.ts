import type { TrainingCentre, TrainingCapacity } from "../../types/domain";

export const trainingCentres: TrainingCentre[] = [
  { id: "tc-pune-itc",        name: "Government ITI Pune",          districtId: "pune",      sectors: ["Automotive & EV", "Manufacturing"], totalSeats: 1240, utilization: 88, equipmentScore: 72, trainerScore: 76, placementRate: 78, establishedYear: 1962 },
  { id: "tc-pune-tti",        name: "Advanced Technical Institute", districtId: "pune",      sectors: ["IT & Software", "Manufacturing", "Automotive & EV"], totalSeats: 1480, utilization: 84, equipmentScore: 86, trainerScore: 82, placementRate: 84, establishedYear: 2008 },
  { id: "tc-mumbai-itc",      name: "Government ITI Mumbai",        districtId: "mumbai",    sectors: ["IT & Software", "BFSI & FinTech", "Healthcare"], totalSeats: 1620, utilization: 91, equipmentScore: 80, trainerScore: 78, placementRate: 81, establishedYear: 1958 },
  { id: "tc-nashik-itc",      name: "Nashik Skill Development Centre", districtId: "nashik", sectors: ["Automotive & EV", "Renewable Energy"], totalSeats: 760, utilization: 64, equipmentScore: 60, trainerScore: 68, placementRate: 70, establishedYear: 2010 },
  { id: "tc-nagpur-itc",      name: "Government ITI Nagpur",        districtId: "nagpur",    sectors: ["IT & Software", "Logistics & Warehousing"], totalSeats: 880, utilization: 71, equipmentScore: 64, trainerScore: 70, placementRate: 69, establishedYear: 1971 },
  { id: "tc-aurangabad-itc",  name: "Aurangabad Skill Centre",      districtId: "aurangabad", sectors: ["Automotive & EV", "Logistics & Warehousing"], totalSeats: 520, utilization: 58, equipmentScore: 55, trainerScore: 62, placementRate: 65, establishedYear: 2013 },
];

export const trainingCapacities: TrainingCapacity[] = [
  { id: "cap-001", sector: "Automotive & EV",       districtId: "pune",     seatsAvailable: 1240, seatsRequired: 1820, trainerAvailability: 76, equipmentAvailability: 72, utilization: 88, placementRate: 78, topRoleId: "rl-ev-technician",     gap: 580 },
  { id: "cap-002", sector: "Automotive & EV",       districtId: "mumbai",   seatsAvailable: 480,  seatsRequired: 720,  trainerAvailability: 70, equipmentAvailability: 68, utilization: 82, placementRate: 74, topRoleId: "rl-ev-charging-tech",  gap: 240 },
  { id: "cap-003", sector: "Automotive & EV",       districtId: "nashik",   seatsAvailable: 320,  seatsRequired: 460,  trainerAvailability: 64, equipmentAvailability: 60, utilization: 70, placementRate: 70, topRoleId: "rl-ev-technician",     gap: 140 },
  { id: "cap-004", sector: "Manufacturing",         districtId: "pune",     seatsAvailable: 1480, seatsRequired: 1620, trainerAvailability: 82, equipmentAvailability: 86, utilization: 84, placementRate: 84, topRoleId: "rl-cnc-operator",      gap: 140 },
  { id: "cap-005", sector: "Manufacturing",         districtId: "mumbai",   seatsAvailable: 820,  seatsRequired: 900,  trainerAvailability: 78, equipmentAvailability: 80, utilization: 86, placementRate: 80, topRoleId: "rl-plc-engineer",      gap: 80 },
  { id: "cap-006", sector: "IT & Software",         districtId: "pune",     seatsAvailable: 1180, seatsRequired: 1380, trainerAvailability: 84, equipmentAvailability: 86, utilization: 90, placementRate: 86, topRoleId: "rl-cloud-engineer",    gap: 200 },
  { id: "cap-007", sector: "IT & Software",         districtId: "mumbai",   seatsAvailable: 1820, seatsRequired: 2080, trainerAvailability: 80, equipmentAvailability: 84, utilization: 88, placementRate: 82, topRoleId: "rl-fullstack",         gap: 260 },
  { id: "cap-008", sector: "IT & Software",         districtId: "nagpur",   seatsAvailable: 320,  seatsRequired: 380,  trainerAvailability: 64, equipmentAvailability: 66, utilization: 72, placementRate: 68, topRoleId: "rl-frontend-dev",      gap: 60 },
  { id: "cap-009", sector: "BFSI & FinTech",        districtId: "mumbai",   seatsAvailable: 420,  seatsRequired: 510,  trainerAvailability: 74, equipmentAvailability: 76, utilization: 78, placementRate: 72, topRoleId: "rl-fraud-analyst",     gap: 90 },
  { id: "cap-010", sector: "Healthcare",            districtId: "mumbai",   seatsAvailable: 540,  seatsRequired: 660,  trainerAvailability: 80, equipmentAvailability: 82, utilization: 84, placementRate: 81, topRoleId: "rl-mri-tech",          gap: 120 },
  { id: "cap-011", sector: "Renewable Energy",      districtId: "nashik",   seatsAvailable: 360,  seatsRequired: 520,  trainerAvailability: 62, equipmentAvailability: 60, utilization: 70, placementRate: 70, topRoleId: "rl-solar-installer",   gap: 160 },
  { id: "cap-012", sector: "Telecommunications",    districtId: "mumbai",   seatsAvailable: 280,  seatsRequired: 420,  trainerAvailability: 70, equipmentAvailability: 72, utilization: 76, placementRate: 70, topRoleId: "rl-5g-tech",           gap: 140 },
  { id: "cap-013", sector: "Logistics & Warehousing", districtId: "thane", seatsAvailable: 540,  seatsRequired: 600,  trainerAvailability: 70, equipmentAvailability: 74, utilization: 80, placementRate: 72, topRoleId: "rl-warehouse-sup",     gap: 60 },
];

export const findCentre = (id: string) => trainingCentres.find(c => c.id === id);
