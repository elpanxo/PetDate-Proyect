package cl.PetDate.ms_citas_medicas.exceptions;

public class UsuarioNotFoundException extends RuntimeException {
    public UsuarioNotFoundException(Long id) {
        super("Usuario con id " + id + " no existe");
    }
}
