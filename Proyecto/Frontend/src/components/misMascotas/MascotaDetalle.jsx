import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';
import './MascotaDetalle.css';

const TIPOS_EVENTO = [
  'Control veterinario', 'Vacuna', 'Desparasitación', 'Medicamento',
  'Cirugía', 'Examen', 'Corte de pelo', 'Baño', 'Otro'
];

const ESTADOS = ['Pendiente', 'Completado', 'Vencido'];

const ESTADO_COLOR = {
  Completado: '#28a745',
  Pendiente: '#e6a817',
  Vencido: '#dc3545'
};

const ESTADO_BG = {
  Completado: '#edf7ef',
  Pendiente: '#fef9ec',
  Vencido: '#fdecea'
};

const EMOJI_TIPO = {
  Perro: '🐶', Gato: '🐱', Ave: '🐦', Conejo: '🐰',
  Reptil: '🦎', Pez: '🐠', Otro: '🐾'
};

const EMOJI_EVENTO = {
  'Control veterinario': '🩺', 'Vacuna': '💉', 'Desparasitación': '🔬',
  'Medicamento': '💊', 'Cirugía': '🏥', 'Examen': '📋',
  'Corte de pelo': '✂️', 'Baño': '🛁', 'Otro': '📌'
};

const FORM_INICIAL = {
  tipo: 'Control veterinario', fecha: '', hora: '',
  descripcion: '', observaciones: '', estado: 'Pendiente'
};

function MascotaDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [mascotas, setMascotas] = useState(() => {
    const stored = localStorage.getItem('mascotas');
    return stored ? JSON.parse(stored) : [];
  });

  const [showModal, setShowModal] = useState(false);
  const [editandoEventoId, setEditandoEventoId] = useState(null);
  const [formEvento, setFormEvento] = useState(FORM_INICIAL);
  const [errFecha, setErrFecha] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('user')) navigate('/login');
  }, []);

  const mascota = mascotas.find(m => m.id === id);

  useEffect(() => {
    if (mascotas.length > 0 && !mascota) navigate('/mis-mascotas');
  }, [mascotas, mascota]);

  const guardarMascotas = (updated) => {
    setMascotas(updated);
    localStorage.setItem('mascotas', JSON.stringify(updated));
  };

  const abrirAgregarEvento = () => {
    setEditandoEventoId(null);
    setFormEvento(FORM_INICIAL);
    setErrFecha(false);
    setShowModal(true);
  };

  const abrirEditarEvento = (evento) => {
    setEditandoEventoId(evento.id);
    setFormEvento({ ...evento });
    setErrFecha(false);
    setShowModal(true);
  };

  const eliminarEvento = (eventoId) => {
    if (!window.confirm('¿Eliminar este evento?')) return;
    const updated = mascotas.map(m =>
      m.id !== id ? m : { ...m, agenda: m.agenda.filter(e => e.id !== eventoId) }
    );
    guardarMascotas(updated);
  };

  const guardarEvento = () => {
    if (!formEvento.fecha) { setErrFecha(true); return; }
    const updated = mascotas.map(m => {
      if (m.id !== id) return m;
      if (editandoEventoId) {
        return { ...m, agenda: m.agenda.map(e => e.id === editandoEventoId ? { ...e, ...formEvento } : e) };
      }
      return { ...m, agenda: [...(m.agenda || []), { ...formEvento, id: Date.now().toString() }] };
    });
    guardarMascotas(updated);
    setShowModal(false);
  };

  const campo = (field, value) => setFormEvento(prev => ({ ...prev, [field]: value }));

  if (!mascota) return null;

  const agenda = mascota.agenda || [];
  const agendaOrdenada = [...agenda].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  const pendientes = agenda.filter(e => e.estado === 'Pendiente').length;
  const vencidos = agenda.filter(e => e.estado === 'Vencido').length;

  return (
    <>
      <Navbar />
      <div className="md-page">

        {/* Breadcrumb */}
        <div className="md-breadcrumb">
          <Link to="/mis-mascotas">← Mis Mascotas</Link>
          <span> / {mascota.nombre}</span>
        </div>

        {/* Perfil de la mascota */}
        <div className="md-perfil">
          <div className="md-perfil-img">
            {mascota.imagen
              ? <img src={mascota.imagen} alt={mascota.nombre} />
              : <span className="md-emoji-big">{EMOJI_TIPO[mascota.tipo] || '🐾'}</span>
            }
          </div>

          <div className="md-perfil-info">
            <div className="md-perfil-top">
              <h1 className="md-nombre">{mascota.nombre}</h1>
              <div className="md-badges">
                <span className="md-badge md-badge-tipo">{mascota.tipo}</span>
                {mascota.sexo && <span className="md-badge md-badge-sexo">{mascota.sexo}</span>}
              </div>
            </div>

            <div className="md-datos-grid">
              {mascota.raza && (
                <div className="md-dato">
                  <span className="md-dato-label">Raza</span>
                  <span className="md-dato-val">{mascota.raza}</span>
                </div>
              )}
              {mascota.edad && (
                <div className="md-dato">
                  <span className="md-dato-label">Edad</span>
                  <span className="md-dato-val">{mascota.edad} {mascota.edad === '1' ? 'año' : 'años'}</span>
                </div>
              )}
              {mascota.peso && (
                <div className="md-dato">
                  <span className="md-dato-label">Peso</span>
                  <span className="md-dato-val">{mascota.peso} kg</span>
                </div>
              )}
              {mascota.color && (
                <div className="md-dato">
                  <span className="md-dato-label">Color</span>
                  <span className="md-dato-val">{mascota.color}</span>
                </div>
              )}
              {mascota.fechaNacimiento && (
                <div className="md-dato">
                  <span className="md-dato-label">Nacimiento</span>
                  <span className="md-dato-val">{mascota.fechaNacimiento}</span>
                </div>
              )}
            </div>

            {mascota.observaciones && (
              <div className="md-obs-box">
                <strong>Observaciones</strong>
                <p>{mascota.observaciones}</p>
              </div>
            )}

            {mascota.infoMedica && (
              <div className="md-obs-box">
                <strong>Información médica</strong>
                <p>{mascota.infoMedica}</p>
              </div>
            )}
          </div>
        </div>

        {/* Resumen agenda */}
        {agenda.length > 0 && (
          <div className="md-resumen">
            <div className="md-resumen-item md-resumen-total">
              <span className="md-resumen-num">{agenda.length}</span>
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
              <span className="md-resumen-num">{agenda.filter(e => e.estado === 'Completado').length}</span>
              <span className="md-resumen-label">Completados</span>
            </div>
          </div>
        )}

        {/* Agenda */}
        <div className="md-agenda">
          <div className="md-agenda-header">
            <h2>📅 Agenda veterinaria</h2>
            <button className="md-btn-evento" onClick={abrirAgregarEvento}>+ Agregar evento</button>
          </div>

          {agendaOrdenada.length === 0 ? (
            <div className="md-agenda-empty">
              <span>📋</span>
              <p>No hay eventos registrados para {mascota.nombre}.</p>
              <p>Agrega visitas al veterinario, vacunas, tratamientos y más.</p>
            </div>
          ) : (
            <div className="md-timeline">
              {agendaOrdenada.map(evento => (
                <div
                  className="md-evento"
                  key={evento.id}
                  style={{ borderLeftColor: ESTADO_COLOR[evento.estado] }}
                >
                  <div className="md-evento-icon">
                    {EMOJI_EVENTO[evento.tipo] || '📌'}
                  </div>

                  <div className="md-evento-body">
                    <div className="md-evento-top">
                      <span className="md-evento-tipo">{evento.tipo}</span>
                      <span
                        className="md-evento-estado"
                        style={{
                          color: ESTADO_COLOR[evento.estado],
                          backgroundColor: ESTADO_BG[evento.estado]
                        }}
                      >
                        {evento.estado}
                      </span>
                    </div>
                    <div className="md-evento-fecha">
                      📅 {evento.fecha}{evento.hora ? ` · ⏰ ${evento.hora}` : ''}
                    </div>
                    {evento.descripcion && <p className="md-evento-desc">{evento.descripcion}</p>}
                    {evento.observaciones && <p className="md-evento-obs">{evento.observaciones}</p>}
                  </div>

                  <div className="md-evento-actions">
                    <button title="Editar" onClick={() => abrirEditarEvento(evento)}>✏️</button>
                    <button title="Eliminar" onClick={() => eliminarEvento(evento.id)}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal evento */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editandoEventoId ? 'Editar evento' : 'Agregar evento'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tipo de evento</Form.Label>
              <Form.Select value={formEvento.tipo} onChange={e => campo('tipo', e.target.value)}>
                {TIPOS_EVENTO.map(t => <option key={t}>{t}</option>)}
              </Form.Select>
            </Form.Group>

            <div className="d-flex gap-3">
              <Form.Group className="mb-3 flex-grow-1">
                <Form.Label>Fecha <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="date"
                  isInvalid={errFecha}
                  value={formEvento.fecha}
                  onChange={e => { campo('fecha', e.target.value); setErrFecha(false); }}
                />
                {errFecha && <Form.Text className="text-danger">La fecha es obligatoria</Form.Text>}
              </Form.Group>

              <Form.Group className="mb-3 flex-grow-1">
                <Form.Label>Hora</Form.Label>
                <Form.Control
                  type="time"
                  value={formEvento.hora}
                  onChange={e => campo('hora', e.target.value)}
                />
              </Form.Group>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                value={formEvento.descripcion}
                placeholder="Ej: Vacuna antirrábica anual"
                onChange={e => campo('descripcion', e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Observaciones</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formEvento.observaciones}
                onChange={e => campo('observaciones', e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-1">
              <Form.Label>Estado</Form.Label>
              <div className="d-flex gap-2">
                {ESTADOS.map(s => (
                  <button
                    key={s}
                    type="button"
                    className="md-estado-btn"
                    style={{
                      backgroundColor: formEvento.estado === s ? ESTADO_COLOR[s] : '#f5f5f5',
                      color: formEvento.estado === s ? '#fff' : '#555',
                      borderColor: ESTADO_COLOR[s]
                    }}
                    onClick={() => campo('estado', s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button style={{ backgroundColor: '#7e6492', border: 'none' }} onClick={guardarEvento}>
            {editandoEventoId ? 'Guardar cambios' : 'Agregar evento'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </>
  );
}

export default MascotaDetalle;
