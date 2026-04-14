const express = require('express');
const Service = require('../models/Service');

const router = express.Router();

// GET all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find().lean();
    return res.json({ success: true, data: services });
  } catch (err) {
    console.error("getServices:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET single service
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id).lean();

    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    return res.json({ success: true, data: service });
  } catch (err) {
    console.error("getService:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// Create service
router.post('/', async (req, res) => {
  try {
    const { name, shortDescription, price, availability } = req.body;

    if (!name || !shortDescription || price === undefined) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const service = new Service({
      name,
      shortDescription,
      about: shortDescription,
      price: Number(price),
      availability: availability || "available",
      createdAt: new Date()
    });

    await service.save();

    return res.status(201).json({
      success: true,
      message: "Service created",
      data: service
    });
  } catch (err) {
    console.error("createService:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
