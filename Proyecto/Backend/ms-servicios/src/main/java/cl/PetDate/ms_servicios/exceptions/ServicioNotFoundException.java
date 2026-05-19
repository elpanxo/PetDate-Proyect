package cl.PetDate.ms_servicios.exceptions;

public class ServicioNotFoundException extends RuntimeException {
    public ServicioNotFoundException(Long id) {
        super("Servicio con id " + id + " no encontrado");
    }
}
