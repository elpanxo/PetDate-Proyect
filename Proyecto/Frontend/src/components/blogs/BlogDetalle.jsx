import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import AppNavbar from '../navbar/Navbar'
import Footer from '../footer/Footer'
import Comentarios, { Estrellas } from '../comentarios/Comentarios'
import api, { BASE_URL } from '../../api/petdate-api'
import { TIPO_COLOR } from '../servicios/serviciosData'
import { Calendar, Clock, ArrowLeft, ExternalLink } from 'lucide-react'
import './BlogDetalle.css'

function PawIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 17.27C10.22 16.5 5 13.45 5 9a7 7 0 0 1 14 0c0 4.45-5.22 7.5-7 8.27zM12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
    </svg>
  )
}

const formatFecha = (f) =>
  f ? new Date(f).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' }) : ''

const calcMin = (texto) =>
  Math.max(1, Math.round((texto?.split(' ').length || 0) / 200))

export default function BlogDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [blog, setBlog]         = useState(null)
  const [servicio, setServicio] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [resumen, setResumen]   = useState({ promedio: 0, total: 0 })

  const handleResumen = useCallback((r) => setResumen(r), [])

  useEffect(() => {
    const cargar = async () => {
      try {
        const b = await api.blogs.porId(id)
        setBlog(b)
        if (b?.idServicio) {
          const s = await api.servicios.porId(b.idServicio).catch(() => null)
          setServicio(s)
        }
      } catch {
        setError('No se pudo cargar esta entrada del blog.')
      } finally {
        setLoading(false)
      }
    }
    cargar()
    window.scrollTo(0, 0)
  }, [id])

  if (loading) return (
    <>
      <AppNavbar />
      <div className="bd-estado">
        <Clock size={28} />
        <p>Cargando entrada...</p>
      </div>
      <Footer />
    </>
  )

  if (error || !blog) return (
    <>
      <AppNavbar />
      <div className="bd-estado">
        <p>{error || 'Entrada no encontrada.'}</p>
        <button className="bd-back-btn" onClick={() => navigate('/blogs')}>← Volver</button>
      </div>
      <Footer />
    </>
  )

  const color   = TIPO_COLOR[servicio?.tipoServicio] || '#7e6492'
  const mins    = calcMin(blog.texto)
  const fotoSrc = blog.imagen ? `${BASE_URL}${blog.imagen}` : null
  const svcFoto = servicio?.imagenUrl ? `${BASE_URL}${servicio.imagenUrl}` : null

  return (
    <>
      <AppNavbar />

      <div className="bd-page">

        {/* ── Breadcrumb ── */}
        <div className="bd-breadcrumb">
          <Link to="/blogs" className="bd-breadcrumb__link">
            <ArrowLeft size={15} /> Volver a Consejos y Cuidados
          </Link>
        </div>

        {/* ── Foto hero ── */}
        {fotoSrc ? (
          <div className="bd-hero">
            <img src={fotoSrc} alt={blog.titulo} className="bd-hero__img" />
          </div>
        ) : (
          <div className="bd-hero bd-hero--placeholder" style={{ background: color + '18' }}>
            <PawIcon size={48} color={color} />
          </div>
        )}

        {/* ── Layout 2 columnas ── */}
        <div className="bd-layout">

          {/* ── Columna principal ── */}
          <main className="bd-main">

            {/* Encabezado del artículo */}
            <div className="bd-encabezado">
              {/* Badges de tipo */}
              <div className="bd-badges">
                {servicio?.tipoServicio && (
                  <span className="bd-badge" style={{ color, background: color + '18' }}>
                    {servicio.tipoServicio}
                  </span>
                )}
              </div>

              {/* Fecha y lectura */}
              <div className="bd-meta">
                {blog.fecha && (
                  <span><Calendar size={14} /> {formatFecha(blog.fecha)}</span>
                )}
                <span>·</span>
                <span><Clock size={14} /> {mins} min de lectura</span>
              </div>

              {/* Título */}
              <h1 className="bd-titulo">{blog.titulo}</h1>

              {/* Autor */}
              {servicio && (
                <div className="bd-autor">
                  {svcFoto
                    ? <img src={svcFoto} alt={servicio.nombreServicio} className="bd-autor__foto" />
                    : <div className="bd-autor__foto bd-autor__foto--placeholder" style={{ background: color + '22', color }}>
                        <PawIcon size={18} color={color} />
                      </div>
                  }
                  <span className="bd-autor__texto">
                    Por <strong>{servicio.nombreServicio}</strong>
                  </span>
                </div>
              )}
            </div>

            <hr className="bd-divider" />

            {/* Texto del blog */}
            <div className="bd-texto">
              {blog.texto?.split('\n').map((parrafo, i) =>
                parrafo.trim() ? <p key={i}>{parrafo}</p> : <br key={i} />
              )}
            </div>

            {/* Comentarios */}
            <div className="bd-comentarios">
              <Comentarios tipo="blog" id={blog.idBlog} onResumen={handleResumen} />
            </div>
          </main>

          {/* ── Sidebar ── */}
          <aside className="bd-sidebar">

            {/* Sobre el autor */}
            {servicio && (
              <div className="bd-sidebar__card">
                <h3 className="bd-sidebar__titulo">Sobre el autor</h3>
                <div className="bd-sidebar__autor">
                  {svcFoto
                    ? <img src={svcFoto} alt={servicio.nombreServicio} className="bd-sidebar__autor-foto" />
                    : <div className="bd-sidebar__autor-foto bd-sidebar__autor-foto--placeholder" style={{ background: color + '22', color }}>
                        <PawIcon size={22} color={color} />
                      </div>
                  }
                  <div>
                    <p className="bd-sidebar__autor-nombre">{servicio.nombreServicio}</p>
                    <p className="bd-sidebar__autor-tipo">{servicio.tipoServicio}</p>
                  </div>
                </div>
                {servicio.descripcion && (
                  <p className="bd-sidebar__autor-desc">{servicio.descripcion}</p>
                )}
                <Link
                  to={`/servicios/${servicio.idServicio}`}
                  className="bd-sidebar__btn"
                  style={{ borderColor: color, color }}
                >
                  Ver perfil de la empresa
                </Link>
              </div>
            )}

            {/* Calificación del blog */}
            {resumen.total > 0 && (
              <div className="bd-sidebar__card">
                <h3 className="bd-sidebar__titulo">Calificación</h3>
                <div className="bd-sidebar__rating">
                  <Estrellas valor={Math.round(resumen.promedio)} tamano={20} />
                  <span className="bd-sidebar__rating-prom">{resumen.promedio.toFixed(1)} / 5</span>
                </div>
                <p className="bd-sidebar__rating-conteo">
                  {resumen.total} {resumen.total === 1 ? 'comentario' : 'comentarios'}
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>

      <Footer />
    </>
  )
}
