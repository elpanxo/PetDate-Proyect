import { useParams, Link } from 'react-router-dom'
import AppNavbar from '../navbar/Navbar'
import Footer from '../footer/Footer'
import { servicios, TIPO_COLOR, TIPO_EMOJI } from './serviciosData'
import './ServicioDetalle.css'

function ServicioDetalle() {
  const { id } = useParams()
  const servicio = servicios.find((s) => s.id === Number(id))

  if (!servicio) {
    return (
      <>
        <AppNavbar />
        <div className="detalle-notfound">
          <span>🐾</span>
          <p>Servicio no encontrado.</p>
          <Link to="/servicios" className="detalle-back">← Volver a Servicios</Link>
        </div>
      </>
    )
  }

  const color = TIPO_COLOR[servicio.tipo]

  return (
    <>
      <AppNavbar />

      <div className="detalle-wrapper">
        {/* Breadcrumb */}
        <div className="detalle-breadcrumb">
          <Link to="/servicios" className="detalle-breadcrumb__link">← Volver a Servicios</Link>
        </div>

        <div className="detalle-layout">

          {/* ── Panel izquierdo: información ── */}
          <aside className="detalle-info">
            <div className="detalle-info__top" style={{ borderTopColor: color }}>
              <div className="detalle-info__icono">{TIPO_EMOJI[servicio.tipo]}</div>
              <div>
                <span className="detalle-info__badge" style={{ backgroundColor: color }}>
                  {servicio.tipo}
                </span>
                <h1 className="detalle-info__nombre">{servicio.nombre}</h1>
              </div>
            </div>

            <p className="detalle-info__desc">{servicio.descripcion}</p>

            <ul className="detalle-info__lista">
              <li>
                <span className="detalle-info__lista-icon">📍</span>
                <div>
                  <span className="detalle-info__lista-label">Dirección</span>
                  <span className="detalle-info__lista-valor">{servicio.direccion}</span>
                </div>
              </li>
              <li>
                <span className="detalle-info__lista-icon">🕐</span>
                <div>
                  <span className="detalle-info__lista-label">Horario</span>
                  <span className="detalle-info__lista-valor">{servicio.horario}</span>
                </div>
              </li>
              <li>
                <span className="detalle-info__lista-icon">📞</span>
                <div>
                  <span className="detalle-info__lista-label">Teléfono</span>
                  <a className="detalle-info__lista-link" href={`tel:${servicio.telefono}`}>
                    {servicio.telefono}
                  </a>
                </div>
              </li>
              <li>
                <span className="detalle-info__lista-icon">💬</span>
                <div>
                  <span className="detalle-info__lista-label">WhatsApp</span>
                  <a
                    className="detalle-info__lista-link detalle-info__lista-link--wsp"
                    href={`https://wa.me/${servicio.wsp}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Abrir chat
                  </a>
                </div>
              </li>
              <li>
                <span className="detalle-info__lista-icon">🌐</span>
                <div>
                  <span className="detalle-info__lista-label">Sitio web</span>
                  <a
                    className="detalle-info__lista-link"
                    href={`https://${servicio.web}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {servicio.web}
                  </a>
                </div>
              </li>
              <li>
                <span className="detalle-info__lista-icon">📸</span>
                <div>
                  <span className="detalle-info__lista-label">Instagram</span>
                  <a
                    className="detalle-info__lista-link"
                    href={`https://instagram.com/${servicio.instagram}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    @{servicio.instagram}
                  </a>
                </div>
              </li>
              <li>
                <span className="detalle-info__lista-icon">👤</span>
                <div>
                  <span className="detalle-info__lista-label">Facebook</span>
                  <a
                    className="detalle-info__lista-link"
                    href={`https://facebook.com/${servicio.facebook}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {servicio.facebook}
                  </a>
                </div>
              </li>
            </ul>
          </aside>

          {/* ── Panel derecho: promociones ── */}
          <section className="detalle-promos">
            <h2 className="detalle-promos__title">
              🏷️ Promociones
              {servicio.promociones.length > 0 && (
                <span className="detalle-promos__count">{servicio.promociones.length}</span>
              )}
            </h2>

            {servicio.promociones.length === 0 ? (
              <div className="detalle-promos__empty">
                <span className="detalle-promos__empty-icon">🐾</span>
                <p>Este servicio no tiene promociones activas por el momento.</p>
              </div>
            ) : (
              <div className="detalle-promos__lista">
                {servicio.promociones.map((promo) => (
                  <div key={promo.id} className="promo-detalle" style={{ borderLeftColor: color }}>
                    <h3 className="promo-detalle__titulo">{promo.titulo}</h3>
                    <p className="promo-detalle__desc">{promo.descripcion}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </div>

      <Footer />
    </>
  )
}

export default ServicioDetalle
