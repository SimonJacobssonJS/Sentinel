// api/controllers/authController.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from '../models/index.js';

const { User } = db;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// POST /auth/register
export const registerUser = async (req, res) => {
  try {
    const { username, password, email } = req.body || {};
    if (!username || !password || !email) {
      return res.status(400).json({
        status: 'error',
        message: 'username, password, and email are required',
      });
    }

    console.log('Registering user:', { username, email });

    const existing = await User.findOne({ where: { username } });
    if (existing) {
      return res
        .status(400)
        .json({ status: 'error', message: 'User already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashed, email });

    return res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      user: { username, email },
    });
  } catch (err) {
    console.error('🔥 registerUser error:', err);
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

// POST /auth/login
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'username and password are required',
      });
    }

    // Override defaultScope to include password
    const user = await User.unscoped().findOne({
      where: { username },
      attributes: ['id', 'username', 'password'],
    });
    if (!user) {
      return res
        .status(400)
        .json({ status: 'error', message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(400)
        .json({ status: 'error', message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({ status: 'success', token });
  } catch (err) {
    console.error('🔥 loginUser error:', err);
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

// GET /auth/me
export const getMe = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res
        .status(401)
        .json({ status: 'error', message: 'Not authenticated' });
    }

    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
    });
    if (!user) {
      return res
        .status(404)
        .json({ status: 'error', message: 'User not found' });
    }

    return res.json({ status: 'success', user });
  } catch (err) {
    console.error('🔥 getMe error:', err);
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

// PATCH /auth/me
export const updateMe = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res
        .status(401)
        .json({ status: 'error', message: 'Not authenticated' });
    }

    const { email, password, phone_number, workplace, job_title } =
      req.body || {};
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ status: 'error', message: 'User not found' });
    }

    if (email) user.email = email;
    if (phone_number) user.phone_number = phone_number;
    if (workplace) user.workplace = workplace;
    if (job_title) user.job_title = job_title;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    return res.json({
      status: 'success',
      message: 'Profile updated successfully',
    });
  } catch (err) {
    console.error('🔥 updateMe error:', err);
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

// DELETE /auth/me
export const deleteMe = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res
        .status(401)
        .json({ status: 'error', message: 'Not authenticated' });
    }

    const deleted = await User.destroy({ where: { id: req.user.id } });
    if (!deleted) {
      return res
        .status(404)
        .json({ status: 'error', message: 'User not found' });
    }

    return res.json({
      status: 'success',
      message: 'User deleted successfully',
    });
  } catch (err) {
    console.error('🔥 deleteMe error:', err);
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

// POST /auth/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) {
      return res
        .status(400)
        .json({ status: 'error', message: 'Email is required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(404)
        .json({ status: 'error', message: 'No user with that email' });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: process.env.RESET_PASSWORD_EXPIRES_IN || '15m',
    });

    // TODO: send reset email
    return res.json({
      status: 'success',
      message: 'Password reset email sent',
    });
  } catch (err) {
    console.error('🔥 forgotPassword error:', err);
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

// POST /auth/reset-password
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body || {};
    if (!token || !newPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Token and newPassword are required',
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res
        .status(404)
        .json({ status: 'error', message: 'User not found' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.json({ status: 'success', message: 'Password has been reset' });
  } catch (err) {
    console.error('🔥 resetPassword error:', err);
    return res
      .status(400)
      .json({ status: 'error', message: 'Invalid or expired token' });
  }
};
