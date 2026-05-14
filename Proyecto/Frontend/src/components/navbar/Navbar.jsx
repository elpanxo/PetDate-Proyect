import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo/petdate-logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';

function Navbar() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const navigate = useNavigate();

  useEffect(() => {
    const handleUserChange = () => {
      const stored = localStorage.getItem('user');
      setUser(stored ? JSON.parse(stored) : null);
    };
    window.addEventListener('userChanged', handleUserChange);
    return () => window.removeEventListener('userChanged', handleUserChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('userChanged'));
    navigate('/');
  };

  return (
    <nav className="navbar fixed-top bg-custom">
      <div className="container-fluid px-4 d-flex align-items-center">

        {/* Brand */}
        <Link to="/" className="d-flex align-items-center gap-3 flex-shrink-0 text-decoration-none">
          <img
            src={logo}
            alt="PetDate"
            className="brand-logo"
            style={{ width: '48px', height: '48px', objectFit: 'contain' }}
          />
          <span className="brand-text">PetDate</span>
        </Link>

        {/* Navigation links (centro) */}
        <div className="d-none d-md-flex justify-content-center flex-grow-1">
          <ul className="navbar-nav flex-row gap-4">
            <li className="nav-item">
              <Link className="nav-link nav-link-custom" to="/">Inicio</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link nav-link-custom" to="/nosotros">Nosotros</Link>
            </li>
            {user && user.role === 'empresa' ? (
              <li className="nav-item">
                <Link className="nav-link nav-link-custom" to="/mi-empresa">Mi Empresa</Link>
              </li>
            ) : user ? (
              <li className="nav-item">
                <Link className="nav-link nav-link-custom" to="/mis-mascotas">Mis Mascotas</Link>
              </li>
            ) : null}
            <li className="nav-item">
              <Link className="nav-link nav-link-custom" to="/servicios">Servicios</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link nav-link-custom" to="/blogs">Blogs</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link nav-link-custom" to="/contacto">Contacto</Link>
            </li>
          </ul>
        </div>

        {/* Botones (derecha) */}
        <div className="d-none d-md-flex align-items-center gap-2 flex-shrink-0">
          {user ? (
            <>
              <span className="navbar-greeting">Hola, {user.name} 🐾</span>
              <button className="btn btn-logout" onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-login">
                <span>👤</span> Inicia Sesión
              </Link>
              <Link to="/register" className="btn btn-register">
                <span>📋</span> Registrate
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="navbar-toggler d-md-none ms-auto"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

      </div>
    </nav>
  );
}

export default Navbar;
