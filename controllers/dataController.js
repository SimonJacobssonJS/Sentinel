import { SensorData } from '../models/index.js';
import { Op } from 'sequelize';

const handleError = (res, err, code = 500) =>
  res.status(code).json({ status: 'error', message: err.message });

// POST /api/data
export const createData = async (req, res) => {
  try {
    const { device_id, timestamp, sensors } = req.body;

    await SensorData.create({
      device_id,
      timestamp,
      temperature: sensors.temperature,
      humidity: sensors.humidity,
      gas: sensors.gas?.ppm,
      fall_detected: sensors.fall_detected,
      heart_rate: sensors.heart_rate,
      noise_level: sensors.noise_level,
      steps: sensors.steps,
      device_battery: sensors.device_battery,
      watch_battery: sensors.watch_battery,
    });

    res.status(201).json({
      status: 'success',
      message: 'Data saved successfully',
    });
  } catch (err) {
    handleError(res, err);
  }
};

// GET /api/data/latest
export const getLatestData = async (req, res) => {
  try {
    const [results] = await SensorData.sequelize.query(`
      SELECT sd.*
      FROM SensorData sd
      INNER JOIN (
        SELECT device_id, MAX(timestamp) AS latest
        FROM SensorData
        GROUP BY device_id
      ) AS latest_data
      ON sd.device_id = latest_data.device_id
      AND sd.timestamp = latest_data.latest
    `);

    res.json(results);
  } catch (err) {
    handleError(res, err);
  }
};

// GET /api/data/:device_id
export const getDeviceData = async (req, res) => {
  const { device_id } = req.params;
  let { start, end } = req.query;

  try {
    if (!start || !end) {
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      start = start || yesterday.toISOString();
      end = end || now.toISOString();
    }

    const data = await SensorData.findAll({
      where: {
        device_id,
        timestamp: {
          [Op.between]: [start, end],
        },
      },
      order: [['timestamp', 'DESC']],
    });

    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
};

// GET /api/alerts
export const getAlerts = async (req, res) => {
  try {
    const data = await SensorData.findAll({
      where: {
        [Op.or]: [
          { gas: { [Op.gt]: 1000 } },
          { noise_level: { [Op.gt]: 100 } },
          { fall_detected: true },
        ],
      },
      order: [['timestamp', 'DESC']],
    });

    const alerts = data
      .map((entry) => {
        if (entry.gas > 1000) {
          return {
            device_id: entry.device_id,
            type: 'gas',
            value: entry.gas,
            message: 'High gas level detected',
            timestamp: entry.timestamp,
          };
        } else if (entry.noise_level > 100) {
          return {
            device_id: entry.device_id,
            type: 'noise',
            value: entry.noise_level,
            message: 'High noise level detected',
            timestamp: entry.timestamp,
          };
        } else if (entry.fall_detected) {
          return {
            device_id: entry.device_id,
            type: 'fall',
            value: null,
            message: 'Fall detected',
            timestamp: entry.timestamp,
          };
        }
        return null;
      })
      .filter(Boolean);

    res.json(alerts);
  } catch (err) {
    handleError(res, err);
  }
};
