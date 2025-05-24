import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import router from "./routes.js";
// import usersRouter from "./routes/users.js";
// import dataRoutes from "./routes/data.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
// import authRoutes from "./routes/auth.js";
import dotenv from "dotenv";
import cors from "cors";

import sequelize from "./config/database.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; //8766;

// För att kunna använda __dirname i ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

// Routers
app.use("/", router);
// app.use("/users", usersRouter);
// app.use("/api", dataRoutes);
// app.use("/auth", authRoutes);

// Start server

// Sync Sequelize models with the database
sequelize
  .sync({ alter: true }) // Use { force: true } if you want to drop and recreate tables
  .then(() => {
    // Starta server
    // server.listen(PORT);
    // server.on("error", onError);
    // server.on("listening", onListening);

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
    process.exit(1); // Exit if sync fails
  });

export default app;
