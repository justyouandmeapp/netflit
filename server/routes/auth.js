const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { get, run, query } = require('../db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'netflit_secret_key_2024';

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const existing = get('SELECT id FROM users WHERE email = ? OR username = ?', [email, username]);
    if (existing) {
      return res.status(409).json({ error: 'User already exists' });
    }
    const hashed = await bcrypt.hash(password, 10);
    run('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashed]);
    const user = get('SELECT id, username, email FROM users WHERE email = ?', [email]);
    const token = jwt.sign({ id: user.id, email }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user.id, username, email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const user = get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, username: user.username, email: user.email, avatar: user.avatar } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/me', (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: 'No token' });
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = get('SELECT id, username, email, avatar FROM users WHERE id = ?', [decoded.id]);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
module.exports.JWT_SECRET = JWT_SECRET;
