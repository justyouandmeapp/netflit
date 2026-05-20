import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTmdbMovie } from '../api';

const Player = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);
  const [embedError, setEmbedError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getTmdbMovie(id).then(({ data }) => { if (!cancelled) setMovie(data); }).catch(() => { if (!cancelled) setError('Error al cargar la película'); });
    return () => { cancelled = true; };
  }, [id]);

  if (error) return <div className="loading">{error}</div>;
  if (!movie) return <div className="loading">Cargando...</div>;

  return (
    <div className="player">
      <button className="player__back" onClick={() => navigate(-1)}>Volver</button>
      <div className="player__container">
        {!embedError ? (
          <iframe
            className="player__video"
            src={`https://vidsrc.cc/v2/embed/movie/${id}?autoplay=1`}
            allow="autoplay; fullscreen; encrypted-media"
            allowFullScreen
            title={movie.title}
            onError={() => setEmbedError(true)}
          />
        ) : (
          <div className="player__fallback">
            <p>No se pudo cargar el video desde la fuente externa.</p>
            <p>Puedes buscar esta película en tu plataforma preferida.</p>
          </div>
        )}
      </div>
      <div className="player__info">
        <h2>{movie.title} ({movie.year})</h2>
        <p>{movie.description}</p>
        {movie.rating && <p className="movie-detail__rating">Puntuación: {movie.rating.toFixed(1)}/10</p>}
      </div>
    </div>
  );
};

export default Player;
