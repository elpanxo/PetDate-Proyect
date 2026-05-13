package cl.PetDate.ms_mascotas.exceptions;

public class MascotaNotFoundException extends RuntimeException{

    public MascotaNotFoundException(Long id) {
        super("Mascota con id " + id + " no encontrada");
    }
}
