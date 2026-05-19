package cl.PetDate.ms_citas_medicas.exceptions;

public class CitaMedicaNotFoundException extends RuntimeException {
    public CitaMedicaNotFoundException(Long id) {
        super("Cita medica con id " + id + " no encontrada");
    }
}
