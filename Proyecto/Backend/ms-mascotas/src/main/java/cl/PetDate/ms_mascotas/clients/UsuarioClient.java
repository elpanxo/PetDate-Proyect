package cl.PetDate.ms_mascotas.clients;

import cl.PetDate.ms_mascotas.clients.dto.UsuarioDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name = "ms-usuarios",
        url = "${ms-usuarios.url}"
)
public interface UsuarioClient {

    @GetMapping("/usuarios/{id}")
    UsuarioDTO buscarUsuarioPorId(@PathVariable Long id);
}
