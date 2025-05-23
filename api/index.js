// models/index.js
// Centralized Sequelize model loader with proper file:// URLs for dynamic imports

import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import sequelize from '../config/database.js';
import { Sequelize, DataTypes } from 'sequelize';

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);

const db = {};

// Dynamically load all model definition files
const modelFiles = fs
  .readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.endsWith('.js') &&
      !file.endsWith('.test.js')
  );

for (const file of modelFiles) {
  const filePath = path.join(__dirname, file);
  const fileUrl = pathToFileURL(filePath).href;
  // Import the model definition via a file:// URL
  const { default: defineModel } = await import(fileUrl);
  const model = defineModel(sequelize, DataTypes);
  db[model.name] = model;
}

// Apply associations if defined
for (const modelName of Object.keys(db)) {
  if (typeof db[modelName].associate === 'function') {
    db[modelName].associate(db);
  }
}

// Expose Sequelize instance and library
db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
export const { SensorData } = db;
