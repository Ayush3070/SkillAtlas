// Time-series for charts — built to be consistent with the domain story.
// All values in INR for salaries, raw counts for demand, percentages where shown.

export const monthLabels = [
  "Sep '25", "Oct '25", "Nov '25", "Dec '25",
  "Jan '26", "Feb '26", "Mar '26", "Apr '26",
  "May '26", "Jun '26", "Jul '26", "Aug '26",
];

/** Monthly openings for selected roles (illustrative, end-of-month). */
export const roleDemandSeries: Record<string, number[]> = {
  "rl-ev-technician":     [ 920,  980, 1040, 1090, 1180, 1260, 1320, 1390, 1480, 1580, 1690, 1820],
  "rl-ev-charging-tech":  [ 330,  360,  380,  400,  430,  470,  510,  550,  600,  650,  710,  760],
  "rl-cloud-engineer":    [ 720,  760,  790,  830,  870,  910,  960, 1020, 1090, 1170, 1280, 1380],
  "rl-genai-engineer":    [  60,   72,   86,  102,  124,  150,  180,  214,  248,  280,  312,  340],
  "rl-cnc-operator":      [1320, 1340, 1370, 1400, 1430, 1460, 1490, 1520, 1550, 1580, 1610, 1640],
  "rl-robotic-arm":       [ 250,  270,  290,  310,  330,  350,  370,  390,  410,  430,  455,  480],
  "rl-solar-installer":   [ 680,  710,  740,  780,  820,  860,  900,  940,  980, 1030, 1100, 1180],
  "rl-mri-tech":          [ 180,  186,  192,  198,  204,  210,  216,  222,  228,  232,  236,  240],
  "rl-automotive-diesel": [1120, 1100, 1090, 1080, 1060, 1050, 1030, 1020, 1000,  980,  960,  940],
};

/** Sector demand (sum of top roles) over time, indexed. */
export const sectorDemandIndex: Record<string, number[]> = {
  "Automotive & EV":       [ 92,  94,  96,  99, 102, 106, 110, 114, 118, 122, 127, 131],
  "Manufacturing":         [ 96,  97,  99, 101, 102, 103, 104, 105, 106, 107, 108, 109],
  "IT & Software":         [ 88,  91,  94,  98, 102, 106, 110, 114, 119, 124, 130, 136],
  "BFSI & FinTech":        [ 95,  97,  98, 100, 101, 102, 103, 104, 105, 106, 108, 110],
  "Healthcare":            [ 94,  95,  96,  97,  98,  99, 100, 101, 102, 103, 104, 105],
  "Construction & Real Estate": [ 90,  92,  94,  96,  98, 100, 102, 104, 105, 106, 107, 108],
  "Retail & E-commerce":   [ 92,  94,  96,  98, 100, 101, 102, 103, 104, 105, 106, 107],
  "Logistics & Warehousing":[ 90,  92,  94,  96,  98, 100, 101, 102, 103, 104, 105, 106],
  "Hospitality":           [ 80,  82,  85,  88,  90,  92,  93,  94,  95,  96,  97,  98],
  "Agriculture & Food Processing":[ 86, 88, 90, 92, 94, 95, 96, 97, 98, 99, 100, 101],
  "Renewable Energy":      [ 88,  92,  96, 100, 104, 108, 112, 116, 120, 124, 128, 132],
  "Telecommunications":    [ 86,  89,  92,  95,  98, 101, 104, 107, 110, 113, 116, 119],
};

/** Pune vs other districts — monthly openings, EV track. */
export const districtEvSeries: Record<string, number[]> = {
  "pune":     [ 320,  350,  380,  410,  450,  500,  550,  610,  680,  760,  840,  920],
  "mumbai":   [ 180,  200,  220,  240,  260,  280,  300,  320,  340,  360,  380,  400],
  "nashik":   [  80,   90,  100,  110,  120,  130,  140,  150,  160,  170,  180,  190],
  "nagpur":   [  40,   45,   50,   55,   60,   65,   70,   75,   80,   85,   90,   95],
};

/** Demand vs supply — top sectors. (Demand index, Supply index) */
export const demandVsSupply = [
  { sector: "Automotive & EV",   demand: 131, supply: 88 },
  { sector: "IT & Software",     demand: 136, supply: 132 },
  { sector: "Manufacturing",     demand: 109, supply: 104 },
  { sector: "BFSI & FinTech",    demand: 110, supply: 98 },
  { sector: "Healthcare",        demand: 105, supply: 92 },
  { sector: "Renewable Energy",  demand: 132, supply: 76 },
  { sector: "Construction",      demand: 108, supply: 96 },
  { sector: "Telecommunications",demand: 119, supply: 88 },
  { sector: "Logistics",         demand: 106, supply: 100 },
];

/** Skill gap severity by sector (0..100) */
export const skillGapBySector = [
  { sector: "Automotive & EV",       gap: 42 },
  { sector: "Renewable Energy",      gap: 56 },
  { sector: "IT & Software",         gap: 28 },
  { sector: "BFSI & FinTech",        gap: 33 },
  { sector: "Healthcare",            gap: 24 },
  { sector: "Manufacturing",         gap: 30 },
  { sector: "Telecommunications",    gap: 47 },
  { sector: "Construction",          gap: 38 },
  { sector: "Logistics & Warehousing", gap: 22 },
];

/** Sector growth % YoY */
export const sectorGrowth = [
  { sector: "Automotive & EV",       growth: 31 },
  { sector: "IT & Software",         growth: 14 },
  { sector: "Renewable Energy",      growth: 21 },
  { sector: "BFSI & FinTech",        growth: 9 },
  { sector: "Healthcare",            growth: 7 },
  { sector: "Manufacturing",         growth: 6 },
  { sector: "Telecommunications",    growth: 17 },
  { sector: "Construction",          growth: 8 },
  { sector: "Logistics & Warehousing", growth: 5 },
  { sector: "Hospitality",           growth: -2 },
];

/** Geographic demand — top districts by openings this month. */
export const geoDemand = [
  { districtId: "pune",     openings: 18800 },
  { districtId: "mumbai",   openings: 24600 },
  { districtId: "thane",    openings:  9200 },
  { districtId: "nashik",   openings:  4100 },
  { districtId: "nagpur",   openings:  3400 },
  { districtId: "aurangabad",openings: 2800 },
  { districtId: "kolhapur", openings:  2400 },
  { districtId: "solapur",  openings:  1800 },
  { districtId: "ahmednagar",openings: 2100 },
  { districtId: "sangli",   openings:  1300 },
];

/** Skill gap matrix data — for /skills matrix view. */
export const skillMatrix = [
  // rows = roleIds, cols = skillIds
  { roleId: "rl-ev-technician",     cell: { "sk-battery-diagnostics": 88, "sk-can-bus": 78, "sk-hv-safety": 30, "sk-thermal-mgmt": 72, "sk-adas": 64, "sk-charging-prot": 56 } },
  { roleId: "rl-ev-charging-tech",  cell: { "sk-charging-prot": 70, "sk-charging-infra": 50, "sk-hv-safety": 38, "sk-iot-mfg": 48 } },
  { roleId: "rl-cloud-engineer",    cell: { "sk-cloud-aws": 36, "sk-devops": 40, "sk-cybersec": 58, "sk-mlops": 72 } },
  { roleId: "rl-genai-engineer",    cell: { "sk-genai": 86, "sk-mlops": 70, "sk-python": 28, "sk-cybersec": 56 } },
  { roleId: "rl-data-engineer",     cell: { "sk-data-eng": 40, "sk-sql": 22, "sk-cloud-aws": 38 } },
  { roleId: "rl-plc-engineer",      cell: { "sk-plc": 38, "sk-robotics": 52, "sk-iot-mfg": 60 } },
  { roleId: "rl-robotic-arm",       cell: { "sk-robotics": 46, "sk-plc": 42 } },
  { roleId: "rl-solar-installer",   cell: { "sk-solar-install": 32, "sk-hv-safety": 34 } },
  { roleId: "rl-mri-tech",          cell: { "sk-mri-op": 30, "sk-emr-ehr": 60 } },
  { roleId: "rl-bim-modeller",      cell: { "sk-revit-bim": 36, "sk-green-building": 70 } },
  { roleId: "rl-fraud-analyst",     cell: { "sk-fraud-analytics": 44, "sk-genai": 64, "sk-sql": 24 } },
  { roleId: "rl-credit-risk",       cell: { "sk-credit-risk": 42, "sk-rbi-compliance": 30, "sk-sql": 22 } },
];

/** Source mix for signals over the last 6 months. */
export const sourceMix = [
  { source: "Employer Survey",   count: 412 },
  { source: "Job Portal",        count: 1280 },
  { source: "Placement Cell",    count:  218 },
  { source: "Training Centre",   count:  164 },
  { source: "Industry Body",     count:  186 },
  { source: "Government Portal", count:  96 },
];

/** Coverage & freshness (used in DataFreshness banners). */
export const freshness = {
  updatedAt: "2026-08-26",
  coverageFrom: "2025-01-01",
  coverageTo: "2026-08-26",
  confidence: "High" as const,
  source: "Demo labour-market signal",
};
