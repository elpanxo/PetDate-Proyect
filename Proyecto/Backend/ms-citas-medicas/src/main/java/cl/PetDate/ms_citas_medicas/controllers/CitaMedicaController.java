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
    public ResponseEntity<CitaMedicaResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(citaMedicaService.buscarPorId(id));
    }

    @Operation(summary = "Buscar citas de un usuario")
    @GetMapping("/usuario/{idUsuario}")
    public Page<CitaMedicaResponse> buscarPorUsuario(
            @PathVariable Long idUsuario,
            @PageableDefault(size = 10, sort = "fecha") Pageable pageable) {
        return citaMedicaService.buscarPorUsuario(idUsuario, pageable);
    }

    @Operation(summary = "Buscar citas de una mascota")
    @GetMapping("/mascota/{idMascota}")
    public Page<CitaMedicaResponse> buscarPorMascota(
            @PathVariable Long idMascota,
            @PageableDefault(size = 10, sort = "fecha") Pageable pageable) {
        return citaMedicaService.buscarPorMascota(idMascota, pageable);
    }

    @Operation(summary = "Buscar citas por estado")
    @GetMapping("/estado/{estado}")
    public Page<CitaMedicaResponse> buscarPorEstado(
            @PathVariable EstadoEvento estado,
            @PageableDefault(size = 10) Pageable pageable) {
        return citaMedicaService.buscarPorEstado(estado, pageable);
    }

    @Operation(summary = "Buscar citas de un usuario por estado")
    @GetMapping("/usuario/{idUsuario}/estado/{estado}")
    public Page<CitaMedicaResponse> buscarPorUsuarioYEstado(
            @PathVariable Long idUsuario,
            @PathVariable EstadoEvento estado,
            @PageableDefault(size = 10) Pageable pageable) {
        return citaMedicaService.buscarPorUsuarioYEstado(idUsuario, estado, pageable);
    }

    @Operation(summary = "Actualizar una cita")
    @ApiResponse(responseCode = "404", description = "Cita no encontrada")
    @PutMapping("/{id}")
    public CitaMedicaResponse actualizarCita(
            @PathVariable Long id,
            @Valid @RequestBody CitaMedicaRequest request) {
        return citaMedicaService.actualizarCita(id, request);
    }

    @Operation(summary = "Cambiar estado de una cita")
    @ApiResponse(responseCode = "404", description = "Cita no encontrada")
    @PatchMapping("/{id}/estado/{estado}")
    public CitaMedicaResponse cambiarEstado(
            @PathVariable Long id,
            @PathVariable EstadoEvento estado) {
        return citaMedicaService.cambiarEstado(id, estado);
    }

    @Operation(summary = "Eliminar una cita")
    @ApiResponse(responseCode = "204", description = "Cita eliminada")
    @ApiResponse(responseCode = "404", description = "Cita no encontrada")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminarCita(@PathVariable Long id) {
        citaMedicaService.eliminarCita(id);
    }
}
