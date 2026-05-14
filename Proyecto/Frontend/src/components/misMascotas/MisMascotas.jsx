import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';
import './MisMascotas.css';

const TIPOS_MASCOTA = ['Perro', 'Gato', 'Ave', 'Conejo', 'Reptil', 'Pez', 'Otro'];

const EMOJI_TIPO = {
  Perro: '🐶', Gato: '🐱', Ave: '🐦', Conejo: '🐰',
  Reptil: '🦎', Pez: '🐠', Otro: '🐾'
};

const FORM_INICIAL = {
  nombre: '', tipo: 'Perro', raza: '', edad: '', sexo: 'Macho',
  peso: '', fechaNacimiento: '', color: '', observaciones: '',
  infoMedica: '', imagen: ''
};

function MisMascotas() {
  const navigate = useNavigate();

  const [mascotas, setMascotas] = useState(() => {
    const stored = localStorage.getItem('mascotas');
    return stored ? JSON.parse(stored) : [];
  });

  const [showModal, setShowModal] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState(FORM_INICIAL);
  const [errNombre, setErrNombre] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('user')) navigate('/login');
  }, []);

  useEffect(() => {
    localStorage.setItem('mascotas', JSON.stringify(mascotas));
  }, [mascotas]);

  const abrirAgregar = () => {
    setEditandoId(null);
    setForm(FORM_INICIAL);
    setErrNombre(false);
    setShowModal(true);
  };

  const abrirEditar = (mascota, e) => {
    e.stopPropagation();
    setEditandoId(mascota.id);
    setForm({ ...mascota });
    setErrNombre(false);
    setShowModal(true);
  };

  const eliminar = (id, e) => {
    e.stopPropagation();
    if (window.confirm('¿Seguro que quieres eliminar esta mascota?')) {
      setMascotas(prev => prev.filter(m => m.id !== id));
    }
  };

  const handleImagen = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm(prev => ({ ...prev, imagen: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const guardar = () => {
    if (!form.nombre.trim()) { setErrNombre(true); return; }
    if (editandoId) {
      setMascotas(prev => prev.map(m => m.id === editandoId ? { ...m, ...form } : m));
    } else {
      setMascotas(prev => [...prev, { ...form, id: Date.now().toString(), agenda: [] }]);
    }
    setShowModal(false);
  };

  const campo = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <>
      <Navbar />
      <div className="mm-page">

        <div className="mm-header">
          <div>
            <h1 className="mm-titulo">🐾 Mis Mascotas</h1>
            <p className="mm-subtitulo">Gestiona el perfil y la agenda de tus compañeros</p>
          </div>
          <button className="mm-btn-agregar" onClick={abrirAgregar}>+ Agregar Mascota</button>
        </div>

        {mascotas.length === 0 ? (
          <div className="mm-empty">
            <div className="mm-empty-icon">🐾</div>
            <h3>Aún no tienes mascotas registradas</h3>
            <p>Agrega tu primera mascota para empezar a gestionar su perfil y agenda</p>
            <button className="mm-btn-agregar" onClick={abrirAgregar}>+ Agregar mi primera mascota</button>
          </div>
        ) : (
          <div className="mm-grid">
            {mascotas.map(m => (
              <div className="mm-card" key={m.id} onClick={() => navigate(`/mis-mascotas/${m.id}`)}>
                <div className="mm-card-img">
                  {m.imagen
                    ? <img src={m.imagen} alt={m.nombre} />
                    : <span className="mm-card-emoji">{EMOJI_TIPO[m.tipo] || '🐾'}</span>
                  }
                </div>
                <div className="mm-card-body">
                  <h3 className="mm-card-nombre">{m.nombre}</h3>
                  <p className="mm-card-tipo">{m.tipo}{m.raza ? ` · ${m.raza}` : ''}</p>
                  {m.edad && <p className="mm-card-edad">{m.edad} {m.edad === '1' ? 'año' : 'años'}</p>}
                </div>
                <div className="mm-card-actions">
                  <button className="mm-btn-edit" onClick={(e) => abrirEditar(m, e)}>✏️ Editar</button>
                  <button className="mm-btn-delete" onClick={(e) => eliminar(m.id, e)}>🗑️ Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{editandoId ? 'Editar mascota' : 'Agregar mascota'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="mm-form-grid">

              <Form.Group className="mm-form-full">
                <Form.Label>Foto de la mascota</Form.Label>
                <Form.Control type="file" accept="image/*" onChange={handleImagen} />
                {form.imagen && (
                  <img src={form.imagen} alt="preview" className="mm-img-preview" />
                )}
              </Form.Group>

              <Form.Group>
                <Form.Label>Nombre <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  value={form.nombre}
                  isInvalid={errNombre}
                  onChange={e => { campo('nombre', e.target.value); setErrNombre(false); }}
                />
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
                <Form.Control type="number" min="0" value={form.edad} onChange={e => campo('edad', e.target.value)} />
              </Form.Group>

              <Form.Group>
                <Form.Label>Sexo</Form.Label>
                <Form.Select value={form.sexo} onChange={e => campo('sexo', e.target.value)}>
                  <option>Macho</option>
                  <option>Hembra</option>
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
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button style={{ backgroundColor: '#7e6492', border: 'none' }} onClick={guardar}>
            {editandoId ? 'Guardar cambios' : 'Agregar mascota'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </>
  );
}

export default MisMascotas;
