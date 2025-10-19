import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { username, password, name, dateOfBirth, address, insurance } = req.body;
    
    // Validate required fields
    if (!username || !password || !name || !dateOfBirth) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate address
    if (!address || !address.street || !address.city || !address.zipCode || !address.lat || !address.lon) {
      return res.status(400).json({ error: "Complete address is required" });
    }

    // Validate insurance
    if (!insurance || !insurance.provider || !insurance.policyNumber) {
      return res.status(400).json({ error: "Insurance information is required" });
    }

    // Check if username already exists
    const existingUser = await User.findOne({ username: username.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Create new user
    // NOTE: In production, ALWAYS hash passwords with bcrypt!
    // Example: const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username: username.toLowerCase(),
      password, // TODO: Hash this in production!
      name,
      dateOfBirth: new Date(dateOfBirth),
      address: {
        street: address.street,
        city: address.city,
        state: address.state || "WA",
        zipCode: address.zipCode,
        lat: parseFloat(address.lat),
        lon: parseFloat(address.lon)
      },
      insurance: {
        provider: insurance.provider,
        policyNumber: insurance.policyNumber
      }
    });

    await user.save();
    
    // Don't send password back
    const userResponse = {
      _id: user._id,
      username: user.username,
      name: user.name,
      dateOfBirth: user.dateOfBirth,
      address: user.address,
      insurance: user.insurance,
      createdAt: user.createdAt
    };
    
    res.status(201).json({ 
      message: "User created successfully", 
      user: userResponse 
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Registration failed: " + err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    // Find user (case-insensitive username)
    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Check password
    // NOTE: In production, use bcrypt.compare(password, user.password)
    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Don't send password back
    const userResponse = {
      _id: user._id,
      username: user.username,
      name: user.name,
      dateOfBirth: user.dateOfBirth,
      address: user.address,
      insurance: user.insurance,
      createdAt: user.createdAt
    };
    
    res.json({ 
      message: "Login successful", 
      user: userResponse 
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed: " + err.message });
  }
});

// Get user profile
router.get("/profile/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Validate userId format
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const user = await User.findById(userId).select("-password");
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json(user);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ error: "Failed to fetch profile: " + err.message });
  }
});

// Update user profile
router.put("/profile/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;
    
    // Validate userId format
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    // Don't allow password update through this route
    delete updates.password;
    delete updates.username; // Username shouldn't be changed
    
    // Validate coordinates if address is being updated
    if (updates.address) {
      if (updates.address.lat) {
        updates.address.lat = parseFloat(updates.address.lat);
      }
      if (updates.address.lon) {
        updates.address.lon = parseFloat(updates.address.lon);
      }
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    ).select("-password");
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json(user);
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ error: "Failed to update profile: " + err.message });
  }
});

// Check if username exists (useful for registration form)
router.get("/check-username/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const exists = await User.findOne({ username: username.toLowerCase() });
    res.json({ exists: !!exists });
  } catch (err) {
    console.error("Check username error:", err);
    res.status(500).json({ error: "Failed to check username" });
  }
});

export default router;