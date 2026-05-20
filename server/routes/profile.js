const express = require('express');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { get, run } = require('../db');
const { JWT_SECRET } = require('./auth');

const router = express.Router();

const auth = (req, res, next) => {
  try {
    const h = req.headers.authorization;
    if (!h) return res.status(401).json({ error: 'No token' });
    req.user = jwt.verify(h.split(' ')[1], JWT_SECRET);
    next();
  } catch { res.status(401).json({ error: 'Invalid token' }); }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => cb(null, `avatar-${req.user.id}${path.extname(file.originalname)}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) return cb(new Error('Only images'));
  cb(null, true);
} });

router.put('/', auth, (req, res) => {
  try {
    const { username, email } = req.body;
    run('UPDATE users SET username = ?, email = ? WHERE id = ?', [username, email, req.user.id]);
    const user = get('SELECT id, username, email, avatar FROM users WHERE id = ?', [req.user.id]);
    res.json(user);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/avatar', auth, (req, res) => {
  upload.single('avatar')(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const avatar = `/uploads/${req.file.filename}`;
    run('UPDATE users SET avatar = ? WHERE id = ?', [avatar, req.user.id]);
    res.json({ avatar });
  });
});

router.put('/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = get('SELECT * FROM users WHERE id = ?', [req.user.id]);
    if (!(await bcrypt.compare(currentPassword, user.password))) {
      return res.status(400).json({ error: 'La contraseña actual es incorrecta' });
    }
    run('UPDATE users SET password = ? WHERE id = ?', [await bcrypt.hash(newPassword, 10), req.user.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
