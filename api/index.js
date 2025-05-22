// api/index.js (Unified API route entry point for Vercel Hobby plan)

import express from 'express';
import serverless from 'serverless-http';
import {
  registerUser,
  loginUser,
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

import { authenticateToken } from '../middlewares/authenticateToken.js';
import validateSensorData from '../middlewares/validateSensorData.js';

const app = express();

app.use(express.json());

// --- Auth Routes ---
app.post('/auth/register', registerUser);
app.post('/auth/login', loginUser);
app.post('/auth/forgot-password', forgotPassword);
app.post('/auth/reset-password', resetPassword);

// --- Authenticated User Routes ---
app.get('/auth/me', authenticateToken, getMe);
app.patch('/auth/me', authenticateToken, updateMe);
app.delete('/auth/me', authenticateToken, deleteMe);

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

// --- Placeholder ---
app.get('/users', (req, res) => {
  res.send('respond with a resource');
});

// --- Root Route ---
app.get('/', (req, res) => {
  res.send('Express on Vercel');
});

// Export the wrapped app as default for Vercel
export default serverless(app);
