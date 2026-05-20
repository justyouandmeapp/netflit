import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTrending } from '../api';

const Hero = () => {
  const [movie, setMovie] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    getTrending().then(({ data }) => {
      if (!cancelled && data.length) setMovie(data[0]);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  if (!movie) return <div className="hero hero--loading"><div className="hero__skeleton"></div></div>;

  return (
    <div className="hero" style={{ backgroundImage: `url(${movie.banner})` }}>
      <div className="hero__content">
        <h1 className="hero__title">{movie.title}</h1>
        <p className="hero__description">{movie.description}</p>
        <div className="hero__buttons">
          <button className="btn btn--play" onClick={() => navigate(`/movie/${movie.id}`)}>Más información</button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
