// models/index.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; // ← use your single, correctly-configured instance

// Required for ESM __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = {};

// Dynamically import and initialize all model files in this directory
for (const file of fs.readdirSync(__dirname)) {
  if (
    file === path.basename(__filename) ||
    !file.endsWith('.js') ||
    file.endsWith('.test.js')
  )
    continue;

  // Each model file should `export default (sequelize, DataTypes) => { … }`
  const { default: defineModel } = await import(path.join(__dirname, file));
  const model = defineModel(sequelize, DataTypes);
  db[model.name] = model;
}

// If any models define associations, set them up
Object.keys(db).forEach((modelName) => {
  if (typeof db[modelName].associate === 'function') {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
export const { SensorData } = db;
