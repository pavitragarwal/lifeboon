import mongoose from "mongoose";
import dotenv from "dotenv";
import Hospital from "../models/Hospital.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/lifeboon";

await mongoose.connect(MONGO_URI);
console.log("✅ Connected to MongoDB for seeding");

const hospitals = [
  {
    name: "LifeBoon General Hospital",
    address: "101 Health St, Seattle, WA",
    phone: "+1-555-0101",
    email: "info@lifeboon-general.org",
    lat: 47.6062, lon: -122.3321,
    services: {
      beds: 25,
      injections: ["flu", "polio", "MMR"],
      care: { general: ["checkup", "blood test"], dental: ["filling"], eye: ["vision test"] },
      surgery: { eye: ["lasik"], arm: ["fracture repair"], leg: ["knee replacement"] },
      other: ["pharmacy", "lab"]
    },
    acceptsInsurance: ["Aetna", "BlueCross", "Medicare"]
  },
  {
    name: "Northview Clinic",
    address: "22 North Ave, Seattle, WA",
    phone: "+1-555-0102",
    email: "contact@northview.clinic",
    lat: 47.6100, lon: -122.3400,
    services: {
      beds: 6,
      injections: ["flu"],
      care: { general: ["checkup"], dental: [], eye: ["vision test"] },
      surgery: { eye: [], arm: [], leg: [] },
      other: ["immunization"]
    },
    acceptsInsurance: ["BlueCross"]
  },
  {
    name: "Harbor Medical Center",
    address: "9 Harbor Rd, Seattle, WA",
    phone: "+1-555-0103",
    email: "hello@harbormed.com",
    lat: 47.6000, lon: -122.3200,
    services: {
      beds: 40,
      injections: ["flu", "tetanus"],
      care: { general: ["blood test", "ECG"], dental: ["root canal"], eye: ["LASIK consult"] },
      surgery: { eye: [], arm: ["fracture repair"], leg: ["ACL repair"] },
      other: ["ambulance"]
    },
    acceptsInsurance: ["Aetna", "Cigna"]
  },
  {
    name: "Maple Urgent Care",
    address: "400 Maple St, Seattle, WA",
    phone: "+1-555-0104",
    email: "maple@urgentcare.org",
    lat: 47.6150, lon: -122.3350,
    services: {
      beds: 4,
      injections: ["MMR", "flu"],
      care: { general: ["stitches", "x-ray"], dental: [], eye: [] },
      surgery: { eye: [], arm: [], leg: [] },
      other: ["walk-in"]
    },
    acceptsInsurance: ["Medicare", "Aetna"]
  },
  {
    name: "Westside Children's Hospital",
    address: "7 West Blvd, Seattle, WA",
    phone: "+1-555-0105",
    email: "peds@westsidechild.org",
    lat: 47.6170, lon: -122.3450,
    services: {
      beds: 18,
      injections: ["MMR", "polio", "dtap"],
      care: { general: ["pediatrics"], dental: [], eye: ["vision test"] },
      surgery: { eye: [], arm: [], leg: [] },
      other: ["neonatal"]
    },
    acceptsInsurance: ["BlueCross", "Medicaid"]
  },
  {
    name: "East End Surgical Center",
    address: "88 East End Ave, Seattle, WA",
    phone: "+1-555-0106",
    email: "surgery@eastend.org",
    lat: 47.6030, lon: -122.3100,
    services: {
      beds: 30,
      injections: ["tetanus"],
      care: { general: [], dental: [], eye: [] },
      surgery: { eye: ["cataract"], arm: ["tendon repair"], leg: ["hip replacement"] },
      other: ["post-op care"]
    },
    acceptsInsurance: ["Cigna", "Aetna"]
  },
  {
    name: "Green Valley Clinic",
    address: "150 Green Valley Dr, Seattle, WA",
    phone: "+1-555-0107",
    email: "info@greenvalleyclinic.com",
    lat: 47.6200, lon: -122.3480,
    services: {
      beds: 8,
      injections: ["flu", "polio"],
      care: { general: ["checkup", "vaccination"], dental: ["cleaning"], eye: ["vision test"] },
      surgery: { eye: [], arm: [], leg: [] },
      other: ["pharmacy"]
    },
    acceptsInsurance: ["Aetna", "Medicare"]
  },
  {
    name: "Summit Eye & Vision",
    address: "211 Summit Rd, Seattle, WA",
    phone: "+1-555-0108",
    email: "contact@summiteye.com",
    lat: 47.6085, lon: -122.3250,
    services: {
      beds: 0,
      injections: [],
      care: { general: [], dental: [], eye: ["vision test", "lasik", "dilation"] },
      surgery: { eye: ["lasik"], arm: [], leg: [] },
      other: ["optical shop"]
    },
    acceptsInsurance: ["VisionCare", "Aetna"]
  },
  {
    name: "Downtown Dental & Care",
    address: "55 2nd St, Seattle, WA",
    phone: "+1-555-0109",
    email: "appointments@downtowndental.com",
    lat: 47.6050, lon: -122.3355,
    services: {
      beds: 0,
      injections: [],
      care: { general: [], dental: ["filling", "root canal", "extraction"], eye: [] },
      surgery: { eye: [], arm: [], leg: [] },
      other: ["dental lab"]
    },
    acceptsInsurance: ["DeltaDental", "Cigna"]
  },
  {
    name: "Community Health Outreach",
    address: "301 Community Ln, Seattle, WA",
    phone: "+1-555-0110",
    email: "outreach@communityhealth.org",
    lat: 47.6120, lon: -122.3300,
    services: {
      beds: 10,
      injections: ["flu", "HPV"],
      care: { general: ["screening", "consultation"], dental: [], eye: [] },
      surgery: { eye: [], arm: [], leg: [] },
      other: ["counseling"]
    },
    acceptsInsurance: ["Medicaid", "Aetna"]
  }
];

await Hospital.deleteMany({});
await Hospital.insertMany(hospitals);
console.log("✅ Successfully added 10 sample hospitals");
process.exit(0);