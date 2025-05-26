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
        allowNull: true, // temporarily allow null for existing rows
        unique: true,
        // remove the built-in isEmail validation to prevent migration errors
        // we'll add stricter validation once the schema is clean
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true, // allow existing rows to stay NULL
      },

      // explicitly allow null timestamps to avoid migration errors
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
      timestamps: true, // Sequelize will auto-manage these fields
      underscored: true, // snake_case column names
      defaultScope: {
        attributes: { exclude: ['password'] },
      },
    }
  );

  return User;
};
