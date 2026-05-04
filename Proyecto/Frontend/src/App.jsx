import { Routes, Route } from 'react-router-dom'
import Login from './components/login/Login'
import Register from './components/login/Register'
import Home from './components/home/Home'
import './App.css'

// AQUI ESTA LAS RUTAS DE LA APP, HACIA DONDE SE REDIRIGE

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Home />} />
    </Routes>
  )
}

export default App
