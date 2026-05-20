import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);
export const getMe = () => API.get('/auth/me');
export const getMovies = (params) => API.get('/movies', { params });
export const getFeatured = () => API.get('/movies/featured');
export const getGenres = () => API.get('/movies/genres');
export const getMovie = (id) => API.get(`/movies/${id}`);
export const getFavorites = () => API.get('/favorites');
export const addFavorite = (id) => API.post(`/favorites/${id}`);
export const removeFavorite = (id) => API.delete(`/favorites/${id}`);

export const getTrending = () => API.get('/tmdb/trending');
export const getPopular = () => API.get('/tmdb/popular');
export const getTopRated = () => API.get('/tmdb/top-rated');
export const getUpcoming = () => API.get('/tmdb/upcoming');
export const getTmdbGenres = () => API.get('/tmdb/genres');
export const discoverMovies = (params) => API.get('/tmdb/discover', { params });
export const searchTmdb = (params) => API.get('/tmdb/search', { params });
export const getTmdbMovie = (id) => API.get(`/tmdb/movie/${id}`);

export const updateProfile = (data) => API.put('/profile', data);
export const uploadAvatar = (file) => {
  const fd = new FormData();
  fd.append('avatar', file);
  return API.post('/profile/avatar', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
};
export const changePassword = (data) => API.put('/profile/password', data);
