// api/config/database.js
import 'dotenv/config'; // detta laddar .env direkt
import { Sequelize } from 'sequelize';
import pg from 'pg';
console.log('DATABASE_URL:', process.env.DATABASE_URL);
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectModule: pg,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // for Neon, Heroku, etc.
    },
  },
  logging: false,
});
sequelize
  .authenticate()
  .then(() => {
    console.log(':white_check_mark: Database connection established.');
  })
  .catch((err) => {
    console.error(':x: Unable to connect to the database:', err);
    process.exit(1);
  });
export default sequelize;
