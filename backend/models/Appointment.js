import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: [true, "User ID is required"],
    index: true
  },
  hospitalId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Hospital", 
    required: [true, "Hospital ID is required"],
    index: true
  },
  patientName: { 
    type: String,
    required: [true, "Patient name is required"],
    trim: true
  },
  appointmentDate: { 
    type: Date, 
    required: [true, "Appointment date is required"],
    index: true
  },
  appointmentTime: { 
    type: String, 
    required: [true, "Appointment time is required"],
    validate: {
      validator: function(v) {
        // Validate time format HH:MM
        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: props => `${props.value} is not a valid time format! Use HH:MM`
    }
  },
  serviceType: { 
    type: String,
    required: [true, "Service type is required"],
    enum: {
      values: ["consultation", "checkup", "emergency", "surgery", "followup", "screening", "vaccination"],
      message: "{VALUE} is not a valid service type"
    }
  },
  specialty: { 
    type: String,
    default: "general",
    lowercase: true
  },
  notes: { 
    type: String,
    maxlength: [500, "Notes cannot exceed 500 characters"]
  },
  status: { 
    type: String, 
    default: "scheduled", 
    enum: {
      values: ["scheduled", "completed", "cancelled", "no-show"],
      message: "{VALUE} is not a valid status"
    },
    index: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for checking conflicts
appointmentSchema.index({ hospitalId: 1, appointmentDate: 1, appointmentTime: 1, status: 1 });

// Index for user queries
appointmentSchema.index({ userId: 1, appointmentDate: 1 });

// Pre-save middleware to update updatedAt
appointmentSchema.pre("save", function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual to check if appointment is upcoming
appointmentSchema.virtual("isUpcoming").get(function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return this.appointmentDate >= today && this.status === "scheduled";
});

// Method to format appointment date
appointmentSchema.methods.formatDate = function() {
  return this.appointmentDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};

// Static method to check for conflicts
appointmentSchema.statics.checkConflict = async function(hospitalId, date, time) {
  const conflict = await this.findOne({
    hospitalId: hospitalId,
    appointmentDate: date,
    appointmentTime: time,
    status: "scheduled"
  });
  return !!conflict;
};

export default mongoose.model("Appointment", appointmentSchema);