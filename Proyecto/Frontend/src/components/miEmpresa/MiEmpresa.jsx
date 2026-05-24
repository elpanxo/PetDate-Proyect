import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';
import { servicios as serviciosEstaticos, TIPOS, TIPO_COLOR, COMUNAS } from '../servicios/serviciosData';
import { Building2, ClipboardList, CheckCircle2, Tag, Pencil, Trash2 } from 'lucide-react';
import './MiEmpresa.css';

const TIPOS_SERVICIO = TIPOS.filter(t => t.valor !== 'todos');
const COMUNAS_LISTA = COMUNAS.filter(c => c !== 'Todas');

const getServicioActual = (servicioId) => {
  const overrides = JSON.parse(localStorage.getItem('servicios_override') || '{}');
  const base = serviciosEstaticos.find(s => s.id === servicioId);
  if (!base) return null;
  return overrides[servicioId] ? { ...base, ...overrides[servicioId] } : { ...base };
};

const guardarOverride = (servicioId, data) => {
  const overrides = JSON.parse(localStorage.getItem('servicios_override') || '{}');
  overrides[servicioId] = data;
  localStorage.setItem('servicios_override', JSON.stringify(overrides));
};

function MiEmpresa() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    if (!user || user.role !== 'empresa') navigate('/');
  }, []);

  const [servicio, setServicio] = useState(() => getServicioActual(user?.servicioId));
  const [formServicio, setFormServicio] = useState(() => getServicioActual(user?.servicioId) || {});
  const [guardado, setGuardado] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editandoPromoId, setEditandoPromoId] = useState(null);
  const [formPromo, setFormPromo] = useState({ titulo: '', descripcion: '' });
  const [errTitulo, setErrTitulo] = useState(false);

  if (!servicio) return null;

  const color = TIPO_COLOR[formServicio.tipo] || '#7e6492';

  const guardarServicio = () => {
    guardarOverride(user.servicioId, formServicio);
    setServicio({ ...formServicio });
    setGuardado(true);
    setTimeout(() => setGuardado(false), 3000);
  };

  const campo = (field, value) => setFormServicio(prev => ({ ...prev, [field]: value }));

  const abrirAgregarPromo = () => {
    setEditandoPromoId(null);
    setFormPromo({ titulo: '', descripcion: '' });
    setErrTitulo(false);
    setShowModal(true);
  };

  const abrirEditarPromo = (promo) => {
    setEditandoPromoId(promo.id);
    setFormPromo({ titulo: promo.titulo, descripcion: promo.descripcion });
    setErrTitulo(false);
    setShowModal(true);
  };

  const eliminarPromo = (promoId) => {
    if (!window.confirm('¿Eliminar esta promoción?')) return;
    const updated = { ...formServicio, promociones: formServicio.promociones.filter(p => p.id !== promoId) };
    setFormServicio(updated);
    setServicio(updated);
    guardarOverride(user.servicioId, updated);
  };

  const guardarPromo = () => {
    if (!formPromo.titulo.trim()) { setErrTitulo(true); return; }
    const promos = formServicio.promociones || [];
    const nuevasPromos = editandoPromoId
      ? promos.map(p => p.id === editandoPromoId ? { ...p, ...formPromo } : p)
      : [...promos, { ...formPromo, id: Date.now() }];
    const updated = { ...formServicio, promociones: nuevasPromos };
    setFormServicio(updated);
    setServicio(updated);
    guardarOverride(user.servicioId, updated);
    setShowModal(false);
  };

  return (
    <>
      <Navbar />
      <div className="me-page">

        <div className="me-header">
          <div>
            <h1 className="me-titulo"><Building2 size={22} /> Mi Empresa</h1>
            <p className="me-subtitulo">Gestiona la información y promociones de tu servicio</p>
          </div>
        </div>

        {/* Sección: información del servicio */}
        <div className="me-seccion">
          <div className="me-seccion-header">
            <h2><ClipboardList size={18} /> Información del servicio</h2>
            <div className="me-acciones">
              {guardado && <span className="me-guardado-msg"><CheckCircle2 size={16} /> Guardado</span>}
              <button className="me-btn-primary" onClick={guardarServicio}>Guardar cambios</button>
            </div>
          </div>

          <Form>
            <div className="me-form-grid">

              <Form.Group>
                <Form.Label>Nombre del servicio</Form.Label>
                <Form.Control value={formServicio.nombre || ''} onChange={e => campo('nombre', e.target.value)} />
              </Form.Group>

              <Form.Group>
                <Form.Label>Tipo</Form.Label>
                <Form.Select value={formServicio.tipo || ''} onChange={e => campo('tipo', e.target.value)}>
                  {TIPOS_SERVICIO.map(t => (
                    <option key={t.valor} value={t.valor}>{t.label}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="me-form-full">
                <Form.Label>Descripción</Form.Label>
                <Form.Control as="textarea" rows={3} value={formServicio.descripcion || ''} onChange={e => campo('descripcion', e.target.value)} />
              </Form.Group>

              <Form.Group>
                <Form.Label>Dirección</Form.Label>
                <Form.Control value={formServicio.direccion || ''} onChange={e => campo('direccion', e.target.value)} />
              </Form.Group>

              <Form.Group>
                <Form.Label>Comuna</Form.Label>
                <Form.Select value={formServicio.comuna || ''} onChange={e => campo('comuna', e.target.value)}>
                  {COMUNAS_LISTA.map(c => <option key={c}>{c}</option>)}
                </Form.Select>
              </Form.Group>

              <Form.Group>
                <Form.Label>Horario</Form.Label>
                <Form.Control value={formServicio.horario || ''} onChange={e => campo('horario', e.target.value)} />
              </Form.Group>

              <Form.Group>
                <Form.Label>Teléfono</Form.Label>
                <Form.Control value={formServicio.telefono || ''} onChange={e => campo('telefono', e.target.value)} />
              </Form.Group>

              <Form.Group>
                <Form.Label>WhatsApp (solo números, sin +)</Form.Label>
                <Form.Control value={formServicio.wsp || ''} onChange={e => campo('wsp', e.target.value)} />
              </Form.Group>

              <Form.Group>
                <Form.Label>Sitio web</Form.Label>
                <Form.Control value={formServicio.web || ''} onChange={e => campo('web', e.target.value)} />
              </Form.Group>

              <Form.Group>
                <Form.Label>Instagram (sin @)</Form.Label>
                <Form.Control value={formServicio.instagram || ''} onChange={e => campo('instagram', e.target.value)} />
              </Form.Group>

              <Form.Group>
                <Form.Label>Facebook</Form.Label>
                <Form.Control value={formServicio.facebook || ''} onChange={e => campo('facebook', e.target.value)} />
              </Form.Group>

            </div>
          </Form>
        </div>

        {/* Sección: promociones */}
        <div className="me-seccion">
          <div className="me-seccion-header">
            <h2><Tag size={18} /> Promociones</h2>
            <button className="me-btn-primary" onClick={abrirAgregarPromo}>+ Agregar promoción</button>
          </div>

          {(formServicio.promociones || []).length === 0 ? (
            <div className="me-promos-empty">
              <Tag size={24} />
              <p>No tienes promociones activas.</p>
              <p>¡Agrega una para atraer más clientes!</p>
            </div>
          ) : (
            <div className="me-promos-lista">
              {formServicio.promociones.map(promo => (
                <div className="me-promo-card" key={promo.id} style={{ borderLeftColor: color }}>
                  <div className="me-promo-info">
                    <h3>{promo.titulo}</h3>
                    {promo.descripcion && <p>{promo.descripcion}</p>}
                  </div>
                  <div className="me-promo-actions">
                    <button className="me-promo-btn-edit" onClick={() => abrirEditarPromo(promo)}><Pencil size={14} /> Editar</button>
                    <button className="me-promo-btn-delete" onClick={() => eliminarPromo(promo.id)}><Trash2 size={14} /> Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Modal promoción */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editandoPromoId ? 'Editar promoción' : 'Agregar promoción'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Título <span className="text-danger">*</span></Form.Label>
              <Form.Control
                isInvalid={errTitulo}
                value={formPromo.titulo}
                placeholder="Ej: 20% en consultas este mes"
                onChange={e => { setFormPromo(p => ({ ...p, titulo: e.target.value })); setErrTitulo(false); }}
              />
              {errTitulo && <Form.Text className="text-danger">El título es obligatorio</Form.Text>}
            </Form.Group>
            <Form.Group>
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formPromo.descripcion}
                placeholder="Describe los detalles y condiciones"
                onChange={e => setFormPromo(p => ({ ...p, descripcion: e.target.value }))}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button style={{ backgroundColor: '#7e6492', border: 'none' }} onClick={guardarPromo}>
            {editandoPromoId ? 'Guardar cambios' : 'Agregar promoción'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </>
  );
}

export default MiEmpresa;
