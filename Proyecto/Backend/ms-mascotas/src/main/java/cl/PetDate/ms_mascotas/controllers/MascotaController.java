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
    public ResponseEntity<MascotaResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(mascotaService.buscarPorId(id));
    }

    @Operation(summary = "Buscar mascotas por usuario")
    @ApiResponse(responseCode = "404", description = "Usuario no existe")
    @GetMapping("/usuario/{usuarioId}")
    public Page<MascotaResponse> buscarPorUsuario(
            @PathVariable Long usuarioId,
            @PageableDefault(size = 10) Pageable pageable) {
        return mascotaService.buscarPorUsuario(usuarioId, pageable);
    }

    @Operation(summary = "Actualizar mascota")
    @ApiResponse(responseCode = "200", description = "Mascota actualizada")
    @ApiResponse(responseCode = "404", description = "Mascota no existe")
    @PutMapping("/{id}")
    public MascotaResponse actualizarMascota(
            @PathVariable Long id,
            @Valid @RequestBody MascotaRequest request) {
        return mascotaService.actualizarMascota(id, request);
    }

    @Operation(summary = "Eliminar mascota")
    @ApiResponse(responseCode = "204", description = "Mascota eliminada")
    @ApiResponse(responseCode = "404", description = "Mascota no existe")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminarMascota(@PathVariable Long id) {
        mascotaService.eliminarMascota(id);
    }
}
