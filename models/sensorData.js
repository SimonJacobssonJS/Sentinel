export default (sequelize, DataTypes) => {
  const SensorData = sequelize.define(
    'SensorData',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      device_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      temperature: DataTypes.FLOAT,
      humidity: DataTypes.INTEGER,
      gas: DataTypes.INTEGER,
      fall_detected: DataTypes.BOOLEAN,
      heart_rate: DataTypes.INTEGER,
      noise_level: DataTypes.INTEGER,
      steps: DataTypes.INTEGER,
      device_battery: DataTypes.INTEGER,
      watch_battery: DataTypes.INTEGER,
    },
    {
      tableName: 'SensorData',
      timestamps: false, // or true, if you want createdAt/updatedAt
    }
  );

  return SensorData;
};
