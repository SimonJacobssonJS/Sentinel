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
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true, // will backfill and then set false later
      },

      // manual timestamp fields; allow null initially to avoid migration errors
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'users',
      timestamps: false, // disable auto timestamps to avoid ALTER on them
      underscored: true, // keep snake_case column names
      defaultScope: {
        attributes: { exclude: ['password'] },
      },
      hooks: {
        beforeUpdate: (user) => {
          user.updated_at = new Date();
        },
      },
    }
  );

  return User;
};
