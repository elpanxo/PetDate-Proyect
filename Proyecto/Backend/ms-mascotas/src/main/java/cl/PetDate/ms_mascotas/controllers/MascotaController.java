package cl.PetDate.ms_mascotas.controllers;

import cl.PetDate.ms_mascotas.models.Mascota;
import cl.PetDate.ms_mascotas.services.MascotaService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/mascotas")
public class MascotaController {

    private final MascotaService mascotaService;

    public MascotaController(MascotaService mascotaService) {
        this.mascotaService = mascotaService;
    }

    @PostMapping
    public Mascota crearMascota(@Valid @RequestBody Mascota mascota) {
        return mascotaService.crearMascota(mascota);
    }

    @GetMapping
    public List<Mascota> listarMascotas() {
        return mascotaService.listarMascotas();
    }

    @GetMapping("/{id}")
    public Mascota buscarPorId(@PathVariable Long id) {
        return mascotaService.buscarPorId(id);
    }

    @GetMapping("/usuario/{usuarioId}")
    public List<Mascota> buscarPorUsuario(@PathVariable Long usuarioId) {
        return mascotaService.buscarPorUsuario(usuarioId);
    }

    @PutMapping("/{id}")
    public Mascota actualizarMascota(
            @PathVariable Long id,
            @Valid @RequestBody Mascota mascota
    ) {
        return mascotaService.actualizarMascota(id, mascota);
    }

    @DeleteMapping("/{id}")
    public String eliminarMascota(@PathVariable Long id) {

        mascotaService.eliminarMascota(id);

        return "Mascota eliminada correctamente";
    }
}
