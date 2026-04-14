const express = require('express');
const serviceAppointment = require('../models/serviceAppointment');

const router = express.Router();

// GET all service appointments
router.get('/', async (req, res) => {
  try {
    const appointments = await serviceAppointment.find().lean();
    return res.json({ success: true, data: appointments });
  } catch (err) {
    console.error("getServiceAppointments:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET service appointments by service
router.get('/service/:serviceId', async (req, res) => {
  try {
    const { serviceId } = req.params;
    const appointments = await serviceAppointment.find({ serviceId }).lean();
    return res.json({ success: true, data: appointments });
  } catch (err) {
    console.error("getServiceAppointmentsByService:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// Create service appointment
router.post('/', async (req, res) => {
  try {
    const { serviceId, customerName, customerEmail, date, time, note } = req.body;

    if (!serviceId || !customerName || !customerEmail || !date || !time) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const appointment = new serviceAppointment({
      serviceId,
      customerName,
      customerEmail,
      date,
      time,
      note: note || "",
      status: "Pending",
      createdAt: new Date()
    });

    await appointment.save();

    return res.status(201).json({
      success: true,
      message: "Service appointment created",
      data: appointment
    });
  } catch (err) {
    console.error("createServiceAppointment:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// Update service appointment
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required" });
    }

    const appointment = await serviceAppointment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Service appointment not found" });
    }

    return res.json({ success: true, data: appointment });
  } catch (err) {
    console.error("updateServiceAppointment:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
