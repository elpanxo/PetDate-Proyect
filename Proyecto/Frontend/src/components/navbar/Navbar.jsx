import logo from '../assets/logo/petdate-logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar fixed-top bg-custom">
      <div className="container-fluid px-4">
        {/* Brand */}
        <div className="d-flex align-items-center gap-3">
          <img 
            src={logo} 
            alt="PetDate" 
            className="brand-logo"
            style={{ width: '48px', height: '48px', objectFit: 'contain' }}
          />
          <span className="brand-text">PetDate</span>
        </div>

        {/* Mobile Toggle Button */}
        <button 
          className="navbar-toggler d-md-none" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Menu */}
        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
          <ul className="navbar-nav gap-md-4">
            <li className="nav-item">
              <a className="nav-link nav-link-custom" href="#inicio">INICIO</a>
            </li>
            <li className="nav-item">
              <a className="nav-link nav-link-custom" href="#nosotros">NOSOTROS</a>
            </li>
            <li className="nav-item">
              <a className="nav-link nav-link-custom" href="#agenda">AGENDA</a>
            </li>
            <li className="nav-item">
              <a className="nav-link nav-link-custom" href="#contacto">CONTACTO</a>
            </li>
          </ul>
        </div>

        {/* Login Button */}
        <button className="btn btn-login d-none d-md-flex align-items-center gap-2">
          <span>👤</span>
          INICIAR SESIÓN
        </button>
      </div>
    </nav>
  );
}

export default Navbar;