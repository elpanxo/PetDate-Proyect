package cl.PetDate.ms_servicios.exceptions;

public class PromocionNotFoundException extends RuntimeException {
    public PromocionNotFoundException(Long id) {
        super("Promocion con id " + id + " no encontrada");
    }
}
