import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';
import api, { ApiError, BASE_URL } from '../../api/petdate-api';
import { Dog, Cat, Bird, Rabbit, Turtle, Fish, PawPrint, Stethoscope, Syringe, Microscope, Pill, Hospital, ClipboardList, Scissors, Bath, Pin, Hourglass, TriangleAlert, Calendar, Clock, Pencil, Trash2, X } from 'lucide-react';
import './MascotaDetalle.css';

// ─────────────────────────────────────────────
// Constantes
// ─────────────────────────────────────────────
const TIPOS_EVENTO = [
  'Control veterinario', 'Vacuna', 'Desparasitación', 'Medicamento',
  'Cirugía', 'Examen', 'Corte de pelo', 'Baño', 'Otro'
];

// El backend maneja PENDIENTE / COMPLETADO / VENCIDO (mayúsculas)
const ESTADOS = ['PENDIENTE', 'COMPLETADO', 'VENCIDO'];

const ESTADO_LABEL = {
  PENDIENTE:  'Pendiente',
  COMPLETADO: 'Completado',
  VENCIDO:    'Vencido',
};

const ESTADO_COLOR = {
  COMPLETADO: '#28a745',
  PENDIENTE:  '#e6a817',
  VENCIDO:    '#dc3545',
};

const ESTADO_BG = {
  COMPLETADO: '#edf7ef',
  PENDIENTE:  '#fef9ec',
  VENCIDO:    '#fdecea',
};

const ICON_TIPO = {
  Perro: Dog, Gato: Cat, Ave: Bird, Conejo: Rabbit,
  Reptil: Turtle, Pez: Fish, Otro: PawPrint,
};

const ICON_EVENTO = {
  'Control veterinario': Stethoscope, 'Vacuna': Syringe, 'Desparasitación': Microscope,
  'Medicamento': Pill, 'Cirugía': Hospital, 'Examen': ClipboardList,
  'Corte de pelo': Scissors, 'Baño': Bath, 'Otro': Pin,
};

const FORM_INICIAL = {
  tipo: 'Control veterinario',
  fecha: '',
  hora: '',
  descripcion: '',
  observaciones: '',
  estado: 'PENDIENTE',
};

// ─────────────────────────────────────────────
// Helpers de mapeo frontend ↔ backend
// ─────────────────────────────────────────────

/** Convierte el form local al body que espera POST/PUT /citas */
function formToRequest(form, usuarioId, mascotaId) {
  return {
    idUsuario:  usuarioId,
    idMascota:  mascotaId,
    tipoEvento: form.tipo,
    fecha:      form.fecha,                      // 'YYYY-MM-DD'
    hora:       form.hora ? `${form.hora}:00` : '00:00:00', // 'HH:MM:SS'
    descripcion: form.descripcion || '',
    observacion: form.observaciones || '',
    estado:     form.estado,
  };
}

/** Convierte la respuesta del backend al estado local del form */
function responseToForm(cita) {
  return {
    tipo:         cita.tipoEvento,
    fecha:        cita.fecha ? String(cita.fecha).slice(0, 10) : '',
    hora:         cita.hora  ? String(cita.hora).slice(0, 5)  : '',  // 'HH:MM'
    descripcion:  cita.descripcion  || '',
    observaciones: cita.observacion || '',
    estado:       cita.estado || 'PENDIENTE',
  };
}

// ─────────────────────────────────────────────
// Componente
// ─────────────────────────────────────────────
function MascotaDetalle() {
  const { id } = useParams();   // id de la mascota (number del backend)
  const navigate = useNavigate();

  // Usuario logueado
  const [usuario, setUsuario] = useState(null);

  // Datos de la mascota
  const [mascota, setMascota]   = useState(null);
  const [loadingMascota, setLoadingMascota] = useState(true);

  // Citas/agenda
  const [citas, setCitas]       = useState([]);
  const [loadingCitas, setLoadingCitas] = useState(true);
  const [errorCitas, setErrorCitas]     = useState('');

  // Modal
  const [showModal, setShowModal]           = useState(false);
  const [editandoCitaId, setEditandoCitaId] = useState(null);
  const [formEvento, setFormEvento]         = useState(FORM_INICIAL);
  const [errFecha, setErrFecha]             = useState(false);
  const [guardando, setGuardando]           = useState(false);
  const [errorModal, setErrorModal]         = useState('');

  // ── Verificar sesión ──
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) { navigate('/login'); return; }
    const user = JSON.parse(userData);
    if (!user.id) { navigate('/login'); return; }
    setUsuario(user);
  }, []);

  // ── Cargar datos de la mascota ──
  useEffect(() => {
    if (!id) return;
    const cargarMascota = async () => {
      try {
        const data = await api.mascotas.porId(Number(id));
        setMascota(data);
      } catch {
        navigate('/mis-mascotas');
      } finally {
        setLoadingMascota(false);
      }
    };
    cargarMascota();
  }, [id]);

  // ── Cargar citas de la mascota ──
  const cargarCitas = useCallback(async () => {
    if (!id) return;
    const userData = localStorage.getItem('user');
    if (!userData) return;
    const { id: idUsuario } = JSON.parse(userData);
    if (!idUsuario) return;

    setLoadingCitas(true);
    setErrorCitas('');
    try {
      // Usamos la ruta acotada al dueño: /citas/mascota/{id} es solo para ADMIN
      // y devuelve 403 a usuarios normales.
      const page = await api.citas.porUsuarioYMascota(idUsuario, Number(id), { size: 100 });
      setCitas(page.content);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        navigate('/login');
      } else {
        setErrorCitas('No se pudieron cargar los eventos.');
      }
    } finally {
      setLoadingCitas(false);
    }
  }, [id]);

  useEffect(() => {
    cargarCitas();
  }, [cargarCitas]);

  // ── Abrir modal agregar ──
  const abrirAgregarEvento = () => {
    setEditandoCitaId(null);
    setFormEvento(FORM_INICIAL);
    setErrFecha(false);
    setErrorModal('');
    setShowModal(true);
  };

  // ── Abrir modal editar ──
  const abrirEditarEvento = (cita) => {
    setEditandoCitaId(cita.idEvento);
    setFormEvento(responseToForm(cita));
    setErrFecha(false);
    setErrorModal('');
    setShowModal(true);
  };

  // ── Eliminar cita ──
  const eliminarEvento = async (idEvento) => {
    if (!window.confirm('¿Eliminar este evento?')) return;
    try {
      await api.citas.eliminar(idEvento);
      setCitas(prev => prev.filter(c => c.idEvento !== idEvento));
    } catch {
      alert('No se pudo eliminar el evento. Intenta de nuevo.');
    }
  };

  // ── Cambiar estado rápido (PATCH) ──
  const cambiarEstado = async (idEvento, nuevoEstado) => {
    try {
      const actualizada = await api.citas.cambiarEstado(idEvento, nuevoEstado);
      setCitas(prev => prev.map(c => c.idEvento === idEvento ? actualizada : c));
    } catch {
      alert('No se pudo cambiar el estado.');
    }
  };

  // ── Guardar (crear o actualizar) ──
  const guardarEvento = async () => {
    if (!formEvento.fecha) { setErrFecha(true); return; }
    if (!usuario || !mascota) return;

    setGuardando(true);
    setErrorModal('');

    try {
      const body = formToRequest(formEvento, usuario.id, mascota.id);

      if (editandoCitaId) {
        // PUT /citas/{id}
        const actualizada = await api.citas.actualizar(editandoCitaId, body);
        setCitas(prev => prev.map(c => c.idEvento === editandoCitaId ? actualizada : c));
      } else {
        // POST /citas
        const nueva = await api.citas.crear(body);
        setCitas(prev => [...prev, nueva]);
      }

      setShowModal(false);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 404) setErrorModal('Usuario o mascota no encontrado.');
        else setErrorModal(err.message || 'Error al guardar el evento.');
      } else {
        setErrorModal('Error de conexión. Verifica que el servidor esté activo.');
      }
    } finally {
      setGuardando(false);
    }
  };

  const campo = (field, value) => setFormEvento(prev => ({ ...prev, [field]: value }));

  // ── Ordenar citas por fecha descendente ──
  const citasOrdenadas = [...citas].sort((a, b) =>
    new Date(b.fecha) - new Date(a.fecha)
  );

  const pendientes  = citas.filter(c => c.estado === 'PENDIENTE').length;
  const vencidos    = citas.filter(c => c.estado === 'VENCIDO').length;
  const completados = citas.filter(c => c.estado === 'COMPLETADO').length;

  if (loadingMascota) return null;
  if (!mascota) return null;

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────
  return (
    <>
      <Navbar />
      <div className="md-page">

        {/* Breadcrumb */}
        <div className="md-breadcrumb">
          <Link to="/mis-mascotas">← Mis Mascotas</Link>
          <span> / {mascota.nombre}</span>
        </div>

        <div className="md-layout">

        {/* Perfil de la mascota */}
        <div className="md-perfil">
          {/* Foto + nombre */}
          <div className="md-ficha-header">
            <div className="md-perfil-img">
              {mascota.imagenUrl
                ? <img src={`${BASE_URL}${mascota.imagenUrl}`} alt={mascota.nombre} className="md-photo-big" />
                : (() => { const EspecieIcon = ICON_TIPO[mascota.especie] || PawPrint; return <EspecieIcon size={52} className="md-emoji-big" />; })()
              }
            </div>
            <div className="md-ficha-header-info">
              <h1 className="md-nombre">{mascota.nombre}</h1>
              <div className="md-badges">
                <span className="md-badge md-badge-tipo">{mascota.especie}</span>
                {mascota.sexo && <span className="md-badge md-badge-sexo">{mascota.sexo}</span>}
              </div>
            </div>
          </div>

          {/* Tarjeta de datos */}
          <div className="md-ficha-datos">
            {mascota.raza && (
              <div className="md-dato-row">
                <span className="md-dato-label">Raza</span>
                <span className="md-dato-val">{mascota.raza}</span>
              </div>
            )}
            {mascota.edad > 0 && (
              <div className="md-dato-row">
                <span className="md-dato-label">Edad</span>
                <span className="md-dato-val">{mascota.edad} {mascota.edad === 1 ? 'año' : 'años'}</span>
              </div>
            )}
            {mascota.peso > 0 && (
              <div className="md-dato-row">
                <span className="md-dato-label">Peso</span>
                <span className="md-dato-val">{mascota.peso} kg</span>
              </div>
            )}
            {mascota.color && (
              <div className="md-dato-row">
                <span className="md-dato-label">Color</span>
                <span className="md-dato-val">{mascota.color}</span>
              </div>
            )}
            {mascota.fecha_nacimineto && (
              <div className="md-dato-row">
                <span className="md-dato-label">Nacimiento</span>
                <span className="md-dato-val">{String(mascota.fecha_nacimineto).slice(0, 10)}</span>
              </div>
            )}
            {mascota.observaciones && (
              <div className="md-dato-row md-dato-row--block">
                <span className="md-dato-label">Observaciones</span>
                <span className="md-dato-val">{mascota.observaciones}</span>
              </div>
            )}
            {mascota.info_medica_basica && (
              <div className="md-dato-row md-dato-row--block">
                <span className="md-dato-label">Info. Médica</span>
                <span className="md-dato-val">{mascota.info_medica_basica}</span>
              </div>
            )}
          </div>

        </div>{/* /md-col-left */}

        {/* ── Columna derecha: agenda ── */}
        <div className="md-col-right">

        {/* Agenda */}
        <div className="md-agenda">
          <div className="md-agenda-header">
            <h2><Calendar size={20} /> Agenda veterinaria</h2>
          </div>

          {/* Resumen agenda */}
          <div className="md-resumen">
            <div className="md-resumen-item md-resumen-total">
              <span className="md-resumen-num">{citas.length}</span>
              <span className="md-resumen-label">Total eventos</span>
            </div>
            <div className="md-resumen-item md-resumen-pendiente">
              <span className="md-resumen-num">{pendientes}</span>
              <span className="md-resumen-label">Pendientes</span>
            </div>
            <div className="md-resumen-item md-resumen-vencido">
              <span className="md-resumen-num">{vencidos}</span>
              <span className="md-resumen-label">Vencidos</span>
            </div>
            <div className="md-resumen-item md-resumen-completado">
              <span className="md-resumen-num">{completados}</span>
              <span className="md-resumen-label">Completados</span>
            </div>
          </div>

          {loadingCitas && (
            <div className="md-agenda-empty">
              <Hourglass size={24} />
              <p>Cargando eventos...</p>
            </div>
          )}

          {!loadingCitas && errorCitas && (
            <div className="md-agenda-empty">
              <TriangleAlert size={24} />
              <p>{errorCitas}</p>
              <button className="md-btn-evento" onClick={cargarCitas}>Reintentar</button>
            </div>
          )}

          {!loadingCitas && !errorCitas && citasOrdenadas.length === 0 && (
            <div className="md-agenda-empty">
              <ClipboardList size={24} />
              <p className="md-agenda-empty__titulo">Aún no tienes eventos registrados</p>
              <p className="md-agenda-empty__desc">Agrega el primer evento veterinario para mantener al día la salud de {mascota.nombre}.</p>
              <button className="md-btn-evento" onClick={abrirAgregarEvento}>+ Agregar evento</button>
            </div>
          )}

          {!loadingCitas && !errorCitas && citasOrdenadas.length > 0 && (() => {
            // Próximo evento: el pendiente más cercano (o el primero si no hay pendientes)
            const pendientesOrdenados = [...citas]
              .filter(c => c.estado === 'PENDIENTE')
              .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
            const proximo = pendientesOrdenados[0] || null;
            const resto = citasOrdenadas.filter(c => !proximo || c.idEvento !== proximo.idEvento);

            const renderEvento = (cita) => (
              <div
                className="md-evento"
                key={cita.idEvento}
                style={{ borderLeftColor: ESTADO_COLOR[cita.estado] }}
              >
                <div className="md-evento-icon" style={{ color: ESTADO_COLOR[cita.estado], backgroundColor: ESTADO_BG[cita.estado] }}>
                  {(() => { const EventIcon = ICON_EVENTO[cita.tipoEvento] || Pin; return <EventIcon size={20} />; })()}
                </div>

                <div className="md-evento-body">
                  <div className="md-evento-top">
                    <span className="md-evento-tipo">{cita.descripcion || cita.tipoEvento}</span>
                    <span
                      className="md-evento-estado"
                      style={{
                        color: ESTADO_COLOR[cita.estado],
                        backgroundColor: ESTADO_BG[cita.estado],
                      }}
                      title="Clic para cambiar estado"
                      onClick={() => {
                        const idx = ESTADOS.indexOf(cita.estado);
                        const siguiente = ESTADOS[(idx + 1) % ESTADOS.length];
                        cambiarEstado(cita.idEvento, siguiente);
                      }}
                    >
                      {ESTADO_LABEL[cita.estado] || cita.estado}
                    </span>
                  </div>
                  {cita.descripcion && <p className="md-evento-subtipo">{cita.tipoEvento}</p>}
                  <div className="md-evento-fecha">
                    <Calendar size={13} /> {String(cita.fecha).slice(0, 10)}
                    {cita.hora ? <> · <Clock size={13} /> {String(cita.hora).slice(0, 5)}</> : ''}
                  </div>
                  {cita.observacion && <p className="md-evento-obs">{cita.observacion}</p>}
                </div>

                <div className="md-evento-actions">
                  <button title="Editar"   onClick={() => abrirEditarEvento(cita)}><Pencil size={14} /></button>
                  <button title="Eliminar" onClick={() => eliminarEvento(cita.idEvento)}><Trash2 size={14} /></button>
                </div>
              </div>
            );

            return (
              <>
                {proximo && (
                  <div className="md-agenda-bloque">
                    <h3 className="md-agenda-subtitulo">Próximo evento</h3>
                    <div className="md-timeline">
                      {renderEvento(proximo)}
                    </div>
                  </div>
                )}

                <div className="md-agenda-bloque">
                  <h3 className="md-agenda-subtitulo">Historial de eventos</h3>
                  <div className="md-timeline">
                    {resto.map(renderEvento)}
                  </div>
                </div>

                <button className="md-btn-evento md-btn-evento--full" onClick={abrirAgregarEvento}>
                  + Agregar evento
                </button>
              </>
            );
          })()}
        </div>
        </div>{/* /md-col-right */}
        </div>{/* /md-layout */}
      </div>{/* /md-page */}

      {/* Modal evento */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered dialogClassName="md-modal" contentClassName="md-modal-content">
        <div className="md-modal-header">
          <div className="md-modal-header__icon"><Calendar size={22} /></div>
          <h2 className="md-modal-header__title">{editandoCitaId ? 'Editar evento' : 'Agregar evento'}</h2>
          <button className="md-modal-close" onClick={() => setShowModal(false)} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        <div className="md-modal-divider" />

        <div className="md-modal-body">
          {errorModal && <div className="alert alert-danger py-2 px-3">{errorModal}</div>}

          <div className="md-modal-field">
            <label className="md-modal-label">Tipo de evento <span className="md-modal-required">*</span></label>
            <select className="md-modal-input md-modal-select" value={formEvento.tipo} onChange={e => campo('tipo', e.target.value)}>
              {TIPOS_EVENTO.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          <div className="md-modal-grid">
            <div className="md-modal-field">
              <label className="md-modal-label">Fecha <span className="md-modal-required">*</span></label>
              <div className="md-modal-date-wrap">
                <Calendar size={16} className="md-modal-date-icon" />
                <input
                  type="date"
                  className={`md-modal-input md-modal-input--date ${errFecha ? 'md-modal-input--error' : ''}`}
                  placeholder="dd-mm-aaaa"
                  value={formEvento.fecha}
                  onChange={e => { campo('fecha', e.target.value); setErrFecha(false); }}
                />
              </div>
              {errFecha && <span className="md-modal-error">La fecha es obligatoria</span>}
            </div>

            <div className="md-modal-field">
              <label className="md-modal-label">Hora</label>
              <input
                type="time"
                className="md-modal-input"
                placeholder="--:--"
                value={formEvento.hora}
                onChange={e => campo('hora', e.target.value)}
              />
            </div>
          </div>

          <div className="md-modal-field">
            <label className="md-modal-label">Descripción</label>
            <input
              className="md-modal-input"
              value={formEvento.descripcion}
              placeholder="Ej: Vacuna antirrábica anual"
              onChange={e => campo('descripcion', e.target.value)}
            />
          </div>

          <div className="md-modal-field">
            <label className="md-modal-label">Observaciones</label>
            <textarea
              className="md-modal-input md-modal-textarea"
              rows={2}
              placeholder="Agrega observaciones adicionales (opcional)"
              value={formEvento.observaciones}
              onChange={e => campo('observaciones', e.target.value)}
            />
          </div>
        </div>

        <div className="md-modal-footer">
          <button className="md-modal-btn md-modal-btn--cancelar" onClick={() => setShowModal(false)} disabled={guardando}>
            Cancelar
          </button>
          <button className="md-modal-btn md-modal-btn--guardar" onClick={guardarEvento} disabled={guardando}>
            {guardando
              ? (editandoCitaId ? 'Guardando...' : 'Agregando...')
              : (editandoCitaId ? 'Guardar cambios' : 'Agregar evento')
            }
          </button>
        </div>
      </Modal>

      <Footer />
    </>
  );
}

export default MascotaDetalle;