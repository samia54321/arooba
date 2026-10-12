import { Router } from 'express';
import { db } from '../db.ts';

const router = Router();

// POST /api/auth/register - Register customer
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Name, email, and password are required' });
    }

    const existing = await db.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ success: false, error: 'An account with this email already exists' });
    }

    const user = await db.createUser({
      name,
      email,
      password,
      role: 'customer',
      phone,
      address
    });

    // Return safe user profile without password
    const safeUser = {
      id: user.id || user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address
    };

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: safeUser
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/auth/login - Login customer or admin
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const user = await db.findUserByEmail(email);
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const safeUser = {
      id: user.id || user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address
    };

    res.json({
      success: true,
      message: 'Login successful',
      user: safeUser
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
