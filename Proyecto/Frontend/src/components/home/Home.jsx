import { Link } from 'react-router-dom'
import AppNavbar from '../navbar/Navbar'
import Footer from '../footer/Footer'
import './Home.css'

const promotions = [
  { id: 1, type: 'Veterinaria', name: 'Clínica VetCare', description: '20% de descuento en consultas este mes.', badge: 'Veterinaria' },
  { id: 2, type: 'Tienda', name: 'PetShop Central', description: 'Alimento premium 2x1 en todas las marcas.', badge: 'Tienda' },
  { id: 3, type: 'Servicio', name: 'Grooming Express', description: 'Baño y corte de pelo desde $5.000.', badge: 'Servicio' },
  { id: 4, type: 'Veterinaria', name: 'Hospital Animal Sur', description: 'Vacunación anual con 30% off.', badge: 'Veterinaria' },
  { id: 5, type: 'Tienda', name: 'Mundo Mascota', description: 'Accesorios y juguetes con envío gratis.', badge: 'Tienda' },
  { id: 6, type: 'Servicio', name: 'PetHotel & Spa', description: 'Guardería nocturna para tu mascota.', badge: 'Servicio' },
]

const badgeColor = {
  Veterinaria: '#7e6492',
  Tienda: '#4a90a4',
  Servicio: '#e07b54',
}

const tips = [
  { id: 1, title: 'CUÁL ES LA FORMA CORRECTA DE LLEVAR A TU MASCOTA', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed...' },
  { id: 2, title: 'CÓMO PRESENTAR UNA NUEVA MASCOTA EN CASA', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed...' },
  { id: 3, title: 'QUÉ HACER SI TU GATO VOMITA', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed...' },
  { id: 4, title: 'INFORMATIVO SOBRE EL EXAMEN SOMA DE IDEXX...A', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed...' },
]

function Home() {
  return (
    <>
      <AppNavbar />

      <section className="home-hero">
        <div className="home-hero__inner">
          <div className="home-hero__text">
            <h1 className="home-hero__title">
              Todo lo que tu mascota<br />
              <span className="home-hero__title--highlight">necesita, en un solo lugar</span>
            </h1>
          </div>
        </div>
        <div className="home-hero__wave">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,50 C400,100 1040,0 1440,50 L1440,100 L0,100 Z" fill="#f5f0f0" />
          </svg>
        </div>
      </section>

      {/* Botón flotante urgencias */}
      <div className="fab">
        <span className="fab__icon">🚨</span>
        <span className="fab__label">Urgencia 24/7</span>
      </div>

      {/* Promociones */}
      <section className="home-promos">
        <h2 className="home-promos__title">Promociones destacadas</h2>
        <div className="home-promos__grid">
          {promotions.slice(0, 3).map((promo) => (
            <div key={promo.id} className="promo-card">
              <span className="promo-card__badge" style={{ backgroundColor: badgeColor[promo.type] }}>
                {promo.badge}
              </span>
              <h3 className="promo-card__name">{promo.name}</h3>
              <p className="promo-card__desc">{promo.description}</p>
              <button className="promo-card__btn">Ver más</button>
            </div>
          ))}
          <div className="promo-card promo-card--all">
            <span className="promo-card__all-icon">🐾</span>
            <h3 className="promo-card__name">¿Quieres ver más?</h3>
            <p className="promo-card__desc">Explora todas las promociones disponibles para tu mascota.</p>
            <button className="promo-card__btn promo-card__btn--all">Ver todos los servicios</button>
          </div>
        </div>
      </section>

      <section className="home-about">
        <div className="home-about__wave-top">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,0 L0,0 Z" fill="#f5f0f0" />
          </svg>
        </div>
        <div className="home-about__content">
          <h2 className="home-about__title">¿Quiénes somos?</h2>
          <p className="home-about__text">
            PetDate nace de una necesidad real: los dueños de mascotas merecen una forma simple, organizada y confiable de gestionar el bienestar de sus compañeros. Somos un equipo de tres estudiantes de Ingeniería apasionados por los animales y la tecnología, que decidimos crear la plataforma que siempre quisimos tener como dueños de mascotas.
          </p>
          <p className="home-about__text">
            Nuestra misión es centralizar toda la información relacionada con el cuidado de las mascotas en un solo lugar. Porque sabemos lo frustrante que es buscar el carnet de vacunas en una gaveta, olvidar la fecha del próximo control o perder el historial médico de tu mejor amigo. PetDate existe para que eso no vuelva a pasar.
          </p>
          <p className="home-about__text">
            Creemos que cada mascota merece el mejor cuidado posible, y que cada dueño merece las herramientas para dárselo. Nuestra visión es convertirnos en el asistente digital de cabecera de cada hogar con mascotas en Chile, expandiéndonos desde la web hacia dispositivos móviles y construyendo una comunidad donde el bienestar animal sea la prioridad.
          </p>
        </div>
        <div className="home-about__wave-bottom">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,40 C360,0 1080,80 1440,40 L1440,80 L0,80 Z" fill="#f5f0f0" />
          </svg>
        </div>
      </section>

      <section className="home-tips">
        <div className="home-tips__header">
          <h2 className="home-tips__title">Consejos y cuidados</h2>
        </div>
        <div className="home-tips__grid">
          {tips.map((tip) => (
            <article key={tip.id} className="tip-card">
              <div className="tip-card__media" />
              <div className="tip-card__body">
                <h3 className="tip-card__title">{tip.title}</h3>
                <p className="tip-card__desc">{tip.desc}</p>
                <button className="tip-card__btn">Leer ahora</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </>
  )
}

export default Home
