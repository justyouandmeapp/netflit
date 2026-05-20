import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrarse');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form">
        <h1>Registrarse</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Usuario" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="btn btn--primary">Registrarse</button>
        </form>
        <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
      </div>
    </div>
  );
};

export default Register;
