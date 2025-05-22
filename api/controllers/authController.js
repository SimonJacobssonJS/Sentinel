import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from '../models/index.js';
import { sendResetEmail } from '../utils/mailer.js';

const { User } = db;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// POST /auth/register
export const registerUser = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const userExists = await User.findOne({ where: { username } });
    if (userExists) {
      return res.status(400).json({ status: 'error', message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashedPassword, email });

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      user: { username }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
};


// POST /auth/login
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ status: 'error', message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ status: 'error', message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ status: 'success', token });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
};

// GET /auth/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ status: 'success', user });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
};

// PATCH /auth/me
export const updateMe = async (req, res) => {
  const userId = req.user.id;
  const { email, password, phone_number, workplace, job_title } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (email) user.email = email;
    if (phone_number) user.phone_number = phone_number;
    if (workplace) user.workplace = workplace;
    if (job_title) user.job_title = job_title;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /auth/me
export const deleteMe = async (req, res) => {
  try {
    const deleted = await User.destroy({ where: { id: req.user.id } });

    if (!deleted) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /auth/forgot-password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'No user with that email' });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: process.env.RESET_PASSWORD_EXPIRES_IN || '15m'
    });

    await sendResetEmail(user.email, token);
    res.json({ message: 'Password reset email sent' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /auth/reset-password
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ message: 'Password has been reset' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};
