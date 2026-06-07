package cl.PetDate.ms_comentarios.controllers;

import cl.PetDate.ms_comentarios.dto.ComentarioServicioRequest;
import cl.PetDate.ms_comentarios.dto.ComentarioServicioResponse;
import cl.PetDate.ms_comentarios.services.ComentarioServicioService;
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

@Tag(name = "Comentarios de servicio", description = "Comentarios y calificaciones de servicios")
@RestController
@RequestMapping("/comentarios/servicio")
public class ComentarioServicioController {

    private final ComentarioServicioService comentarioServicioService;

    public ComentarioServicioController(ComentarioServicioService comentarioServicioService) {
        this.comentarioServicioService = comentarioServicioService;
    }

    @Operation(summary = "Crear un comentario de servicio (solo cuentas de usuario)")
    @ApiResponse(responseCode = "201", description = "Comentario creado")
    @PostMapping
    public ResponseEntity<ComentarioServicioResponse> crearComentario(
            @Valid @RequestBody ComentarioServicioRequest request,
            @RequestHeader(value = "X-Usuario-Id", required = false) Long tokenId,
            @RequestHeader(value = "X-Usuario-Rol", required = false) String tokenRol) {
        // El gateway ya exige token de USUARIO (no de servicio); el comentario
        // queda asociado al usuario autenticado
        if (tokenId == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(comentarioServicioService.crearComentario(tokenId, request));
    }

    @Operation(summary = "Listar comentarios de servicio paginado (público)")
    @GetMapping
    public Page<ComentarioServicioResponse> listarComentarios(
            @PageableDefault(size = 10, sort = "fecha") Pageable pageable) {
        return comentarioServicioService.listarComentarios(pageable);
    }

    @Operation(summary = "Buscar comentario de servicio por ID (público)")
    @ApiResponse(responseCode = "404", description = "Comentario no encontrado")
    @GetMapping("/{id}")
    public ResponseEntity<ComentarioServicioResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(comentarioServicioService.buscarPorId(id));
    }

    @Operation(summary = "Buscar comentarios de un servicio (público)")
    @GetMapping("/servicio/{idServicio}")
    public Page<ComentarioServicioResponse> buscarPorServicio(
            @PathVariable Long idServicio,
            @PageableDefault(size = 10, sort = "fecha") Pageable pageable) {
        return comentarioServicioService.buscarPorServicio(idServicio, pageable);
    }

    @Operation(summary = "Buscar comentarios realizados por un usuario (público)")
    @GetMapping("/usuario/{idUsuario}")
    public Page<ComentarioServicioResponse> buscarPorUsuario(
            @PathVariable Long idUsuario,
            @PageableDefault(size = 10, sort = "fecha") Pageable pageable) {
        return comentarioServicioService.buscarPorUsuario(idUsuario, pageable);
    }

    @Operation(summary = "Actualizar un comentario de servicio (solo el usuario dueño)")
    @ApiResponse(responseCode = "404", description = "Comentario no encontrado")
    @PutMapping("/{id}")
    public ResponseEntity<ComentarioServicioResponse> actualizarComentario(
            @PathVariable Long id,
            @Valid @RequestBody ComentarioServicioRequest request,
            @RequestHeader(value = "X-Usuario-Id", required = false) Long tokenId,
            @RequestHeader(value = "X-Usuario-Rol", required = false) String tokenRol) {
        if (!esPropioUsuario(tokenId, tokenRol, comentarioServicioService.obtenerEntidad(id).getIdUsuario())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(comentarioServicioService.actualizarComentario(id, request));
    }

    @Operation(summary = "Eliminar un comentario de servicio (solo el usuario dueño)")
    @ApiResponse(responseCode = "204", description = "Comentario eliminado")
    @ApiResponse(responseCode = "404", description = "Comentario no encontrado")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarComentario(
            @PathVariable Long id,
            @RequestHeader(value = "X-Usuario-Id", required = false) Long tokenId,
            @RequestHeader(value = "X-Usuario-Rol", required = false) String tokenRol) {
        if (!esPropioUsuario(tokenId, tokenRol, comentarioServicioService.obtenerEntidad(id).getIdUsuario())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        comentarioServicioService.eliminarComentario(id);
        return ResponseEntity.noContent().build();
    }

    // Solo el propio usuario (token de usuario cuyo id coincide con idUsuario del comentario)
    private boolean esPropioUsuario(Long tokenId, String tokenRol, Long idUsuario) {
        return !"SERVICIO".equals(tokenRol) && tokenId != null && tokenId.equals(idUsuario);
    }
}
