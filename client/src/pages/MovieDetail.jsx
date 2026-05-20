import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTmdbMovie, addFavorite, removeFavorite, getFavorites } from '../api';
import { useAuth } from '../context/AuthContext';
import MovieRow from '../components/MovieRow';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);
  const [isFav, setIsFav] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getTmdbMovie(id).then(({ data }) => { if (!cancelled) setMovie(data); }).catch(() => { if (!cancelled) setError('Error al cargar la película'); });
    if (user) {
      getFavorites().then(({ data }) => { if (!cancelled) setIsFav(data.some(m => m.id === Number(id))); }).catch(() => {});
    }
    return () => { cancelled = true; };
  }, [id, user]);

  const toggleFav = async () => {
    try {
      if (isFav) { await removeFavorite(id); setIsFav(false); }
      else { await addFavorite(id); setIsFav(true); }
    } catch {}
  };

  if (error) return <div className="loading">{error}</div>;
  if (!movie) return <div className="loading">Cargando...</div>;

  return (
    <div className="movie-detail">
      <div className="movie-detail__banner" style={{ backgroundImage: `url(${movie.banner})` }}>
        <div className="movie-detail__info">
          <h1>{movie.title}</h1>
          <p className="movie-detail__meta">
            {movie.year} &bull; {movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : movie.duration} &bull;
            {movie.genres?.join(', ')}
          </p>
          <p className="movie-detail__rating">Puntuación: {movie.rating?.toFixed(1)}/10</p>
          <p className="movie-detail__desc">{movie.description}</p>
          <div className="movie-detail__buttons">
            {movie.trailer && (
              <button className="btn btn--play" onClick={() => setShowTrailer(true)}>Ver tráiler</button>
            )}
            {user && (
              <button className="btn btn--info" onClick={toggleFav}>{isFav ? 'Quitar de Mi Lista' : '+ Mi Lista'}</button>
            )}
          </div>
        </div>
      </div>

      {showTrailer && movie.trailer && (
        <div className="trailer-overlay" onClick={() => setShowTrailer(false)}>
          <div className="trailer-container" onClick={(e) => e.stopPropagation()}>
            <button className="trailer-close" onClick={() => setShowTrailer(false)}>X</button>
            <iframe src={`https://www.youtube.com/embed/${movie.trailer}?autoplay=1`} allow="autoplay; encrypted-media" allowFullScreen title="trailer"></iframe>
          </div>
        </div>
      )}

      <div className="movie-detail__content">
        {movie.cast?.length > 0 && (
          <div className="cast-section">
            <h2>Reparto</h2>
            <div className="cast-list">
              {movie.cast.map((c) => (
                <div key={c.id} className="cast-card">
                  <img src={c.photo || 'https://via.placeholder.com/185x278/333/666?text=?'} alt={c.name} />
                  <p className="cast-name">{c.name}</p>
                  <p className="cast-character">{c.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {movie.similar?.length > 0 && (
          <MovieRow title="Películas similares" movies={movie.similar} favorites={[]} />
        )}
      </div>
    </div>
  );
};

export default MovieDetail;
