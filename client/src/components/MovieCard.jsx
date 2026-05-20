import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addFavorite, removeFavorite } from '../api';
import { useAuth } from '../context/AuthContext';

const MovieCard = ({ movie, isFavorite, onToggle }) => {
  const [fav, setFav] = useState(isFavorite);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { setFav(isFavorite); }, [isFavorite]);

  const toggleFav = async (e) => {
    e.stopPropagation();
    if (!user) return navigate('/login');
    try {
      if (fav) {
        await removeFavorite(movie.id);
        setFav(false);
      } else {
        await addFavorite(movie.id);
        setFav(true);
      }
      onToggle?.();
    } catch {}
  };

  return (
    <div className="movie-card" onClick={() => navigate(`/movie/${movie.id}`)}>
      <img src={movie.image} alt={movie.title} className="movie-card__image" />
      <div className="movie-card__overlay">
        <h3>{movie.title}</h3>
        <p>{movie.year} &bull; {movie.duration}</p>
        <div className="movie-card__actions">
          <button className="btn btn--small" onClick={(e) => { e.stopPropagation(); navigate(`/watch/${movie.id}`); }}>Reproducir</button>
          <button className={`btn btn--small ${fav ? 'btn--fav' : ''}`} onClick={toggleFav}>{fav ? '♥' : '♡'}</button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
