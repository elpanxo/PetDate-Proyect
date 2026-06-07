package cl.PetDate.ms_citas_medicas.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "ms-usuarios", url = "${ms-usuarios.url}")
public interface UsuarioClient {

    // Endpoint interno — sin validación de headers, solo accesible dentro de la red Docker
    @GetMapping("/usuarios/interno/{id}")
    Object buscarUsuarioPorId(@PathVariable Long id);
}
