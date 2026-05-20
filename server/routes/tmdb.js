const express = require('express');
const router = express.Router();

const API_KEY = '534dc164b04696d22918c626fee9c7cc';
const BASE = 'https://api.themoviedb.org/3';
const IMG = 'https://image.tmdb.org/t/p';

const tmdb = async (path, params = {}) => {
  const url = new URL(`${BASE}${path}`);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('language', 'es-MX');
  Object.entries(params).forEach(([k, v]) => v && url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
  return res.json();
};

const formatMovie = (m) => ({
  id: m.id,
  title: m.title,
  description: m.overview,
  year: m.release_date?.split('-')[0],
  genre: m.genre_ids?.length ? null : null,
  duration: m.runtime ? `${m.runtime}m` : null,
  rating: m.vote_average,
  image: m.poster_path ? `${IMG}/w500${m.poster_path}` : null,
  banner: m.backdrop_path ? `${IMG}/w1280${m.backdrop_path}` : null,
  video_url: null,
  featured: m.vote_average > 7 ? 1 : 0,
});

router.get('/trending', async (req, res) => {
  try {
    const data = await tmdb('/trending/movie/week');
    res.json(data.results.map(formatMovie));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/popular', async (req, res) => {
  try {
    const data = await tmdb('/movie/popular');
    res.json(data.results.map(formatMovie));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/top-rated', async (req, res) => {
  try {
    const data = await tmdb('/movie/top_rated');
    res.json(data.results.map(formatMovie));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/upcoming', async (req, res) => {
  try {
    const data = await tmdb('/movie/upcoming');
    res.json(data.results.map(formatMovie));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/genres', async (req, res) => {
  try {
    const data = await tmdb('/genre/movie/list');
    res.json(data.genres);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/discover', async (req, res) => {
  try {
    const { genre, page } = req.query;
    const data = await tmdb('/discover/movie', { with_genres: genre, page: page || 1 });
    res.json(data.results.map(formatMovie));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/search', async (req, res) => {
  try {
    const { q, page } = req.query;
    if (!q) return res.json([]);
    const data = await tmdb('/search/movie', { query: q, page: page || 1 });
    res.json(data.results.map(formatMovie));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/movie/:id', async (req, res) => {
  try {
    const data = await tmdb(`/movie/${req.params.id}`);
    const credits = await tmdb(`/movie/${req.params.id}/credits`);
    const videos = await tmdb(`/movie/${req.params.id}/videos`);
    const similar = await tmdb(`/movie/${req.params.id}/similar`);
    res.json({
      ...formatMovie(data),
      genres: data.genres?.map(g => g.name),
      runtime: data.runtime,
      release_date: data.release_date,
      cast: credits.cast?.slice(0, 10).map(c => ({ id: c.id, name: c.name, character: c.character, photo: c.profile_path ? `${IMG}/w185${c.profile_path}` : null })),
      trailer: videos.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube')?.key || null,
      similar: similar.results?.slice(0, 12).map(formatMovie),
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
