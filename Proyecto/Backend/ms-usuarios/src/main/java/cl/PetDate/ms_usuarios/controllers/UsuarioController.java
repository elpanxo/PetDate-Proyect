package cl.PetDate.ms_usuarios.controllers;

import cl.PetDate.ms_usuarios.dto.UsuarioRequest;
import cl.PetDate.ms_usuarios.dto.UsuarioResponse;
import cl.PetDate.ms_usuarios.services.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioResponse crearUsuario(@Valid @RequestBody UsuarioRequest request) {
        return usuarioService.crearUsuario(request);
    }

    // Solo ADMIN — protegido en el gateway
    @GetMapping
    public List<UsuarioResponse> listarUsuarios() {
        return usuarioService.listarUsuarios();
    }

    // Cada usuario solo puede ver su propio perfil
    // El gateway valida el token; aquí verificamos que el id del path coincida con el del token
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponse> buscarPorId(
            @PathVariable Long id,
            @RequestHeader(value = "X-Usuario-Id", required = false) Long tokenId,
            @RequestHeader(value = "X-Usuario-Rol", required = false) String tokenRol) {

        // ADMIN puede ver cualquier perfil; USER solo el suyo
        if (!"ADMIN".equals(tokenRol) && (tokenId == null || !tokenId.equals(id))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(usuarioService.buscarPorId(id));
    }

    // Solo para uso interno entre microservicios — protegido en el gateway (requiere ADMIN)
    @GetMapping("/correo/{correo}")
    public UsuarioResponse buscarPorCorreo(@PathVariable String correo) {
        return usuarioService.buscarPorCorreo(correo);
    }

    // ── Endpoints internos (solo accesibles dentro de la red Docker) ──────────
    // No expuestos al exterior porque los puertos internos no están publicados.

    @GetMapping("/interno/{id}")
    public UsuarioResponse buscarPorIdInterno(@PathVariable Long id) {
        return usuarioService.buscarPorId(id);
    }

    // Cada usuario solo puede actualizar su propio perfil
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponse> actualizarUsuario(
            @PathVariable Long id,
            @Valid @RequestBody UsuarioRequest request,
            @RequestHeader(value = "X-Usuario-Id", required = false) Long tokenId,
            @RequestHeader(value = "X-Usuario-Rol", required = false) String tokenRol) {

        if (!"ADMIN".equals(tokenRol) && (tokenId == null || !tokenId.equals(id))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(usuarioService.actualizarUsuario(id, request));
    }

    @PostMapping("/{id}/imagen")
    public ResponseEntity<UsuarioResponse> subirImagen(
            @PathVariable Long id,
            @RequestParam("imagen") MultipartFile imagen,
            @RequestHeader(value = "X-Usuario-Id", required = false) Long tokenId,
            @RequestHeader(value = "X-Usuario-Rol", required = false) String tokenRol) throws IOException {

        if (!"ADMIN".equals(tokenRol) && (tokenId == null || !tokenId.equals(id))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(usuarioService.subirImagen(id, imagen));
    }

    // Cada usuario solo puede eliminar su propia cuenta
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarUsuario(
            @PathVariable Long id,
            @RequestHeader(value = "X-Usuario-Id", required = false) Long tokenId,
            @RequestHeader(value = "X-Usuario-Rol", required = false) String tokenRol) {

        if (!"ADMIN".equals(tokenRol) && (tokenId == null || !tokenId.equals(id))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        usuarioService.eliminarUsuario(id);
        return ResponseEntity.noContent().build();
    }
}
