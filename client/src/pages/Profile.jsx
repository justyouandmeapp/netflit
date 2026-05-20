import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile, uploadAvatar, changePassword } from '../api';

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const fileRef = useRef();
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [avatar, setAvatar] = useState(user?.avatar || null);

  const handleProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ username, email });
      await refreshUser();
      setMsg('Perfil actualizado');
      setErr('');
    } catch (e) { setErr(e.response?.data?.error || 'Error'); setMsg(''); }
  };

  const handleAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const { data } = await uploadAvatar(file);
      setAvatar(data.avatar + '?t=' + Date.now());
      await refreshUser();
      setMsg('Foto actualizada');
      setErr('');
    } catch (e) { setErr('Error al subir foto'); setMsg(''); }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 4) { setErr('La contraseña debe tener al menos 4 caracteres'); return; }
    try {
      await changePassword({ currentPassword, newPassword });
      setMsg('Contraseña cambiada');
      setErr('');
      setCurrentPassword('');
      setNewPassword('');
    } catch (e) { setErr(e.response?.data?.error || 'Error'); setMsg(''); }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1>Mi Perfil</h1>

        <div className="profile-avatar">
          <img src={avatar || 'https://via.placeholder.com/150/333/fff?text=U'} alt="avatar" />
          <button className="btn btn--info" onClick={() => fileRef.current.click()}>Cambiar foto</button>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatar} />
        </div>

        {msg && <p className="success-msg">{msg}</p>}
        {err && <p className="error">{err}</p>}

        <form onSubmit={handleProfile} className="profile-form">
          <label>Usuario</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <label>Correo electrónico</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <button type="submit" className="btn btn--primary">Guardar cambios</button>
        </form>

        <hr className="profile-divider" />

        <h2>Cambiar contraseña</h2>
        <form onSubmit={handlePassword} className="profile-form">
          <label>Contraseña actual</label>
          <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
          <label>Nueva contraseña</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          <button type="submit" className="btn btn--primary">Cambiar contraseña</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
