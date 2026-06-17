import { Link } from 'react-router-dom'
import AppNavbar from '../navbar/Navbar'
import Footer from '../footer/Footer'
import { ShieldCheck, Database, Target, Lock, Scale, RefreshCw, Mail, UserCheck, Calendar, CheckCircle2 } from 'lucide-react'
import './PoliticaPrivacidad.css'

const SECCIONES = [
  {
    num: 1,
    icon: UserCheck,
    titulo: 'Responsable del tratamiento',
    contenido: (
      <p>
        PetDate es la plataforma responsable de recopilar y tratar los datos personales que entregas
        al registrarte y usar nuestros servicios. Puedes contactarnos a través de los canales indicados
        en la sección de Contacto para cualquier consulta relacionada con tus datos.
      </p>
    ),
  },
  {
    num: 2,
    icon: Database,
    titulo: 'Qué datos recopilamos',
    contenido: (
      <>
        <p>Para prestarte el servicio, tratamos las siguientes categorías de datos:</p>
        <ul className="pp-lista">
          <li><strong>Datos de tu cuenta:</strong> nombre, correo electrónico, teléfono, dirección y contraseña (almacenada siempre de forma cifrada, nunca en texto plano).</li>
          <li><strong>Datos de tus mascotas:</strong> nombre, especie, raza, edad y demás información que registres sobre ellas.</li>
          <li><strong>Datos de citas médicas:</strong> fechas, motivos, observaciones y demás información asociada a las atenciones que agendes.</li>
          <li><strong>Datos de uso y seguridad:</strong> registros de acceso (auditoría) que nos permiten detectar actividad sospechosa y proteger tu cuenta.</li>
        </ul>
      </>
    ),
  },
  {
    num: 3,
    icon: Target,
    titulo: 'Para qué usamos tus datos',
    contenido: (
      <>
        <ul className="pp-lista">
          <li>Crear y administrar tu cuenta, y permitir que inicies sesión de forma segura.</li>
          <li>Gestionar la información de tus mascotas y tus citas médicas dentro de la plataforma.</li>
          <li>Conectar dueños de mascotas con proveedores de servicios verificados.</li>
          <li>Enviar notificaciones relacionadas con tu cuenta o tus citas (cuando corresponda).</li>
          <li>Detectar y prevenir accesos no autorizados o usos indebidos de la plataforma.</li>
        </ul>
        <p>
          El tratamiento de tus datos se basa en el <strong>consentimiento expreso, libre e informado</strong>{' '}
          que entregas al registrarte y aceptar esta política, conforme a lo dispuesto en la Ley N° 19.628.
        </p>
      </>
    ),
  },
  {
    num: 4,
    icon: Lock,
    titulo: 'Cómo protegemos tu información',
    contenido: (
      <ul className="pp-lista">
        <li>Tu contraseña se almacena cifrada y nunca es visible ni siquiera para nuestro equipo.</li>
        <li>Comunicaciones protegidas y control de acceso por roles dentro de la plataforma.</li>
        <li><strong>Registros de auditoría</strong> de inicios de sesión para detectar actividad inusual.</li>
        <li>Mecanismos de protección contra intentos de acceso indebido (bloqueo temporal tras intentos fallidos repetidos).</li>
      </ul>
    ),
  },
  {
    num: 5,
    icon: Scale,
    titulo: 'Tus derechos (Derechos ARCO)',
    contenido: (
      <>
        <p>
          De acuerdo con la Ley N° 19.628, en cualquier momento puedes ejercer los siguientes derechos
          sobre tus datos personales:
        </p>
        <div className="pp-arco">
          {[
            { label: 'Acceso',        desc: 'Conocer qué datos tuyos tenemos y cómo los usamos.' },
            { label: 'Rectificación', desc: 'Corregir datos que estén desactualizados, sean inexactos o incompletos.' },
            { label: 'Cancelación',   desc: 'Solicitar la eliminación de tus datos cuando ya no sean necesarios o retires tu consentimiento.' },
            { label: 'Oposición',     desc: 'Oponerte a un tratamiento específico de tus datos por motivos legítimos.' },
          ].map(({ label, desc }) => (
            <div key={label} className="pp-arco__item">
              <div className="pp-arco__check"><CheckCircle2 size={16} /></div>
              <p className="pp-arco__label">{label}</p>
              <p className="pp-arco__desc">{desc}</p>
            </div>
          ))}
        </div>
        <p>
          Puedes ejercer estos derechos directamente desde tu perfil o contactándonos a través de los
          canales indicados a continuación. Responderemos tu solicitud dentro de los plazos que establece la ley.
        </p>
      </>
    ),
  },
  {
    num: 6,
    icon: RefreshCw,
    titulo: 'Cambios a esta política',
    contenido: (
      <p>
        Si actualizamos esta política de privacidad, publicaremos la nueva versión en esta misma página
        indicando la fecha de la última actualización. Si los cambios son sustanciales, te lo notificaremos
        por los medios de contacto que tengamos registrados.
      </p>
    ),
  },
]

function PoliticaPrivacidad() {
  return (
    <>
      <AppNavbar />

      {/* Hero */}
      <section className="pp-hero">
        <div className="pp-hero__content">
          <div className="pp-hero__shield"><ShieldCheck size={36} /></div>
          <h1 className="pp-hero__titulo">Política de Privacidad</h1>
          <p className="pp-hero__desc">
            Cómo recopilamos, usamos y protegemos tus datos personales y los
            de tus mascotas, en conformidad con la Ley N° 19.628 sobre
            Protección de la Vida Privada.
          </p>
          <p className="pp-hero__fecha">
            <Calendar size={14} /> Última actualización: 11 de junio de 2026
          </p>
        </div>
      </section>

      {/* Secciones */}
      <section className="pp-contenido">
        <div className="pp-wrap">

          {SECCIONES.map(({ num, icon: Icon, titulo, contenido }) => (
            <article key={num} className="pp-bloque">
              <div className="pp-bloque__ico"><Icon size={22} /></div>
              <div className="pp-bloque__body">
                <h2 className="pp-bloque__titulo">{num}. {titulo}</h2>
                {contenido}
              </div>
            </article>
          ))}

          {/* Contacto */}
          <article className="pp-bloque pp-bloque--contacto">
            <div className="pp-bloque__ico"><Mail size={22} /></div>
            <div className="pp-bloque__body">
              <div className="pp-contacto__row">
                <div>
                  <h2 className="pp-bloque__titulo">7. Contacto</h2>
                  <p>
                    Si tienes dudas sobre esta política o quieres ejercer tus derechos ARCO, escríbenos a través de
                    nuestra sección de <Link to="/contacto" className="pp-link">Contacto</Link> y te responderemos a la brevedad.
                  </p>
                </div>
                <Link to="/contacto" className="pp-contacto__btn">
                  Ir a Contacto →
                </Link>
              </div>
            </div>
          </article>

        </div>
      </section>

      <Footer />
    </>
  )
}

export default PoliticaPrivacidad