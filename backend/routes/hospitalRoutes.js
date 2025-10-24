import express from "express";
import Hospital from "../models/Hospital.js";

const router = express.Router();

// GET all hospitals
router.get("/", async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.json(hospitals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single hospital by ID
router.get("/:id", async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) return res.status(404).json({ error: "Hospital not found" });
    res.json(hospital);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create new hospital
router.post("/", async (req, res) => {
  try {
    const hospital = new Hospital(req.body);
    await hospital.save();
    res.status(201).json(hospital);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;