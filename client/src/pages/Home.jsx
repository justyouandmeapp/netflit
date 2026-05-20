import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Hero from '../components/Hero';
import MovieRow from '../components/MovieRow';
import { getTrending, getPopular, getTopRated, getUpcoming, getTmdbGenres, discoverMovies, searchTmdb, getFavorites } from '../api';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [genreMovies, setGenreMovies] = useState({});
  const [genres, setGenres] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (search) {
        const { data } = await searchTmdb({ q: search });
        setSearchResults(data);
      } else {
        const [tr, pop, trr, up, gr] = await Promise.all([
          getTrending(), getPopular(), getTopRated(), getUpcoming(), getTmdbGenres()
        ]);
        setTrending(tr.data);
        setPopular(pop.data);
        setTopRated(trr.data);
        setUpcoming(up.data);
        setGenres(gr.data.slice(0, 6));

        const genreData = {};
        for (const g of gr.data.slice(0, 6)) {
          const { data } = await discoverMovies({ genre: g.id, page: 1 });
          genreData[g.id] = data;
        }
        setGenreMovies(genreData);
      }
    } catch (e) {
      setError('Error al cargar contenido. Verifica que el servidor esté funcionando.');
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = useCallback(async () => {
    try { const { data } = await getFavorites(); setFavorites(data); } catch {}
  }, []);

  useEffect(() => { fetchData(); }, [search]);
  useEffect(() => { if (user) fetchFavorites(); }, [user, fetchFavorites]);

  if (error) return <div className="loading">{error}</div>;

  if (search) {
    return (
      <div className="home">
        <div className="search-results">
          <h2>Resultados para "{search}"</h2>
          <MovieRow title="" movies={searchResults} favorites={favorites} onToggle={fetchFavorites} />
          {!searchResults.length && !loading && <p className="no-results">No se encontraron películas</p>}
          {loading && <div className="loading">Buscando...</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="home">
      <Hero />
      <div className="home__rows">
        {loading ? (
          <div className="loading">Cargando...</div>
        ) : (
          <>
            <MovieRow title="Tendencias de la semana" movies={trending} favorites={favorites} onToggle={fetchFavorites} />
            <MovieRow title="Más populares" movies={popular} favorites={favorites} onToggle={fetchFavorites} />
            <MovieRow title="Mejor puntuadas" movies={topRated} favorites={favorites} onToggle={fetchFavorites} />
            <MovieRow title="Próximamente" movies={upcoming} favorites={favorites} onToggle={fetchFavorites} />
            {genres.map((g) => (
              <MovieRow key={g.id} title={g.name} movies={genreMovies[g.id] || []} favorites={favorites} onToggle={fetchFavorites} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
