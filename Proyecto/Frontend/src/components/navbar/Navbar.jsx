import { Link } from 'react-router-dom';
import logo from '../../assets/logo/petdate-logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';

function Navbar() {
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
              <a className="nav-link nav-link-custom" href="#inicio">Inicio</a>
            </li>
            <li className="nav-item">
              <a className="nav-link nav-link-custom" href="#nosotros">Nosotros</a>
            </li>
            <li className="nav-item">
              <a className="nav-link nav-link-custom" href="#servicios">Servicios</a>
            </li>
            <li className="nav-item">
              <a className="nav-link nav-link-custom" href="#blogs">Blogs</a>
            </li>
            <li className="nav-item">
              <a className="nav-link nav-link-custom" href="#contacto">Contacto</a>
            </li>
          </ul>
        </div>

        {/* Botones (derecha) */}
        <div className="d-none d-md-flex align-items-center gap-2 flex-shrink-0">
          <Link to="/login" className="btn btn-login">
            <span>👤</span> Inicia Sesión
          </Link>
          <Link to="/register" className="btn btn-register">
            <span>📋</span> Registrate
          </Link>
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
