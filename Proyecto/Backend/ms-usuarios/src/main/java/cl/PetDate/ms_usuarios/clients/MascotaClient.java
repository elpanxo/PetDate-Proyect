package cl.PetDate.ms_usuarios.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name = "ms-mascotas",
        url = "${ms-mascotas.url}"
)
public interface MascotaClient {

    // Endpoint interno — sin validación de headers, solo accesible dentro de la red Docker.
    // Se usa para borrar en cascada las mascotas (y sus citas) de un usuario al eliminar su cuenta.
    @DeleteMapping("/mascotas/interno/usuario/{usuarioId}")
    void eliminarMascotasPorUsuario(@PathVariable Long usuarioId);
}
