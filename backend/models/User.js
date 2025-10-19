import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: [true, "Username is required"],
    unique: true,
    lowercase: true,
    trim: true,
    minlength: [3, "Username must be at least 3 characters"],
    maxlength: [30, "Username cannot exceed 30 characters"]
  },
  password: { 
    type: String, 
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"]
    // NOTE: In production, this should be hashed with bcrypt!
  },
  name: { 
    type: String, 
    required: [true, "Name is required"],
    trim: true
  },
  dateOfBirth: { 
    type: Date, 
    required: [true, "Date of birth is required"]
  },
  address: {
    street: { 
      type: String, 
      required: [true, "Street address is required"] 
    },
    city: { 
      type: String, 
      required: [true, "City is required"] 
    },
    state: { 
      type: String, 
      default: "WA" 
    },
    zipCode: { 
      type: String, 
      required: [true, "Zip code is required"] 
    },
    lat: { 
      type: Number, 
      required: [true, "Latitude is required"],
      min: [-90, "Invalid latitude"],
      max: [90, "Invalid latitude"]
    },
    lon: { 
      type: Number, 
      required: [true, "Longitude is required"],
      min: [-180, "Invalid longitude"],
      max: [180, "Invalid longitude"]
    }
  },
  insurance: {
    provider: { 
      type: String, 
      required: [true, "Insurance provider is required"] 
    },
    policyNumber: { 
      type: String, 
      required: [true, "Policy number is required"] 
    }
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Index for faster queries
userSchema.index({ username: 1 });
userSchema.index({ "address.lat": 1, "address.lon": 1 });

// Virtual for age calculation
userSchema.virtual("age").get(function() {
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Method to get user without password
userSchema.methods.toSafeObject = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model("User", userSchema);