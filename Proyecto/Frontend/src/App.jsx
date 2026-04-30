import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { Container, Row, Col, Button, Card, Navbar, Nav } from 'react-bootstrap'
import Login from './components/login/Login'
import Register from './components/login/Register'
import './App.css'

// Componente del contenido principal (lo que ya tenías)
function HomeContent() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <>
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#">Mi App</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#">Inicio</Nav.Link>
            <Nav.Link href="#">Servicios</Nav.Link>
            <Nav.Link href="#">Contacto</Nav.Link>
          </Nav>
          <Nav>
            {user && (
              <>
                <Navbar.Text className="me-3 text-white">
                  Hola, {user.name}
                </Navbar.Text>
                <Button variant="outline-light" size="sm" onClick={handleLogout}>
                  Cerrar Sesión
                </Button>
              </>
            )}
          </Nav>
        </Container>
      </Navbar>

      {/* Contenido */}
      <Container className="mt-4">
        <Row>
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>Tarjeta 1</Card.Title>
                <Card.Text>
                  Este es un ejemplo usando Bootstrap en React.
                </Card.Text>
                <Button variant="primary">Acción</Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>Tarjeta 2</Card.Title>
                <Card.Text>
                  Puedes reutilizar componentes fácilmente.
                </Card.Text>
                <Button variant="success">Acción</Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>Tarjeta 3</Card.Title>
                <Card.Text>
                  Ideal para dashboards o landing pages.
                </Card.Text>
                <Button variant="warning">Acción</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}

// Componente para proteger rutas
function PrivateRoute({ children }) {
  const isAuthenticated = localStorage.getItem('user') !== null
  return isAuthenticated ? children : <Navigate to="/login" />
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route 
        path="/" 
        element={
          <PrivateRoute>
            <HomeContent />
          </PrivateRoute>
        } 
      />
    </Routes>
  )
}

export default App