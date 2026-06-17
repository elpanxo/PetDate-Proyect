import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import api, { ApiError } from '../../api/petdate-api';
import './Admin.css';

const AdminLogin = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.auth.loginAdmin(email, password);
      navigate('/admin');
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) setError('Credenciales de administrador incorrectas');
        else if (err.status === 0) setError('Error de conexión. Verifica que el servidor esté activo.');
        else setError(err.message || 'Error al iniciar sesión');
      } else {
        setError('Error inesperado. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-icon">
          <ShieldCheck size={40} />
        </div>
        <h1 className="admin-login-title">Panel de Administración</h1>
        <p className="admin-login-sub">Acceso restringido — solo administradores</p>

        {error && <div className="admin-login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-login-field">
            <label className="admin-login-label">Correo</label>
            <div className="admin-login-input-wrap">
              <Mail size={16} className="admin-login-icon-input" />
              <input
                type="email"
                className="admin-login-input"
                placeholder="admin@petdate.cl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="admin-login-field">
            <label className="admin-login-label">Contraseña</label>
            <div className="admin-login-input-wrap">
              <Lock size={16} className="admin-login-icon-input" />
              <input
                type={showPass ? 'text' : 'password'}
                className="admin-login-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="admin-login-toggle"
                onClick={() => setShowPass(!showPass)}
                tabIndex={-1}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? 'Verificando...' : 'Ingresar como Admin'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
