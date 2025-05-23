// config/database.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT || 'postgres', // default to postgres
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'Sentinel',
  username: process.env.DB_USER || 'your_pg_user',
  password: process.env.DB_PASSWORD || 'your_pg_password',
  logging: false,
});

sequelize
  .authenticate()
  .then(() => console.log('✅ DB connection established'))
  .catch((err) => {
    console.error('❌ DB connection failed:', err);
    process.exit(1);
  });

export default sequelize;
