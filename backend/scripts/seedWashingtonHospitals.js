// backend/scripts/seedWashingtonHospitals.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Hospital from "../models/Hospital.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/lifeboon";

await mongoose.connect(MONGO_URI);
console.log("✅ Connected to MongoDB for seeding");

// Major hospitals across Washington State
const hospitals = [
  // Seattle Area
  {
    name: "Harborview Medical Center",
    address: "325 9th Ave, Seattle, WA 98104",
    phone: "+1-206-744-3000",
    email: "info@harborview.org",
    lat: 47.6050, lon: -122.3226,
    specialties: ["trauma", "emergency", "general", "surgery"],
    services: {
      beds: 413,
      injections: ["flu", "tetanus", "hepatitis", "MMR", "polio"],
      care: {
        general: ["checkup", "blood test", "ECG", "x-ray"],
        dental: ["emergency dental"],
        eye: ["vision test", "emergency eye care"],
        heart: ["cardiology", "cardiac surgery", "heart monitoring"]
      },
      surgery: {
        eye: ["cataract", "retinal surgery"],
        arm: ["fracture repair", "tendon repair"],
        leg: ["knee replacement", "hip replacement", "fracture repair"],
        heart: ["bypass surgery", "valve replacement"]
      },
      other: ["emergency room", "trauma center", "ICU", "ambulance"]
    },
    acceptsInsurance: ["Aetna", "BlueCross", "Cigna", "Medicare", "Medicaid", "UnitedHealthcare", "Kaiser"]
  },
  {
    name: "Swedish Medical Center - First Hill",
    address: "747 Broadway, Seattle, WA 98122",
    phone: "+1-206-744-8000",
    email: "contact@swedish.org",
    lat: 47.6082, lon: -122.3208,
    specialties: ["cardiology", "neurology", "oncology", "general"],
    services: {
      beds: 697,
      injections: ["flu", "pneumonia", "shingles", "MMR"],
      care: {
        general: ["checkup", "blood test", "physical exam"],
        dental: [],
        eye: ["vision test", "glaucoma screening"],
        heart: ["cardiology", "echocardiogram", "stress test", "cardiac catheterization"]
      },
      surgery: {
        eye: ["lasik", "cataract"],
        arm: ["fracture repair"],
        leg: ["knee replacement", "hip replacement"],
        heart: ["bypass surgery", "angioplasty", "pacemaker implant"]
      },
      other: ["cancer center", "neurology", "pharmacy", "lab"]
    },
    acceptsInsurance: ["Aetna", "BlueCross", "Cigna", "Medicare", "UnitedHealthcare", "Humana"]
  },
  {
    name: "University of Washington Medical Center",
    address: "1959 NE Pacific St, Seattle, WA 98195",
    phone: "+1-206-598-3300",
    email: "uwmedinfo@uw.edu",
    lat: 47.6504, lon: -122.3045,
    specialties: ["research", "teaching", "neurology", "oncology", "transplant"],
    services: {
      beds: 450,
      injections: ["flu", "travel vaccines", "MMR", "HPV"],
      care: {
        general: ["checkup", "blood test", "screening"],
        dental: ["oral surgery"],
        eye: ["vision test", "retinal screening", "lasik consult"],
        heart: ["cardiology", "heart failure clinic", "arrhythmia clinic"]
      },
      surgery: {
        eye: ["lasik", "cataract", "retinal surgery"],
        arm: ["tendon repair", "nerve repair"],
        leg: ["knee replacement", "hip replacement", "ACL repair"],
        heart: ["heart transplant", "bypass surgery", "valve replacement"]
      },
      other: ["research hospital", "transplant center", "cancer center"]
    },
    acceptsInsurance: ["Aetna", "BlueCross", "Medicare", "Medicaid", "UnitedHealthcare", "Kaiser"]
  },
  {
    name: "Seattle Children's Hospital",
    address: "4800 Sand Point Way NE, Seattle, WA 98105",
    phone: "+1-206-987-2000",
    email: "info@seattlechildrens.org",
    lat: 47.6548, lon: -122.2840,
    specialties: ["pediatrics", "neonatal", "children"],
    services: {
      beds: 407,
      injections: ["MMR", "DTaP", "polio", "flu", "HPV", "meningitis"],
      care: {
        general: ["pediatric checkup", "immunizations", "well-child visits"],
        dental: ["pediatric dentistry"],
        eye: ["pediatric eye exam", "vision screening"],
        heart: ["pediatric cardiology", "congenital heart care"]
      },
      surgery: {
        eye: ["pediatric eye surgery"],
        arm: ["pediatric orthopedics"],
        leg: ["pediatric orthopedics"],
        heart: ["pediatric heart surgery"]
      },
      other: ["NICU", "pediatric ICU", "child life services"]
    },
    acceptsInsurance: ["Aetna", "BlueCross", "Cigna", "Medicare", "Medicaid", "UnitedHealthcare"]
  },
  {
    name: "Virginia Mason Medical Center",
    address: "1100 9th Ave, Seattle, WA 98101",
    phone: "+1-206-223-6600",
    email: "info@virginiamason.org",
    lat: 47.6104, lon: -122.3242,
    specialties: ["general", "surgery", "gastroenterology"],
    services: {
      beds: 336,
      injections: ["flu", "pneumonia", "tetanus"],
      care: {
        general: ["checkup", "blood test", "colonoscopy"],
        dental: [],
        eye: ["vision test"],
        heart: ["cardiology", "heart monitoring"]
      },
      surgery: {
        eye: ["cataract"],
        arm: ["fracture repair"],
        leg: ["knee replacement"],
        heart: ["cardiac procedures"]
      },
      other: ["digestive disease center", "cancer center"]
    },
    acceptsInsurance: ["Aetna", "BlueCross", "Cigna", "UnitedHealthcare", "Premera"]
  },

  // Spokane Area
  {
    name: "Providence Sacred Heart Medical Center",
    address: "101 W 8th Ave, Spokane, WA 99204",
    phone: "+1-509-474-3131",
    email: "info@providence.org",
    lat: 47.6533, lon: -117.4165,
    specialties: ["cardiology", "trauma", "neurology", "general"],
    services: {
      beds: 679,
      injections: ["flu", "pneumonia", "shingles", "tetanus"],
      care: {
        general: ["checkup", "blood test", "x-ray"],
        dental: ["emergency dental"],
        eye: ["vision test", "emergency eye care"],
        heart: ["cardiology", "heart surgery", "cardiac rehab"]
      },
      surgery: {
        eye: ["cataract"],
        arm: ["fracture repair", "tendon repair"],
        leg: ["knee replacement", "hip replacement"],
        heart: ["bypass surgery", "valve surgery", "angioplasty"]
      },
      other: ["trauma center", "stroke center", "cancer center"]
    },
    acceptsInsurance: ["Aetna", "BlueCross", "Cigna", "Medicare", "Medicaid", "UnitedHealthcare"]
  },
  {
    name: "MultiCare Deaconess Hospital",
    address: "800 W 5th Ave, Spokane, WA 99204",
    phone: "+1-509-473-5800",
    email: "contact@multicare.org",
    lat: 47.6572, lon: -117.4166,
    specialties: ["general", "orthopedics", "women's health"],
    services: {
      beds: 352,
      injections: ["flu", "MMR", "tetanus"],
      care: {
        general: ["checkup", "blood test", "physical therapy"],
        dental: [],
        eye: ["vision test"],
        heart: ["cardiology", "stress test"]
      },
      surgery: {
        eye: ["cataract"],
        arm: ["fracture repair", "rotator cuff repair"],
        leg: ["knee replacement", "hip replacement", "ankle surgery"],
        heart: ["cardiac procedures"]
      },
      other: ["orthopedic center", "women's center", "pharmacy"]
    },
    acceptsInsurance: ["Aetna", "BlueCross", "Medicare", "Medicaid", "UnitedHealthcare", "Premera"]
  },

  // Tacoma Area
  {
    name: "MultiCare Tacoma General Hospital",
    address: "315 Martin Luther King Jr Way, Tacoma, WA 98405",
    phone: "+1-253-403-1000",
    email: "info@multicare.org",
    lat: 47.2480, lon: -122.4493,
    specialties: ["trauma", "burn center", "general"],
    services: {
      beds: 410,
      injections: ["flu", "tetanus", "hepatitis"],
      care: {
        general: ["checkup", "emergency care", "urgent care"],
        dental: ["emergency dental"],
        eye: ["emergency eye care"],
        heart: ["cardiology", "emergency cardiac care"]
      },
      surgery: {
        eye: ["emergency eye surgery"],
        arm: ["fracture repair", "burn treatment"],
        leg: ["fracture repair", "burn treatment"],
        heart: ["emergency cardiac surgery"]
      },
      other: ["trauma center", "burn center", "emergency room"]
    },
    acceptsInsurance: ["Aetna", "BlueCross", "Cigna", "Medicare", "Medicaid", "UnitedHealthcare"]
  },
  {
    name: "St. Joseph Medical Center Tacoma",
    address: "1717 S J St, Tacoma, WA 98405",
    phone: "+1-253-426-4101",
    email: "contact@chifranciscan.org",
    lat: 47.2392, lon: -122.4506,
    specialties: ["maternity", "women's health", "general"],
    services: {
      beds: 342,
      injections: ["flu", "MMR", "prenatal vaccines"],
      care: {
        general: ["checkup", "prenatal care", "postnatal care"],
        dental: [],
        eye: ["vision test"],
        heart: ["cardiology", "prenatal cardiac screening"]
      },
      surgery: {
        eye: ["cataract"],
        arm: ["fracture repair"],
        leg: ["knee replacement"],
        heart: ["cardiac procedures"]
      },
      other: ["maternity ward", "NICU", "women's center"]
    },
    acceptsInsurance: ["Aetna", "BlueCross", "Medicare", "UnitedHealthcare", "Premera"]
  },

  // Vancouver Area
  {
    name: "PeaceHealth Southwest Medical Center",
    address: "400 NE Mother Joseph Pl, Vancouver, WA 98664",
    phone: "+1-360-256-2000",
    email: "info@peacehealth.org",
    lat: 45.6409, lon: -122.6524,
    specialties: ["general", "emergency", "cardiology"],
    services: {
      beds: 450,
      injections: ["flu", "pneumonia", "shingles"],
      care: {
        general: ["checkup", "emergency care", "blood test"],
        dental: ["emergency dental"],
        eye: ["vision test", "emergency eye care"],
        heart: ["cardiology", "heart monitoring", "cardiac rehab"]
      },
      surgery: {
        eye: ["cataract"],
        arm: ["fracture repair"],
        leg: ["knee replacement", "hip replacement"],
        heart: ["bypass surgery", "angioplasty"]
      },
      other: ["emergency room", "cancer center", "pharmacy"]
    },
    acceptsInsurance: ["Aetna", "BlueCross", "Cigna", "Medicare", "Medicaid", "UnitedHealthcare"]
  },

  // Bellevue Area
  {
    name: "Overlake Medical Center",
    address: "1035 116th Ave NE, Bellevue, WA 98004",
    phone: "+1-425-688-5000",
    email: "info@overlakehospital.org",
    lat: 47.6151, lon: -122.1926,
    specialties: ["general", "maternity", "cardiology"],
    services: {
      beds: 349,
      injections: ["flu", "MMR", "tetanus", "prenatal vaccines"],
      care: {
        general: ["checkup", "blood test", "prenatal care"],
        dental: [],
        eye: ["vision test"],
        heart: ["cardiology", "echocardiogram", "stress test"]
      },
      surgery: {
        eye: ["cataract", "lasik"],
        arm: ["fracture repair"],
        leg: ["knee replacement", "hip replacement"],
        heart: ["cardiac procedures", "angioplasty"]
      },
      other: ["maternity ward", "cancer center", "pharmacy"]
    },
    acceptsInsurance: ["Aetna", "BlueCross", "Cigna", "Medicare", "UnitedHealthcare", "Premera"]
  },

  // Everett Area
  {
    name: "Providence Regional Medical Center Everett",
    address: "1321 Colby Ave, Everett, WA 98201",
    phone: "+1-425-261-2000",
    email: "contact@providence.org",
    lat: 47.9835, lon: -122.2014,
    specialties: ["general", "trauma", "cardiology"],
    services: {
      beds: 571,
      injections: ["flu", "pneumonia", "tetanus", "shingles"],
      care: {
        general: ["checkup", "emergency care", "blood test"],
        dental: ["emergency dental"],
        eye: ["vision test", "emergency eye care"],
        heart: ["cardiology", "cardiac surgery", "heart monitoring"]
      },
      surgery: {
        eye: ["cataract"],
        arm: ["fracture repair", "tendon repair"],
        leg: ["knee replacement", "hip replacement"],
        heart: ["bypass surgery", "valve replacement"]
      },
      other: ["trauma center", "stroke center", "cancer center"]
    },
    acceptsInsurance: ["Aetna", "BlueCross", "Cigna", "Medicare", "Medicaid", "UnitedHealthcare"]
  },

  // Olympia Area
  {
    name: "Providence St. Peter Hospital",
    address: "413 Lilly Rd NE, Olympia, WA 98506",
    phone: "+1-360-491-9480",
    email: "info@providence.org",
    lat: 47.0738, lon: -122.8515,
    specialties: ["general", "cardiology", "orthopedics"],
    services: {
      beds: 390,
      injections: ["flu", "pneumonia", "tetanus"],
      care: {
        general: ["checkup", "blood test", "x-ray"],
        dental: [],
        eye: ["vision test"],
        heart: ["cardiology", "echocardiogram", "cardiac rehab"]
      },
      surgery: {
        eye: ["cataract"],
        arm: ["fracture repair", "rotator cuff repair"],
        leg: ["knee replacement", "hip replacement"],
        heart: ["cardiac procedures"]
      },
      other: ["cancer center", "orthopedic center", "pharmacy"]
    },
    acceptsInsurance: ["Aetna", "BlueCross", "Medicare", "Medicaid", "UnitedHealthcare", "Premera"]
  },

  // Yakima Area
  {
    name: "Yakima Valley Memorial Hospital",
    address: "2811 Tieton Dr, Yakima, WA 98902",
    phone: "+1-509-575-8000",
    email: "info@yakimamemorial.org",
    lat: 46.5997, lon: -120.5629,
    specialties: ["general", "trauma", "maternity"],
    services: {
      beds: 226,
      injections: ["flu", "tetanus", "MMR"],
      care: {
        general: ["checkup", "emergency care", "prenatal care"],
        dental: ["emergency dental"],
        eye: ["vision test"],
        heart: ["cardiology", "stress test"]
      },
      surgery: {
        eye: ["cataract"],
        arm: ["fracture repair"],
        leg: ["knee replacement"],
        heart: ["cardiac procedures"]
      },
      other: ["emergency room", "maternity ward", "cancer center"]
    },
    acceptsInsurance: ["Aetna", "BlueCross", "Medicare", "Medicaid", "UnitedHealthcare"]
  },

  // Bellingham Area
  {
    name: "PeaceHealth St. Joseph Medical Center",
    address: "2901 Squalicum Pkwy, Bellingham, WA 98225",
    phone: "+1-360-734-5400",
    email: "info@peacehealth.org",
    lat: 48.7836, lon: -122.4908,
    specialties: ["general", "cardiology", "orthopedics"],
    services: {
      beds: 253,
      injections: ["flu", "pneumonia", "tetanus", "shingles"],
      care: {
        general: ["checkup", "blood test", "physical therapy"],
        dental: [],
        eye: ["vision test"],
        heart: ["cardiology", "echocardiogram", "cardiac rehab"]
      },
      surgery: {
        eye: ["cataract"],
        arm: ["fracture repair", "rotator cuff repair"],
        leg: ["knee replacement", "hip replacement"],
        heart: ["cardiac procedures"]
      },
      other: ["cancer center", "orthopedic center", "pharmacy"]
    },
    acceptsInsurance: ["Aetna", "BlueCross", "Cigna", "Medicare", "Medicaid", "UnitedHealthcare"]
  },

  // Specialty Clinics
  {
    name: "Seattle Eye Surgery Center",
    address: "2112 Third Ave, Seattle, WA 98121",
    phone: "+1-206-448-1230",
    email: "info@seattleeyesurgery.com",
    lat: 47.6145, lon: -122.3449,
    specialties: ["eye", "ophthalmology", "vision"],
    services: {
      beds: 0,
      injections: [],
      care: {
        general: [],
        dental: [],
        eye: ["comprehensive eye exam", "vision test", "glaucoma screening", "macular degeneration", "diabetic eye exam"],
        heart: []
      },
      surgery: {
        eye: ["lasik", "cataract surgery", "retinal surgery", "corneal transplant", "glaucoma surgery"],
        arm: [],
        leg: [],
        heart: []
      },
      other: ["optical shop", "contact lens fitting"]
    },
    acceptsInsurance: ["Aetna", "BlueCross", "Cigna", "VSP", "EyeMed", "UnitedHealthcare"]
  },
  {
    name: "Ballard Dental Arts",
    address: "5300 Tallman Ave NW, Seattle, WA 98107",
    phone: "+1-206-789-7800",
    email: "smile@ballarddentalarts.com",
    lat: 47.6687, lon: -122.3759,
    specialties: ["dental", "orthodontics"],
    services: {
      beds: 0,
      injections: [],
      care: {
        general: [],
        dental: ["cleaning", "filling", "root canal", "crown", "bridge", "extraction", "teeth whitening"],
        eye: [],
        heart: []
      },
      surgery: {
        eye: [],
        arm: [],
        leg: [],
        heart: []
      },
      other: ["dental lab", "orthodontics", "cosmetic dentistry"]
    },
    acceptsInsurance: ["Aetna", "BlueCross", "Cigna", "DeltaDental", "MetLife", "UnitedHealthcare"]
  },
  {
    name: "Northwest Heart & Vascular",
    address: "16259 Sylvester Rd SW, Seattle, WA 98166",
    phone: "+1-206-431-1111",
    email: "info@nwheart.com",
    lat: 47.4563, lon: -122.3524,
    specialties: ["heart", "cardiology", "vascular"],
    services: {
      beds: 0,
      injections: [],
      care: {
        general: [],
        dental: [],
        eye: [],
        heart: ["cardiology consultation", "echocardiogram", "stress test", "holter monitor", "EKG", "vascular ultrasound", "heart failure clinic"]
      },
      surgery: {
        eye: [],
        arm: [],
        leg: [],
        heart: ["angioplasty", "stent placement", "pacemaker", "defibrillator implant", "cardiac catheterization"]
      },
      other: ["cardiac rehab", "vascular center"]
    },
    acceptsInsurance: ["Aetna", "BlueCross", "Cigna", "Medicare", "UnitedHealthcare", "Premera"]
  },
  {
    name: "Seattle Orthopedic Center",
    address: "1101 Madison St #600, Seattle, WA 98104",
    phone: "+1-206-633-8100",
    email: "info@seattleorthopedic.com",
    lat: 47.6100, lon: -122.3190,
    specialties: ["orthopedics", "sports medicine"],
    services: {
      beds: 0,
      injections: ["cortisone injections"],
      care: {
        general: ["sports medicine", "physical therapy"],
        dental: [],
        eye: [],
        heart: []
      },
      surgery: {
        eye: [],
        arm: ["rotator cuff repair", "tennis elbow", "carpal tunnel", "fracture repair"],
        leg: ["ACL repair", "meniscus repair", "knee replacement", "hip replacement", "ankle surgery"],
        heart: []
      },
      other: ["physical therapy", "sports medicine", "MRI"]
    },
    acceptsInsurance: ["Aetna", "BlueCross", "Cigna", "Medicare", "UnitedHealthcare", "Premera"]
  },
  {
    name: "Washington Urgent Care - Capitol Hill",
    address: "201 16th Ave E, Seattle, WA 98112",
    phone: "+1-206-328-2100",
    email: "info@waurgentcare.com",
    lat: 47.6230, lon: -122.3109,
    specialties: ["urgent care", "walk-in"],
    services: {
      beds: 6,
      injections: ["flu", "tetanus", "MMR"],
      care: {
        general: ["walk-in care", "x-ray", "stitches", "minor injuries", "illness treatment"],
        dental: [],
        eye: ["minor eye injuries"],
        heart: []
      },
      surgery: {
        eye: [],
        arm: ["minor procedures"],
        leg: ["minor procedures"],
        heart: []
      },
      other: ["walk-in", "no appointment needed", "lab services"]
    },
    acceptsInsurance: ["Aetna", "BlueCross", "Cigna", "Medicare", "UnitedHealthcare"]
  }
];

await Hospital.deleteMany({});
await Hospital.insertMany(hospitals);
console.log(`✅ Successfully added ${hospitals.length} Washington hospitals and clinics`);
process.exit(0);