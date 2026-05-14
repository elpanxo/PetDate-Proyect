import { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import AuthNavbar from '../navbar/AuthNavbar';
import { servicios } from '../servicios/serviciosData';

// Muestra solo un representante por tipo de servicio
const TIPOS_EMPRESA = [
  { label: 'Veterinaria', servicioId: 1 },
  { label: 'Urgencia 24/7', servicioId: 2 },
  { label: 'Peluquería / Estética', servicioId: 3 },
  { label: 'Tienda de mascotas', servicioId: 4 },
];

const LoginEmpresa = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [servicioId, setServicioId] = useState(TIPOS_EMPRESA[0].servicioId);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const tipo = TIPOS_EMPRESA.find(t => t.servicioId === Number(servicioId));
    const servicio = servicios.find(s => s.id === Number(servicioId));
    localStorage.setItem('user', JSON.stringify({
      email,
      name: servicio.nombre,
      role: 'empresa',
      servicioId: Number(servicioId),
    }));
    window.dispatchEvent(new Event('userChanged'));
    navigate('/');
  };

  return (
    <>
      <AuthNavbar />
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', paddingTop: '70px' }}>
        <Row className="w-100">
          <Col md={6} lg={4} className="mx-auto">
            <Card className="shadow">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <span style={{ fontSize: '2rem' }}>🏢</span>
                  <h2 className="mt-2 mb-0">Iniciar Sesión</h2>
                  <p className="text-muted" style={{ fontSize: '0.9rem' }}>Cuenta empresa / servicio</p>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tipo de servicio</Form.Label>
                    <Form.Select
                      value={servicioId}
                      onChange={e => setServicioId(Number(e.target.value))}
                    >
                      {TIPOS_EMPRESA.map(t => (
                        <option key={t.servicioId} value={t.servicioId}>{t.label}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Correo Electrónico</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="empresa@correo.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="********"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    className="w-100 mb-3"
                    style={{ backgroundColor: '#7e6492', border: 'none', fontWeight: 600 }}
                  >
                    Ingresar como empresa
                  </Button>

                  <div className="text-center">
                    <Link to="/login" className="text-decoration-none text-muted" style={{ fontSize: '0.9rem' }}>
                      ← Volver al inicio de sesión de usuario
                    </Link>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default LoginEmpresa;
