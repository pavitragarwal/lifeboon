import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema({
  name: String,
  address: String,
  phone: String,
  email: String,
  lat: Number,
  lon: Number,
  services: {
    beds: Number,
    injections: [String],
    care: {
      general: [String],
      dental: [String],
      eye: [String],
    },
    surgery: {
      eye: [String],
      arm: [String],
      leg: [String],
    },
    other: [String],
  },
  acceptsInsurance: [String],
  lastUpdated: { type: Date, default: Date.now }
});

export default mongoose.model("Hospital", hospitalSchema);