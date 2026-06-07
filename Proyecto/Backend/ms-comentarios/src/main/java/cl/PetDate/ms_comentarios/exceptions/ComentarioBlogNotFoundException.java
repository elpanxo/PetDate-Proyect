package cl.PetDate.ms_comentarios.exceptions;

public class ComentarioBlogNotFoundException extends RuntimeException {
    public ComentarioBlogNotFoundException(Long id) {
        super("Comentario de blog con id " + id + " no encontrado");
    }
}
