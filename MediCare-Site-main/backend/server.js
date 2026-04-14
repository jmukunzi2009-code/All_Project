const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection - Try MongoDB first, if unavailable use in-memory mock
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/medicare';
let mongoConnected = false;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  mongoConnected = true;
  console.log('✓ MongoDB connected');
})
.catch(err => {
  console.warn('⚠ MongoDB connection failed:', err.message);
  console.log('⚠ Running in mock/offline mode');
});

// Routes
const doctorsRoute = require('./routes/doctors');
const appointmentsRoute = require('./routes/appointments');
const servicesRoute = require('./routes/services');
const serviceAppointmentsRoute = require('./routes/serviceAppointments');

app.use('/api/doctors', doctorsRoute);
app.use('/api/appointments', appointmentsRoute);
app.use('/api/services', servicesRoute);
app.use('/api/service-appointments', serviceAppointmentsRoute);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server is running', 
    mongodb: mongoConnected ? 'connected' : 'disconnected',
    timestamp: new Date() 
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'MediCare API Server',
    version: '1.0.0',
    endpoints: [
      '/api/doctors',
      '/api/appointments',
      '/api/services',
      '/api/service-appointments',
      '/api/health'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`\n✓ MediCare API Server running on http://localhost:${PORT}`);
  console.log(`✓ API available at http://localhost:${PORT}/api`);
  console.log(`✓ Health check: http://localhost:${PORT}/api/health\n`);
});
