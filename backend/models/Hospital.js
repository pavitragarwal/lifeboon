import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Hospital name is required"],
    trim: true
  },
  address: { 
    type: String, 
    required: [true, "Address is required"] 
  },
  phone: { 
    type: String, 
    required: [true, "Phone number is required"]
    // Removed strict validation - phone formats vary too much
  },
  email: { 
    type: String,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: props => `${props.value} is not a valid email!`
    }
  },
  lat: { 
    type: Number, 
    required: [true, "Latitude is required"],
    min: [-90, "Invalid latitude"],
    max: [90, "Invalid latitude"],
    index: true
  },
  lon: { 
    type: Number, 
    required: [true, "Longitude is required"],
    min: [-180, "Invalid longitude"],
    max: [180, "Invalid longitude"],
    index: true
  },
  specialties: {
    type: [String],
    default: [],
    lowercase: true,
    index: true
  },
  services: {
    beds: { 
      type: Number, 
      default: 0,
      min: [0, "Beds cannot be negative"]
    },
    injections: {
      type: [String],
      default: [],
      lowercase: true
    },
    care: {
      general: { type: [String], default: [] },
      dental: { type: [String], default: [] },
      eye: { type: [String], default: [] },
      heart: { type: [String], default: [] }
    },
    surgery: {
      eye: { type: [String], default: [] },
      arm: { type: [String], default: [] },
      leg: { type: [String], default: [] },
      heart: { type: [String], default: [] }
    },
    other: {
      type: [String],
      default: []
    }
  },
  acceptsInsurance: {
    type: [String],
    default: [],
    index: true
  },
  lastUpdated: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

// Compound index for geospatial queries
hospitalSchema.index({ lat: 1, lon: 1 });

// Index for specialty searches
hospitalSchema.index({ specialties: 1 });

// Method to check if hospital accepts insurance
hospitalSchema.methods.acceptsInsuranceProvider = function(provider) {
  return this.acceptsInsurance.some(ins => 
    ins.toLowerCase().includes(provider.toLowerCase())
  );
};

// Static method to find hospitals near a location
hospitalSchema.statics.findNearLocation = async function(lat, lon, radiusMiles) {
  const hospitals = await this.find();
  
  return hospitals.filter(hospital => {
    const distance = calculateDistance(lat, lon, hospital.lat, hospital.lon);
    return distance <= radiusMiles;
  });
};

// Helper function for distance calculation
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export default mongoose.model("Hospital", hospitalSchema);