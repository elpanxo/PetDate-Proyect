package cl.PetDate.ms_servicios.controllers;

import cl.PetDate.ms_servicios.dto.BlogRequest;
import cl.PetDate.ms_servicios.dto.BlogResponse;
import cl.PetDate.ms_servicios.services.BlogService;
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

@Tag(name = "Blogs", description = "Entradas de blog publicadas por los servicios")
@RestController
@RequestMapping("/blogs")
public class BlogController {

    private final BlogService blogService;

    public BlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    @Operation(summary = "Crear una entrada de blog (solo cuentas de servicio)")
    @ApiResponse(responseCode = "201", description = "Blog creado")
    @ApiResponse(responseCode = "404", description = "Servicio no encontrado")
    @PostMapping
    public ResponseEntity<BlogResponse> crearBlog(
            @Valid @RequestBody BlogRequest request,
            @RequestHeader(value = "X-Usuario-Id", required = false) Long tokenId,
            @RequestHeader(value = "X-Usuario-Rol", required = false) String tokenRol) {
        // El gateway ya exige token de tipo SERVICIO; aquí validamos que el blog
        // se cree para el propio servicio autenticado
        if (!esPropioServicio(tokenId, tokenRol, request.getIdServicio())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(blogService.crearBlog(request));
    }

    @Operation(summary = "Listar entradas de blog paginado (público)")
    @GetMapping
    public Page<BlogResponse> listarBlogs(
            @PageableDefault(size = 10, sort = "fecha") Pageable pageable) {
        return blogService.listarBlogs(pageable);
    }

    @Operation(summary = "Buscar entrada de blog por ID (público)")
    @ApiResponse(responseCode = "404", description = "Blog no encontrado")
    @GetMapping("/{id}")
    public ResponseEntity<BlogResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(blogService.buscarPorId(id));
    }

    @Operation(summary = "Buscar entradas de blog de un servicio (público)")
    @GetMapping("/servicio/{idServicio}")
    public Page<BlogResponse> buscarPorServicio(
            @PathVariable Long idServicio,
            @PageableDefault(size = 10, sort = "fecha") Pageable pageable) {
        return blogService.buscarPorServicio(idServicio, pageable);
    }

    @Operation(summary = "Actualizar una entrada de blog")
    @ApiResponse(responseCode = "404", description = "Blog no encontrado")
    @PutMapping("/{id}")
    public ResponseEntity<BlogResponse> actualizarBlog(
            @PathVariable Long id,
            @Valid @RequestBody BlogRequest request,
            @RequestHeader(value = "X-Usuario-Id", required = false) Long tokenId,
            @RequestHeader(value = "X-Usuario-Rol", required = false) String tokenRol) {
        BlogResponse blog = blogService.buscarPorId(id);
        if (!esPropioServicio(tokenId, tokenRol, blog.getIdServicio())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(blogService.actualizarBlog(id, request));
    }

    @Operation(summary = "Eliminar una entrada de blog")
    @ApiResponse(responseCode = "204", description = "Blog eliminado")
    @ApiResponse(responseCode = "404", description = "Blog no encontrado")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarBlog(
            @PathVariable Long id,
            @RequestHeader(value = "X-Usuario-Id", required = false) Long tokenId,
            @RequestHeader(value = "X-Usuario-Rol", required = false) String tokenRol) {
        BlogResponse blog = blogService.buscarPorId(id);
        if (!esPropioServicio(tokenId, tokenRol, blog.getIdServicio())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        blogService.eliminarBlog(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Subir/actualizar la imagen de una entrada de blog")
    @ApiResponse(responseCode = "200", description = "Imagen actualizada")
    @ApiResponse(responseCode = "404", description = "Blog no encontrado")
    @PostMapping("/{id}/imagen")
    public ResponseEntity<BlogResponse> subirImagen(
            @PathVariable Long id,
            @RequestParam("imagen") MultipartFile imagen,
            @RequestHeader(value = "X-Usuario-Id", required = false) Long tokenId,
            @RequestHeader(value = "X-Usuario-Rol", required = false) String tokenRol) throws IOException {
        BlogResponse blog = blogService.buscarPorId(id);
        if (!esPropioServicio(tokenId, tokenRol, blog.getIdServicio())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(blogService.subirImagen(id, imagen));
    }

    // Solo el propio servicio (token de tipo SERVICIO cuyo id coincide con idServicio del blog)
    private boolean esPropioServicio(Long tokenId, String tokenRol, Long idServicio) {
        return "SERVICIO".equals(tokenRol) && tokenId != null && tokenId.equals(idServicio);
    }
}
