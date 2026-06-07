package cl.PetDate.ms_servicios.exceptions;

public class BlogNotFoundException extends RuntimeException {
    public BlogNotFoundException(Long id) {
        super("Blog con id " + id + " no encontrado");
    }
}
