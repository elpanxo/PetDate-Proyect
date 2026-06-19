import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppNavbar from '../navbar/Navbar'
import Footer from '../footer/Footer'
import api, { BASE_URL } from '../../api/petdate-api'
import { TIPO_COLOR } from '../servicios/serviciosData'
import { Heart, ShieldCheck, Users, Sparkles, ChevronLeft, ChevronRight, Tag, BookOpen, Calendar, Clock } from 'lucide-react'
import './Home.css'

const bgPhotos = [
  { src: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80', pos: 'center top' },
  { src: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80', pos: 'center 55%' },
  { src: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80', pos: 'center center' },
  { src: 'https://images.unsplash.com/photo-1478098711619-5ab0b478d6e6?w=800&q=80', pos: 'center center' },
  { src: 'https://blog.mascotaysalud.com/wp-content/uploads/2025/08/seguro-veterinario-perros-gatos.jpg', pos: 'center 40%' },
  { src: 'https://i.pinimg.com/736x/3e/df/9d/3edf9dc3954c83ae2bf6e2ba8b082a7e.jpg', pos: 'center center' },
]
const zoomDuration = ['22s', '27s', '19s', '24s', '29s', '21s']
const zoomDir      = ['normal', 'alternate', 'alternate', 'normal', 'normal', 'alternate']

const VALORES = [
  { icon: Heart,       label: 'Amor por los animales',  desc: 'Creemos en el respeto y bienestar animal por encima de todo.' },
  { icon: ShieldCheck, label: 'Confianza y calidad',    desc: 'Trabajamos con servicios verificados para tu tranquilidad.' },
  { icon: Users,       label: 'Comunidad',              desc: 'Fomentamos una red de apoyo entre familias pet lovers.' },
  { icon: Sparkles,    label: 'Innovación',             desc: 'Usamos tecnología para hacer más fácil el cuidado de tu mascota.' },
]

function calcLectura(texto) {
  if (!texto) return 0
  return Math.max(1, Math.round(texto.split(' ').length / 200))
}

function formatFecha(fechaStr) {
  if (!fechaStr) return ''
  return new Date(fechaStr).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })
}

function Home() {
  const navigate = useNavigate()
  const [user, setUser]                   = useState(null)
  const [promos, setPromos]               = useState([])
  const [cargandoPromos, setCargandoPromos] = useState(true)
  const [blogs, setBlogs]                 = useState([])
  const [blogsServicios, setBlogsServicios] = useState({})
  const [cargandoBlogs, setCargandoBlogs] = useState(true)
  const [promoIdx, setPromoIdx]           = useState(0)
  const [blogIdx, setBlogIdx]             = useState(0)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    setUser(stored ? JSON.parse(stored) : null)
    const handleUserChange = () => {
      const updated = localStorage.getItem('user')
      setUser(updated ? JSON.parse(updated) : null)
    }
    window.addEventListener('userChanged', handleUserChange)
    return () => window.removeEventListener('userChanged', handleUserChange)
  }, [])

  useEffect(() => {
    const cargarPromos = async () => {
      try {
        const resultado = await api.promociones.listar({ size: 6 })
        const lista = resultado.content || []
        const idsUnicos = [...new Set(lista.map(p => p.idServicio))]
        const servicios = await Promise.all(idsUnicos.map(id => api.servicios.porId(id).catch(() => null)))
        const mapaServicios = Object.fromEntries(servicios.filter(Boolean).map(s => [s.idServicio, s]))
        const promosEnriquecidas = lista.map(p => ({
          id: p.idPromocion, titulo: p.titulo, descripcion: p.descripcion,
          fechaTermino: p.fechaTermino, servicio: mapaServicios[p.idServicio] || null,
        })).filter(p => p.servicio)
        setPromos(promosEnriquecidas.slice(0, 6))
      } catch { setPromos([]) }
      finally  { setCargandoPromos(false) }
    }
    cargarPromos()
  }, [])

  useEffect(() => {
    const cargarBlogs = async () => {
      try {
        const resultado = await api.blogs.listar({ size: 3, sort: 'id,desc' })
        const lista = resultado.content || []
        setBlogs(lista)
        const idsUnicos = [...new Set(lista.map(b => b.idServicio).filter(Boolean))]
        const svcs = await Promise.all(idsUnicos.map(id => api.servicios.porId(id).catch(() => null)))
        const mapa = Object.fromEntries(svcs.filter(Boolean).map(s => [s.idServicio, s]))
        setBlogsServicios(mapa)
      } catch { setBlogs([]) }
      finally  { setCargandoBlogs(false) }
    }
    cargarBlogs()
  }, [])

  const promosPag = promos.slice(promoIdx, promoIdx + 3)
  const puedeIzq  = promoIdx > 0
  const puedeDer  = promoIdx + 3 < promos.length

  const blogsPag    = blogs.slice(blogIdx, blogIdx + 3)
  const puedeBlogIzq = blogIdx > 0
  const puedeBlogDer = blogIdx + 3 < blogs.length

  return (
    <>
      <AppNavbar />

      {/* ══ HERO ══ */}
      <section className="hero" aria-label="Sección principal">

        {/* Collage 3×2 desaturado */}
        <div className="hero__collage" aria-hidden="true">
          {bgPhotos.map((photo, i) => (
            <div key={i} className="hero__cell">
              {photo.src ? (
                <img
                  src={photo.src}
                  alt=""
                  className="hero__cell-img"
                  style={{
                    objectPosition: photo.pos,
                    animationDuration: zoomDuration[i],
                    animationDirection: zoomDir[i],
                  }}
                />
              ) : (
                <div className="hero__cell-placeholder">
                  <span>🐾</span>
                  <p>Foto {i + 1}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Viñeta radial que aclara el centro */}
        <div className="hero__vignette" aria-hidden="true" />

        {/* Texto central */}
        <div className="hero__content">
          <p className="hero__eyebrow">Tu plataforma de mascotas en Chile</p>

          <h1 className="hero__title">PetDate</h1>

          <div className="hero__divider" aria-hidden="true" />

          <p className="hero__subtitle">
            Todo el cuidado que tu mascota merece,<br />en un solo lugar
          </p>

          <div className="hero__actions">
            <Link to="/servicios" className="hero__btn hero__btn--primary">
              Ver servicios
            </Link>
            {user && user.role === 'empresa' ? (
              <Link to="/mi-empresa" className="hero__btn hero__btn--outline">
                Mi Empresa
              </Link>
            ) : user ? (
              <Link to="/mis-mascotas" className="hero__btn hero__btn--outline">
                Mis Mascotas
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      {/* ══ PROMOCIONES ══ */}
      <section className="hp-promos">
        <div className="hp-section-tag"><Tag size={13} /> PROMOCIONES DESTACADAS</div>
        <h2 className="hp-title">Promociones que cuidan<br />a tu mejor amigo</h2>
        <p className="hp-subtitle">Descubre descuentos y beneficios exclusivos de veterinarias<br />y servicios para mascotas cerca de ti.</p>

        {cargandoPromos ? (
          <p className="hp-loading">Cargando promociones...</p>
        ) : promos.length === 0 ? (
          <p className="hp-empty">Aún no hay promociones activas. ¡Vuelve pronto!</p>
        ) : (
          <>
            <div className="hp-promos__carousel">
              {puedeIzq && (
                <button className="hp-arrow hp-arrow--izq" onClick={() => setPromoIdx(i => i - 1)} aria-label="Anterior">
                  <ChevronLeft size={22} />
                </button>
              )}

              <div className="hp-promos__grid">
                {promosPag.map(promo => {
                  const svc   = promo.servicio
                  const color = TIPO_COLOR[svc.tipoServicio] || '#7e6492'
                  const foto  = svc.imagenUrl ? `${BASE_URL}${svc.imagenUrl}` : null
                  return (
                    <div
                      key={promo.id}
                      className="hp-promo-card"
                      onClick={() => navigate(`/servicios/${svc.idServicio}`)}
                      role="link"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/servicios/${svc.idServicio}`) }}
                    >
                      {/* Foto superior */}
                      <div className="hp-promo-card__img-wrap">
                        {foto
                          ? <img src={foto} alt={svc.nombreServicio} className="hp-promo-card__img" />
                          : <div className="hp-promo-card__img-placeholder"><Tag size={28} color={color} /></div>
                        }
                      </div>

                      {/* Info */}
                      <div className="hp-promo-card__body">
                        <h3 className="hp-promo-card__nombre">{svc.nombreServicio}</h3>
                        <p className="hp-promo-card__titulo">{promo.titulo}</p>
                        {promo.descripcion && <p className="hp-promo-card__desc">{promo.descripcion}</p>}
                        {promo.fechaTermino && (
                          <p className="hp-promo-card__fecha">
                            <Calendar size={13} /> Válido hasta el {formatFecha(promo.fechaTermino)}
                          </p>
                        )}
                        <Link to={`/servicios/${svc.idServicio}`} className="hp-promo-card__btn">Ver más</Link>
                      </div>
                    </div>
                  )
                })}
              </div>

              {puedeDer && (
                <button className="hp-arrow hp-arrow--der" onClick={() => setPromoIdx(i => i + 1)} aria-label="Siguiente">
                  <ChevronRight size={22} />
                </button>
              )}
            </div>

            <div className="hp-promos__footer">
              <Link to="/servicios" className="hp-btn-outlined">
                <Tag size={15} /> Ver todas las promociones
              </Link>
            </div>
          </>
        )}
      </section>

      {/* ══ QUIÉNES SOMOS ══ */}
      <section className="hp-about">
        <div className="hp-about__foto-col">
          <img src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1200&q=85" alt="Mascotas" className="hp-about__foto" />
        </div>

        <div className="hp-about__content">
          <h2 className="hp-about__titulo">¿Quiénes somos?</h2>
          <p className="hp-about__texto">
            PetDate nace de una necesidad real: los dueños de mascotas queremos darles lo mejor, pero no siempre tenemos el tiempo o la información para hacerlo.
          </p>
          <p className="hp-about__texto">
            Creamos esta plataforma para conectar a las familias con veterinarias, servicios y contenidos útiles que realmente marcan la diferencia en la vida de sus mascotas.
          </p>

          <div className="hp-about__valores">
            {VALORES.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="hp-valor">
                <div className="hp-valor__ico"><Icon size={22} strokeWidth={1.6} /></div>
                <p className="hp-valor__label">{label}</p>
                <p className="hp-valor__desc">{desc}</p>
              </div>
            ))}
          </div>

          <Link to="/nosotros" className="hp-about__foto-btn">Leer más sobre nosotros</Link>
        </div>
      </section>

      {/* ══ BLOG / CONSEJOS ══ */}
      <section className="hp-blogs">
        <div className="hp-section-tag"><BookOpen size={13} /> CONSEJOS Y CUIDADOS</div>
        <h2 className="hp-title">Aprende, cuida, comparte</h2>
        <p className="hp-subtitle">Consejos, guías y recomendaciones de expertos para<br />una vida más saludable y feliz junto a tu mascota.</p>

        {cargandoBlogs ? (
          <p className="hp-loading">Cargando artículos...</p>
        ) : blogs.length === 0 ? (
          <p className="hp-empty">Aún no hay artículos publicados. ¡Vuelve pronto!</p>
        ) : (
          <>
            <div className="hp-blogs__carousel">
              {puedeBlogIzq && (
                <button className="hp-arrow hp-arrow--izq" onClick={() => setBlogIdx(i => i - 1)} aria-label="Anterior">
                  <ChevronLeft size={22} />
                </button>
              )}

              <div className="hp-blogs__grid">
                {blogsPag.map(blog => {
                  const svc   = blogsServicios[blog.idServicio]
                  const color = TIPO_COLOR[svc?.tipoServicio] || '#7e6492'
                  const mins  = calcLectura(blog.texto)
                  return (
                    <article
                      key={blog.idBlog}
                      className="hp-blog-card"
                      onClick={() => navigate(`/blogs/${blog.idBlog}`)}
                      role="link"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/blogs/${blog.idBlog}`) }}
                    >
                      <div className="hp-blog-card__img-wrap">
                        {blog.imagen
                          ? <img src={`${BASE_URL}${blog.imagen}`} alt={blog.titulo} className="hp-blog-card__img" />
                          : <div className="hp-blog-card__img-placeholder"><BookOpen size={32} color="#ccc" /></div>
                        }
                      </div>
                      <div className="hp-blog-card__body">
                        {svc && <span className="hp-blog-card__cat" style={{ color, background: color + '18' }}>{svc.tipoServicio}</span>}
                        <h3 className="hp-blog-card__titulo">{blog.titulo}</h3>
                        <p className="hp-blog-card__desc">{blog.texto?.slice(0, 120)}{blog.texto?.length > 120 ? '...' : ''}</p>
                        <div className="hp-blog-card__meta">
                          {blog.fecha && <span><Calendar size={12} /> {formatFecha(blog.fecha)}</span>}
                          <span><Clock size={12} /> {mins} min de lectura</span>
                        </div>
                        <Link to={`/blogs/${blog.idBlog}`} className="hp-blog-card__ver-mas">Ver más</Link>
                      </div>
                    </article>
                  )
                })}
              </div>

              {puedeBlogDer && (
                <button className="hp-arrow hp-arrow--der" onClick={() => setBlogIdx(i => i + 1)} aria-label="Siguiente">
                  <ChevronRight size={22} />
                </button>
              )}
            </div>

            <div className="hp-blogs__footer">
              <Link to="/blogs" className="hp-btn-filled">
                <BookOpen size={15} /> Ver todos los consejos
              </Link>
            </div>
          </>
        )}
      </section>

      <Footer />
    </>
  )
}

export default Home