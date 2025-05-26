// api/controllers/authController.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from '../models/index.js';

const { User } = db;
const JWT_SECRET = process.env.JWT_SECRET;

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

    // ▶️ Use our withPassword scope so we actually fetch the hash:
    const user = await User.scope('withPassword').findOne({
      where: { username },
    });

    console.log('🔑 loginUser fetched user:', user?.toJSON());

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
