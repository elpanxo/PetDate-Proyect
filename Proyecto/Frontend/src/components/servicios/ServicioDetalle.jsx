import { useParams, Link } from 'react-router-dom'
import AppNavbar from '../navbar/Navbar'
import Footer from '../footer/Footer'
import { servicios, TIPO_COLOR, TIPO_ICON } from './serviciosData'
import { Hospital, Siren, Scissors, ShoppingCart, PawPrint, Store, MapPin, Clock, Phone, MessageCircle, Globe, Camera, User, Tag } from 'lucide-react'
import './ServicioDetalle.css'

function ServicioDetalle() {
  const { id } = useParams()
  const overrides = JSON.parse(localStorage.getItem('servicios_override') || '{}')
  const base = servicios.find((s) => s.id === Number(id))
  const servicio = base && overrides[id] ? { ...base, ...overrides[id] } : base

  if (!servicio) {
    return (
      <>
        <AppNavbar />
        <div className="detalle-notfound">
          <PawPrint className="fab__icon" size={22} />
          <p>Servicio no encontrado.</p>
          <Link to="/servicios" className="detalle-back">← Volver a Servicios</Link>
        </div>
      </>
    )
  }

  const color = TIPO_COLOR[servicio.tipo]
  const TipoIcon = TIPO_ICON[servicio.tipo] || Store

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
              <div className="detalle-info__icono"><TipoIcon size={28} /></div>
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
                <span className="detalle-info__lista-icon"><MapPin size={16} /></span>
                <div>
                  <span className="detalle-info__lista-label">Dirección</span>
                  <span className="detalle-info__lista-valor">{servicio.direccion}</span>
                </div>
              </li>
              <li>
                <span className="detalle-info__lista-icon"><Clock size={16} /></span>
                <div>
                  <span className="detalle-info__lista-label">Horario</span>
                  <span className="detalle-info__lista-valor">{servicio.horario}</span>
                </div>
              </li>
              <li>
                <span className="detalle-info__lista-icon"><Phone size={16} /></span>
                <div>
                  <span className="detalle-info__lista-label">Teléfono</span>
                  <a className="detalle-info__lista-link" href={`tel:${servicio.telefono}`}>
                    {servicio.telefono}
                  </a>
                </div>
              </li>
              <li>
                <span className="detalle-info__lista-icon"><MessageCircle size={16} /></span>
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
                <span className="detalle-info__lista-icon"><Globe size={16} /></span>
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
                <span className="detalle-info__lista-icon"><Camera size={16} /></span>
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
                <span className="detalle-info__lista-icon"><User size={16} /></span>
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
              <Tag size={18} /> Promociones
              {servicio.promociones.length > 0 && (
                <span className="detalle-promos__count">{servicio.promociones.length}</span>
              )}
            </h2>

            {servicio.promociones.length === 0 ? (
              <div className="detalle-promos__empty">
                <PawPrint className="fab__icon" size={22} />
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
