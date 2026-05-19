package cl.PetDate.ms_servicios.exceptions;

public class CorreoDuplicadoException extends RuntimeException {
    public CorreoDuplicadoException(String correo) {
        super("El correo '" + correo + "' ya esta registrado");
    }
}
