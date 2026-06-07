package cl.PetDate.ms_citas_medicas.controllers;

import cl.PetDate.ms_citas_medicas.dto.CitaMedicaRequest;
import cl.PetDate.ms_citas_medicas.dto.CitaMedicaResponse;
import cl.PetDate.ms_citas_medicas.models.EstadoEvento;
import cl.PetDate.ms_citas_medicas.services.CitaMedicaService;
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

@Tag(name = "Citas Medicas", description = "Gestion de citas medicas y eventos")
@RestController
@RequestMapping("/citas")
public class CitaMedicaController {

    private final CitaMedicaService citaMedicaService;

    public CitaMedicaController(CitaMedicaService citaMedicaService) {
        this.citaMedicaService = citaMedicaService;
    }

    @Operation(summary = "Agendar una cita medica")
    @ApiResponse(responseCode = "201", description = "Cita agendada")
    @ApiResponse(responseCode = "404", description = "Usuario o mascota no existe")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CitaMedicaResponse crearCita(@Valid @RequestBody CitaMedicaRequest request) {
        return citaMedicaService.crearCita(request);
    }

    @Operation(summary = "Listar todas las citas paginado")
    @GetMapping
    public Page<CitaMedicaResponse> listarCitas(
            @PageableDefault(size = 10, sort = "fecha") Pageable pageable) {
        return citaMedicaService.listarCitas(pageable);
    }

    @Operation(summary = "Buscar cita por ID")
    @ApiResponse(responseCode = "404", description = "Cita no encontrada")
    @GetMapping("/{id}")
    public ResponseEntity<CitaMedicaResponse> buscarPorId(
            @PathVariable Long id,
            @RequestHeader(value = "X-Usuario-Id", required = false) Long tokenId,
            @RequestHeader(value = "X-Usuario-Rol", required = false) String tokenRol) {
        CitaMedicaResponse cita = citaMedicaService.buscarPorId(id);
        if (!esPropietarioOAdmin(tokenId, tokenRol, cita.getIdUsuario())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(cita);
    }

    @Operation(summary = "Buscar citas de un usuario")
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<Page<CitaMedicaResponse>> buscarPorUsuario(
            @PathVariable Long idUsuario,
            @PageableDefault(size = 10, sort = "fecha") Pageable pageable,
            @RequestHeader(value = "X-Usuario-Id", required = false) Long tokenId,
            @RequestHeader(value = "X-Usuario-Rol", required = false) String tokenRol) {
        if (!esPropietarioOAdmin(tokenId, tokenRol, idUsuario)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(citaMedicaService.buscarPorUsuario(idUsuario, pageable));
    }

    @Operation(summary = "Buscar citas de una mascota")
    @GetMapping("/mascota/{idMascota}")
    public Page<CitaMedicaResponse> buscarPorMascota(
            @PathVariable Long idMascota,
            @PageableDefault(size = 10, sort = "fecha") Pageable pageable) {
        // Solo ADMIN — protegido en el gateway
        return citaMedicaService.buscarPorMascota(idMascota, pageable);
    }

    @Operation(summary = "Buscar citas por estado")
    @GetMapping("/estado/{estado}")
    public Page<CitaMedicaResponse> buscarPorEstado(
            @PathVariable EstadoEvento estado,
            @PageableDefault(size = 10) Pageable pageable) {
        // Solo ADMIN — protegido en el gateway
        return citaMedicaService.buscarPorEstado(estado, pageable);
    }

    @Operation(summary = "Buscar citas de un usuario por estado")
    @GetMapping("/usuario/{idUsuario}/estado/{estado}")
    public ResponseEntity<Page<CitaMedicaResponse>> buscarPorUsuarioYEstado(
            @PathVariable Long idUsuario,
            @PathVariable EstadoEvento estado,
            @PageableDefault(size = 10) Pageable pageable,
            @RequestHeader(value = "X-Usuario-Id", required = false) Long tokenId,
            @RequestHeader(value = "X-Usuario-Rol", required = false) String tokenRol) {
        if (!esPropietarioOAdmin(tokenId, tokenRol, idUsuario)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(citaMedicaService.buscarPorUsuarioYEstado(idUsuario, estado, pageable));
    }

    @Operation(summary = "Actualizar una cita")
    @ApiResponse(responseCode = "404", description = "Cita no encontrada")
    @PutMapping("/{id}")
    public ResponseEntity<CitaMedicaResponse> actualizarCita(
            @PathVariable Long id,
            @Valid @RequestBody CitaMedicaRequest request,
            @RequestHeader(value = "X-Usuario-Id", required = false) Long tokenId,
            @RequestHeader(value = "X-Usuario-Rol", required = false) String tokenRol) {
        CitaMedicaResponse cita = citaMedicaService.buscarPorId(id);
        if (!esPropietarioOAdmin(tokenId, tokenRol, cita.getIdUsuario())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(citaMedicaService.actualizarCita(id, request));
    }

    @Operation(summary = "Cambiar estado de una cita")
    @ApiResponse(responseCode = "404", description = "Cita no encontrada")
    @PatchMapping("/{id}/estado/{estado}")
    public ResponseEntity<CitaMedicaResponse> cambiarEstado(
            @PathVariable Long id,
            @PathVariable EstadoEvento estado,
            @RequestHeader(value = "X-Usuario-Id", required = false) Long tokenId,
            @RequestHeader(value = "X-Usuario-Rol", required = false) String tokenRol) {
        CitaMedicaResponse cita = citaMedicaService.buscarPorId(id);
        if (!esPropietarioOAdmin(tokenId, tokenRol, cita.getIdUsuario())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(citaMedicaService.cambiarEstado(id, estado));
    }

    @Operation(summary = "Eliminar una cita")
    @ApiResponse(responseCode = "204", description = "Cita eliminada")
    @ApiResponse(responseCode = "404", description = "Cita no encontrada")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarCita(
            @PathVariable Long id,
            @RequestHeader(value = "X-Usuario-Id", required = false) Long tokenId,
            @RequestHeader(value = "X-Usuario-Rol", required = false) String tokenRol) {
        CitaMedicaResponse cita = citaMedicaService.buscarPorId(id);
        if (!esPropietarioOAdmin(tokenId, tokenRol, cita.getIdUsuario())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        citaMedicaService.eliminarCita(id);
        return ResponseEntity.noContent().build();
    }

    // El dueño de la cita (su idUsuario coincide con el id del token) o un ADMIN
    private boolean esPropietarioOAdmin(Long tokenId, String tokenRol, Long idUsuarioDueno) {
        return "ADMIN".equals(tokenRol) || (tokenId != null && tokenId.equals(idUsuarioDueno));
    }

    // ── Endpoints internos (solo accesibles dentro de la red Docker) ──────────
    // Usados para el borrado en cascada al eliminar un usuario o una mascota.

    @DeleteMapping("/interno/usuario/{idUsuario}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminarPorUsuarioInterno(@PathVariable Long idUsuario) {
        citaMedicaService.eliminarPorUsuario(idUsuario);
    }

    @DeleteMapping("/interno/mascota/{idMascota}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminarPorMascotaInterno(@PathVariable Long idMascota) {
        citaMedicaService.eliminarPorMascota(idMascota);
    }
}
