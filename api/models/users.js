// api/models/user.js

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

      // password can initially be null for existing rows
      password: {
        type: DataTypes.STRING, // store the bcrypt hash here
        allowNull: true,
      },

      // explicitly allow null timestamps to avoid sync errors
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'users', // explicit table name
      timestamps: true, // auto-manage created_at & updated_at
      underscored: true, // uses snake_case in DB columns
      defaultScope: {
        // hide password unless explicitly requested
        attributes: { exclude: ['password'] },
      },
    }
  );

  /* You can add associations here if needed, e.g.
     User.hasMany(models.SensorData, { foreignKey: 'user_id' });
  */

  return User;
};
