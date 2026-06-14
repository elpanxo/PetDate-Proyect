import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, CheckCircle, Heart, PawPrint } from 'lucide-react';
import AuthNavbar from '../navbar/AuthNavbar';
import catAndDog from '../../assets/roots/cat-and-dog.png';
import api, { ApiError } from '../../api/petdate-api';
import './Login.css';

const RecuperarContrasena = ({ tipo = 'cliente' }) => {
  const [paso, setPaso]                   = useState(0);
  const [correo, setCorreo]               = useState('');
  const [digits, setDigits]               = useState(['', '', '', '', '', '']);
  const [nuevaContrasena, setNueva]       = useState('');
  const [confirmar, setConfirmar]         = useState('');
  const [showPass, setShowPass]           = useState(false);
  const [showConfirm, setShowConfirm]     = useState(false);
  const [error, setError]                 = useState('');
  const [loading, setLoading]             = useState(false);

  const inputRefs = useRef([]);
  const navigate  = useNavigate();

  const loginPath = tipo === 'empresa' ? '/login-empresa' : '/login';

  // ── Manejadores de los 6 dígitos ─────────────────────
  const handleDigitChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleDigitKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleDigitPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setDigits(pasted.split(''));
      inputRefs.current[5]?.focus();
      e.preventDefault();
    }
  };

  // ── Paso 0: enviar código ─────────────────────────────
  const enviarCodigo = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (tipo === 'empresa') {
        await api.auth.forgotPasswordEmpresa(correo);
      } else {
        await api.auth.forgotPassword(correo);
      }
      setPaso(1);
    } catch {
      setError('No se pudo enviar el código. Verifica tu conexión e intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // ── Paso 1: verificar dígitos ─────────────────────────
  const verificarCodigo = (e) => {
    e.preventDefault();
    if (digits.join('').length < 6) {
      setError('Ingresa el código completo de 6 dígitos.');
      return;
    }
    setError('');
    setPaso(2);
  };

  // ── Paso 2: cambiar contraseña ────────────────────────
  const cambiarContrasena = async (e) => {
    e.preventDefault();
    setError('');
    if (nuevaContrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (nuevaContrasena !== confirmar) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setLoading(true);
    try {
      const codigo = digits.join('');
      if (tipo === 'empresa') {
        await api.auth.resetPasswordEmpresa(correo, codigo, nuevaContrasena);
      } else {
        await api.auth.resetPassword(correo, codigo, nuevaContrasena);
      }
      setPaso(3);
    } catch (err) {
      if (err instanceof ApiError && err.status === 400) {
        setError('Código inválido o expirado. Solicita un nuevo código.');
        setDigits(['', '', '', '', '', '']);
        setPaso(1);
      } else {
        setError('Error al cambiar la contraseña. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthNavbar />
      <div className="login-page">

        {/* ── Izquierda: ilustración ── */}
        <div className="login-left">
          <div className="login-left__text">
            <h2 className="login-left__title">
              Todo lo que tu mascota<br />necesita, en un solo lugar.{' '}
              <Heart size={28} style={{ display: 'inline', verticalAlign: 'middle', color: '#e07b54', fill: '#e07b54' }} />
            </h2>
            <p className="login-left__sub">
              Conectamos dueños y empresas de confianza<br />
              para el mejor cuidado de tu mascota{' '}
              <PawPrint size={16} style={{ display: 'inline', verticalAlign: 'middle' }} />
            </p>
          </div>
          <div className="login-left__illo">
            <img src={catAndDog} alt="Perro y gato" className="login-left__img" />
          </div>
        </div>

        {/* ── Derecha: wizard ── */}
        <div className="login-right">
          <div className="login-card">

            {/* Indicador de pasos (solo si no estamos en éxito) */}
            {paso < 3 && (
              <div className="login-steps">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className={`login-step-dot${paso === i ? ' login-step-dot--active' : ''}`}
                  />
                ))}
              </div>
            )}

            {error && <div className="login-error">{error}</div>}

            {/* ════ Paso 0: ingresar correo ════ */}
            {paso === 0 && (
              <>
                <h1 className="login-card__title">Recuperar contraseña</h1>
                <p className="login-card__sub">
                  {tipo === 'empresa' ? 'Cuenta empresa / negocio' : 'Cuenta de usuario'}
                </p>
                <p className="login-card__sub" style={{ marginTop: '-14px', marginBottom: '24px', fontSize: '0.85rem' }}>
                  Te enviaremos un código de 6 dígitos a tu correo.
                </p>

                <form onSubmit={enviarCodigo} className="login-form">
                  <div className="login-field">
                    <label className="login-label">Correo electrónico</label>
                    <div className="login-input-wrap">
                      <Mail size={16} className="login-input-icon" />
                      <input
                        type="email"
                        className="login-input"
                        placeholder="ejemplo@correo.com"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="login-btn-primary" disabled={loading}>
                    {loading ? 'Enviando...' : 'Enviar código'}
                  </button>

                  <p className="login-register-link">
                    <Link to={loginPath}>← Volver al inicio de sesión</Link>
                  </p>
                </form>
              </>
            )}

            {/* ════ Paso 1: ingresar código ════ */}
            {paso === 1 && (
              <>
                <h1 className="login-card__title">Ingresa el código</h1>
                <p className="login-card__sub">
                  Enviamos un código de 6 dígitos a<br />
                  <strong style={{ color: '#333' }}>{correo}</strong>
                </p>
                <p className="login-card__sub" style={{ marginTop: '-10px', marginBottom: '20px', fontSize: '0.8rem' }}>
                  Revisa también la carpeta de spam. Expira en 15 minutos.
                </p>

                <form onSubmit={verificarCodigo} className="login-form">
                  <div className="code-inputs">
                    {digits.map((d, i) => (
                      <input
                        key={i}
                        ref={el => inputRefs.current[i] = el}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        className="code-input"
                        value={d}
                        onChange={e => handleDigitChange(i, e.target.value)}
                        onKeyDown={e => handleDigitKeyDown(i, e)}
                        onPaste={handleDigitPaste}
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="login-btn-primary"
                    disabled={digits.join('').length < 6}
                  >
                    Continuar
                  </button>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                    <button
                      type="button"
                      className="login-back-link"
                      onClick={() => { setError(''); setDigits(['', '', '', '', '', '']); setPaso(0); }}
                    >
                      Cambiar correo
                    </button>
                    <button
                      type="button"
                      className="login-back-link"
                      onClick={async () => {
                        setError('');
                        setLoading(true);
                        try {
                          tipo === 'empresa'
                            ? await api.auth.forgotPasswordEmpresa(correo)
                            : await api.auth.forgotPassword(correo);
                          setDigits(['', '', '', '', '', '']);
                        } catch {
                          setError('No se pudo reenviar el código. Intenta de nuevo.');
                        } finally {
                          setLoading(false);
                        }
                      }}
                      disabled={loading}
                    >
                      {loading ? 'Reenviando...' : '¿No recibiste el código? Reenviar'}
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* ════ Paso 2: nueva contraseña ════ */}
            {paso === 2 && (
              <>
                <h1 className="login-card__title">Nueva contraseña</h1>
                <p className="login-card__sub">Crea una contraseña segura para tu cuenta.</p>

                <form onSubmit={cambiarContrasena} className="login-form">
                  <div className="login-field">
                    <label className="login-label">Nueva contraseña</label>
                    <div className="login-input-wrap">
                      <Lock size={16} className="login-input-icon" />
                      <input
                        type={showPass ? 'text' : 'password'}
                        className="login-input"
                        placeholder="Mínimo 6 caracteres"
                        value={nuevaContrasena}
                        onChange={e => setNueva(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="login-input-toggle"
                        onClick={() => setShowPass(p => !p)}
                        tabIndex={-1}
                      >
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="login-field">
                    <label className="login-label">Confirmar contraseña</label>
                    <div className="login-input-wrap">
                      <Lock size={16} className="login-input-icon" />
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        className="login-input"
                        placeholder="Repite tu contraseña"
                        value={confirmar}
                        onChange={e => setConfirmar(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="login-input-toggle"
                        onClick={() => setShowConfirm(p => !p)}
                        tabIndex={-1}
                      >
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="login-btn-primary" disabled={loading}>
                    {loading ? 'Guardando...' : 'Cambiar contraseña'}
                  </button>

                  <button
                    type="button"
                    className="login-back-link"
                    style={{ textAlign: 'center' }}
                    onClick={() => { setError(''); setPaso(1); }}
                  >
                    ← Volver
                  </button>
                </form>
              </>
            )}

            {/* ════ Paso 3: éxito ════ */}
            {paso === 3 && (
              <div className="login-success">
                <div className="login-success__icon">
                  <CheckCircle size={40} />
                </div>
                <h1 className="login-card__title">¡Contraseña actualizada!</h1>
                <p className="login-card__sub" style={{ marginBottom: '28px' }}>
                  Tu contraseña ha sido restablecida exitosamente.<br />Ya puedes iniciar sesión con tu nueva contraseña.
                </p>
                <button
                  className="login-btn-primary"
                  onClick={() => navigate(loginPath)}
                >
                  Ir al inicio de sesión
                </button>
              </div>
            )}

          </div>
        </div>
      </div>

      <div className="login-footer">
        <span>Hecho con <Heart size={14} /> para las mascotas de Chile</span>
      </div>
    </>
  );
};

export default RecuperarContrasena;
