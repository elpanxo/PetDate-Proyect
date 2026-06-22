import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock } from 'lucide-react'
import { clearSession } from '../../api/petdate-api'
import '../confirm/ConfirmModal.css'

//  CONFIGURACIÓN — edita solo estos dos números

const MINUTOS_INACTIVIDAD  = 10
const MINUTOS_AVISO_PREVIO = 1

const LIMITE_MS = MINUTOS_INACTIVIDAD * 60 * 1000

const AVISO_MS  = Math.min(MINUTOS_AVISO_PREVIO, MINUTOS_INACTIVIDAD) * 60 * 1000
const ULTIMA_ACTIVIDAD_KEY = 'petdate_last_activity'

// Eventos que cuentan como "actividad" del usuario.
const EVENTOS = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click', 'wheel']

// ¿Hay una sesión de cliente/empresa abierta? (es lo que ve el navbar)
const haySesion = () => !!localStorage.getItem('user')

// Formatea segundos como "m:ss" (ej. 120 → "2:00").
function formatear(segundos) {
  const m = Math.floor(segundos / 60)
  const s = segundos % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function SessionManager() {
  const navigate = useNavigate()
  const [mostrarAviso, setMostrarAviso] = useState(false)
  const [segundosRestantes, setSegundosRestantes] = useState(0)

  // Referencias a las acciones que disparan los botones del modal.
  const seguirRef = useRef(null)
  const cerrarRef = useRef(null)

  useEffect(() => {
    let timerAviso = null      // dispara la aparición del aviso
    let timerCierre = null      // dispara el cierre tras el aviso
    let intervaloCuenta = null  // actualiza la cuenta atrás cada segundo
    let avisoActivo = false     // mientras el aviso está visible, ignoramos actividad
    let ultimaPersistencia = 0  // para no escribir en localStorage en cada pixel del mouse

    const limpiarTimers = () => {
      clearTimeout(timerAviso)
      clearTimeout(timerCierre)
      clearInterval(intervaloCuenta)
    }

    const cerrarSesion = () => {
      limpiarTimers()
      avisoActivo = false
      setMostrarAviso(false)
      clearSession()          // borra token + usuario y emite 'userChanged'
      navigate('/login')
    }

    const abrirAviso = (duracionMs) => {
      avisoActivo = true
      const fin = Date.now() + duracionMs
      setSegundosRestantes(Math.ceil(duracionMs / 1000))
      setMostrarAviso(true)
      intervaloCuenta = setInterval(() => {
        const restan = Math.ceil((fin - Date.now()) / 1000)
        if (restan <= 0) cerrarSesion()
        else setSegundosRestantes(restan)
      }, 1000)
      timerCierre = setTimeout(cerrarSesion, duracionMs)
    }

    // (Re)programa los timers tomando como base la marca de última actividad.
    const programar = (baseTs) => {
      limpiarTimers()
      if (!haySesion()) return
      const restante = LIMITE_MS - (Date.now() - baseTs)
      if (restante <= 0) { cerrarSesion(); return }
      if (restante <= AVISO_MS) { abrirAviso(restante); return }
      timerAviso = setTimeout(() => abrirAviso(AVISO_MS), restante - AVISO_MS)
    }

    const registrarActividad = () => {
      if (avisoActivo || !haySesion()) return
      const ahora = Date.now()
      if (ahora - ultimaPersistencia >= 1000) {   // throttle: máx. 1 escritura/seg
        ultimaPersistencia = ahora
        localStorage.setItem(ULTIMA_ACTIVIDAD_KEY, String(ahora))
        programar(ahora)
      }
    }

    const seguirConectado = () => {
      avisoActivo = false
      setMostrarAviso(false)
      const ahora = Date.now()
      localStorage.setItem(ULTIMA_ACTIVIDAD_KEY, String(ahora))
      programar(ahora)
    }

    seguirRef.current = seguirConectado
    cerrarRef.current = cerrarSesion

    // Arranque: si ya hay sesión, comprobamos el caso "ventana cerrada".
    if (haySesion()) {
      const guardada = Number(localStorage.getItem(ULTIMA_ACTIVIDAD_KEY)) || Date.now()
      programar(guardada)
    }

    // Si se inicia/cierra sesión en otra parte de la app, reaccionamos.
    const alCambiarUsuario = () => {
      if (haySesion()) {
        const ahora = Date.now()
        localStorage.setItem(ULTIMA_ACTIVIDAD_KEY, String(ahora))
        avisoActivo = false
        setMostrarAviso(false)
        programar(ahora)
      } else {
        limpiarTimers()
        avisoActivo = false
        setMostrarAviso(false)
      }
    }

    EVENTOS.forEach(ev => window.addEventListener(ev, registrarActividad, { passive: true }))
    window.addEventListener('userChanged', alCambiarUsuario)

    return () => {
      EVENTOS.forEach(ev => window.removeEventListener(ev, registrarActividad))
      window.removeEventListener('userChanged', alCambiarUsuario)
      limpiarTimers()
    }
  }, [navigate])

  if (!mostrarAviso) return null

  return (
    <div className="cm-overlay">
      <div className="cm-box" onClick={e => e.stopPropagation()}>
        <div className="cm-box__ico-wrap cm-box__ico-wrap--lila">
          <Clock size={22} />
        </div>
        <h2 className="cm-box__titulo">¿Sigues ahí?</h2>
        <p className="cm-box__mensaje">
          Por seguridad, tu sesión se cerrará por inactividad en{' '}
          <strong>{formatear(segundosRestantes)}</strong>. ¿Quieres seguir conectada?
        </p>
        <div className="cm-box__acciones">
          <button
            className="cm-box__btn cm-box__btn--cancelar"
            onClick={() => cerrarRef.current?.()}
          >
            Cerrar sesión
          </button>
          <button
            className="cm-box__btn cm-box__btn--lila"
            onClick={() => seguirRef.current?.()}
          >
            Seguir conectada
          </button>
        </div>
      </div>
    </div>
  )
}
