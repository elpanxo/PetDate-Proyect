package cl.PetDate.ms_mascotas.controllers;

import cl.PetDate.ms_mascotas.dto.MascotaRequest;
import cl.PetDate.ms_mascotas.dto.MascotaResponse;
import cl.PetDate.ms_mascotas.services.MascotaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Tag(name = "Mascotas", description = "CRUD de mascotas")
@RestController
@RequestMapping("/mascotas")
public class MascotaController {

    private final MascotaService mascotaService;

    public MascotaController(MascotaService mascotaService) {
        this.mascotaService = mascotaService;
    }

    @Operation(summary = "Crear una mascota")
    @ApiResponse(responseCode = "201", description = "Mascota creada")
    @ApiResponse(responseCode = "404", description = "Usuario no existe")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MascotaResponse crearMascota(@Valid @RequestBody MascotaRequest request) {
        return mascotaService.crearMascota(request);
    }

    @Operation(summary = "Listar mascotas paginado")
    @GetMapping
    public Page<MascotaResponse> listarMascotas(
            @PageableDefault(size = 10, sort = "nombre") Pageable pageable) {
        return mascotaService.listarMascotas(pageable);
    }

    @Operation(summary = "Buscar por ID")
    @ApiResponse(responseCode = "404", description = "Mascota no existe")
    @GetMapping("/{id}")
    public ResponseEntity<MascotaResponse> buscarPorId(
            @PathVariable Long id,
            @RequestHeader(value = "X-Usuario-Id", required = false) Long tokenId,
            @RequestHeader(value = "X-Usuario-Rol", required = false) String tokenRol) {
        MascotaResponse mascota = mascotaService.buscarPorId(id);
        if (!esPropietarioOAdmin(tokenId, tokenRol, mascota.getUsuarioId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(mascota);
    }

    @Operation(summary = "Buscar mascotas por usuario")
    @ApiResponse(responseCode = "404", description = "Usuario no existe")
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<Page<MascotaResponse>> buscarPorUsuario(
            @PathVariable Long usuarioId,
            @PageableDefault(size = 10) Pageable pageable,
            @RequestHeader(value = "X-Usuario-Id", required = false) Long tokenId,
            @RequestHeader(value = "X-Usuario-Rol", required = false) String tokenRol) {
        if (!esPropietarioOAdmin(tokenId, tokenRol, usuarioId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(mascotaService.buscarPorUsuario(usuarioId, pageable));
    }

    @Operation(summary = "Actualizar mascota")
    @ApiResponse(responseCode = "200", description = "Mascota actualizada")
    @ApiResponse(responseCode = "404", description = "Mascota no existe")
    @PutMapping("/{id}")
    public ResponseEntity<MascotaResponse> actualizarMascota(
            @PathVariable Long id,
            @Valid @RequestBody MascotaRequest request,
            @RequestHeader(value = "X-Usuario-Id", required = false) Long tokenId,
            @RequestHeader(value = "X-Usuario-Rol", required = false) String tokenRol) {
        MascotaResponse mascota = mascotaService.buscarPorId(id);
        if (!esPropietarioOAdmin(tokenId, tokenRol, mascota.getUsuarioId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(mascotaService.actualizarMascota(id, request));
    }

    @Operation(summary = "Eliminar mascota")
    @ApiResponse(responseCode = "204", description = "Mascota eliminada")
    @ApiResponse(responseCode = "404", description = "Mascota no existe")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarMascota(
            @PathVariable Long id,
            @RequestHeader(value = "X-Usuario-Id", required = false) Long tokenId,
            @RequestHeader(value = "X-Usuario-Rol", required = false) String tokenRol) {
        MascotaResponse mascota = mascotaService.buscarPorId(id);
        if (!esPropietarioOAdmin(tokenId, tokenRol, mascota.getUsuarioId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        mascotaService.eliminarMascota(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/imagen")
    public ResponseEntity<MascotaResponse> subirImagen(
            @PathVariable Long id,
            @RequestParam("imagen") MultipartFile imagen,
            @RequestHeader(value = "X-Usuario-Id", required = false) Long tokenId,
            @RequestHeader(value = "X-Usuario-Rol", required = false) String tokenRol) throws IOException {
        MascotaResponse mascota = mascotaService.buscarPorId(id);
        if (!esPropietarioOAdmin(tokenId, tokenRol, mascota.getUsuarioId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(mascotaService.subirImagen(id, imagen));
    }

    // El dueño de la mascota (su usuarioId coincide con el id del token) o un ADMIN
    private boolean esPropietarioOAdmin(Long tokenId, String tokenRol, Long usuarioIdDueno) {
        return "ADMIN".equals(tokenRol) || (tokenId != null && tokenId.equals(usuarioIdDueno));
    }

    // ── Endpoints internos (solo accesibles dentro de la red Docker) ──────────
    @GetMapping("/interno/{id}")
    public ResponseEntity<MascotaResponse> buscarPorIdInterno(@PathVariable Long id) {
        return ResponseEntity.ok(mascotaService.buscarPorId(id));
    }

    // Usado para el borrado en cascada al eliminar un usuario (política de retención de datos)
    @DeleteMapping("/interno/usuario/{usuarioId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminarPorUsuarioInterno(@PathVariable Long usuarioId) {
        mascotaService.eliminarPorUsuario(usuarioId);
    }
}
