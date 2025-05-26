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
        allowNull: true, // ok for migration; we’ll backfill
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true, // ok for migration
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true, // ok for migration
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'users',
      timestamps: false, // we manage created_at/updated_at manually
      underscored: true,
      defaultScope: {
        attributes: { exclude: ['password'] },
      },
      scopes: {
        withPassword: {
          // a named scope that includes password
          attributes: [
            'id',
            'username',
            'email',
            'password',
            'created_at',
            'updated_at',
          ],
        },
      },
    }
  );

  // update updated_at on every save
  User.addHook('beforeUpdate', (user) => {
    user.updated_at = new Date();
  });

  return User;
};
