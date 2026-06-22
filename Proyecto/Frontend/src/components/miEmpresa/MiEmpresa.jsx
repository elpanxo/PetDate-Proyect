import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';
import { TIPO_COLOR, COMUNAS } from '../servicios/serviciosData';
import { Building2, ClipboardList, CheckCircle2, Tag, Pencil, Trash2, Image as ImageIcon, Newspaper, MapPin, Phone, MessageCircle, Globe, Clock, Eye, BookOpen, X } from 'lucide-react';
import ConfirmModal from '../confirm/ConfirmModal';

// SVGs inline para redes que no están en lucide-react
function InstagramIcon({ size = 16, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function FacebookIcon({ size = 16, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}
import api, { BASE_URL } from '../../api/petdate-api';
import './MiEmpresa.css';

const COMUNAS_LISTA = COMUNAS.filter(c => c !== 'Todas');

const RUBROS_EMPRESA = [
  { label: 'Veterinaria',                  valor: 'Veterinaria' },
  { label: 'Veterinaria 24/7',             valor: 'Veterinaria 24/7' },
  { label: 'Servicios (Peluquería / Spa)', valor: 'Peluquería / Spa' },
  { label: 'Tienda de mascotas',           valor: 'Tienda de mascotas' },
];

const HORARIOS_PRESET = ['Lunes a Viernes', 'Lunes a Sábado', 'Todos los días', 'Lunes a Domingo 24/7'];
const TIPOS_IMAGEN_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp'];
const TAMANO_MAX_MB = 5;

function MiEmpresa() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => { if (!user || user.role !== 'empresa') navigate('/'); }, []);

  const [cargando, setCargando]     = useState(true);
  const [errorCarga, setErrorCarga] = useState('');
  const [formServicio, setFormServicio] = useState({
    nombre: '', tipo: '', descripcion: '', direccion: '',
    comuna: '', horario: '', horaDesde: '', horaHasta: '',
    telefono: '', wsp: '', web: '', instagram: '', facebook: '',
  });
  const [guardado, setGuardado]   = useState(false);
  const [guardando, setGuardando] = useState(false);

  const [imagenUrl, setImagenUrl]           = useState('');
  const [imagenPreview, setImagenPreview]   = useState(null);
  const [archivoImagen, setArchivoImagen]   = useState(null);
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [errorImagen, setErrorImagen]       = useState('');

  const [promociones, setPromociones]           = useState([]);
  const [showModal, setShowModal]               = useState(false);
  const [editandoPromoId, setEditandoPromoId]   = useState(null);
  const [formPromo, setFormPromo]               = useState({ titulo: '', descripcion: '', fechaInicio: '', fechaTermino: '' });
  const [errPromo, setErrPromo]                 = useState({});
  const [guardandoPromo, setGuardandoPromo]     = useState(false);

  const [blogs, setBlogs]                         = useState([]);
  const [showModalBlog, setShowModalBlog]         = useState(false);
  const [editandoBlogId, setEditandoBlogId]       = useState(null);
  const [formBlog, setFormBlog]                   = useState({ titulo: '', texto: '' });
  const [errBlog, setErrBlog]                     = useState({});
  const [guardandoBlog, setGuardandoBlog]         = useState(false);
  const [imagenActualBlog, setImagenActualBlog]   = useState('');
  const [archivoImagenBlog, setArchivoImagenBlog] = useState(null);
  const [imagenPreviewBlog, setImagenPreviewBlog] = useState(null);
  const [errorImagenBlog, setErrorImagenBlog]     = useState('');

  const [confirmPromo, setConfirmPromo] = useState(null); // idPromocion
  const [confirmBlog, setConfirmBlog]   = useState(null); // idBlog

  useEffect(() => {
    if (!user?.servicioId) return;
    const cargar = async () => {
      try {
        const [svc, promos, entradasBlog] = await Promise.all([
          api.servicios.porId(user.servicioId),
          api.promociones.porServicio(user.servicioId, { size: 100 }),
          api.blogs.porServicio(user.servicioId, { size: 100, sort: 'fecha,desc' }),
        ]);
        setFormServicio({
          nombre:      svc.nombreServicio || '',
          tipo:        svc.tipoServicio   || '',
          descripcion: svc.descripcion    || '',
          direccion:   svc.direccion      || '',
          comuna:      svc.comuna         || '',
          horario:     svc.horario        || '',
          horaDesde:   '',
          horaHasta:   '',
          telefono:    svc.telefono       || '',
          wsp:         svc.whatsApp       || '',
          web:         svc.sitioWeb       || '',
          instagram:   svc.instagram      || '',
          facebook:    svc.facebook       || '',
        });
        setImagenUrl(svc.imagenUrl || '');
        setPromociones(promos.content || []);
        setBlogs(entradasBlog.content || []);
      } catch { setErrorCarga('No se pudo cargar la información de tu empresa.'); }
      finally  { setCargando(false); }
    };
    cargar();
  }, []);

  useEffect(() => () => { if (imagenPreview) URL.revokeObjectURL(imagenPreview); }, [imagenPreview]);
  useEffect(() => () => { if (imagenPreviewBlog) URL.revokeObjectURL(imagenPreviewBlog); }, [imagenPreviewBlog]);

  const campo = (f, v) => setFormServicio(p => ({ ...p, [f]: v }));

  const guardarServicio = async () => {
    setGuardando(true);
    try {
      const u = JSON.parse(localStorage.getItem('user'));
      await api.servicios.actualizar(u.servicioId, {
        nombreServicio: formServicio.nombre, tipoServicio: formServicio.tipo,
        rutEmpresa: u.rut || '', correo: u.email || '', contrasena: u.contrasena || '',
        descripcion: formServicio.descripcion, direccion: formServicio.direccion,
        comuna: formServicio.comuna, horario: formServicio.horario,
        telefono: formServicio.telefono, whatsApp: formServicio.wsp,
        sitioWeb: formServicio.web, instagram: formServicio.instagram, facebook: formServicio.facebook,
      });
      u.name = formServicio.nombre;
      localStorage.setItem('user', JSON.stringify(u));
      window.dispatchEvent(new Event('userChanged'));
      setGuardado(true);
      setTimeout(() => setGuardado(false), 3000);
    } catch { alert('Error al guardar los cambios. Intenta nuevamente.'); }
    finally  { setGuardando(false); }
  };

  const seleccionarImagen = (e) => {
    const archivo = e.target.files?.[0]; setErrorImagen('');
    if (!archivo) return;
    if (!TIPOS_IMAGEN_PERMITIDOS.includes(archivo.type)) { setErrorImagen('Formato no permitido. Usa JPG, PNG o WEBP.'); e.target.value = ''; return; }
    if (archivo.size > TAMANO_MAX_MB * 1024 * 1024) { setErrorImagen(`La imagen no puede superar los ${TAMANO_MAX_MB} MB.`); e.target.value = ''; return; }
    setArchivoImagen(archivo); setImagenPreview(URL.createObjectURL(archivo));
  };

  const subirImagen = async () => {
    if (!archivoImagen || !user?.servicioId) return;
    setSubiendoImagen(true); setErrorImagen('');
    try {
      const actualizado = await api.servicios.subirImagen(user.servicioId, archivoImagen);
      setImagenUrl(actualizado.imagenUrl || ''); setArchivoImagen(null); setImagenPreview(null);
    } catch { setErrorImagen('No se pudo subir la imagen. Intenta nuevamente.'); }
    finally  { setSubiendoImagen(false); }
  };

  const cancelarSeleccionImagen = () => { setArchivoImagen(null); setImagenPreview(null); setErrorImagen(''); };

  const recargarPromociones = async () => { const p = await api.promociones.porServicio(user.servicioId, { size: 100 }); setPromociones(p.content || []); };

  const abrirAgregarPromo  = () => { setEditandoPromoId(null); setFormPromo({ titulo: '', descripcion: '', fechaInicio: '', fechaTermino: '' }); setErrPromo({}); setShowModal(true); };
  const abrirEditarPromo   = (p) => { setEditandoPromoId(p.idPromocion); setFormPromo({ titulo: p.titulo || '', descripcion: p.descripcion || '', fechaInicio: p.fechaInicio || '', fechaTermino: p.fechaTermino || '' }); setErrPromo({}); setShowModal(true); };
  const eliminarPromo      = (id) => setConfirmPromo(id);
  const confirmarEliminarPromo = async () => {
    const id = confirmPromo;
    setConfirmPromo(null);
    try { await api.promociones.eliminar(id); await recargarPromociones(); } catch { alert('Error al eliminar la promoción.'); }
  };

  const validarPromo = () => {
    const e = {};
    if (!formPromo.titulo.trim()) e.titulo = 'El título es obligatorio';
    if (!formPromo.fechaInicio)   e.fechaInicio = 'La fecha de inicio es obligatoria';
    if (!formPromo.fechaTermino)  e.fechaTermino = 'La fecha de término es obligatoria';
    if (formPromo.fechaInicio && formPromo.fechaTermino && formPromo.fechaTermino < formPromo.fechaInicio) e.fechaTermino = 'La fecha de término debe ser posterior al inicio';
    return e;
  };

  const guardarPromo = async () => {
    const errs = validarPromo(); if (Object.keys(errs).length) { setErrPromo(errs); return; }
    setGuardandoPromo(true);
    try {
      const payload = { idServicio: user.servicioId, titulo: formPromo.titulo, descripcion: formPromo.descripcion, fechaInicio: formPromo.fechaInicio, fechaTermino: formPromo.fechaTermino };
      if (editandoPromoId) await api.promociones.actualizar(editandoPromoId, payload);
      else await api.promociones.crear(payload);
      await recargarPromociones(); setShowModal(false);
    } catch { alert('Error al guardar la promoción. Intenta nuevamente.'); }
    finally  { setGuardandoPromo(false); }
  };

  const recargarBlogs = async () => { const d = await api.blogs.porServicio(user.servicioId, { size: 100, sort: 'fecha,desc' }); setBlogs(d.content || []); };
  const limpiarSeleccionImagenBlog = () => { if (imagenPreviewBlog) URL.revokeObjectURL(imagenPreviewBlog); setArchivoImagenBlog(null); setImagenPreviewBlog(null); setErrorImagenBlog(''); };
  const abrirAgregarBlog = () => { setEditandoBlogId(null); setFormBlog({ titulo: '', texto: '' }); setErrBlog({}); setImagenActualBlog(''); limpiarSeleccionImagenBlog(); setShowModalBlog(true); };
  const abrirEditarBlog  = (b) => { setEditandoBlogId(b.idBlog); setFormBlog({ titulo: b.titulo || '', texto: b.texto || '' }); setErrBlog({}); setImagenActualBlog(b.imagen || ''); limpiarSeleccionImagenBlog(); setShowModalBlog(true); };
  const eliminarBlog     = (id) => setConfirmBlog(id);
  const confirmarEliminarBlog = async () => {
    const id = confirmBlog;
    setConfirmBlog(null);
    try { await api.blogs.eliminar(id); await recargarBlogs(); } catch { alert('Error al eliminar la entrada de blog.'); }
  };

  const seleccionarImagenBlog = (e) => {
    const archivo = e.target.files?.[0]; setErrorImagenBlog('');
    if (!archivo) return;
    if (!TIPOS_IMAGEN_PERMITIDOS.includes(archivo.type)) { setErrorImagenBlog('Formato no permitido. Usa JPG, PNG o WEBP.'); e.target.value = ''; return; }
    if (archivo.size > TAMANO_MAX_MB * 1024 * 1024) { setErrorImagenBlog(`La imagen no puede superar los ${TAMANO_MAX_MB} MB.`); e.target.value = ''; return; }
    if (imagenPreviewBlog) URL.revokeObjectURL(imagenPreviewBlog);
    setArchivoImagenBlog(archivo); setImagenPreviewBlog(URL.createObjectURL(archivo));
  };

  const validarBlog = () => { const e = {}; if (!formBlog.titulo.trim()) e.titulo = 'El título es obligatorio'; if (!formBlog.texto.trim()) e.texto = 'El contenido es obligatorio'; return e; };

  const guardarBlog = async () => {
    const errs = validarBlog(); if (Object.keys(errs).length) { setErrBlog(errs); return; }
    setGuardandoBlog(true);
    try {
      const payload = { idServicio: user.servicioId, titulo: formBlog.titulo, texto: formBlog.texto };
      let blogGuardado;
      if (editandoBlogId) blogGuardado = await api.blogs.actualizar(editandoBlogId, payload);
      else blogGuardado = await api.blogs.crear(payload);
      if (archivoImagenBlog && blogGuardado?.idBlog) { try { await api.blogs.subirImagen(blogGuardado.idBlog, archivoImagenBlog); } catch { setErrorImagenBlog('La entrada se guardó, pero no se pudo subir la imagen.'); } }
      await recargarBlogs(); setShowModalBlog(false);
    } catch { alert('Error al guardar la entrada de blog. Intenta nuevamente.'); }
    finally  { setGuardandoBlog(false); }
  };

  const color   = TIPO_COLOR[formServicio.tipo] || '#7e6492';
  const colorBg = color + '18';
  const fotoSrc = imagenPreview || (imagenUrl ? `${BASE_URL}${imagenUrl}` : null);

  if (cargando) return (<><Navbar /><div className="me-loading">Cargando información de tu empresa...</div><Footer /></>);
  if (errorCarga) return (<><Navbar /><div className="me-loading me-loading--error">{errorCarga}</div><Footer /></>);

  return (
    <>
      <Navbar />
      <div className="me-page">
        <div className="me-layout">

          {/* ════ SIDEBAR IZQUIERDO ════ */}
          <aside className="me-sidebar">

            {/* Foto circular con botón cámara */}
            <div className="me-sidebar__foto-wrap">
              {fotoSrc
                ? <img src={fotoSrc} alt={formServicio.nombre} className="me-sidebar__foto" style={{ borderColor: color }} />
                : <div className="me-sidebar__foto me-sidebar__foto--vacio" style={{ borderColor: color, color, background: colorBg }}>
                    <Building2 size={44} />
                  </div>
              }
              <label className="me-sidebar__camara" htmlFor="me-input-foto" style={{ background: color }}>
                <ImageIcon size={13} />
                <input id="me-input-foto" type="file" accept="image/jpeg,image/png,image/webp" onChange={seleccionarImagen} style={{ display: 'none' }} />
              </label>
            </div>

            {archivoImagen && (
              <div className="me-sidebar__foto-btns">
                <button className="me-btn-cancelar" onClick={cancelarSeleccionImagen} disabled={subiendoImagen}>Cancelar</button>
                <button className="me-btn-guardar" style={{ background: color }} onClick={subirImagen} disabled={subiendoImagen}>
                  {subiendoImagen ? 'Subiendo...' : 'Guardar foto'}
                </button>
              </div>
            )}
            {errorImagen && <p className="me-sidebar__error">{errorImagen}</p>}

            {/* Nombre y badge */}
            <h2 className="me-sidebar__nombre">{formServicio.nombre || 'Mi Empresa'}</h2>
            {formServicio.tipo && <span className="me-sidebar__badge" style={{ color, background: colorBg }}>{formServicio.tipo}</span>}

            {/* Lista de datos */}
            <ul className="me-sidebar__lista">
              {formServicio.direccion && (
                <li>
                  <MapPin size={16} className="me-sidebar__ico" />
                  <span>{formServicio.direccion}{formServicio.comuna ? `, ${formServicio.comuna}` : ''}</span>
                  <Pencil size={12} className="me-sidebar__editar" />
                </li>
              )}
              {formServicio.telefono && (
                <li>
                  <Phone size={16} className="me-sidebar__ico" />
                  <span>{formServicio.telefono}</span>
                  <Pencil size={12} className="me-sidebar__editar" />
                </li>
              )}
              {formServicio.wsp && (
                <li>
                  <MessageCircle size={16} className="me-sidebar__ico" />
                  <span>{formServicio.wsp}<br /><small>(solo números)</small></span>
                  <Pencil size={12} className="me-sidebar__editar" />
                </li>
              )}
              {formServicio.instagram && (
                <li>
                  <InstagramIcon size={16} className="me-sidebar__ico" />
                  <span>@{formServicio.instagram}<br /><small>(sin @)</small></span>
                  <Pencil size={12} className="me-sidebar__editar" />
                </li>
              )}
              {formServicio.web && (
                <li>
                  <Globe size={16} className="me-sidebar__ico" />
                  <span style={{ color }}>{formServicio.web}</span>
                  <Pencil size={12} className="me-sidebar__editar" />
                </li>
              )}
              {formServicio.facebook && (
                <li>
                  <FacebookIcon size={16} className="me-sidebar__ico" />
                  <span>{formServicio.facebook}</span>
                  <Pencil size={12} className="me-sidebar__editar" />
                </li>
              )}
              {formServicio.horario && (
                <li>
                  <Clock size={16} className="me-sidebar__ico" />
                  <span>{formServicio.horario}</span>
                  <Pencil size={12} className="me-sidebar__editar" />
                </li>
              )}
            </ul>

            {/* ── Vista previa del perfil público ── */}
            <section className="me-seccion me-seccion--preview me-sidebar__preview">
              <div className="me-seccion__cabecera" style={{ marginBottom: 0 }}>
                <div className="me-seccion__cabecera-izq">
                  <div className="me-seccion__icono" style={{ background: colorBg, color }}><Eye size={18} /></div>
                  <div>
                    <h2 className="me-seccion__titulo">Vista previa de tu perfil público</h2>
                    <p className="me-seccion__desc">Así es como los usuarios verán tu información en PetDate.</p>
                  </div>
                </div>
                <button className="me-btn-outline" style={{ borderColor: color, color }} onClick={() => navigate(`/servicios/${user.servicioId}`)}>
                  <Eye size={14} /> Ver mi perfil público
                </button>
              </div>
            </section>
          </aside>

          {/* ════ COLUMNA PRINCIPAL ════ */}
          <main className="me-main">

            {/* Encabezado */}
            <div className="me-main-header">
              <div className="me-main-header__icono" style={{ background: colorBg, color }}><Building2 size={22} /></div>
              <div>
                <h1 className="me-main-header__titulo">Mi Empresa</h1>
                <p className="me-main-header__desc">Actualiza la información que será visible para los usuarios de PetDate.</p>
              </div>
            </div>

            {/* ── Sección: Información básica ── */}
            <section className="me-seccion">
              <div className="me-seccion__cabecera">
                <div className="me-seccion__cabecera-izq">
                  <div className="me-seccion__icono" style={{ background: colorBg, color }}><ClipboardList size={18} /></div>
                  <div>
                    <h2 className="me-seccion__titulo">Información básica</h2>
                  </div>
                </div>
                <div className="me-seccion__cabecera-der">
                  {guardado && <span className="me-guardado"><CheckCircle2 size={14} /> Guardado</span>}
                  <button className="me-btn-guardar" style={{ background: color }} onClick={guardarServicio} disabled={guardando}>
                    {guardando ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                </div>
              </div>

              {/* Formulario dos columnas independientes */}
              <div className="me-form-dos-cols">

                {/* Col izquierda */}
                <div className="me-form-col">
                  <div className="me-campo">
                    <label className="me-campo__label">Nombre del servicio <span className="me-req">*</span></label>
                    <input className="me-campo__input" value={formServicio.nombre} maxLength={100} onChange={e => campo('nombre', e.target.value)} />
                    <span className="me-campo__contador">{formServicio.nombre.length}/100</span>
                  </div>
                  <div className="me-campo">
                    <label className="me-campo__label">Descripción <span className="me-req">*</span></label>
                    <textarea className="me-campo__input me-campo__textarea" rows={5} maxLength={300} value={formServicio.descripcion} onChange={e => campo('descripcion', e.target.value)} placeholder="Cuéntanos sobre tu servicio..." />
                    <span className="me-campo__contador">{formServicio.descripcion.length}/300</span>
                  </div>
                  <div className="me-campo">
                    <label className="me-campo__label">Tipo <span className="me-req">*</span></label>
                    <select className="me-campo__input me-campo__select" value={formServicio.tipo} onChange={e => campo('tipo', e.target.value)}>
                      <option value="">Seleccionar tipo</option>
                      {RUBROS_EMPRESA.map(r => <option key={r.valor} value={r.valor}>{r.label}</option>)}
                    </select>
                  </div>
                  <div className="me-campo">
                    <label className="me-campo__label">Sitio web</label>
                    <input className="me-campo__input" style={{ color }} value={formServicio.web} onChange={e => campo('web', e.target.value)} placeholder="www.tuempresa.cl" />
                  </div>
                </div>

                {/* Col derecha */}
                <div className="me-form-col">
                  <div className="me-campo">
                    <label className="me-campo__label">Dirección <span className="me-req">*</span></label>
                    <input className="me-campo__input" value={formServicio.direccion} maxLength={100} onChange={e => campo('direccion', e.target.value)} />
                    <span className="me-campo__contador">{formServicio.direccion.length}/100</span>
                  </div>
                  <div className="me-campo">
                    <label className="me-campo__label">Teléfono <span className="me-req">*</span></label>
                    <input className="me-campo__input" value={formServicio.telefono} onChange={e => campo('telefono', e.target.value)} placeholder="+56 9 XXXX XXXX" />
                  </div>
                  <div className="me-campo">
                    <label className="me-campo__label">WhatsApp (solo números)</label>
                    <input className="me-campo__input" value={formServicio.wsp} onChange={e => campo('wsp', e.target.value)} />
                  </div>
                  <div className="me-campo">
                    <label className="me-campo__label">Instagram (sin @)</label>
                    <input className="me-campo__input" value={formServicio.instagram} onChange={e => campo('instagram', e.target.value)} />
                  </div>
                  <div className="me-campo">
                    <label className="me-campo__label">Facebook</label>
                    <input className="me-campo__input" value={formServicio.facebook} onChange={e => campo('facebook', e.target.value)} />
                  </div>
                  <div className="me-campo">
                    <label className="me-campo__label">Horario <span className="me-req">*</span></label>
                    <select className="me-campo__input me-campo__select" value={formServicio.horario} onChange={e => campo('horario', e.target.value)}>
                      <option value="">Seleccionar horario</option>
                      {HORARIOS_PRESET.map(h => <option key={h}>{h}</option>)}
                      {formServicio.horario && !HORARIOS_PRESET.includes(formServicio.horario) && <option value={formServicio.horario}>{formServicio.horario}</option>}
                    </select>
                  </div>
                  <div className="me-form-fila">
                    <div className="me-campo">
                      <label className="me-campo__label">Desde</label>
                      <input type="time" className="me-campo__input" value={formServicio.horaDesde} onChange={e => campo('horaDesde', e.target.value)} />
                    </div>
                    <div className="me-campo">
                      <label className="me-campo__label">Hasta</label>
                      <input type="time" className="me-campo__input" value={formServicio.horaHasta} onChange={e => campo('horaHasta', e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ── Sección: Promociones ── */}
            <section className="me-seccion">
              <div className="me-seccion__cabecera">
                <div className="me-seccion__cabecera-izq">
                  <div className="me-seccion__icono" style={{ background: colorBg, color }}><Tag size={18} /></div>
                  <div>
                    <h2 className="me-seccion__titulo">Promociones activas</h2>
                    <p className="me-seccion__desc">Crea y gestiona las promociones que quieres destacar.</p>
                  </div>
                </div>
                <button className="me-btn-outline" style={{ borderColor: color, color }} onClick={abrirAgregarPromo}>
                  + Agregar promoción
                </button>
              </div>

              {promociones.length === 0 ? (
                <div className="me-vacio">
                  <Tag size={36} className="me-vacio__ico" />
                  <p className="me-vacio__titulo">Aún no tienes promociones activas</p>
                  <p className="me-vacio__desc">Crea tu primera promoción y llega a más dueños de mascotas.</p>
                  <button className="me-btn-guardar me-vacio__btn" style={{ background: color }} onClick={abrirAgregarPromo}>+ Agregar promoción</button>
                </div>
              ) : (
                <div className="me-lista">
                  {promociones.map(p => (
                    <div className="me-item" key={p.idPromocion} style={{ borderLeftColor: color }}>
                      <div className="me-item__info">
                        <h3 className="me-item__titulo">{p.titulo}</h3>
                        {p.descripcion && <p className="me-item__desc">{p.descripcion}</p>}
                        <small className="me-item__fecha">{p.fechaInicio} → {p.fechaTermino}</small>
                      </div>
                      <div className="me-item__acciones">
                        <button className="me-item__editar" onClick={() => abrirEditarPromo(p)}><Pencil size={13} /> Editar</button>
                        <button className="me-item__eliminar" onClick={() => eliminarPromo(p.idPromocion)}><Trash2 size={13} /> Eliminar</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* ── Sección: Blog ── */}
            <section className="me-seccion">
              <div className="me-seccion__cabecera">
                <div className="me-seccion__cabecera-izq">
                  <div className="me-seccion__icono" style={{ background: colorBg, color }}><BookOpen size={18} /></div>
                  <div>
                    <h2 className="me-seccion__titulo">Blog / Consejos de cuidado</h2>
                    <p className="me-seccion__desc">Comparte consejos útiles y ayuda a más dueños de mascotas.</p>
                  </div>
                </div>
                <button className="me-btn-outline" style={{ borderColor: color, color }} onClick={abrirAgregarBlog}>
                  + Nueva entrada
                </button>
              </div>

              {blogs.length === 0 ? (
                <div className="me-vacio">
                  <BookOpen size={36} className="me-vacio__ico" />
                  <p className="me-vacio__titulo">Aún no tienes entradas en el blog</p>
                  <p className="me-vacio__desc">Comparte consejos útiles y ayuda a más dueños de mascotas.</p>
                  <button className="me-btn-guardar me-vacio__btn" style={{ background: color }} onClick={abrirAgregarBlog}>+ Crear entrada</button>
                </div>
              ) : (
                <div className="me-lista">
                  {blogs.map(b => (
                    <div className="me-item me-item--blog" key={b.idBlog}>
                      <div className="me-item__blog-img">
                        {b.imagen ? <img src={`${BASE_URL}${b.imagen}`} alt={b.titulo} /> : <BookOpen size={22} color={color} />}
                      </div>
                      <div className="me-item__info">
                        <h3 className="me-item__titulo">{b.titulo}</h3>
                        {b.fecha && <small className="me-item__fecha">{new Date(b.fecha).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })}</small>}
                        <p className="me-item__desc">{b.texto}</p>
                      </div>
                      <div className="me-item__acciones">
                        <button className="me-item__editar" onClick={() => abrirEditarBlog(b)}><Pencil size={13} /> Editar</button>
                        <button className="me-item__eliminar" onClick={() => eliminarBlog(b.idBlog)}><Trash2 size={13} /> Eliminar</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

          </main>
        </div>
      </div>

      {/* ══ Modal promoción ══ */}
      {showModal && (
        <div className="me-overlay" onClick={() => setShowModal(false)}>
          <div className="me-modal" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="me-modal__header">
              <div className="me-modal__icono" style={{ background: colorBg, color }}><Tag size={22} /></div>
              <h2 className="me-modal__titulo">{editandoPromoId ? 'Editar promoción' : 'Agregar promoción'}</h2>
              <button className="me-modal__cerrar" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>

            {/* Body */}
            <div className="me-modal__body">
              {/* Título */}
              <div className="me-campo">
                <label className="me-campo__label">Título <span className="me-req">*</span></label>
                <input
                  className={`me-campo__input${errPromo.titulo ? ' me-campo__input--error' : ''}`}
                  value={formPromo.titulo}
                  placeholder="Ej: 20% en consultas este mes"
                  maxLength={100}
                  onChange={e => { setFormPromo(p => ({ ...p, titulo: e.target.value })); setErrPromo(p => ({ ...p, titulo: '' })); }}
                />
                <div className="me-campo__foot">
                  {errPromo.titulo && <span className="me-campo__error">{errPromo.titulo}</span>}
                  <span className="me-campo__contador">{formPromo.titulo.length}/100</span>
                </div>
              </div>

              {/* Descripción */}
              <div className="me-campo">
                <label className="me-campo__label">Descripción <span className="me-req">*</span></label>
                <textarea
                  className="me-campo__input me-campo__textarea"
                  rows={4}
                  maxLength={300}
                  value={formPromo.descripcion}
                  placeholder="Describe los detalles y condiciones"
                  onChange={e => setFormPromo(p => ({ ...p, descripcion: e.target.value }))}
                />
                <div className="me-campo__foot">
                  <span />
                  <span className="me-campo__contador">{formPromo.descripcion.length}/300</span>
                </div>
              </div>

              {/* Fechas en 2 columnas */}
              <div className="me-modal__grid">
                <div className="me-campo">
                  <label className="me-campo__label">Fecha de inicio <span className="me-req">*</span></label>
                  <div className="me-campo__date-wrap">
                    <input
                      type="date"
                      className={`me-campo__input${errPromo.fechaInicio ? ' me-campo__input--error' : ''}`}
                      value={formPromo.fechaInicio}
                      onChange={e => { setFormPromo(p => ({ ...p, fechaInicio: e.target.value })); setErrPromo(p => ({ ...p, fechaInicio: '' })); }}
                    />
                  </div>
                  {errPromo.fechaInicio && <span className="me-campo__error">{errPromo.fechaInicio}</span>}
                </div>
                <div className="me-campo">
                  <label className="me-campo__label">Fecha de término <span className="me-req">*</span></label>
                  <div className="me-campo__date-wrap">
                    <input
                      type="date"
                      className={`me-campo__input${errPromo.fechaTermino ? ' me-campo__input--error' : ''}`}
                      value={formPromo.fechaTermino}
                      onChange={e => { setFormPromo(p => ({ ...p, fechaTermino: e.target.value })); setErrPromo(p => ({ ...p, fechaTermino: '' })); }}
                    />
                  </div>
                  {errPromo.fechaTermino && <span className="me-campo__error">{errPromo.fechaTermino}</span>}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="me-modal__footer">
              <button className="me-modal__btn-cancelar" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="me-modal__btn-guardar" style={{ background: color }} onClick={guardarPromo} disabled={guardandoPromo}>
                {guardandoPromo ? 'Guardando...' : editandoPromoId ? 'Guardar cambios' : 'Agregar promoción'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ Modal blog ══ */}
      {showModalBlog && (
        <div className="me-overlay" onClick={() => setShowModalBlog(false)}>
          <div className="me-modal" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="me-modal__header">
              <div className="me-modal__icono" style={{ background: colorBg, color }}><BookOpen size={22} /></div>
              <h2 className="me-modal__titulo">{editandoBlogId ? 'Editar entrada de blog' : 'Nueva entrada de blog'}</h2>
              <button className="me-modal__cerrar" onClick={() => setShowModalBlog(false)}><X size={20} /></button>
            </div>

            {/* Body */}
            <div className="me-modal__body">

              {/* Imagen de portada + Título en 2 columnas */}
              <div className="me-modal__grid">
                {/* Imagen */}
                <div className="me-campo">
                  <label className="me-campo__label">Imagen de portada</label>
                  <label className="me-blog-dropzone" htmlFor="me-input-imagen-blog">
                    {(imagenPreviewBlog || imagenActualBlog) ? (
                      <img src={imagenPreviewBlog || `${BASE_URL}${imagenActualBlog}`} alt="Portada" className="me-blog-dropzone__preview" />
                    ) : (
                      <>
                        <ImageIcon size={28} className="me-blog-dropzone__ico" />
                        <span className="me-blog-dropzone__txt">Seleccionar imagen</span>
                        <span className="me-blog-dropzone__sub">o arrastra y suelta</span>
                      </>
                    )}
                    <input id="me-input-imagen-blog" type="file" accept="image/jpeg,image/png,image/webp" onChange={seleccionarImagenBlog} style={{ display: 'none' }} />
                  </label>
                  <small className="me-blog-dropzone__info">JPG, PNG o WEBP — máx. {TAMANO_MAX_MB} MB.<br />Se sube al guardar la entrada.</small>
                  {archivoImagenBlog && <button type="button" className="me-modal__btn-cancelar" style={{ marginTop: 4 }} onClick={limpiarSeleccionImagenBlog}>Quitar imagen</button>}
                  {errorImagenBlog && <span className="me-campo__error">{errorImagenBlog}</span>}
                </div>

                {/* Título */}
                <div className="me-campo">
                  <label className="me-campo__label">Título <span className="me-req">*</span></label>
                  <input
                    className={`me-campo__input${errBlog.titulo ? ' me-campo__input--error' : ''}`}
                    value={formBlog.titulo}
                    maxLength={100}
                    placeholder="Ej: 5 consejos para el cuidado de tu mascota en invierno"
                    onChange={e => { setFormBlog(p => ({ ...p, titulo: e.target.value })); setErrBlog(p => ({ ...p, titulo: '' })); }}
                  />
                  <div className="me-campo__foot">
                    {errBlog.titulo && <span className="me-campo__error">{errBlog.titulo}</span>}
                    <span className="me-campo__contador">{formBlog.titulo.length}/100</span>
                  </div>
                </div>
              </div>

              {/* Contenido */}
              <div className="me-campo">
                <label className="me-campo__label">Contenido <span className="me-req">*</span></label>
                <textarea
                  className={`me-campo__input me-campo__textarea${errBlog.texto ? ' me-campo__input--error' : ''}`}
                  rows={6}
                  maxLength={5000}
                  value={formBlog.texto}
                  placeholder="Escribe el contenido de tu publicación..."
                  onChange={e => { setFormBlog(p => ({ ...p, texto: e.target.value })); setErrBlog(p => ({ ...p, texto: '' })); }}
                />
                <div className="me-campo__foot">
                  {errBlog.texto && <span className="me-campo__error">{errBlog.texto}</span>}
                  <span className="me-campo__contador">{formBlog.texto.length}/5000</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="me-modal__footer">
              <button className="me-modal__btn-cancelar" onClick={() => setShowModalBlog(false)} disabled={guardandoBlog}>Cancelar</button>
              <button className="me-modal__btn-guardar" style={{ background: color }} onClick={guardarBlog} disabled={guardandoBlog}>
                {guardandoBlog ? 'Guardando...' : editandoBlogId ? 'Guardar cambios' : 'Publicar entrada'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        show={confirmPromo !== null}
        titulo="¿Eliminar promoción?"
        mensaje="Se eliminará esta promoción de forma permanente. Esta acción no se puede deshacer."
        labelOk="Eliminar"
        onConfirm={confirmarEliminarPromo}
        onCancel={() => setConfirmPromo(null)}
      />

      <ConfirmModal
        show={confirmBlog !== null}
        titulo="¿Eliminar entrada de blog?"
        mensaje="Se eliminará esta entrada del blog de forma permanente. Esta acción no se puede deshacer."
        labelOk="Eliminar"
        onConfirm={confirmarEliminarBlog}
        onCancel={() => setConfirmBlog(null)}
      />

      <Footer />
    </>
  );
}

export default MiEmpresa;