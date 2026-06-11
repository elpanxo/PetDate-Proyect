import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';
import api, { ApiError, BASE_URL, token } from '../../api/petdate-api';
import { Dog, Cat, Bird, Rabbit, Turtle, Fish, PawPrint, Hourglass, TriangleAlert, Pencil, Trash2, User, Star } from 'lucide-react';
import './MisMascotas.css';

// ─────────────────────────────────────────────
// Constantes
// ─────────────────────────────────────────────
const TIPOS_MASCOTA = ['Perro', 'Gato', 'Ave', 'Conejo', 'Reptil', 'Pez', 'Otro'];

const ICON_TIPO = {
  Perro: Dog, Gato: Cat, Ave: Bird, Conejo: Rabbit,
  Reptil: Turtle, Pez: Fish, Otro: PawPrint,
};

const FORM_INICIAL = {
  nombre: '', tipo: 'Perro', raza: '', edad: '', sexo: 'Macho',
  peso: '', fechaNacimiento: '', color: '', observaciones: '', infoMedica: '',
};

// ─────────────────────────────────────────────
// Helpers de mapeo frontend ↔ backend
// ─────────────────────────────────────────────
function formToRequest(form, usuarioId) {
  return {
    nombre: form.nombre, especie: form.tipo,
    raza: form.raza || 'Sin especificar', edad: Number(form.edad) || 0,
    sexo: form.sexo, tamano: 'Mediano', peso: parseFloat(form.peso) || 0,
    fecha_nacimineto: form.fechaNacimiento || null, color: form.color || '',
    observaciones: form.observaciones || '', info_medica_basica: form.infoMedica || '',
    usuarioId,
  };
}

function responseToForm(mascota) {
  return {
    nombre: mascota.nombre, tipo: mascota.especie, raza: mascota.raza,
    edad: String(mascota.edad), sexo: mascota.sexo, peso: String(mascota.peso),
    fechaNacimiento: mascota.fecha_nacimineto ? mascota.fecha_nacimineto.slice(0, 10) : '',
    color: mascota.color || '', observaciones: mascota.observaciones || '',
    infoMedica: mascota.info_medica_basica || '',
  };
}

// ─────────────────────────────────────────────
// Sub-componente: estrellas de visualización
// ─────────────────────────────────────────────
function StarDisplay({ value }) {
  return (
    <span className="perfil-stars">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={13}
          fill={i <= value ? '#f59e0b' : 'none'}
          color={i <= value ? '#f59e0b' : '#d1d5db'}
          strokeWidth={1.5}
        />
      ))}
    </span>
  );
}

// ─────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────
function MisMascotas() {
  const navigate = useNavigate();

  // ─── Usuario y perfil ───
  const [usuario, setUsuario]       = useState(null);
  const [perfilData, setPerfilData] = useState(null);
  const [tabActiva, setTabActiva]   = useState('perfil');

  // Editar perfil
  const [editandoPerfil, setEditandoPerfil]     = useState(false);
  const [formPerfil, setFormPerfil]             = useState({ nombre: '', telefono: '', sobreMi: '', contrasena: '' });
  const [guardandoPerfil, setGuardandoPerfil]   = useState(false);
  const [errorPerfil, setErrorPerfil]           = useState('');

  // ─── Calificaciones ───
  const [califBlog, setCalifBlog]       = useState([]);
  const [califServicio, setCalifServicio] = useState([]);
  const [cargandoCalif, setCargandoCalif] = useState(false);
  const [blogsMap, setBlogsMap]         = useState({});
  const [serviciosMap, setServiciosMap] = useState({});

  // Modal editar calificación
  const [editandoCalif, setEditandoCalif]     = useState(null);
  const [formCalif, setFormCalif]             = useState({ texto: '', calificacion: 5 });
  const [guardandoCalif, setGuardandoCalif]   = useState(false);

  // ─── Mascotas ───
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  // Modal mascota
  const [showModal, setShowModal]     = useState(false);
  const [editandoId, setEditandoId]   = useState(null);
  const [form, setForm]               = useState(FORM_INICIAL);
  const [errNombre, setErrNombre]     = useState(false);
  const [guardando, setGuardando]     = useState(false);
  const [errorModal, setErrorModal]   = useState('');

  // ─── Verificar sesión al montar ───
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) { navigate('/login'); return; }
    const user = JSON.parse(userData);
    if (!user.id) { navigate('/login'); return; }
    setUsuario(user);
    cargarPerfil(user.id);
    cargarMascotas(user.id);
  }, []);

  // ─── Cargar perfil del backend ───
  const cargarPerfil = async (id) => {
    try {
      const data = await api.usuarios.porId(id);
      setPerfilData(data);
      setFormPerfil({
        nombre: data.nombre || '',
        telefono: data.telefono || '',
        sobreMi: data.direccion || '',
        contrasena: '',
      });
    } catch {
      const u = JSON.parse(localStorage.getItem('user') || '{}');
      setPerfilData(u);
      setFormPerfil({ nombre: u.nombre || '', telefono: u.telefono || '', sobreMi: '', contrasena: '' });
    }
  };

  // ─── Cargar calificaciones (solo al activar esa pestaña) ───
  const cargarCalificaciones = useCallback(async (id) => {
    setCargandoCalif(true);
    try {
      const [pageBlog, pageServ] = await Promise.all([
        api.comentarios.blog.porUsuario(id, { size: 50 }).catch(() => ({ content: [] })),
        api.comentarios.servicio.porUsuario(id, { size: 50 }).catch(() => ({ content: [] })),
      ]);
      const listaBlog = pageBlog.content || [];
      const listaServ = pageServ.content || [];
      setCalifBlog(listaBlog);
      setCalifServicio(listaServ);

      // Enriquecer con títulos/nombres
      const blogIds = [...new Set(listaBlog.map(c => c.idBlog).filter(Boolean))];
      const servIds = [...new Set(listaServ.map(c => c.idServicio).filter(Boolean))];
      const [blogsArr, servsArr] = await Promise.all([
        Promise.all(blogIds.map(bid => api.blogs.porId(bid).catch(() => null))),
        Promise.all(servIds.map(sid => api.servicios.porId(sid).catch(() => null))),
      ]);
      setBlogsMap(Object.fromEntries(blogsArr.filter(Boolean).map(b => [b.idBlog, b])));
      setServiciosMap(Object.fromEntries(servsArr.filter(Boolean).map(s => [s.idServicio, s])));
    } finally {
      setCargandoCalif(false);
    }
  }, []);

  useEffect(() => {
    if (tabActiva === 'calificaciones' && usuario?.id) {
      cargarCalificaciones(usuario.id);
    }
  }, [tabActiva, usuario]);

  // ─── Cargar mascotas ───
  const cargarMascotas = useCallback(async (usuarioId) => {
    setLoading(true); setError('');
    try {
      const page = await api.mascotas.porUsuario(usuarioId, { size: 100 });
      setMascotas(page.content);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) navigate('/login');
      else setError('No se pudieron cargar las mascotas. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // ─────────────────────────────────────────────
  // Perfil: guardar
  // ─────────────────────────────────────────────
  const guardarPerfil = async () => {
    if (!formPerfil.nombre.trim()) { setErrorPerfil('El nombre es obligatorio.'); return; }
    if (!formPerfil.contrasena.trim()) { setErrorPerfil('Debes ingresar tu contraseña para guardar cambios.'); return; }
    setGuardandoPerfil(true); setErrorPerfil('');
    try {
      const updated = await api.usuarios.actualizar(usuario.id, {
        nombre: formPerfil.nombre,
        correo: perfilData.correo,
        contrasena: formPerfil.contrasena,
        telefono: formPerfil.telefono,
        direccion: formPerfil.sobreMi,
        consentimientoInformado: true,
      });
      setPerfilData(updated);
      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...stored, nombre: updated.nombre, correo: updated.correo, telefono: updated.telefono }));
      window.dispatchEvent(new Event('userChanged'));
      setEditandoPerfil(false);
      setFormPerfil(p => ({ ...p, contrasena: '' }));
    } catch {
      setErrorPerfil('No se pudo guardar. Verifica tu contraseña e intenta de nuevo.');
    } finally {
      setGuardandoPerfil(false);
    }
  };

  // ─────────────────────────────────────────────
  // Perfil: eliminar cuenta
  // ─────────────────────────────────────────────
  const eliminarCuenta = async () => {
    const confirm1 = window.confirm('¿Estás seguro de que quieres eliminar tu cuenta?\n\nEsto eliminará tu perfil, mascotas y calificaciones. Esta acción no se puede deshacer.');
    if (!confirm1) return;
    try {
      await api.usuarios.eliminar(usuario.id);
      localStorage.removeItem('user');
      token.remove();
      window.dispatchEvent(new Event('userChanged'));
      navigate('/');
    } catch {
      alert('No se pudo eliminar la cuenta. Intenta de nuevo.');
    }
  };

  // ─────────────────────────────────────────────
  // Calificaciones: editar / eliminar
  // ─────────────────────────────────────────────
  const abrirEditarCalif = (tipo, comentario) => {
    setEditandoCalif({ tipo, comentario });
    setFormCalif({ texto: comentario.texto, calificacion: comentario.calificacion });
  };

  const guardarCalif = async () => {
    if (!editandoCalif) return;
    setGuardandoCalif(true);
    try {
      const { tipo, comentario } = editandoCalif;
      if (tipo === 'blog') {
        const updated = await api.comentarios.blog.actualizar(comentario.id, {
          idBlog: comentario.idBlog,
          nombreUsuario: comentario.nombreUsuario,
          texto: formCalif.texto,
          calificacion: formCalif.calificacion,
        });
        setCalifBlog(prev => prev.map(c => c.id === comentario.id ? updated : c));
      } else {
        const updated = await api.comentarios.servicio.actualizar(comentario.id, {
          idServicio: comentario.idServicio,
          nombreUsuario: comentario.nombreUsuario,
          texto: formCalif.texto,
          calificacion: formCalif.calificacion,
        });
        setCalifServicio(prev => prev.map(c => c.id === comentario.id ? updated : c));
      }
      setEditandoCalif(null);
    } catch {
      alert('No se pudo guardar la calificación.');
    } finally {
      setGuardandoCalif(false);
    }
  };

  const eliminarCalif = async (tipo, id) => {
    if (!window.confirm('¿Eliminar esta calificación?')) return;
    try {
      if (tipo === 'blog') {
        await api.comentarios.blog.eliminar(id);
        setCalifBlog(prev => prev.filter(c => c.id !== id));
      } else {
        await api.comentarios.servicio.eliminar(id);
        setCalifServicio(prev => prev.filter(c => c.id !== id));
      }
    } catch {
      alert('No se pudo eliminar la calificación.');
    }
  };

  // ─────────────────────────────────────────────
  // Mascotas: modal
  // ─────────────────────────────────────────────
  const abrirAgregar = () => {
    setEditandoId(null); setForm(FORM_INICIAL); setErrNombre(false); setErrorModal(''); setShowModal(true);
  };

  const abrirEditar = (mascota, e) => {
    e.stopPropagation();
    setEditandoId(mascota.id); setForm(responseToForm(mascota));
    setErrNombre(false); setErrorModal(''); setShowModal(true);
  };

  const eliminar = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('¿Seguro que quieres eliminar esta mascota?')) return;
    try {
      await api.mascotas.eliminar(id);
      setMascotas(prev => prev.filter(m => m.id !== id));
    } catch {
      alert('No se pudo eliminar la mascota. Intenta de nuevo.');
    }
  };

  const handleImagen = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm(prev => ({ ...prev, _imagenFile: file }));
    const reader = new FileReader();
    reader.onload = (ev) => setForm(prev => ({ ...prev, imagen: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const guardar = async () => {
    if (!form.nombre.trim()) { setErrNombre(true); return; }
    setGuardando(true); setErrorModal('');
    try {
      const body = formToRequest(form, usuario.id);
      let mascotaGuardada;
      if (editandoId) {
        mascotaGuardada = await api.mascotas.actualizar(editandoId, body);
        setMascotas(prev => prev.map(m => m.id === editandoId ? mascotaGuardada : m));
      } else {
        mascotaGuardada = await api.mascotas.crear(body);
        setMascotas(prev => [...prev, mascotaGuardada]);
      }
      if (form._imagenFile) {
        const formData = new FormData();
        formData.append('imagen', form._imagenFile);
        const response = await fetch(`${BASE_URL}/mascotas/${mascotaGuardada.id}/imagen`, {
          method: 'POST',
          headers: token.exists() ? { Authorization: `Bearer ${token.get()}` } : {},
          body: formData,
        });
        const mascotaConImagen = await response.json();
        setMascotas(prev => prev.map(m => m.id === mascotaGuardada.id ? mascotaConImagen : m));
      }
      setShowModal(false);
    } catch {
      setErrorModal('Error al guardar la mascota.');
    } finally {
      setGuardando(false);
    }
  };

  const campo = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const iniciales = (nombre) => {
    if (!nombre) return '?';
    return nombre.trim().split(/\s+/).map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────
  return (
    <>
      <Navbar />

      <div className="perfil-page">

        {/* ══════════════════════════════════════
            PANEL IZQUIERDO — Perfil
            ══════════════════════════════════════ */}
        <aside className="perfil-panel">

          {/* Tabs */}
          <div className="perfil-tabs">
            <button
              className={`perfil-tab${tabActiva === 'perfil' ? ' perfil-tab--activa' : ''}`}
              onClick={() => setTabActiva('perfil')}
            >
              <User size={15} /> Mi Perfil
            </button>
            <button
              className={`perfil-tab${tabActiva === 'calificaciones' ? ' perfil-tab--activa' : ''}`}
              onClick={() => setTabActiva('calificaciones')}
            >
              <Star size={15} /> Mis Calificaciones
            </button>
          </div>

          {/* ── Tab: Mi Perfil ── */}
          {tabActiva === 'perfil' && (
            <div className="perfil-content">
              <div className="perfil-avatar">
                <span className="perfil-avatar__iniciales">{iniciales(perfilData?.nombre)}</span>
              </div>

              {!editandoPerfil ? (
                <>
                  <div className="perfil-info">
                    <h2 className="perfil-nombre">{perfilData?.nombre}</h2>
                    {perfilData?.direccion && (
                      <p className="perfil-bio">{perfilData.direccion}</p>
                    )}
                    <div className="perfil-datos">
                      <div className="perfil-dato">
                        <span className="perfil-dato__label">Correo</span>
                        <span className="perfil-dato__valor">{perfilData?.correo}</span>
                      </div>
                      {perfilData?.telefono && (
                        <div className="perfil-dato">
                          <span className="perfil-dato__label">Teléfono</span>
                          <span className="perfil-dato__valor">{perfilData.telefono}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="perfil-acciones">
                    <button className="perfil-btn perfil-btn--editar" onClick={() => { setEditandoPerfil(true); setErrorPerfil(''); }}>
                      <Pencil size={14} /> Editar perfil
                    </button>
                    <button className="perfil-btn perfil-btn--eliminar" onClick={eliminarCuenta}>
                      <Trash2 size={14} /> Eliminar cuenta
                    </button>
                  </div>
                </>
              ) : (
                <div className="perfil-form">
                  {errorPerfil && (
                    <div className="alert alert-danger py-2 px-3 mb-3 small">{errorPerfil}</div>
                  )}

                  <Form.Group className="mb-3">
                    <Form.Label className="perfil-form__label">Nombre</Form.Label>
                    <Form.Control
                      value={formPerfil.nombre}
                      onChange={e => setFormPerfil(p => ({ ...p, nombre: e.target.value }))}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="perfil-form__label">Sobre mí</Form.Label>
                    <Form.Control
                      as="textarea" rows={3} maxLength={200}
                      value={formPerfil.sobreMi}
                      onChange={e => setFormPerfil(p => ({ ...p, sobreMi: e.target.value }))}
                      placeholder="Cuéntanos algo sobre ti..."
                    />
                    <Form.Text className="text-muted">{formPerfil.sobreMi.length}/200</Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="perfil-form__label">Teléfono</Form.Label>
                    <Form.Control
                      value={formPerfil.telefono}
                      onChange={e => setFormPerfil(p => ({ ...p, telefono: e.target.value }))}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="perfil-form__label">
                      Contraseña <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="password"
                      value={formPerfil.contrasena}
                      onChange={e => setFormPerfil(p => ({ ...p, contrasena: e.target.value }))}
                      placeholder="Ingresa tu contraseña para confirmar"
                    />
                  </Form.Group>

                  <div className="perfil-form-acciones">
                    <button
                      className="perfil-btn perfil-btn--cancelar"
                      onClick={() => { setEditandoPerfil(false); setErrorPerfil(''); }}
                      disabled={guardandoPerfil}
                    >
                      Cancelar
                    </button>
                    <button
                      className="perfil-btn perfil-btn--guardar"
                      onClick={guardarPerfil}
                      disabled={guardandoPerfil}
                    >
                      {guardandoPerfil ? 'Guardando...' : 'Guardar'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Tab: Mis Calificaciones ── */}
          {tabActiva === 'calificaciones' && (
            <div className="perfil-content">
              {cargandoCalif ? (
                <div className="perfil-calif-empty">
                  <Hourglass size={24} color="#9b7eb8" />
                  <p>Cargando calificaciones...</p>
                </div>
              ) : califBlog.length === 0 && califServicio.length === 0 ? (
                <div className="perfil-calif-empty">
                  <Star size={30} color="#c5b0db" />
                  <p>Aún no has dejado ninguna calificación.</p>
                </div>
              ) : (
                <div className="perfil-calif-lista">

                  {califBlog.length > 0 && (
                    <section className="perfil-calif-seccion">
                      <h4 className="perfil-calif-seccion__titulo">En blogs</h4>
                      {califBlog.map(c => (
                        <div key={c.id} className="perfil-calif-item">
                          <div className="perfil-calif-item__header">
                            <span className="perfil-calif-item__nombre">
                              {blogsMap[c.idBlog]?.titulo || `Blog #${c.idBlog}`}
                            </span>
                            <StarDisplay value={c.calificacion} />
                          </div>
                          <p className="perfil-calif-item__texto">{c.texto}</p>
                          <div className="perfil-calif-item__actions">
                            <button className="perfil-calif-btn perfil-calif-btn--edit" onClick={() => abrirEditarCalif('blog', c)}>
                              <Pencil size={11} /> Editar
                            </button>
                            <button className="perfil-calif-btn perfil-calif-btn--delete" onClick={() => eliminarCalif('blog', c.id)}>
                              <Trash2 size={11} /> Eliminar
                            </button>
                          </div>
                        </div>
                      ))}
                    </section>
                  )}

                  {califServicio.length > 0 && (
                    <section className="perfil-calif-seccion">
                      <h4 className="perfil-calif-seccion__titulo">En servicios</h4>
                      {califServicio.map(c => (
                        <div key={c.id} className="perfil-calif-item">
                          <div className="perfil-calif-item__header">
                            <span className="perfil-calif-item__nombre">
                              {serviciosMap[c.idServicio]?.nombreServicio || `Servicio #${c.idServicio}`}
                            </span>
                            <StarDisplay value={c.calificacion} />
                          </div>
                          <p className="perfil-calif-item__texto">{c.texto}</p>
                          <div className="perfil-calif-item__actions">
                            <button className="perfil-calif-btn perfil-calif-btn--edit" onClick={() => abrirEditarCalif('servicio', c)}>
                              <Pencil size={11} /> Editar
                            </button>
                            <button className="perfil-calif-btn perfil-calif-btn--delete" onClick={() => eliminarCalif('servicio', c.id)}>
                              <Trash2 size={11} /> Eliminar
                            </button>
                          </div>
                        </div>
                      ))}
                    </section>
                  )}

                </div>
              )}
            </div>
          )}
        </aside>

        {/* ══════════════════════════════════════
            PANEL DERECHO — Mis Mascotas
            ══════════════════════════════════════ */}
        <main className="perfil-mascotas">
          <div className="mm-header">
            <div>
              <h1 className="mm-titulo"><PawPrint size={22} /> Mis Mascotas</h1>
              <p className="mm-subtitulo">Gestiona el perfil y la agenda de tus compañeros</p>
            </div>
            <button className="mm-btn-agregar" onClick={abrirAgregar}>+ Agregar Mascota</button>
          </div>

          {loading && (
            <div className="mm-empty">
              <div className="mm-empty-icon"><Hourglass size={32} /></div>
              <h3>Cargando mascotas...</h3>
            </div>
          )}

          {!loading && error && (
            <div className="mm-empty">
              <div className="mm-empty-icon"><TriangleAlert size={32} /></div>
              <h3>{error}</h3>
              <button className="mm-btn-agregar" onClick={() => cargarMascotas(usuario?.id)}>Reintentar</button>
            </div>
          )}

          {!loading && !error && mascotas.length === 0 && (
            <div className="mm-empty">
              <div className="mm-empty-icon"><PawPrint size={32} /></div>
              <h3>Aún no tienes mascotas registradas</h3>
              <p>Agrega tu primera mascota para empezar a gestionar su perfil y agenda</p>
              <button className="mm-btn-agregar" onClick={abrirAgregar}>+ Agregar mi primera mascota</button>
            </div>
          )}

          {!loading && !error && mascotas.length > 0 && (
            <div className="mm-grid">
              {mascotas.map(m => (
                <div className="mm-card" key={m.id} onClick={() => navigate(`/mis-mascotas/${m.id}`)}>
                  <div className="mm-card-img">
                    {m.imagenUrl
                      ? <img src={`${BASE_URL}${m.imagenUrl}`} alt={m.nombre} className="mm-card-foto" />
                      : (() => { const I = ICON_TIPO[m.especie] || PawPrint; return <I className="mm-card-emoji" size={40} />; })()
                    }
                  </div>
                  <div className="mm-card-body">
                    <h3 className="mm-card-nombre">{m.nombre}</h3>
                    <p className="mm-card-tipo">{m.especie}{m.raza ? ` · ${m.raza}` : ''}</p>
                    {m.edad > 0 && <p className="mm-card-edad">{m.edad} {m.edad === 1 ? 'año' : 'años'}</p>}
                  </div>
                  <div className="mm-card-actions">
                    <button className="mm-btn-edit" onClick={(e) => abrirEditar(m, e)}><Pencil size={14} /> Editar</button>
                    <button className="mm-btn-delete" onClick={(e) => eliminar(m.id, e)}><Trash2 size={14} /> Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ── Modal editar calificación ── */}
      <Modal show={!!editandoCalif} onHide={() => setEditandoCalif(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar calificación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Calificación</Form.Label>
            <div className="perfil-star-picker">
              {[1, 2, 3, 4, 5].map(i => (
                <button
                  key={i} type="button"
                  className={`perfil-star-pick${formCalif.calificacion >= i ? ' perfil-star-pick--on' : ''}`}
                  onClick={() => setFormCalif(p => ({ ...p, calificacion: i }))}
                >
                  <Star size={24}
                    fill={formCalif.calificacion >= i ? '#f59e0b' : 'none'}
                    color={formCalif.calificacion >= i ? '#f59e0b' : '#d1d5db'}
                    strokeWidth={1.5}
                  />
                </button>
              ))}
            </div>
          </Form.Group>
          <Form.Group>
            <Form.Label>Comentario</Form.Label>
            <Form.Control
              as="textarea" rows={3} maxLength={100}
              value={formCalif.texto}
              onChange={e => setFormCalif(p => ({ ...p, texto: e.target.value }))}
            />
            <Form.Text className="text-muted">{formCalif.texto.length}/100</Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditandoCalif(null)} disabled={guardandoCalif}>
            Cancelar
          </Button>
          <Button style={{ backgroundColor: '#7e6492', border: 'none' }} onClick={guardarCalif} disabled={guardandoCalif}>
            {guardandoCalif ? 'Guardando...' : 'Guardar'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ── Modal agregar / editar mascota ── */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{editandoId ? 'Editar mascota' : 'Agregar mascota'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorModal && <div className="alert alert-danger" role="alert">{errorModal}</div>}
          <Form>
            <div className="mm-form-grid">
              <Form.Group className="mm-form-full">
                <Form.Label>Foto de la mascota</Form.Label>
                <Form.Control type="file" accept="image/*" onChange={handleImagen} />
                {form.imagen && <img src={form.imagen} alt="preview" className="mm-img-preview" />}
                <Form.Text className="text-muted">La foto se guarda en el servidor y estará disponible en cualquier dispositivo.</Form.Text>
              </Form.Group>
              <Form.Group>
                <Form.Label>Nombre <span className="text-danger">*</span></Form.Label>
                <Form.Control value={form.nombre} isInvalid={errNombre}
                  onChange={e => { campo('nombre', e.target.value); setErrNombre(false); }} />
                {errNombre && <Form.Text className="text-danger">El nombre es obligatorio</Form.Text>}
              </Form.Group>
              <Form.Group>
                <Form.Label>Tipo de mascota</Form.Label>
                <Form.Select value={form.tipo} onChange={e => campo('tipo', e.target.value)}>
                  {TIPOS_MASCOTA.map(t => <option key={t}>{t}</option>)}
                </Form.Select>
              </Form.Group>
              <Form.Group>
                <Form.Label>Raza</Form.Label>
                <Form.Control value={form.raza} onChange={e => campo('raza', e.target.value)} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Edad (años)</Form.Label>
                <Form.Control type="number" min="0" max="50" value={form.edad} onChange={e => campo('edad', e.target.value)} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Sexo</Form.Label>
                <Form.Select value={form.sexo} onChange={e => campo('sexo', e.target.value)}>
                  <option>Macho</option><option>Hembra</option>
                </Form.Select>
              </Form.Group>
              <Form.Group>
                <Form.Label>Peso (kg)</Form.Label>
                <Form.Control type="number" step="0.1" min="0" value={form.peso} onChange={e => campo('peso', e.target.value)} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Fecha de nacimiento</Form.Label>
                <Form.Control type="date" value={form.fechaNacimiento} onChange={e => campo('fechaNacimiento', e.target.value)} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Color</Form.Label>
                <Form.Control value={form.color} onChange={e => campo('color', e.target.value)} />
              </Form.Group>
              <Form.Group className="mm-form-full">
                <Form.Label>Observaciones</Form.Label>
                <Form.Control as="textarea" rows={2} value={form.observaciones} onChange={e => campo('observaciones', e.target.value)} />
              </Form.Group>
              <Form.Group className="mm-form-full">
                <Form.Label>Información médica básica</Form.Label>
                <Form.Control as="textarea" rows={2} value={form.infoMedica} onChange={e => campo('infoMedica', e.target.value)} />
              </Form.Group>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)} disabled={guardando}>Cancelar</Button>
          <Button style={{ backgroundColor: '#7e6492', border: 'none' }} onClick={guardar} disabled={guardando}>
            {guardando ? (editandoId ? 'Guardando...' : 'Agregando...') : (editandoId ? 'Guardar cambios' : 'Agregar mascota')}
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </>
  );
}

export default MisMascotas;
