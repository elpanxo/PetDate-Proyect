import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import AuthNavbar from '../navbar/AuthNavbar';
import { servicios } from '../servicios/serviciosData';
import './Register.css';

const RUBROS = [
  { label: 'Veterinaria', servicioId: 1 },
  { label: 'Veterinaria 24/7', servicioId: 2 },
  { label: 'Servicios (Peluquería / Spa)', servicioId: 3 },
  { label: 'Tienda de mascotas', servicioId: 4 },
];

const FORM_CLIENTE_INICIAL = { nombre: '', email: '', telefono: '', password: '', confirm: '' };
const FORM_EMPRESA_INICIAL = { empresa: '', rubro: RUBROS[0].servicioId, rut: '', direccion: '', telefono: '', email: '', password: '', confirm: '', terminos: false };

const Register = () => {
  const [tipo, setTipo] = useState('cliente');
  const navigate = useNavigate();

  const [cliente, setCliente] = useState(FORM_CLIENTE_INICIAL);
  const [errorCliente, setErrorCliente] = useState('');

  const [empresa, setEmpresa] = useState(FORM_EMPRESA_INICIAL);
  const [errorEmpresa, setErrorEmpresa] = useState('');

  const campoCliente = (field, value) => setCliente(p => ({ ...p, [field]: value }));
  const campoEmpresa = (field, value) => setEmpresa(p => ({ ...p, [field]: value }));

  const handleCliente = (e) => {
    e.preventDefault();
    setErrorCliente('');
    if (cliente.password !== cliente.confirm) return setErrorCliente('Las contraseñas no coinciden');
    if (cliente.password.length < 6) return setErrorCliente('La contraseña debe tener al menos 6 caracteres');
    localStorage.setItem('user', JSON.stringify({ email: cliente.email, name: cliente.nombre, role: 'cliente' }));
    window.dispatchEvent(new Event('userChanged'));
    navigate('/mis-mascotas');
  };

  const handleEmpresa = (e) => {
    e.preventDefault();
    setErrorEmpresa('');
    if (!empresa.terminos) return setErrorEmpresa('Debes aceptar los términos y condiciones');
    if (empresa.password !== empresa.confirm) return setErrorEmpresa('Las contraseñas no coinciden');
    if (empresa.password.length < 6) return setErrorEmpresa('La contraseña debe tener al menos 6 caracteres');
    const servicio = servicios.find(s => s.id === Number(empresa.rubro));
    localStorage.setItem('user', JSON.stringify({
      email: empresa.email,
      name: empresa.empresa,
      role: 'empresa',
      servicioId: Number(empresa.rubro),
    }));
    window.dispatchEvent(new Event('userChanged'));
    navigate('/mi-empresa');
  };

  const switchTo = (t) => {
    setErrorCliente('');
    setErrorEmpresa('');
    setTipo(t);
  };

  return (
    <>
      <AuthNavbar />
      <div className="reg-page">

        {/* ── Panel Cliente ── */}
        <div
          className={`reg-panel reg-panel--cliente ${tipo === 'cliente' ? 'reg-panel--active' : 'reg-panel--inactive'}`}
          onClick={tipo !== 'cliente' ? () => switchTo('cliente') : undefined}
        >
          {tipo !== 'cliente' ? (
            <div className="reg-teaser">
              <span className="reg-teaser-icon">🐾</span>
              <h2>Dueño de mascota</h2>
              <p>Crea tu cuenta como cliente</p>
              <span className="reg-teaser-cta">Regístrate aquí →</span>
            </div>
          ) : (
            <div className="reg-form-wrap">
              <h2 className="reg-form-title">🐾 Crear cuenta</h2>
              <p className="reg-form-sub">Registro de dueño de mascota</p>

              {errorCliente && <div className="reg-error">{errorCliente}</div>}

              <Form onSubmit={handleCliente}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre completo</Form.Label>
                  <Form.Control placeholder="Tu nombre" value={cliente.nombre} onChange={e => campoCliente('nombre', e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Correo electrónico</Form.Label>
                  <Form.Control type="email" placeholder="ejemplo@correo.com" value={cliente.email} onChange={e => campoCliente('email', e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control type="tel" placeholder="+56 9 1234 5678" value={cliente.telefono} onChange={e => campoCliente('telefono', e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control type="password" placeholder="Mínimo 6 caracteres" value={cliente.password} onChange={e => campoCliente('password', e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>Confirmar contraseña</Form.Label>
                  <Form.Control type="password" placeholder="Repite tu contraseña" value={cliente.confirm} onChange={e => campoCliente('confirm', e.target.value)} required />
                </Form.Group>

                <button type="submit" className="reg-btn reg-btn--cliente">
                  Registrarme como cliente
                </button>
                <div className="reg-login-link">
                  <span className="text-muted">¿Ya tienes cuenta? </span>
                  <Link to="/login">Inicia sesión aquí</Link>
                </div>
              </Form>
            </div>
          )}
        </div>

        {/* ── Divisor ── */}
        <div className="reg-divider"><span>o</span></div>

        {/* ── Panel Empresa ── */}
        <div
          className={`reg-panel reg-panel--empresa ${tipo === 'empresa' ? 'reg-panel--active' : 'reg-panel--inactive'}`}
          onClick={tipo !== 'empresa' ? () => switchTo('empresa') : undefined}
        >
          {tipo !== 'empresa' ? (
            <div className="reg-teaser">
              <span className="reg-teaser-icon">🏢</span>
              <h2>Empresa / Servicio</h2>
              <p>Crea tu cuenta como proveedor</p>
              <span className="reg-teaser-cta">Regístrate aquí →</span>
            </div>
          ) : (
            <div className="reg-form-wrap">
              <h2 className="reg-form-title">🏢 Crear cuenta empresa</h2>
              <p className="reg-form-sub">Registro de servicio / proveedor</p>

              {errorEmpresa && <div className="reg-error">{errorEmpresa}</div>}

              <Form onSubmit={handleEmpresa}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre de la empresa</Form.Label>
                  <Form.Control placeholder="Ej: Clínica VetCare" value={empresa.empresa} onChange={e => campoEmpresa('empresa', e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Rubro</Form.Label>
                  <Form.Select value={empresa.rubro} onChange={e => campoEmpresa('rubro', e.target.value)}>
                    {RUBROS.map(r => (
                      <option key={r.servicioId} value={r.servicioId}>{r.label}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>RUT empresa</Form.Label>
                  <Form.Control placeholder="12.345.678-9" value={empresa.rut} onChange={e => campoEmpresa('rut', e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Dirección</Form.Label>
                  <Form.Control placeholder="Av. Ejemplo 1234, Santiago" value={empresa.direccion} onChange={e => campoEmpresa('direccion', e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control type="tel" placeholder="+56 2 1234 5678" value={empresa.telefono} onChange={e => campoEmpresa('telefono', e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Correo electrónico</Form.Label>
                  <Form.Control type="email" placeholder="empresa@correo.com" value={empresa.email} onChange={e => campoEmpresa('email', e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control type="password" placeholder="Mínimo 6 caracteres" value={empresa.password} onChange={e => campoEmpresa('password', e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Confirmar contraseña</Form.Label>
                  <Form.Control type="password" placeholder="Repite tu contraseña" value={empresa.confirm} onChange={e => campoEmpresa('confirm', e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Check
                    type="checkbox"
                    id="terminos"
                    label="Acepto los términos y condiciones de uso"
                    checked={empresa.terminos}
                    onChange={e => campoEmpresa('terminos', e.target.checked)}
                  />
                </Form.Group>

                <button type="submit" className="reg-btn reg-btn--empresa">
                  Registrar empresa
                </button>
                <div className="reg-login-link">
                  <span className="text-muted">¿Ya tienes cuenta? </span>
                  <Link to="/login-empresa">Inicia sesión aquí</Link>
                </div>
              </Form>
            </div>
          )}
        </div>

      </div>
    </>
  );
};

export default Register;
