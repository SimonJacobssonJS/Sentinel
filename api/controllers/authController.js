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

// (the rest of your handlers remain unchanged...)
