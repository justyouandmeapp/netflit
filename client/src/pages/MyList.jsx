import { useState, useEffect } from 'react';
import MovieRow from '../components/MovieRow';
import { getFavorites } from '../api';

const MyList = () => {
  const [favorites, setFavorites] = useState([]);

  const fetchFavorites = async () => {
    try {
      const { data } = await getFavorites();
      setFavorites(data);
    } catch {}
  };

  useEffect(() => { fetchFavorites(); }, []);

  return (
    <div className="my-list">
      <div className="my-list__header">
        <h1>Mi Lista</h1>
      </div>
      <MovieRow title="Tus favoritos" movies={favorites} favorites={favorites} onToggle={fetchFavorites} />
      {!favorites.length && <p className="no-results">Tu lista está vacía. ¡Agrega algunas películas!</p>}
    </div>
  );
};

export default MyList;
