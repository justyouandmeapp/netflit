const express = require('express');
const { get, query } = require('../db');

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const { genre, search } = req.query;
    let movies;
    if (search) {
      movies = query('SELECT * FROM movies WHERE title LIKE ? ORDER BY created_at DESC', [`%${search}%`]);
    } else if (genre) {
      movies = query('SELECT * FROM movies WHERE genre = ? ORDER BY created_at DESC', [genre]);
    } else {
      movies = query('SELECT * FROM movies ORDER BY created_at DESC', []);
    }
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/featured', (req, res) => {
  try {
    const movies = query('SELECT * FROM movies WHERE featured = 1 ORDER BY rating DESC', []);
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/genres', (req, res) => {
  try {
    const genres = query('SELECT DISTINCT genre FROM movies ORDER BY genre', []);
    res.json(genres.map(g => g.genre));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const movie = get('SELECT * FROM movies WHERE id = ?', [req.params.id]);
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
