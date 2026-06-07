package cl.PetDate.ms_mascotas.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name = "ms-citas-medicas",
        url = "${ms-citas-medicas.url}"
)
public interface CitaMedicaClient {

    // Endpoint interno — sin validación de headers, solo accesible dentro de la red Docker.
    // Se usa para borrar en cascada las citas de una mascota cuando esta se elimina.
    @DeleteMapping("/citas/interno/mascota/{idMascota}")
    void eliminarCitasPorMascota(@PathVariable Long idMascota);
}
