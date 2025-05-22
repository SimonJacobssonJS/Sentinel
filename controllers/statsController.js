import { SensorData } from '../models/index.js';
import { fn, col } from 'sequelize';

const handleError = (res, err, code = 500) =>
  res.status(code).json({ status: 'error', message: err.message });

export const getStatsSummary = async (req, res) => {
  try {
    const totalEntries = await SensorData.count();

    const deviceCount = await SensorData.count({
      distinct: true,
      col: 'device_id',
    });

    const averages = await SensorData.findAll({
      attributes: [
        [fn('AVG', col('temperature')), 'avg_temperature'],
        [fn('AVG', col('humidity')), 'avg_humidity'],
        [fn('AVG', col('co2')), 'avg_co2'],
        [fn('AVG', col('co')), 'avg_co'],
        [fn('AVG', col('heart_rate')), 'avg_heart_rate'],
        [fn('AVG', col('noise_level')), 'avg_noise'],
        [fn('AVG', col('battery')), 'avg_battery'],
      ],
    });

    res.json({
      totalEntries,
      deviceCount,
      averages: averages[0] || {},
    });
  } catch (err) {
    handleError(res, err);
  }
};
