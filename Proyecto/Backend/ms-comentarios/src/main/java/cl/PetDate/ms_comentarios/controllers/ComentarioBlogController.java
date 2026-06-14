package cl.PetDate.ms_comentarios.controllers;

import cl.PetDate.ms_comentarios.dto.ComentarioBlogRequest;
import cl.PetDate.ms_comentarios.dto.ComentarioBlogResponse;
import cl.PetDate.ms_comentarios.services.ComentarioBlogService;
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

@Tag(name = "Comentarios de blog", description = "Comentarios y calificaciones de entradas de blog")
@RestController
@RequestMapping("/comentarios/blog")
public class ComentarioBlogController {

    private final ComentarioBlogService comentarioBlogService;

    public ComentarioBlogController(ComentarioBlogService comentarioBlogService) {
        this.comentarioBlogService = comentarioBlogService;
    }

    @Operation(summary = "Crear un comentario de blog (solo cuentas de usuario)")
    @ApiResponse(responseCode = "201", description = "Comentario creado")
    @PostMapping
    public ResponseEntity<ComentarioBlogResponse> crearComentario(
            @Valid @RequestBody ComentarioBlogRequest request,
            @RequestHeader(value = "X-Usuario-Id", required = false) Long tokenId,
            @RequestHeader(value = "X-Usuario-Rol", required = false) String tokenRol) {
        // El gateway ya exige token de USUARIO (no de servicio); el comentario
        // queda asociado al usuario autenticado
        if (tokenId == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(comentarioBlogService.crearComentario(tokenId, request));
    }

    @Operation(summary = "Listar comentarios de blog paginado (público)")
    @GetMapping
    public Page<ComentarioBlogResponse> listarComentarios(
            @PageableDefault(size = 10, sort = "fecha") Pageable pageable) {
        return comentarioBlogService.listarComentarios(pageable);
    }

    @Operation(summary = "Buscar comentario de blog por ID (público)")
    @ApiResponse(responseCode = "404", description = "Comentario no encontrado")
    @GetMapping("/{id}")
    public ResponseEntity<ComentarioBlogResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(comentarioBlogService.buscarPorId(id));
    }

    @Operation(summary = "Buscar comentarios de un blog (público)")
    @GetMapping("/blog/{idBlog}")
    public Page<ComentarioBlogResponse> buscarPorBlog(
            @PathVariable Long idBlog,
            @PageableDefault(size = 10, sort = "fecha") Pageable pageable) {
        return comentarioBlogService.buscarPorBlog(idBlog, pageable);
    }

    @Operation(summary = "Buscar comentarios realizados por un usuario (público)")
    @GetMapping("/usuario/{idUsuario}")
    public Page<ComentarioBlogResponse> buscarPorUsuario(
            @PathVariable Long idUsuario,
            @PageableDefault(size = 10, sort = "fecha") Pageable pageable) {
        return comentarioBlogService.buscarPorUsuario(idUsuario, pageable);
    }

    @Operation(summary = "Actualizar un comentario de blog (solo el usuario dueño)")
    @ApiResponse(responseCode = "404", description = "Comentario no encontrado")
    @PutMapping("/{id}")
    public ResponseEntity<ComentarioBlogResponse> actualizarComentario(
            @PathVariable Long id,
            @Valid @RequestBody ComentarioBlogRequest request,
            @RequestHeader(value = "X-Usuario-Id", required = false) Long tokenId,
            @RequestHeader(value = "X-Usuario-Rol", required = false) String tokenRol) {
        if (!esPropioUsuario(tokenId, tokenRol, comentarioBlogService.obtenerEntidad(id).getIdUsuario())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(comentarioBlogService.actualizarComentario(id, request));
    }

    @Operation(summary = "Eliminar un comentario de blog (solo el usuario dueño)")
    @ApiResponse(responseCode = "204", description = "Comentario eliminado")
    @ApiResponse(responseCode = "404", description = "Comentario no encontrado")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarComentario(
            @PathVariable Long id,
            @RequestHeader(value = "X-Usuario-Id", required = false) Long tokenId,
            @RequestHeader(value = "X-Usuario-Rol", required = false) String tokenRol) {
        if (!esPropioUsuario(tokenId, tokenRol, comentarioBlogService.obtenerEntidad(id).getIdUsuario())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        comentarioBlogService.eliminarComentario(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Eliminar todos los comentarios de blog de un usuario (uso interno entre microservicios)")
    @ApiResponse(responseCode = "204", description = "Comentarios eliminados")
    @DeleteMapping("/interno/usuario/{idUsuario}")
    public ResponseEntity<Void> eliminarPorUsuario(@PathVariable Long idUsuario) {
        comentarioBlogService.eliminarPorUsuario(idUsuario);
        return ResponseEntity.noContent().build();
    }

    // Solo el propio usuario (token de usuario cuyo id coincide con idUsuario del comentario)
    private boolean esPropioUsuario(Long tokenId, String tokenRol, Long idUsuario) {
        return !"SERVICIO".equals(tokenRol) && tokenId != null && tokenId.equals(idUsuario);
    }
}
