package cl.PetDate.ms_usuarios.exceptions;

/**
 * Se lanza cuando alguien intenta registrarse sin aceptar el consentimiento
 * informado / Política de Privacidad (Ley 19.628: el tratamiento de datos
 * personales requiere consentimiento previo, libre, informado y expreso del
 * titular).
 */
public class ConsentimientoRequeridoException extends RuntimeException {

    public ConsentimientoRequeridoException() {
        super("Debes leer y aceptar la Política de Privacidad para poder registrarte");
    }
}
