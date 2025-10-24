import express from "express";
import Appointment from "../models/Appointment.js";
import mongoose from "mongoose";

const router = express.Router();

// Create appointment
router.post("/", async (req, res) => {
  try {
    const { 
      userId, 
      hospitalId, 
      patientName,
      appointmentDate, 
      appointmentTime, 
      serviceType, 
      specialty, 
      notes 
    } = req.body;
    
    // Validate required fields
    if (!userId || !hospitalId || !appointmentDate || !appointmentTime || !serviceType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(hospitalId)) {
      return res.status(400).json({ error: "Invalid user ID or hospital ID" });
    }

    // Parse date
    const parsedDate = new Date(appointmentDate);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    // Check if date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (parsedDate < today) {
      return res.status(400).json({ error: "Cannot book appointments in the past" });
    }

    // Normalize date to midnight
    parsedDate.setHours(0, 0, 0, 0);

    // Check for conflicts
    const existingAppointment = await Appointment.findOne({
      hospitalId: new mongoose.Types.ObjectId(hospitalId),
      appointmentDate: parsedDate,
      appointmentTime: appointmentTime,
      status: "scheduled"
    });
    
    if (existingAppointment) {
      return res.status(409).json({ 
        error: "Time slot already booked", 
        conflict: true 
      });
    }

    // Create appointment
    const appointment = new Appointment({
      userId: new mongoose.Types.ObjectId(userId),
      hospitalId: new mongoose.Types.ObjectId(hospitalId),
      patientName: patientName || "Patient",
      appointmentDate: parsedDate,
      appointmentTime: appointmentTime,
      serviceType: serviceType,
      specialty: specialty || "general",
      notes: notes || "",
      status: "scheduled"
    });

    await appointment.save();
    
    // Populate hospital and user data
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate("hospitalId")
      .populate("userId", "-password");
    
    res.status(201).json(populatedAppointment);
  } catch (err) {
    console.error("Create appointment error:", err);
    res.status(500).json({ error: "Failed to create appointment: " + err.message });
  }
});

// Get all appointments for a user
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const appointments = await Appointment.find({ 
      userId: new mongoose.Types.ObjectId(userId)
    })
      .populate("hospitalId")
      .sort({ appointmentDate: 1, appointmentTime: 1 });
    
    res.json(appointments);
  } catch (err) {
    console.error("Get appointments error:", err);
    res.status(500).json({ error: "Failed to fetch appointments: " + err.message });
  }
});

// Get upcoming appointments for a user
router.get("/user/:userId/upcoming", async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const appointments = await Appointment.find({ 
      userId: new mongoose.Types.ObjectId(userId),
      appointmentDate: { $gte: today },
      status: "scheduled"
    })
      .populate("hospitalId")
      .sort({ appointmentDate: 1, appointmentTime: 1 });
    
    res.json(appointments);
  } catch (err) {
    console.error("Get upcoming appointments error:", err);
    res.status(500).json({ error: "Failed to fetch upcoming appointments: " + err.message });
  }
});

// Cancel appointment
router.delete("/:appointmentId", async (req, res) => {
  try {
    const { appointmentId } = req.params;
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({ error: "Invalid appointment ID format" });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status: "cancelled" },
      { new: true }
    ).populate("hospitalId");
    
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    
    res.json({ 
      message: "Appointment cancelled successfully", 
      appointment 
    });
  } catch (err) {
    console.error("Cancel appointment error:", err);
    res.status(500).json({ error: "Failed to cancel appointment: " + err.message });
  }
});

// Check available time slots
router.get("/available/:hospitalId/:date", async (req, res) => {
  try {
    const { hospitalId, date } = req.params;
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(hospitalId)) {
      return res.status(400).json({ error: "Invalid hospital ID format" });
    }

    // Parse and validate date
    const appointmentDate = new Date(date);
    if (isNaN(appointmentDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    // Normalize to midnight
    appointmentDate.setHours(0, 0, 0, 0);
    
    // Get all booked appointments for that day
    const bookedAppointments = await Appointment.find({
      hospitalId: new mongoose.Types.ObjectId(hospitalId),
      appointmentDate: appointmentDate,
      status: "scheduled"
    }).select("appointmentTime");
    
    const bookedTimes = bookedAppointments.map(apt => apt.appointmentTime);
    
    // Generate all possible time slots (9 AM - 5 PM, 30 min intervals)
    const allTimeSlots = [];
    for (let hour = 9; hour < 17; hour++) {
      allTimeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
      allTimeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    
    const availableSlots = allTimeSlots.filter(slot => !bookedTimes.includes(slot));
    
    res.json({ 
      date: date,
      availableSlots, 
      bookedSlots: bookedTimes,
      totalSlots: allTimeSlots.length,
      availableCount: availableSlots.length
    });
  } catch (err) {
    console.error("Get available slots error:", err);
    res.status(500).json({ error: "Failed to fetch available slots: " + err.message });
  }
});

// Get appointment by ID
router.get("/:appointmentId", async (req, res) => {
  try {
    const { appointmentId } = req.params;
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({ error: "Invalid appointment ID format" });
    }

    const appointment = await Appointment.findById(appointmentId)
      .populate("hospitalId")
      .populate("userId", "-password");
    
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    
    res.json(appointment);
  } catch (err) {
    console.error("Get appointment error:", err);
    res.status(500).json({ error: "Failed to fetch appointment: " + err.message });
  }
});

export default router;