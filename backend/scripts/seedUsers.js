// backend/scripts/seedUsers.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/lifeboon";

await mongoose.connect(MONGO_URI);
console.log("✅ Connected to MongoDB for seeding users");

const users = [
  {
    username: "john_seattle",
    password: "password123",
    name: "John Anderson",
    dateOfBirth: new Date("1985-03-15"),
    address: {
      street: "1234 Pike St",
      city: "Seattle",
      state: "WA",
      zipCode: "98101",
      lat: 47.6097,
      lon: -122.3331
    },
    insurance: {
      provider: "BlueCross",
      policyNumber: "BC-1234567"
    }
  },
  {
    username: "sarah_spokane",
    password: "password123",
    name: "Sarah Martinez",
    dateOfBirth: new Date("1990-07-22"),
    address: {
      street: "567 Riverside Ave",
      city: "Spokane",
      state: "WA",
      zipCode: "99201",
      lat: 47.6588,
      lon: -117.4260
    },
    insurance: {
      provider: "Aetna",
      policyNumber: "AE-9876543"
    }
  },
  {
    username: "mike_tacoma",
    password: "password123",
    name: "Michael Chen",
    dateOfBirth: new Date("1978-11-30"),
    address: {
      street: "890 Pacific Ave",
      city: "Tacoma",
      state: "WA",
      zipCode: "98402",
      lat: 47.2529,
      lon: -122.4443
    },
    insurance: {
      provider: "UnitedHealthcare",
      policyNumber: "UH-5551234"
    }
  },
  {
    username: "emily_bellevue",
    password: "password123",
    name: "Emily Johnson",
    dateOfBirth: new Date("1995-05-18"),
    address: {
      street: "234 Bellevue Way NE",
      city: "Bellevue",
      state: "WA",
      zipCode: "98004",
      lat: 47.6101,
      lon: -122.2015
    },
    insurance: {
      provider: "Kaiser",
      policyNumber: "KP-7778888"
    }
  },
  {
    username: "david_vancouver",
    password: "password123",
    name: "David Wilson",
    dateOfBirth: new Date("1982-09-08"),
    address: {
      street: "456 Main St",
      city: "Vancouver",
      state: "WA",
      zipCode: "98660",
      lat: 45.6387,
      lon: -122.6615
    },
    insurance: {
      provider: "Cigna",
      policyNumber: "CG-3334444"
    }
  },
  {
    username: "lisa_everett",
    password: "password123",
    name: "Lisa Thompson",
    dateOfBirth: new Date("1988-12-25"),
    address: {
      street: "789 Broadway",
      city: "Everett",
      state: "WA",
      zipCode: "98201",
      lat: 47.9790,
      lon: -122.2021
    },
    insurance: {
      provider: "Medicare",
      policyNumber: "MC-9990000"
    }
  },
  {
    username: "robert_olympia",
    password: "password123",
    name: "Robert Davis",
    dateOfBirth: new Date("1975-04-12"),
    address: {
      street: "321 Capitol Way",
      city: "Olympia",
      state: "WA",
      zipCode: "98501",
      lat: 47.0379,
      lon: -122.9007
    },
    insurance: {
      provider: "Premera",
      policyNumber: "PR-1112222"
    }
  },
  {
    username: "maria_yakima",
    password: "password123",
    name: "Maria Rodriguez",
    dateOfBirth: new Date("1992-08-19"),
    address: {
      street: "654 Yakima Ave",
      city: "Yakima",
      state: "WA",
      zipCode: "98901",
      lat: 46.6021,
      lon: -120.5059
    },
    insurance: {
      provider: "Medicaid",
      policyNumber: "MD-4445555"
    }
  },
  {
    username: "james_bellingham",
    password: "password123",
    name: "James Taylor",
    dateOfBirth: new Date("1980-02-28"),
    address: {
      street: "987 Cornwall Ave",
      city: "Bellingham",
      state: "WA",
      zipCode: "98225",
      lat: 48.7519,
      lon: -122.4787
    },
    insurance: {
      provider: "BlueCross",
      policyNumber: "BC-6667777"
    }
  },
  {
    username: "amanda_renton",
    password: "password123",
    name: "Amanda Brown",
    dateOfBirth: new Date("1993-06-14"),
    address: {
      street: "147 S 3rd St",
      city: "Renton",
      state: "WA",
      zipCode: "98055",
      lat: 47.4829,
      lon: -122.2171
    },
    insurance: {
      provider: "Aetna",
      policyNumber: "AE-8889999"
    }
  }
];

await User.deleteMany({});
await User.insertMany(users);
console.log(`✅ Successfully added ${users.length} test users across Washington`);
console.log("\n📝 Test Users Created:");
users.forEach(user => {
  console.log(`   Username: ${user.username} | Password: password123 | Location: ${user.address.city}`);
});
process.exit(0);