const express = require('express');
const cors = require('cors');
const path = require('path');
const { getDb } = require('./db');
const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');
const favoriteRoutes = require('./routes/favorites');
const tmdbRoutes = require('./routes/tmdb');
const profileRoutes = require('./routes/profile');

const app = express();
const PORT = process.env.PORT || 4000;
const isProd = process.env.NODE_ENV === 'production';

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/tmdb', tmdbRoutes);
app.use('/api/profile', profileRoutes);

if (isProd) {
  const dist = path.join(__dirname, '..', 'client', 'dist');
  app.use(express.static(dist));
  app.get('*', (req, res) => res.sendFile(path.join(dist, 'index.html')));
}

getDb().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Netflit running on http://0.0.0.0:${PORT}`);
  });
});
