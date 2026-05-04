import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { Container, Row, Col, Button, Card } from 'react-bootstrap'
import Login from './components/login/Login'
import Register from './components/login/Register'
import AppNavbar from './components/navbar/Navbar'
import './App.css'

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
      <AppNavbar />
      <main style={{ paddingTop: '70px' }}>
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
      </main>
    </>
  )
}


function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<HomeContent />} />
    </Routes>
  )
}

export default App
