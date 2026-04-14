const express = require('express');
const Doctor = require('../models/Doctor');

const router = express.Router();

// Utility functions
const parseTimeToMinutes = (t = "") => {
  const [time = "0:00", ampm = ""] = (t || "").split(" ");
  const [hh = 0, mm = 0] = time.split(":").map(Number);
  let h = hh % 12;
  if ((ampm || "").toUpperCase() === "PM") h += 12;
  return h * 60 + (mm || 0);
};

// GET all doctors
router.get('/', async (req, res) => {
  try {
    const { q = "", limit: limitRaw = 200, page: pageRaw = 1 } = req.query;
    const limit = Math.min(500, Math.max(1, parseInt(limitRaw, 10) || 200));
    const page = Math.max(1, parseInt(pageRaw, 10) || 1);
    const skip = (page - 1) * limit;

    const match = {};
    if (q && typeof q === "string" && q.trim()) {
      const re = new RegExp(q.trim(), "i");
      match.$or = [
        { name: re },
        { specialization: re },
        { email: re }
      ];
    }

    const docs = await Doctor.aggregate([
      { $match: match },
      { $sort: { name: 1 } },
      { $skip: skip },
      { $limit: limit }
    ]);

    const total = await Doctor.countDocuments(match);

    const normalized = docs.map((d) => ({
      _id: d._id,
      id: d._id,
      name: d.name || "Unknown",
      specialization: d.specialization || "",
      fee: d.fee ?? 0,
      imageUrl: d.imageUrl || d.image || null,
      availability: d.availability ?? "Available",
      schedule: (d.schedule && typeof d.schedule === "object") ? d.schedule : {},
      patients: d.patients ?? "",
      rating: d.rating ?? 0,
      about: d.about ?? "",
      experience: d.experience ?? "",
      qualifications: d.qualifications ?? "",
      location: d.location ?? "",
      success: d.success ?? ""
    }));

    return res.json({ success: true, data: normalized, meta: { page, limit, total } });
  } catch (err) {
    console.error("getDoctors:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET single doctor
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Doctor.findById(id);
    
    if (!doc) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    return res.json({
      success: true,
      data: {
        _id: doc._id,
        id: doc._id,
        name: doc.name || "",
        specialization: doc.specialization || "",
        fee: doc.fee ?? 0,
        imageUrl: doc.imageUrl || null,
        availability: doc.availability ?? "Available",
        schedule: doc.schedule || {},
        patients: doc.patients ?? "",
        rating: doc.rating ?? 0,
        about: doc.about ?? "",
        experience: doc.experience ?? "",
        qualifications: doc.qualifications ?? "",
        location: doc.location ?? "",
        success: doc.success ?? "",
        email: doc.email
      }
    });
  } catch (err) {
    console.error("getDoctor:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// Create doctor
router.post('/', async (req, res) => {
  try {
    const { email, password, name, specialization, experience, fee } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: "Email, password, and name are required" });
    }

    const existing = await Doctor.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }

    const doc = new Doctor({
      email: email.toLowerCase(),
      password,
      name,
      specialization: specialization || "",
      experience: experience || "",
      fee: fee ? Number(fee) : 0,
      availability: "Available"
    });

    await doc.save();

    return res.status(201).json({
      success: true,
      message: "Doctor created",
      data: {
        id: doc._id,
        name: doc.name,
        email: doc.email,
        specialization: doc.specialization
      }
    });
  } catch (err) {
    console.error("createDoctor:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
