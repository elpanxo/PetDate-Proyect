import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import AppNavbar from '../navbar/Navbar'
import Footer from '../footer/Footer'
import { TIPO_COLOR, TIPO_ICON, estadoVencimientoPromo } from './serviciosData'
import { Store, MapPin, Clock, Phone, MessageCircle, Globe, Camera, User, Tag, PawPrint, Hourglass, MessageSquare, SquarePen, ArrowLeft, Mail, Star } from 'lucide-react'
import api, { BASE_URL } from '../../api/petdate-api'
import Comentarios from '../comentarios/Comentarios'
import './ServicioDetalle.css'

function resolverColor(tipoServicio) {
  return TIPO_COLOR[tipoServicio] || '#7e6492'
}

function resolverIcon(tipoServicio) {
  return TIPO_ICON[tipoServicio] || Store
}

// Texto del badge de la promoción según su estado de vencimiento
const BADGE_VENC = {
  normal:  'Activa',
  pronto:  'Por vencer',
  urgente: '¡Último día!',
  vencida: 'Finalizada',
}

function obtenerUsuario() {
  try {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

// Estrellas con soporte de medias estrellas para el promedio
function EstrellasPromedio({ valor = 0, size = 16 }) {
  return (
    <span className="detalle-estrellas" aria-label={`${valor} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const llena  = valor >= n
        const media  = !llena && valor >= n - 0.5
        return (
          <span key={n} className="detalle-estrella-wrap" style={{ width: size, height: size }}>
            <Star size={size} className="detalle-estrella detalle-estrella--fondo" />
            {(llena || media) && (
              <Star
                size={size}
                className="detalle-estrella detalle-estrella--llena"
                style={media ? { clipPath: 'inset(0 50% 0 0)' } : undefined}
              />
            )}
          </span>
        )
      })}
    </span>
  )
}

function ServicioDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [servicio, setServicio]       = useState(null)
  const [promociones, setPromociones] = useState([])
  const [cargando, setCargando]       = useState(true)
  const [notFound, setNotFound]       = useState(false)
  const [tab, setTab] = useState('promos') // 'promos' | 'comentarios'
  const [rating, setRating] = useState({ promedio: 0, total: 0 })

  const usuario = obtenerUsuario()

  useEffect(() => {
    const cargar = async () => {
      try {
        const [svc, promos] = await Promise.all([
          api.servicios.porId(id),
          api.promociones.porServicio(id, { size: 100 }),
        ])
        setServicio(svc)
        setPromociones(promos.content || [])

        try {
          const com = await api.comentarios.servicio.porServicio(id, { size: 200 })
          const lista = com.content || []
          const total = lista.length
          const promedio = total
            ? lista.reduce((acc, c) => acc + (c.calificacion || 0), 0) / total
            : 0
          setRating({ promedio, total })
        } catch {
          setRating({ promedio: 0, total: 0 })
        }
      } catch {
        setNotFound(true)
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [id])

  if (cargando) return (
    <>
      <AppNavbar />
      <div className="detalle-notfound">
        <Hourglass size={30} />
        <p>Cargando servicio...</p>
      </div>
      <Footer />
    </>
  )

  if (notFound || !servicio) return (
    <>
      <AppNavbar />
      <div className="detalle-notfound">
        <PawPrint size={22} />
        <p>Servicio no encontrado.</p>
        <Link to="/servicios" className="detalle-back">← Volver a Servicios</Link>
      </div>
      <Footer />
    </>
  )

  const color    = resolverColor(servicio.tipoServicio)
  const TipoIcon = resolverIcon(servicio.tipoServicio)
  const imagenUrl = servicio.imagenUrl
    ? (servicio.imagenUrl.startsWith('http') ? servicio.imagenUrl : `${BASE_URL}${servicio.imagenUrl}`)
    : null

  // Solo la propia empresa ve el botón de editar
  const esDuenio = !!usuario && usuario.role === 'empresa' &&
    (usuario.servicioId === servicio.idServicio || usuario.id === servicio.idServicio)

  // Características destacadas (si existen)
  const caracteristicas = [
    servicio.caracteristica1,
    servicio.caracteristica2,
    servicio.caracteristica3,
    servicio.caracteristica4,
  ].filter(Boolean)

  return (
    <>
      <AppNavbar />

      <div className="detalle-wrapper">
        <div className="detalle-breadcrumb">
          <Link to="/servicios" className="detalle-breadcrumb__link">
            <ArrowLeft size={18} /> Volver a Servicios
          </Link>
        </div>

        <div className="detalle-layout">

          {/* ── Columna izquierda: información ── */}
          <aside className="detalle-info">

            {/* Avatar / foto circular */}
            <div className="detalle-info__header">
              <div className="detalle-info__avatar" style={{ backgroundColor: `${color}1f` }}>
                {imagenUrl ? (
                  <img src={imagenUrl} alt={servicio.nombreServicio} className="detalle-info__avatar-img" />
                ) : (
                  <TipoIcon size={40} color={color} />
                )}
              </div>

              <span className="detalle-info__badge" style={{ backgroundColor: `${color}1f`, color }}>
                {servicio.tipoServicio?.toUpperCase()}
              </span>

              <h1 className="detalle-info__nombre">{servicio.nombreServicio}</h1>

              {rating.total > 0 && (
                <div className="detalle-info__rating">
                  <EstrellasPromedio valor={rating.promedio} size={17} />
                  <span className="detalle-info__rating-text">
                    {rating.promedio.toFixed(1)} / 5 <span className="detalle-info__rating-count">({rating.total} {rating.total === 1 ? 'comentario' : 'comentarios'})</span>
                  </span>
                </div>
              )}
            </div>

            {/* Datos de contacto */}
            {(servicio.direccion || servicio.telefono || servicio.horario || servicio.whatsApp || servicio.sitioWeb || servicio.instagram || servicio.facebook || servicio.correo) && (
              <ul className="detalle-info__lista">
                {servicio.direccion && (
                  <li>
                    <span className="detalle-info__lista-icon"><MapPin size={17} /></span>
                    <span className="detalle-info__lista-valor">
                      {servicio.direccion}{servicio.comuna ? `, ${servicio.comuna}` : ''}
                    </span>
                  </li>
                )}
                {servicio.telefono && (
                  <li>
                    <span className="detalle-info__lista-icon"><Phone size={17} /></span>
                    <a className="detalle-info__lista-link" href={`tel:${servicio.telefono}`}>
                      {servicio.telefono}
                    </a>
                  </li>
                )}
                {servicio.horario && (
                  <li>
                    <span className="detalle-info__lista-icon"><Clock size={17} /></span>
                    <span className="detalle-info__lista-valor">{servicio.horario}</span>
                  </li>
                )}
                {servicio.correo && (
                  <li>
                    <span className="detalle-info__lista-icon"><Mail size={17} /></span>
                    <a className="detalle-info__lista-link" href={`mailto:${servicio.correo}`}>
                      {servicio.correo}
                    </a>
                  </li>
                )}
                {servicio.whatsApp && (
                  <li>
                    <span className="detalle-info__lista-icon detalle-info__lista-icon--wsp"><MessageCircle size={17} /></span>
                    <a
                      className="detalle-info__lista-link detalle-info__lista-link--wsp"
                      href={`https://wa.me/${servicio.whatsApp}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Abrir chat de WhatsApp
                    </a>
                  </li>
                )}
                {servicio.sitioWeb && (
                  <li>
                    <span className="detalle-info__lista-icon"><Globe size={17} /></span>
                    <a
                      className="detalle-info__lista-link"
                      href={`https://${servicio.sitioWeb}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {servicio.sitioWeb}
                    </a>
                  </li>
                )}
                {servicio.instagram && (
                  <li>
                    <span className="detalle-info__lista-icon"><Camera size={17} /></span>
                    <a
                      className="detalle-info__lista-link"
                      href={`https://instagram.com/${servicio.instagram}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      @{servicio.instagram}
                    </a>
                  </li>
                )}
                {servicio.facebook && (
                  <li>
                    <span className="detalle-info__lista-icon"><User size={17} /></span>
                    <a
                      className="detalle-info__lista-link"
                      href={`https://facebook.com/${servicio.facebook}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {servicio.facebook}
                    </a>
                  </li>
                )}
              </ul>
            )}

            {/* Sobre la empresa */}
            <div className="detalle-info__sobre">
              <h2 className="detalle-info__seccion-titulo">Sobre la empresa</h2>
              <p className="detalle-info__desc">
                {servicio.descripcion
                  ? servicio.descripcion
                  : 'Aún no hay descripción disponible.'}
              </p>

              {caracteristicas.length > 0 && (
                <div className="detalle-info__caracteristicas">
                  {caracteristicas.map((texto, i) => (
                    <div key={i} className="detalle-info__caracteristica">
                      <span className="detalle-info__caracteristica-icon" style={{ color }}>
                        <PawPrint size={16} />
                      </span>
                      {texto}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Solo la empresa dueña del perfil ve este botón */}
            {esDuenio && (
              <button
                className="detalle-info__editar-btn"
                style={{ borderColor: color, color }}
                onClick={() => navigate('/mi-empresa')}
              >
                <SquarePen size={16} /> Editar información
              </button>
            )}
          </aside>

          {/* ── Columna derecha: tabs Promociones / Comentarios ── */}
          <section className="detalle-tabs">

            <div className="detalle-tabs__header">
              <button
                className={`detalle-tab-btn ${tab === 'promos' ? 'detalle-tab-btn--activo' : ''}`}
                style={tab === 'promos' ? { color, borderColor: color } : {}}
                onClick={() => setTab('promos')}
              >
                <Tag size={16} /> Promociones
              </button>
              <button
                className={`detalle-tab-btn ${tab === 'comentarios' ? 'detalle-tab-btn--activo' : ''}`}
                style={tab === 'comentarios' ? { color, borderColor: color } : {}}
                onClick={() => setTab('comentarios')}
              >
                <MessageSquare size={16} /> Comentarios y calificaciones
              </button>
            </div>

            <div className="detalle-tabs__body">
              {tab === 'promos' && (
                promociones.length === 0 ? (
                  <div className="detalle-promos__empty">
                    <PawPrint size={22} />
                    <p>Este servicio no tiene promociones activas por el momento.</p>
                  </div>
                ) : (
                  <div className="detalle-promos__lista">
                    {promociones.map((promo) => {
                      const venc = estadoVencimientoPromo(promo.fechaTermino);
                      return (
                      <div key={promo.idPromocion} className="promo-detalle" style={{ borderLeftColor: color }}>
                        <h3 className="promo-detalle__titulo">{promo.titulo}</h3>
                        {promo.descripcion && <p className="promo-detalle__desc">{promo.descripcion}</p>}
                        <span className={`promo-detalle__estado promo-detalle__estado--${venc.nivel}`}>
                          {BADGE_VENC[venc.nivel]}
                        </span>
                        <small className={`promo-detalle__fecha promo-detalle__fecha--${venc.nivel}`}>
                          Válido hasta {promo.fechaTermino}
                          {venc.texto && <span className="promo-detalle__venc"> · {venc.texto}</span>}
                        </small>
                      </div>
                      );
                    })}
                  </div>
                )
              )}

              {tab === 'comentarios' && (
                <div className="detalle-comentarios">
                  <Comentarios tipo="servicio" id={id} color={color} />
                </div>
              )}
            </div>
          </section>

        </div>
      </div>

      <Footer />
    </>
  )
}

export default ServicioDetalle