import { useState } from 'react'
import AppNavbar from '../navbar/Navbar'
import Footer from '../footer/Footer'
import { CheckCircle2, Mail, Send, User, Info } from 'lucide-react'
import api from '../../api/petdate-api'
import ContactDog from '../../assets/roots/contactDog.jpg'
import './Contacto.css'

const MAX_CHARS = 500
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// ── Imagen de fondo del hero ── cámbiala aquí
const HERO_IMG = ContactDog

function WhatsAppIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

function FacebookIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )
}

function InstagramIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  )
}

function Contacto() {
  const [form, setForm]       = useState({ nombre: '', correo: '', mensaje: '' })
  const [touched, setTouched] = useState({ nombre: false, correo: false, mensaje: false })
  const [enviado, setEnviado]   = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [errorEnvio, setErrorEnvio] = useState('')

  const errores = {
    nombre:  form.nombre.trim() === '' ? 'El nombre es obligatorio.' : '',
    correo:  form.correo.trim() === ''
      ? 'El correo es obligatorio.'
      : !EMAIL_REGEX.test(form.correo) ? 'Ingresa un correo válido.' : '',
    mensaje: form.mensaje.trim() === '' ? 'El mensaje es obligatorio.' : '',
  }

  const formularioValido = Object.values(errores).every(e => e === '')

  function handleChange(e) {
    const { name, value } = e.target
    if (name === 'mensaje' && value.length > MAX_CHARS) return
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleBlur(e) {
    setTouched(prev => ({ ...prev, [e.target.name]: true }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setTouched({ nombre: true, correo: true, mensaje: true })
    if (!formularioValido) return
    setEnviando(true)
    setErrorEnvio('')
    try {
      await api.contacto.enviar({ nombre: form.nombre, correo: form.correo, mensaje: form.mensaje })
      setEnviado(true)
      setForm({ nombre: '', correo: '', mensaje: '' })
      setTouched({ nombre: false, correo: false, mensaje: false })
    } catch {
      setErrorEnvio('No se pudo enviar el mensaje. Intenta nuevamente.')
    } finally {
      setEnviando(false)
    }
  }

  const used = form.mensaje.length

  return (
    <>
      <AppNavbar />

      {/* Hero */}
      <section className="contacto-hero">
        <div className="contacto-hero__bg" aria-hidden="true">
          {HERO_IMG
            ? <img src={HERO_IMG} alt="" className="contacto-hero__bg-img" />
            : <div className="contacto-hero__bg-placeholder" />
          }
        </div>
        <div className="contacto-hero__vignette" aria-hidden="true" />
        <div className="contacto-hero__content">
          <h1 className="contacto-hero__title">Contacto</h1>
          <p className="contacto-hero__slogan">¿Tienes alguna consulta? Estamos para ayudarte.</p>
        </div>
      </section>

      {/* Sección principal */}
      <section className="contacto-section">
        <div className="contacto-grid">

          {/* Formulario */}
          <div className="contacto-card">
            <div className="contacto-card__header">
              <div className="contacto-card__icono"><Mail size={22} /></div>
              <h2 className="contacto-card__titulo">Escríbenos</h2>
              <p className="contacto-card__desc">Si tienes dudas o necesitas ayuda, estaremos encantados de ayudarte.</p>
            </div>

            {enviado ? (
              <div className="contacto-success">
                <CheckCircle2 size={44} className="contacto-success__icon" />
                <h3 className="contacto-success__title">¡Mensaje enviado!</h3>
                <p className="contacto-success__text">Gracias por contactarnos. Te responderemos a la brevedad.</p>
                <button className="contacto-btn" onClick={() => setEnviado(false)}>
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form className="contacto-form" onSubmit={handleSubmit} noValidate>

                <div className="contacto-field">
                  <div className={`contacto-field__wrap ${touched.nombre && errores.nombre ? 'contacto-field__wrap--error' : ''}`}>
                    <span className="contacto-field__ico"><User size={16} /></span>
                    <input
                      name="nombre" type="text"
                      className="contacto-field__input"
                      placeholder="Nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  {touched.nombre && errores.nombre && <span className="contacto-field__error">{errores.nombre}</span>}
                </div>

                <div className="contacto-field">
                  <div className={`contacto-field__wrap ${touched.correo && errores.correo ? 'contacto-field__wrap--error' : ''}`}>
                    <span className="contacto-field__ico"><Mail size={16} /></span>
                    <input
                      name="correo" type="email"
                      className="contacto-field__input"
                      placeholder="Email"
                      value={form.correo}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  {touched.correo && errores.correo && <span className="contacto-field__error">{errores.correo}</span>}
                </div>

                <div className="contacto-field">
                  <div className={`contacto-field__wrap contacto-field__wrap--textarea ${touched.mensaje && errores.mensaje ? 'contacto-field__wrap--error' : ''}`}>
                    <span className="contacto-field__ico contacto-field__ico--top">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>
                      </svg>
                    </span>
                    <textarea
                      name="mensaje"
                      className="contacto-field__input contacto-field__textarea"
                      placeholder="Mensaje"
                      rows={5}
                      value={form.mensaje}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  {touched.mensaje && errores.mensaje && <span className="contacto-field__error">{errores.mensaje}</span>}
                  <span className="contacto-field__counter">{used} / {MAX_CHARS} caracteres</span>
                </div>

                {errorEnvio && <span className="contacto-field__error">{errorEnvio}</span>}

                <div className="contacto-form__footer">
                  <button type="submit" className="contacto-btn" disabled={enviando}>
                    <Send size={16} />
                    {enviando ? 'Enviando...' : 'Enviar mensaje'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Info de contacto */}
          <div className="contacto-card">
            <div className="contacto-card__header">
              <div className="contacto-card__icono contacto-card__icono--green"><Info size={22} /></div>
              <h2 className="contacto-card__titulo">Información de contacto</h2>
              <p className="contacto-card__desc">También puedes comunicarte con nosotros a través de nuestros canales.</p>
            </div>

            <ul className="contacto-info">
              <li className="contacto-info__item">
                <div className="contacto-info__ico-wrap"><InstagramIcon size={18} /></div>
                <a href="https://instagram.com/petdate_cl" target="_blank" rel="noreferrer" className="contacto-info__link">Instagram</a>
              </li>
              <li className="contacto-info__item">
                <div className="contacto-info__ico-wrap"><FacebookIcon size={18} /></div>
                <a href="https://facebook.com/PetDateCL" target="_blank" rel="noreferrer" className="contacto-info__link">Facebook</a>
              </li>
              <li className="contacto-info__item">
                <div className="contacto-info__ico-wrap"><WhatsAppIcon size={18} /></div>
                <a href="https://wa.me/56900000000" target="_blank" rel="noreferrer" className="contacto-info__link">WhatsApp</a>
              </li>
              <li className="contacto-info__item">
                <div className="contacto-info__ico-wrap"><Mail size={18} /></div>
                <a href="mailto:contacto@petdate.cl" className="contacto-info__link">contacto@petdate.cl</a>
              </li>
            </ul>
          </div>

        </div>
      </section>

      <Footer />
    </>
  )
}

export default Contacto