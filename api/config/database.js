// api/config/database.js
import 'dotenv/config';
import { Sequelize } from 'sequelize';
import pg from 'pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('Missing DATABASE_URL environment variable!');
}

const sequelize = new Sequelize(connectionString, {
  dialect: 'postgres',
  dialectModule: pg,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // for Neon, Heroku, etc.
    },
  },
  logging: false, // set to console.log for debugging
});

// verify & log
sequelize
  .authenticate()
  .then(() => {
    console.log('✅ Database connection established.');
  })
  .catch((err) => {
    console.error('❌ Unable to connect to the database:', err);
    process.exit(1);
  });

export default sequelize;
