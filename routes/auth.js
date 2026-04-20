const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendWelcomeEmail } = require('../services/email');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: 'Tous les champs sont requis' });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ error: 'Email déjà utilisé' });

    const user = await User.create({ name, email, password });

    // Email de bienvenue (non bloquant)
    sendWelcomeEmail({ to: email, name }).catch(console.error);

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, plan: user.plan }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        applicationsUsed: user.applicationsUsed,
        applicationsLimit: user.applicationsLimit
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me
router.get('/me', require('../controllers/authMiddleware'), async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      plan: req.user.plan,
      applicationsUsed: req.user.applicationsUsed,
      applicationsLimit: req.user.applicationsLimit
    }
  });
});

module.exports = router;
