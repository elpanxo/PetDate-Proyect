package cl.PetDate.ms_mascotas.services;

import cl.PetDate.ms_mascotas.clients.UsuarioClient;
import cl.PetDate.ms_mascotas.models.Mascota;
import cl.PetDate.ms_mascotas.repositories.MascotaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class MascotaService {

    private static final String SEQUENCE_NAME = "mascotas_sequence";

    private final MascotaRepository mascotaRepository;
    private final SequenceGeneratorService sequenceGeneratorService;
    private final UsuarioClient usuarioClient;

    public MascotaService(
            MascotaRepository mascotaRepository,
            SequenceGeneratorService sequenceGeneratorService,
            UsuarioClient usuarioClient
    ) {
        this.mascotaRepository = mascotaRepository;
        this.sequenceGeneratorService = sequenceGeneratorService;
        this.usuarioClient = usuarioClient;
    }

    public Mascota crearMascota(Mascota mascota) {

        try {

            usuarioClient.buscarUsuarioPorId(mascota.getUsuarioId());

        } catch (Exception e) {

            throw new RuntimeException("El usuario no existe");
        }

        mascota.setId(
                sequenceGeneratorService.generateSequence(SEQUENCE_NAME)
        );

        return mascotaRepository.save(mascota);
    }

    public List<Mascota> listarMascotas() {
        return mascotaRepository.findAll();
    }

    public Mascota buscarPorId(Long id) {
        return mascotaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mascota no encontrada"));
    }

    public List<Mascota> buscarPorUsuario(Long usuarioId) {
        return mascotaRepository.findByUsuarioId(usuarioId);
    }

    public Mascota actualizarMascota(Long id, Mascota mascotaActualizada) {

        Mascota mascota = buscarPorId(id);

        mascota.setNombre(mascotaActualizada.getNombre());
        mascota.setEspecie(mascotaActualizada.getEspecie());
        mascota.setRaza(mascotaActualizada.getRaza());
        mascota.setEdad(mascotaActualizada.getEdad());
        mascota.setTamano(mascotaActualizada.getTamano());

        return mascotaRepository.save(mascota);
    }

    public void eliminarMascota(Long id) {

        Mascota mascota = buscarPorId(id);

        mascotaRepository.delete(mascota);
    }
}
