import AppNavbar from '../navbar/Navbar'
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

function Home() {
  return (
    <>
      <AppNavbar />

      {/* Hero / descripción */}
      <section className="home-hero">
        <div className="home-hero__content">
          <h1 className="home-hero__title">PetDate</h1>
          <p className="home-hero__slogan">El lugar donde las mascotas y sus dueños encuentran todo lo que necesitan.</p>
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
    </>
  )
}

export default Home
