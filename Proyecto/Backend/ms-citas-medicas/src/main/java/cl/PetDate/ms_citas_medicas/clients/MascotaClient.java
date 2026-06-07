package cl.PetDate.ms_citas_medicas.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "ms-mascotas", url = "${ms-mascotas.url}")
public interface MascotaClient {

    // Endpoint interno — sin validación de headers, solo accesible dentro de la red Docker
    @GetMapping("/mascotas/interno/{id}")
    Object buscarMascotaPorId(@PathVariable Long id);
}
