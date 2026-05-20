const express = require('express');
const jwt = require('jsonwebtoken');
const { get, run, query } = require('../db');
const { JWT_SECRET } = require('./auth');

const router = express.Router();

const authMiddleware = (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: 'No token' });
    const token = auth.split(' ')[1];
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const fetchTmdbMovie = async (movieId) => {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=534dc164b04696d22918c626fee9c7cc&language=es-MX`);
    if (!res.ok) return null;
    const data = await res.json();
    return {
      id: data.id,
      title: data.title,
      description: data.overview,
      year: data.release_date?.split('-')[0],
      genre: data.genres?.[0]?.name,
      duration: data.runtime ? `${data.runtime}m` : null,
      rating: data.vote_average,
      image: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : null,
      banner: data.backdrop_path ? `https://image.tmdb.org/t/p/w1280${data.backdrop_path}` : null,
      video_url: null,
      featured: 0,
    };
  } catch { return null; }
};

router.get('/', authMiddleware, (req, res) => {
  try {
    const favorites = query(`
      SELECT m.* FROM movies m
      JOIN favorites f ON m.id = f.movie_id
      WHERE f.user_id = ?
      ORDER BY f.created_at DESC
    `, [req.user.id]);
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:movieId', authMiddleware, async (req, res) => {
  try {
    const movieId = req.params.movieId;
    const existing = get('SELECT id FROM movies WHERE id = ?', [movieId]);
    if (!existing) {
      const movie = await fetchTmdbMovie(movieId);
      if (movie) {
        run('INSERT OR IGNORE INTO movies (id, title, description, year, genre, duration, rating, image, banner, video_url, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [movie.id, movie.title, movie.description, movie.year, movie.genre, movie.duration, movie.rating, movie.image, movie.banner, movie.video_url, movie.featured]);
      }
    }
    run('INSERT OR IGNORE INTO favorites (user_id, movie_id) VALUES (?, ?)', [req.user.id, movieId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:movieId', authMiddleware, (req, res) => {
  try {
    run('DELETE FROM favorites WHERE user_id = ? AND movie_id = ?', [req.user.id, req.params.movieId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
