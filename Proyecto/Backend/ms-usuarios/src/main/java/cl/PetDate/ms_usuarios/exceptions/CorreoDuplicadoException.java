package cl.PetDate.ms_usuarios.exceptions;

public class CorreoDuplicadoException extends RuntimeException{

    public CorreoDuplicadoException(String correo) {
        super("El correo '" + correo + "' ya está registrado");
    }
}
