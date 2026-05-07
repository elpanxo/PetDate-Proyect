import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import AppNavbar from '../navbar/Navbar'
import Footer from '../footer/Footer'
import { servicios, TIPOS, TIPO_COLOR, TIPO_EMOJI, COMUNAS } from './serviciosData'
import './Servicios.css'

function Servicios() {
  const [searchParams] = useSearchParams()
  const [tipoActivo, setTipoActivo] = useState(() => searchParams.get('tipo') || 'todos')

  useEffect(() => {
    const tipo = searchParams.get('tipo')
    setTipoActivo(tipo || 'todos')
  }, [searchParams])
  const [comunaActiva, setComunaActiva] = useState('Todas')
  const [busqueda, setBusqueda] = useState('')

  const filtrados = servicios.filter((s) => {
    const coincideTipo = tipoActivo === 'todos' || s.tipo === tipoActivo
    const coincideComuna = comunaActiva === 'Todas' || s.comuna === comunaActiva
    const coincideBusqueda = s.nombre.toLowerCase().includes(busqueda.toLowerCase())
    return coincideTipo && coincideComuna && coincideBusqueda
  })

  return (
    <>
      <AppNavbar />

      {/* Hero */}
      <section className="servicios-hero">
        <div className="servicios-hero__content">
          <h1 className="servicios-hero__title">Servicios</h1>
          <p className="servicios-hero__slogan">Encuentra veterinarias, urgencias, peluquerías y tiendas cerca de ti.</p>
        </div>
      </section>

      {/* Filtros */}
      <section className="servicios-filtros">
        {/* Buscador */}
        <div className="filtros-busqueda">
          <span className="filtros-busqueda__icon">🔍</span>
          <input
            type="text"
            className="filtros-busqueda__input"
            placeholder="Buscar por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="filtros-row">
          {/* Tipo de servicio */}
          <div className="filtros-grupo">
            <span className="filtros-grupo__label">Tipo de servicio</span>
            <div className="filtros-pills">
              {TIPOS.map((t) => (
                <button
                  key={t.valor}
                  className={`filtro-pill ${tipoActivo === t.valor ? 'filtro-pill--activo' : ''}`}
                  onClick={() => setTipoActivo(t.valor)}
                >
                  {t.valor !== 'todos' && (
                    <span style={{ color: TIPO_COLOR[t.valor] }}>{TIPO_EMOJI[t.valor]}</span>
                  )}
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Comuna */}
          <div className="filtros-grupo">
            <span className="filtros-grupo__label">Comuna</span>
            <select
              className="filtros-select"
              value={comunaActiva}
              onChange={(e) => setComunaActiva(e.target.value)}
            >
              {COMUNAS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Resultados */}
      <section className="servicios-section">
        <p className="servicios-count">
          {filtrados.length} {filtrados.length === 1 ? 'resultado' : 'resultados'} encontrados
        </p>

        {filtrados.length === 0 ? (
          <div className="servicios-empty">
            <span className="servicios-empty__icon">🐾</span>
            <p>No se encontraron servicios con los filtros aplicados.</p>
          </div>
        ) : (
          <div className="servicios-grid">
            {filtrados.map((s) => (
              <Link key={s.id} to={`/servicios/${s.id}`} className="servicio-card">
                <div className="servicio-card__header" style={{ borderLeftColor: TIPO_COLOR[s.tipo] }}>
                  <div className="servicio-card__icon">{TIPO_EMOJI[s.tipo]}</div>
                  <div>
                    <span
                      className="servicio-card__badge"
                      style={{ backgroundColor: TIPO_COLOR[s.tipo] }}
                    >
                      {s.tipo}
                    </span>
                    <h3 className="servicio-card__nombre">{s.nombre}</h3>
                  </div>
                </div>
                <p className="servicio-card__desc">{s.descripcion}</p>
                <div className="servicio-card__footer">
                  <span className="servicio-card__dir">📍 {s.comuna}</span>
                  <span className="servicio-card__horario">🕐 {s.horario.split('·')[0].trim()}</span>
                  {s.promociones.length > 0 && (
                    <span className="servicio-card__promos">🏷️ {s.promociones.length} promo{s.promociones.length > 1 ? 's' : ''}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </>
  )
}

export default Servicios
