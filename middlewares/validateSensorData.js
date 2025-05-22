const validateSensorData = (req, res, next) => {
  const { device_id, timestamp, sensors } = req.body;
  const missingFields = [];

  // Top-level checks
  if (!device_id) missingFields.push('device_id');
  if (!timestamp) missingFields.push('timestamp');
  if (!sensors) {
    missingFields.push('sensors');
  } else {
    // Check required sensor fields
    if (sensors.temperature === undefined) missingFields.push('sensors.temperature');
    if (sensors.humidity === undefined) missingFields.push('sensors.humidity');
    if (!sensors.gas || sensors.gas.ppm === undefined) missingFields.push('sensors.gas.ppm');
    if (sensors.fall_detected === undefined) missingFields.push('sensors.fall_detected');
    if (sensors.heart_rate === undefined) missingFields.push('sensors.heart_rate');
    if (sensors.noise_level === undefined) missingFields.push('sensors.noise_level');
    if (sensors.steps === undefined) missingFields.push('sensors.steps');
    if (sensors.device_battery === undefined) missingFields.push('sensors.device_battery');
    if (sensors.watch_battery === undefined) missingFields.push('sensors.watch_battery');
  }

  // Invalid timestamp format
  if (timestamp && isNaN(Date.parse(timestamp))) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid timestamp format. Expected ISO 8601.'
    });
  }

  if (missingFields.length > 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Missing required fields',
      missing: missingFields
    });
  }

  next();
};

export default validateSensorData;
