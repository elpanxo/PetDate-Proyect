import { TriangleAlert, X } from 'lucide-react'
import './ConfirmModal.css'

/**
 * Modal de confirmación reutilizable.
 * Props:
 *   show        {boolean}  - mostrar/ocultar
 *   titulo      {string}   - título del modal
 *   mensaje     {string}   - descripción/pregunta
 *   labelOk     {string}   - texto del botón de confirmar (default "Eliminar")
 *   labelCancel {string}   - texto del botón de cancelar (default "Cancelar")
 *   danger      {boolean}  - si true, botón ok es rojo; si false, es lila
 *   onConfirm   {function} - callback al confirmar
 *   onCancel    {function} - callback al cancelar
 */
export default function ConfirmModal({
  show,
  titulo = '¿Estás seguro?',
  mensaje = 'Esta acción no se puede deshacer.',
  labelOk = 'Eliminar',
  labelCancel = 'Cancelar',
  danger = true,
  onConfirm,
  onCancel,
}) {
  if (!show) return null

  return (
    <div className="cm-overlay" onClick={onCancel}>
      <div className="cm-box" onClick={e => e.stopPropagation()}>
        <div className={`cm-box__ico-wrap ${danger ? 'cm-box__ico-wrap--danger' : 'cm-box__ico-wrap--lila'}`}>
          <TriangleAlert size={22} />
        </div>

        <button className="cm-box__close" onClick={onCancel} aria-label="Cerrar">
          <X size={18} />
        </button>

        <h2 className="cm-box__titulo">{titulo}</h2>
        <p className="cm-box__mensaje">{mensaje}</p>

        <div className="cm-box__acciones">
          <button className="cm-box__btn cm-box__btn--cancelar" onClick={onCancel}>
            {labelCancel}
          </button>
          <button
            className={`cm-box__btn ${danger ? 'cm-box__btn--danger' : 'cm-box__btn--lila'}`}
            onClick={onConfirm}
          >
            {labelOk}
          </button>
        </div>
      </div>
    </div>
  )
}
