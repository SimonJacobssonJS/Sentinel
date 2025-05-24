import { Sequelize } from "sequelize";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file
// console.log("DATABASE_URL:", process.env.DATABASE_URL);
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectModule: pg,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // needed for some Neon deployments
    },
  },
  logging: false,
});

// const sequelize = new Sequelize({
//   dialect: "postgres",
//   dialectModule: pg,
//   url: process.env.DATABASE_URL
//   host: process.env.PG_HOST || "localhost",
//   port: process.env.DB_PORT || 5432,
//   database: process.env.PGDATABASE || "Sentinel",
//   username: process.env.PGUSER || "your_pg_user",
//   password: process.env.PGPASSWORD || "your_pg_password",
//   logging: false,
// });

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

export default sequelize;
