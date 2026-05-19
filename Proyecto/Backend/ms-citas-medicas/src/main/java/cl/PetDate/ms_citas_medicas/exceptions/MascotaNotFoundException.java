package cl.PetDate.ms_citas_medicas.exceptions;

public class MascotaNotFoundException extends RuntimeException {
    public MascotaNotFoundException(Long id) {
        super("Mascota con id " + id + " no existe");
    }
}
