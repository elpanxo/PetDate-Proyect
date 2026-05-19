package cl.PetDate.ms_servicios.controllers;

import cl.PetDate.ms_servicios.dto.PromocionRequest;
import cl.PetDate.ms_servicios.dto.PromocionResponse;
import cl.PetDate.ms_servicios.services.PromocionService;
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

@Tag(name = "Promociones", description = "CRUD de promociones")
@RestController
@RequestMapping("/promociones")
public class PromocionController {

    private final PromocionService promocionService;

    public PromocionController(PromocionService promocionService) {
        this.promocionService = promocionService;
    }

    @Operation(summary = "Crear una promocion")
    @ApiResponse(responseCode = "201", description = "Promocion creada")
    @ApiResponse(responseCode = "404", description = "Servicio no encontrado")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PromocionResponse crearPromocion(@Valid @RequestBody PromocionRequest request) {
        return promocionService.crearPromocion(request);
    }

    @Operation(summary = "Listar promociones paginado")
    @GetMapping
    public Page<PromocionResponse> listarPromociones(
            @PageableDefault(size = 10) Pageable pageable) {
        return promocionService.listarPromociones(pageable);
    }

    @Operation(summary = "Buscar promocion por ID")
    @ApiResponse(responseCode = "404", description = "Promocion no encontrada")
    @GetMapping("/{id}")
    public ResponseEntity<PromocionResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(promocionService.buscarPorId(id));
    }

    @Operation(summary = "Buscar promociones por servicio")
    @GetMapping("/servicio/{idServicio}")
    public Page<PromocionResponse> buscarPorServicio(
            @PathVariable Long idServicio,
            @PageableDefault(size = 10) Pageable pageable) {
        return promocionService.buscarPorServicio(idServicio, pageable);
    }

    @Operation(summary = "Actualizar promocion")
    @ApiResponse(responseCode = "404", description = "Promocion no encontrada")
    @PutMapping("/{id}")
    public PromocionResponse actualizarPromocion(
            @PathVariable Long id,
            @Valid @RequestBody PromocionRequest request) {
        return promocionService.actualizarPromocion(id, request);
    }

    @Operation(summary = "Eliminar promocion")
    @ApiResponse(responseCode = "204", description = "Promocion eliminada")
    @ApiResponse(responseCode = "404", description = "Promocion no encontrada")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminarPromocion(@PathVariable Long id) {
        promocionService.eliminarPromocion(id);
    }
}
