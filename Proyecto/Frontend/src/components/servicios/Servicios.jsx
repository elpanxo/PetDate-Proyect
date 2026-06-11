import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import AppNavbar from '../navbar/Navbar'
import Footer from '../footer/Footer'
import api, { ApiError, BASE_URL } from '../../api/petdate-api'
import { TIPOS, TIPO_COLOR, TIPO_ICON } from './serviciosData'
import { Search, Hospital, Siren, Scissors, ShoppingCart, PawPrint, TriangleAlert, Hourglass, Store, MapPin, Clock } from 'lucide-react'
import './Servicios.css'

function normalizarTipo(tipoServicio) {
  if (!tipoServicio) return 'Otro'
  return tipoServicio.trim()
}

function extraerComunas(servicios) {
  const set = new Set(servicios.map(s => s.comuna).filter(Boolean))
  return ['Todas', ...Array.from(set).sort()]
}

// Chips de categoría visibles (sin "Todos")
const CHIPS = [
  {
    valor: 'Veterinaria',
    label: 'Veterinaria',
    desc: 'Consultas, vacunas, cirugías y más.',
    Icon: Hospital,
    tituloSeccion: 'Veterinarias cerca de ti',
    color: '#7e6492',
    bgInactivo: '#f0ecf5',
    bgActivo: '#f7f3fb',
  },
  {
    valor: 'Peluquería / Spa',
    label: 'Peluquería',
    desc: 'Baño, corte, estética y spa para tu mascota.',
    Icon: Scissors,
    tituloSeccion: 'Peluquerías cerca de ti',
    color: '#e07b54',
    bgInactivo: '#fff3ee',
    bgActivo: '#fff8f5',
  },
  {
    valor: 'Tienda de mascotas',
    label: 'Tienda de mascota',
    desc: 'Alimentos, accesorios y juguetes.',
    Icon: ShoppingCart,
    tituloSeccion: 'Tiendas de mascotas cerca de ti',
    color: '#2a9db5',
    bgInactivo: '#e6f6fb',
    bgActivo: '#eef9fc',
  },
  {
    valor: 'Veterinaria 24/7',
    label: 'Urgencia 24/7',
    desc: 'Atención veterinaria de emergencia.',
    Icon: Siren,
    tituloSeccion: 'Veterinarias 24/7 cerca de ti',
    color: '#c0392b',
    bgInactivo: '#fdecea',
    bgActivo: '#fef5f5',
  },
]

// Icono de respaldo por tipo cuando no hay foto
const ICONO_RESPALDO = {
  'Veterinaria':        Hospital,
  'Veterinaria 24/7':   Siren,
  'Peluquería / Spa':   Scissors,
  'Tienda de mascotas': ShoppingCart,
}

function Servicios() {
  const [searchParams] = useSearchParams()

  const [tipoActivo, setTipoActivo] = useState(
    () => searchParams.get('tipo') || 'todos'
  )
  const [comunaActiva, setComunaActiva] = useState('Todas')
  const [busqueda, setBusqueda]         = useState('')
  const [serviciosTodos, setServiciosTodos] = useState([])
  const [comunas, setComunas]     = useState(['Todas'])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')

  // Leer usuario del localStorage
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })

  useEffect(() => {
    const handleUserChange = () => {
      const stored = localStorage.getItem('user')
      setUser(stored ? JSON.parse(stored) : null)
    }
    window.addEventListener('userChanged', handleUserChange)
    return () => window.removeEventListener('userChanged', handleUserChange)
  }, [])

  useEffect(() => {
    const tipo = searchParams.get('tipo')
    setTipoActivo(tipo || 'todos')
  }, [searchParams])

  const cargarServicios = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const page = await api.servicios.listar({ page: 0, size: 200 })
      const todos = page.content
      setComunas(extraerComunas(todos))
      setServiciosTodos(todos)
    } catch (err) {
      if (err instanceof ApiError) {
        setError('No se pudieron cargar los servicios. Intenta de nuevo.')
      } else {
        setError('Error de conexión. Verifica que el servidor esté activo.')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    cargarServicios()
  }, [cargarServicios])

  // Filtrado local
  const filtrados = serviciosTodos.filter(s => {
    const coincideTipo = tipoActivo === 'todos' || s.tipoServicio === tipoActivo
    const coincideComuna = comunaActiva === 'Todas' || s.comuna === comunaActiva
    const coincideBusqueda = s.nombreServicio?.toLowerCase().includes(busqueda.toLowerCase())
    return coincideTipo && coincideComuna && coincideBusqueda
  })

  const chipActivo = CHIPS.find(c => c.valor === tipoActivo)

  const handleChip = (valor) => {
    // Toggle: si ya está activo, vuelve a todos
    setTipoActivo(prev => prev === valor ? 'todos' : valor)
    setComunaActiva('Todas')
  }

  return (
    <>
      <AppNavbar />

      {/* ── Hero ── */}
      <section className="servicios-hero">
        <div className="servicios-hero__bg" aria-hidden="true">
          <div className="servicios-hero__collage">
            <div className="servicios-hero__cell">
              <div className="servicios-hero__bg-placeholder">🐾</div></div>
              <div className="servicios-hero__cell"><div className="servicios-hero__bg-placeholder">🐾</div></div>
              <div className="servicios-hero__cell"><div className="servicios-hero__bg-placeholder">🐾</div></div>
              <div className="servicios-hero__cell"><div className="servicios-hero__bg-placeholder">🐾</div></div>
            </div>
          </div>
        <div className="servicios-hero__vignette" aria-hidden="true" />
        <div className="servicios-hero__content">
          <h1 className="servicios-hero__title">Servicios</h1>
          <p className="servicios-hero__slogan">
            Encuentra veterinarias, urgencias, peluquerías y tiendas cerca de ti.
          </p>
        </div>
      </section>

      {/* ── Body ── */}
      <div className="servicios-body">

        {/* Barra de búsqueda + select comuna */}
        <div className="servicios-search-bar">
          <div className="servicios-search-input">
            <Search size={18} className="servicios-search-input__icon" />
            <input
              type="text"
              placeholder="Buscar por nombre de servicio..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />
          </div>
          <div className="servicios-search-input servicios-search-input--comuna">
            <MapPin size={18} className="servicios-search-input__icon" />
            <select
              value={comunaActiva}
              onChange={e => setComunaActiva(e.target.value)}
            >
              {comunas.map(c => <option key={c} value={c}>{c === 'Todas' ? 'Comuna o ubicación' : c}</option>)}
            </select>
          </div>
          <button className="servicios-search-btn" onClick={cargarServicios}>
            Buscar
          </button>
        </div>

        {/* Chips de categoría */}
        <div className="servicios-chips">
          {CHIPS.map(chip => {
            const activo = tipoActivo === chip.valor
            return (
              <button
                key={chip.valor}
                className={`servicio-chip ${activo ? 'servicio-chip--activo' : ''}`}
                onClick={() => handleChip(chip.valor)}
                style={activo ? {
                  borderColor: chip.color,
                  background: chip.bgActivo,
                } : {}}
              >
                <div
                  className="servicio-chip__icon-wrap"
                  style={{
                    background: activo ? chip.color : chip.bgInactivo,
                    color: activo ? '#fff' : chip.color,
                  }}
                >
                  <chip.Icon size={22} />
                </div>
                <div className="servicio-chip__text">
                  <span
                    className="servicio-chip__label"
                    style={activo ? { color: chip.color } : {}}
                  >{chip.label}</span>
                  <span className="servicio-chip__desc">{chip.desc}</span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Título dinámico + resultados */}
        <div className="servicios-section">
          {loading && (
            <div className="servicios-empty">
              <Hourglass size={30} />
              <p>Cargando servicios...</p>
            </div>
          )}

          {!loading && error && (
            <div className="servicios-empty">
              <TriangleAlert size={30} />
              <p>{error}</p>
              <button className="servicios-search-btn" onClick={cargarServicios}>Reintentar</button>
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="servicios-section__header">
                <h2 className="servicios-section__title">
                  <PawPrint size={22} />
                  {chipActivo ? chipActivo.tituloSeccion : 'Todos los servicios'}
                </h2>
              </div>

              {filtrados.length === 0 ? (
                <div className="servicios-empty">
                  <PawPrint size={30} />
                  <p>No se encontraron servicios con los filtros aplicados.</p>
                </div>
              ) : (
                <div className="servicios-grid">
                  {filtrados.map(s => {
                    const tipo = normalizarTipo(s.tipoServicio)
                    const IconoRespaldo = ICONO_RESPALDO[tipo] || Store
                    const fotoUrl = s.imagenUrl
                      ? (s.imagenUrl.startsWith('http') ? s.imagenUrl : `${BASE_URL}${s.imagenUrl}`)
                      : null

                    return (
                      <Link
                        key={s.idServicio}
                        to={`/servicios/${s.idServicio}`}
                        className="servicio-card"
                      >
                        {/* Foto o icono de respaldo */}
                        <div className="servicio-card__media">
                          {fotoUrl ? (
                            <img src={fotoUrl} alt={s.nombreServicio} className="servicio-card__img" />
                          ) : (
                            <div className="servicio-card__media-placeholder">
                              <IconoRespaldo size={40} color={TIPO_COLOR[tipo] || '#7e6492'} />
                            </div>
                          )}
                          <span
                            className="servicio-card__badge"
                            style={{ backgroundColor: TIPO_COLOR[tipo] || '#7e6492' }}
                          >
                            {s.tipoServicio}
                          </span>
                        </div>

                        {/* Info */}
                        <div className="servicio-card__body">
                          <h3 className="servicio-card__nombre">{s.nombreServicio}</h3>
                          {s.tipoServicio && (
                            <p className="servicio-card__tipo">
                              <PawPrint size={12} /> {s.tipoServicio}
                            </p>
                          )}
                          {s.comuna && (
                            <p className="servicio-card__dir">
                              <MapPin size={12} /> {s.comuna}
                            </p>
                          )}
                        </div>

                        <div className="servicio-card__footer">
                          <span className="servicio-card__ver">Ver perfil</span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Banner CTA — solo para no-empresa */}
        {(!user || user.role !== 'empresa') && (
          <div className="servicios-cta">
            <div className="servicios-cta__icon-wrap">
              <Store size={32} color="#7e6492" />
            </div>
            <div className="servicios-cta__text">
              <h3 className="servicios-cta__title">¿Tienes un negocio relacionado con mascotas?</h3>
              <p className="servicios-cta__desc">Registra tu emprendimiento y conecta con miles de dueños de mascotas.</p>
            </div>
            <Link to="/register" className="servicios-cta__btn">
              Registra tu negocio <Store size={18} />
            </Link>
          </div>
        )}

      </div>

      <Footer />
    </>
  )
}

export default Servicios