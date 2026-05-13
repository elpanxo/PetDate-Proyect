package cl.PetDate.ms_usuarios.exceptions;

public class UsuarioNotFoundException extends RuntimeException{

    public UsuarioNotFoundException(Long id) {
        super("Usuario con id " + id + " no encontrado");
    }
    public UsuarioNotFoundException(String campo, String valor) {
        super("Usuario con " + campo + " '" + valor + "' no encontrado");
    }
}
