export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      // credentials & identity
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      password: {
        type: DataTypes.STRING, // store the bcrypt hash here
        allowNull: true,
      },
    },
    {
      tableName: 'users', // explicit table name
      timestamps: true, // adds createdAt / updatedAt columns
      underscored: true, // uses snake_case in DB columns
      defaultScope: {
        // hide password unless explicitly requested (e.g. for auth flow)
        attributes: { exclude: ['password'] },
      },
    }
  );

  /* You can add associations here if needed, e.g.
     User.hasMany(models.SensorData, { foreignKey: 'user_id' });
  */

  return User;
};
