package cl.PetDate.ms_usuarios.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name = "ms-comentarios",
        url = "${ms-comentarios.url}"
)
public interface ComentarioClient {

    // Endpoints internos — sin validación de headers, solo accesibles dentro de la red Docker.
    // Se usan para borrar en cascada los comentarios de un usuario al eliminar su cuenta.
    @DeleteMapping("/comentarios/blog/interno/usuario/{idUsuario}")
    void eliminarComentariosBlogPorUsuario(@PathVariable Long idUsuario);

    @DeleteMapping("/comentarios/servicio/interno/usuario/{idUsuario}")
    void eliminarComentariosServicioPorUsuario(@PathVariable Long idUsuario);
}
