import type { District } from "../../types/domain";

export const districts: District[] = [
  { id: "pune",     name: "Pune",        x: 220, y: 245, tier: 1, population_lakhs: 94.3 },
  { id: "mumbai",   name: "Mumbai",      x: 145, y: 280, tier: 1, population_lakhs: 124.4 },
  { id: "nashik",   name: "Nashik",      x: 205, y: 200, tier: 2, population_lakhs: 61.0 },
  { id: "nagpur",   name: "Nagpur",      x: 360, y: 260, tier: 2, population_lakhs: 49.7 },
  { id: "aurangabad", name: "Aurangabad", x: 250, y: 245, tier: 2, population_lakhs: 36.1 },
  { id: "kolhapur", name: "Kolhapur",    x: 175, y: 320, tier: 2, population_lakhs: 38.7 },
  { id: "sangli",   name: "Sangli",      x: 205, y: 305, tier: 3, population_lakhs: 28.2 },
  { id: "solapur",  name: "Solapur",     x: 285, y: 285, tier: 3, population_lakhs: 43.2 },
  { id: "amravati", name: "Amravati",    x: 335, y: 210, tier: 3, population_lakhs: 28.8 },
  { id: "nanded",   name: "Nanded",      x: 330, y: 285, tier: 3, population_lakhs: 33.6 },
  { id: "ratnagiri",name: "Ratnagiri",   x: 130, y: 305, tier: 3, population_lakhs: 15.1 },
  { id: "latur",    name: "Latur",       x: 310, y: 305, tier: 3, population_lakhs: 24.6 },
  { id: "jalgaon",  name: "Jalgaon",     x: 265, y: 195, tier: 2, population_lakhs: 42.2 },
  { id: "ahmednagar",name: "Ahmednagar", x: 235, y: 230, tier: 2, population_lakhs: 45.4 },
  { id: "thane",    name: "Thane",       x: 165, y: 270, tier: 1, population_lakhs: 80.9 },
];

export const findDistrict = (id: string) => districts.find(d => d.id === id);
