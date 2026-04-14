const express = require('express');
const Appointment = require('../models/Appointment');

const router = express.Router();

// GET all appointments
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find().lean();
    return res.json({ success: true, data: appointments });
  } catch (err) {
    console.error("getAppointments:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET appointments by doctor
router.get('/doctor/:doctorId', async (req, res) => {
  try {
    const { doctorId } = req.params;
    const appointments = await Appointment.find({ doctorId }).lean();
    return res.json({ success: true, data: appointments });
  } catch (err) {
    console.error("getAppointmentsByDoctor:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// Create appointment
router.post('/', async (req, res) => {
  try {
    const { doctorId, patientName, patientEmail, date, time, reason } = req.body;

    if (!doctorId || !patientName || !patientEmail || !date || !time) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const appointment = new Appointment({
      doctorId,
      patientName,
      patientEmail,
      date,
      time,
      reason: reason || "",
      status: "Pending",
      createdAt: new Date()
    });

    await appointment.save();

    return res.status(201).json({
      success: true,
      message: "Appointment created",
      data: appointment
    });
  } catch (err) {
    console.error("createAppointment:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// Update appointment status
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required" });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    return res.json({ success: true, data: appointment });
  } catch (err) {
    console.error("updateAppointment:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
