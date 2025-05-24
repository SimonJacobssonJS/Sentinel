import express from "express";
import {
  loginUser,
  registerUser,
  getMe,
  updateMe,
  deleteMe,
  forgotPassword,
  resetPassword,
} from "./controllers/authController.js";

import { authenticateToken } from "./middlewares/authenticateToken.js";

const router = express.Router();

// Auth
// router.post("/auth/register", registerUser);
// router.post("/auth/login", loginUser);

// // User profile
// router.get("/auth/me", authenticateToken, getMe);
// router.patch("/auth/me", authenticateToken, updateMe);
// router.delete("/auth/me", authenticateToken, deleteMe);

// // Password reset
// router.post("/auth/forgot-password", forgotPassword);
// router.post("/auth/reset-password", resetPassword);

// index
router.get("/", (req, res) => res.send("Express on Vercel"));

/* GET users listing. */
router.get("/users", (req, res, next) => {
  res.send("respond with a resource");
});

export default router;
