import { useRef, useState } from 'react';
import MovieCard from './MovieCard';

const MovieRow = ({ title, movies, favorites, onToggle }) => {
  const listRef = useRef();
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  if (!movies?.length) return null;

  const scroll = (dir) => {
    const amount = listRef.current.clientWidth * 0.75;
    listRef.current.scrollBy({ left: dir * amount, behavior: 'smooth' });
  };

  const checkScroll = () => {
    const el = listRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 10);
    setShowRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  return (
    <div className="movie-row">
      {title && <h2 className="movie-row__title">{title}</h2>}
      <div className="movie-row__wrapper">
        {showLeft && <button className="scroll-btn scroll-btn--left" onClick={() => scroll(-1)}>&#10094;</button>}
        <div className="movie-row__list" ref={listRef} onScroll={checkScroll}>
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} isFavorite={favorites?.some((f) => f.id === movie.id)} onToggle={onToggle} />
          ))}
        </div>
        {showRight && <button className="scroll-btn scroll-btn--right" onClick={() => scroll(1)}>&#10095;</button>}
      </div>
    </div>
  );
};

export default MovieRow;
