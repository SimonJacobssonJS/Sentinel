import fs from "fs";
import path from "path";
import Sequelize from "sequelize";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import sequelize from "../config/database.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const basename = path.basename(__filename);

const db = {};

// 🔌 Connect to DB
// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASS,
//   {
//     host: process.env.DB_HOST,
//     dialect: process.env.DB_DIALECT,
//     logging: false
//   }
// );

// 🚀 Load models dynamically
const modelFiles = fs
  .readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
  );

for (const file of modelFiles) {
  const { default: modelDef } = await import(`./${file}`);
  const model = modelDef(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
}

// 🔗 Define associations if any
for (const modelName of Object.keys(db)) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// 🔄 Auto-sync models to DB (adds missing columns)
await sequelize.sync({ alter: true }); // <- This line enables live schema sync

export default db;
export const { SensorData } = db;
