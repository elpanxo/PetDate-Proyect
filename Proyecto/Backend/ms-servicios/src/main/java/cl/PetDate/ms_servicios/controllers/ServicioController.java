package cl.PetDate.ms_servicios.controllers;

import cl.PetDate.ms_servicios.dto.ServicioRequest;
import cl.PetDate.ms_servicios.dto.ServicioResponse;
import cl.PetDate.ms_servicios.dto.ServicioUpdateRequest;
import cl.PetDate.ms_servicios.services.ServicioService;
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

@Tag(name = "Servicios", description = "CRUD de servicios")
@RestController
@RequestMapping("/servicios")
public class ServicioController {

    private final ServicioService servicioService;

    public ServicioController(ServicioService servicioService) {
        this.servicioService = servicioService;
    }

    @Operation(summary = "Registrar un servicio")
    @ApiResponse(responseCode = "201", description = "Servicio creado")
    @ApiResponse(responseCode = "409", description = "Correo ya registrado")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ServicioResponse crearServicio(@Valid @RequestBody ServicioRequest request) {
        return servicioService.crearServicio(request);
    }

    @Operation(summary = "Listar servicios paginado")
    @GetMapping
    public Page<ServicioResponse> listarServicios(
            @PageableDefault(size = 10, sort = "nombreServicio") Pageable pageable) {
        return servicioService.listarServicios(pageable);
    }

    @Operation(summary = "Buscar servicio por ID")
    @ApiResponse(responseCode = "404", description = "Servicio no encontrado")
    @GetMapping("/{id}")
    public ResponseEntity<ServicioResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(servicioService.buscarPorId(id));
    }

    @Operation(summary = "Buscar servicios por tipo")
    @GetMapping("/tipo/{tipoServicio}")
    public Page<ServicioResponse> buscarPorTipo(
            @PathVariable String tipoServicio,
            @PageableDefault(size = 10) Pageable pageable) {
        return servicioService.buscarPorTipo(tipoServicio, pageable);
    }

    @Operation(summary = "Buscar servicios por comuna")
    @GetMapping("/comuna/{comuna}")
    public Page<ServicioResponse> buscarPorComuna(
            @PathVariable String comuna,
            @PageableDefault(size = 10) Pageable pageable) {
        return servicioService.buscarPorComuna(comuna, pageable);
    }

    @Operation(summary = "Actualizar servicio")
    @ApiResponse(responseCode = "404", description = "Servicio no encontrado")
    @PutMapping("/{id}")
    public ResponseEntity<ServicioResponse> actualizarServicio(
            @PathVariable Long id,
            @Valid @RequestBody ServicioUpdateRequest request,
            @RequestHeader(value = "X-Usuario-Id", required = false) Long tokenId,
            @RequestHeader(value = "X-Usuario-Rol", required = false) String tokenRol) {
        if (!esPropioServicio(tokenId, tokenRol, id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(servicioService.actualizarServicio(id, request));
    }

    @Operation(summary = "Eliminar servicio")
    @ApiResponse(responseCode = "204", description = "Servicio eliminado")
    @ApiResponse(responseCode = "404", description = "Servicio no encontrado")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarServicio(
            @PathVariable Long id,
            @RequestHeader(value = "X-Usuario-Id", required = false) Long tokenId,
            @RequestHeader(value = "X-Usuario-Rol", required = false) String tokenRol) {
        if (!esPropioServicio(tokenId, tokenRol, id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        servicioService.eliminarServicio(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Subir/actualizar la imagen del servicio")
    @ApiResponse(responseCode = "200", description = "Imagen actualizada")
    @ApiResponse(responseCode = "404", description = "Servicio no encontrado")
    @PostMapping("/{id}/imagen")
    public ResponseEntity<ServicioResponse> subirImagen(
            @PathVariable Long id,
            @RequestParam("imagen") MultipartFile imagen,
            @RequestHeader(value = "X-Usuario-Id", required = false) Long tokenId,
            @RequestHeader(value = "X-Usuario-Rol", required = false) String tokenRol) throws IOException {
        if (!esPropioServicio(tokenId, tokenRol, id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(servicioService.subirImagen(id, imagen));
    }

    // Solo el propio servicio (token de tipo SERVICIO cuyo id coincide) puede modificarse/eliminarse
    private boolean esPropioServicio(Long tokenId, String tokenRol, Long idServicio) {
        return "SERVICIO".equals(tokenRol) && tokenId != null && tokenId.equals(idServicio);
    }
}
