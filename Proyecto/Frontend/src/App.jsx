import { Routes, Route } from 'react-router-dom'
import Login from './components/login/Login'
import Register from './components/login/Register'
import Home from './components/home/Home'
import Nosotros from './components/nosotros/Nosotros'
import Contacto from './components/contacto/Contacto'
import Blogs from './components/blogs/Blogs'
import Servicios from './components/servicios/Servicios'
import ServicioDetalle from './components/servicios/ServicioDetalle'
import MisMascotas from './components/misMascotas/MisMascotas'
import MascotaDetalle from './components/misMascotas/MascotaDetalle'
import LoginEmpresa from './components/login/LoginEmpresa'
import MiEmpresa from './components/miEmpresa/MiEmpresa'
import PoliticaPrivacidad from './components/politicaPrivacidad/PoliticaPrivacidad'
import RecuperarContrasena from './components/login/RecuperarContrasena'
import AdminLogin from './components/admin/AdminLogin'
import AdminRoute from './components/admin/AdminRoute'
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './components/admin/sections/AdminDashboard'
import AdminUsuarios from './components/admin/sections/AdminUsuarios'
import AdminMascotas from './components/admin/sections/AdminMascotas'
import AdminCitas from './components/admin/sections/AdminCitas'
import AdminComentarios from './components/admin/sections/AdminComentarios'
import AdminBlogs from './components/admin/sections/AdminBlogs'
import AdminServicios from './components/admin/sections/AdminServicios'
import AdminLogs from './components/admin/sections/AdminLogs'
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
      <Route path="/servicios" element={<Servicios />} />
      <Route path="/servicios/:id" element={<ServicioDetalle />} />
      <Route path="/mis-mascotas" element={<MisMascotas />} />
      <Route path="/mis-mascotas/:id" element={<MascotaDetalle />} />
      <Route path="/login-empresa" element={<LoginEmpresa />} />
      <Route path="/mi-empresa" element={<MiEmpresa />} />
      <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
      <Route path="/recuperar-contrasena" element={<RecuperarContrasena tipo="cliente" />} />
      <Route path="/recuperar-contrasena-empresa" element={<RecuperarContrasena tipo="empresa" />} />

      {/* ── Rutas de administración ── */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>} />
      <Route path="/admin/usuarios" element={<AdminRoute><AdminLayout><AdminUsuarios /></AdminLayout></AdminRoute>} />
      <Route path="/admin/mascotas" element={<AdminRoute><AdminLayout><AdminMascotas /></AdminLayout></AdminRoute>} />
      <Route path="/admin/citas" element={<AdminRoute><AdminLayout><AdminCitas /></AdminLayout></AdminRoute>} />
      <Route path="/admin/comentarios" element={<AdminRoute><AdminLayout><AdminComentarios /></AdminLayout></AdminRoute>} />
      <Route path="/admin/blogs" element={<AdminRoute><AdminLayout><AdminBlogs /></AdminLayout></AdminRoute>} />
      <Route path="/admin/servicios" element={<AdminRoute><AdminLayout><AdminServicios /></AdminLayout></AdminRoute>} />
      <Route path="/admin/logs" element={<AdminRoute><AdminLayout><AdminLogs /></AdminLayout></AdminRoute>} />

      <Route path="/" element={<Home />} />
    </Routes>
  )
}

export default App
