import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppNavbar from '../navbar/Navbar'
import Footer from '../footer/Footer'
import { Newspaper, Hourglass, TriangleAlert, BookOpen, Calendar, Clock } from 'lucide-react'
import api, { BASE_URL } from '../../api/petdate-api'
import { TIPO_COLOR } from '../servicios/serviciosData'
import catBlog from '../../assets/roots/catBlog.jpg'
import './Blogs.css'

// ── Imagen de fondo del hero ── cámbiala aquí
const HERO_IMG = catBlog

const formatearFecha = (fecha) => {
  if (!fecha) return ''
  return new Date(fecha).toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric' })
}

const extracto = (texto, max = 160) => {
  if (!texto) return ''
  return texto.length > max ? `${texto.slice(0, max).trimEnd()}…` : texto
}

function Blogs() {
  const navigate = useNavigate()
  const [posts, setPosts]         = useState([])
  const [servicios, setServicios] = useState({})
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')

  useEffect(() => {
    const cargar = async () => {
      setLoading(true)
      setError('')
      try {
        const page  = await api.blogs.listar({ size: 30, sort: 'fecha,desc' })
        const lista = page.content || []
        setPosts(lista)

        const idsUnicos = [...new Set(lista.map(p => p.idServicio).filter(Boolean))]
        const svcs      = await Promise.all(idsUnicos.map(id => api.servicios.porId(id).catch(() => null)))
        const mapa      = Object.fromEntries(svcs.filter(Boolean).map(s => [s.idServicio, s]))
        setServicios(mapa)
      } catch {
        setError('No se pudieron cargar las entradas del blog. Intenta de nuevo más tarde.')
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [])

  return (
    <>
      <AppNavbar />

      {/* Hero */}
      <section className="blogs-hero">
        <div className="blogs-hero__bg" aria-hidden="true">
          {HERO_IMG
            ? <img src={HERO_IMG} alt="" className="blogs-hero__bg-img" />
            : <div className="blogs-hero__bg-placeholder"></div>
          }
        </div>
        <div className="blogs-hero__vignette" aria-hidden="true" />
        <div className="blogs-hero__content">
          <h1 className="blogs-hero__title">Blog PetDate</h1>
          <p className="blogs-hero__slogan">Explora artículos, consejos y novedades sobre el cuidado de tus mascotas, escritos por los servicios de la comunidad.</p>
        </div>
      </section>

      {/* Grid de posts */}
      <section className="blogs-section">
        {loading && (
          <div className="blogs-estado">
            <Hourglass size={28} />
            <p>Cargando publicaciones...</p>
          </div>
        )}

        {!loading && error && (
          <div className="blogs-estado">
            <TriangleAlert size={28} />
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="blogs-estado">
            <Newspaper size={28} />
            <p>Todavía no hay publicaciones en el blog.</p>
          </div>
        )}

        {!loading && !error && posts.length > 0 && (
          <div className="blogs-grid">
            {posts.map((post) => {
              const servicio = servicios[post.idServicio]
              const color    = TIPO_COLOR[servicio?.tipoServicio] || '#7e6492'
              return (
                <article key={post.idBlog} className="hp-blog-card">
                  <div className="hp-blog-card__img-wrap">
                    {post.imagen
                      ? <img src={`${BASE_URL}${post.imagen}`} alt={post.titulo} className="hp-blog-card__img" />
                      : <div className="hp-blog-card__img-placeholder"><BookOpen size={32} color="#ccc" /></div>
                    }
                  </div>
                  <div className="hp-blog-card__body">
                    {servicio && (
                      <span className="hp-blog-card__cat" style={{ color, background: `${color}18` }}>
                        {servicio.tipoServicio}
                      </span>
                    )}
                    <h3 className="hp-blog-card__titulo">{post.titulo}</h3>
                    <p className="hp-blog-card__desc">{extracto(post.texto, 120)}</p>
                    <div className="hp-blog-card__meta">
                      {post.fecha && <span><Calendar size={12} /> {formatearFecha(post.fecha)}</span>}
                      <span><Clock size={12} /> {Math.max(1, Math.round((post.texto?.split(' ').length || 0) / 200))} min de lectura</span>
                    </div>
                    <button
                      className="hp-blog-card__ver-mas"
                      onClick={() => navigate(`/blogs/${post.idBlog}`)}
                    >
                      Ver más
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      <Footer />
    </>
  )
}

export default Blogs