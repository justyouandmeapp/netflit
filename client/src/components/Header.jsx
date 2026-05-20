import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) { navigate(`/?search=${search}`); setSearch(''); }
  };

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="header__left">
        <h1 className="header__logo" onClick={() => navigate('/')}>NETFLIT</h1>
        <nav className="header__nav">
          <Link to="/">Inicio</Link>
          <Link to="/my-list">Mi Lista</Link>
        </nav>
      </div>
      <div className="header__right">
        <form onSubmit={handleSearch} className="header__search">
          <input type="text" placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </form>
        {user ? (
          <div className="header__user" ref={menuRef}>
            <div className="header__avatar" onClick={() => setShowMenu(!showMenu)}>
              <img src={user.avatar ? user.avatar : 'https://via.placeholder.com/32/333/fff?text=U'} alt="" />
              <span className="header__arrow">&#9660;</span>
            </div>
            {showMenu && (
              <div className="header__dropdown">
                <Link to="/profile" onClick={() => setShowMenu(false)}>Mi Perfil</Link>
                <Link to="/my-list" onClick={() => setShowMenu(false)}>Mi Lista</Link>
                <hr />
                <button onClick={() => { logout(); setShowMenu(false); navigate('/'); }}>Cerrar sesión</button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="btn btn--login">Iniciar sesión</Link>
        )}
      </div>
    </header>
  );
};

export default Header;
