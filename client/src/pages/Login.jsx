import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form">
        <h1>Iniciar sesión</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="btn btn--primary">Iniciar sesión</button>
        </form>
        <p>¿Nuevo en Netflit? <Link to="/register">Regístrate</Link></p>
        <p className="hint">Demo: demo@netflit.com / 123456</p>
      </div>
    </div>
  );
};

export default Login;
