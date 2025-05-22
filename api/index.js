// routes/api.js (Unified routes for Vercel-compatible single API endpoint)

import express from 'express';
import {
  loginUser,
  registerUser,
  getMe,
  updateMe,
  deleteMe,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';

import {
  createData,
  getLatestData,
  getDeviceData,
  getAlerts,
} from '../controllers/dataController.js';

import { getStatsSummary } from '../controllers/statsController.js';

import validateSensorData from '../middlewares/validateSensorData.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';

const app = express();

app.use(express.json()); // Middleware for JSON parsing

// --- Auth Routes ---
app.post('/auth/register', registerUser);
app.post('/auth/login', loginUser);

// --- User Profile Routes ---
app.get('/auth/me', authenticateToken, getMe);
app.patch('/auth/me', authenticateToken, updateMe);
app.delete('/auth/me', authenticateToken, deleteMe);

// --- Password Reset Routes ---
app.post('/auth/forgot-password', forgotPassword);
app.post('/auth/reset-password', resetPassword);

// --- Sensor Data Routes ---
app.post('/data', validateSensorData, createData);
app.get('/data/latest', getLatestData);
app.get('/data/:device_id', getDeviceData);
app.get('/alerts', getAlerts);

// --- Stats Summary Route ---
app.get('/stats/summary', getStatsSummary);

// --- Secure Info ---
app.get('/secure-info', authenticateToken, (req, res) => {
  res.json({
    message: `This is protected data for ${req.user.username}`,
    data: {
      sensorReading: 42,
      timestamp: new Date().toISOString(),
    },
  });
});

// --- Users Route Placeholder ---
app.get('/users', (req, res) => {
  res.send('respond with a resource');
});

// --- Root Route ---
app.get('/', (req, res) => {
  res.send('Express on Vercel');
});

export default app;
