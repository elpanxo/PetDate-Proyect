package cl.PetDate.ms_comentarios.exceptions;

public class ComentarioServicioNotFoundException extends RuntimeException {
    public ComentarioServicioNotFoundException(Long id) {
        super("Comentario de servicio con id " + id + " no encontrado");
    }
}
