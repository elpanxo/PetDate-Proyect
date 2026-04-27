import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

import { Container, Row, Col, Button, Card, Navbar, Nav } from 'react-bootstrap'

function App() {
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

export default App
