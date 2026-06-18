import { Routes, Route } from 'react-router-dom'
import Login from './components/login/Login'
import Register from './components/login/Register'
import Home from './components/home/Home'
import Nosotros from './components/nosotros/Nosotros'
import Contacto from './components/contacto/Contacto'
import Blogs from './components/blogs/Blogs'
import BlogDetalle from './components/blogs/BlogDetalle'
import Servicios from './components/servicios/Servicios'
import ServicioDetalle from './components/servicios/ServicioDetalle'
import MisMascotas from './components/misMascotas/MisMascotas'
import MascotaDetalle from './components/misMascotas/MascotaDetalle'
import LoginEmpresa from './components/login/LoginEmpresa'
import MiEmpresa from './components/miEmpresa/MiEmpresa'
import PoliticaPrivacidad from './components/politicaPrivacidad/PoliticaPrivacidad'
import RecuperarContrasena from './components/login/RecuperarContrasena'
import './App.css'

// AQUI ESTA LAS RUTAS DE LA APP, HACIA DONDE SE REDIRIGE

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/nosotros" element={<Nosotros />} />
      <Route path="/contacto" element={<Contacto />} />
      <Route path="/blogs" element={<Blogs />} />
      <Route path="/blogs/:id" element={<BlogDetalle />} />
      <Route path="/servicios" element={<Servicios />} />
      <Route path="/servicios/:id" element={<ServicioDetalle />} />
      <Route path="/mis-mascotas" element={<MisMascotas />} />
      <Route path="/mis-mascotas/:id" element={<MascotaDetalle />} />
      <Route path="/login-empresa" element={<LoginEmpresa />} />
      <Route path="/mi-empresa" element={<MiEmpresa />} />
      <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
      <Route path="/recuperar-contrasena" element={<RecuperarContrasena tipo="cliente" />} />
      <Route path="/recuperar-contrasena-empresa" element={<RecuperarContrasena tipo="empresa" />} />
      <Route path="/" element={<Home />} />
    </Routes>
  )
}

export default App
