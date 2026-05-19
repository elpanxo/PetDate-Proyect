package cl.PetDate.ms_mascotas.services;

import cl.PetDate.ms_mascotas.clients.UsuarioClient;
import cl.PetDate.ms_mascotas.dto.MascotaRequest;
import cl.PetDate.ms_mascotas.dto.MascotaResponse;
import cl.PetDate.ms_mascotas.exceptions.MascotaNotFoundException;
import cl.PetDate.ms_mascotas.exceptions.UsuarioNotFoundException;
import cl.PetDate.ms_mascotas.models.Mascota;
import cl.PetDate.ms_mascotas.repositories.MascotaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
            UsuarioClient usuarioClient) {
        this.mascotaRepository = mascotaRepository;
        this.sequenceGeneratorService = sequenceGeneratorService;
        this.usuarioClient = usuarioClient;
    }

    public MascotaResponse crearMascota(MascotaRequest request) {
        try {
            usuarioClient.buscarUsuarioPorId(request.getUsuarioId());
        } catch (Exception e) {
            throw new UsuarioNotFoundException(request.getUsuarioId());
        }
        Mascota mascota = toEntity(request);
        mascota.setId(sequenceGeneratorService.generateSequence(SEQUENCE_NAME));
        return toResponse(mascotaRepository.save(mascota));
    }

    public Page<MascotaResponse> listarMascotas(Pageable pageable) {
        return mascotaRepository.findAll(pageable)
                .map(this::toResponse);
    }

    public MascotaResponse buscarPorId(Long id) {
        return mascotaRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new MascotaNotFoundException(id));
    }

    public Page<MascotaResponse> buscarPorUsuario(Long usuarioId, Pageable pageable) {
        return mascotaRepository.findByUsuarioId(usuarioId, pageable)
                .map(this::toResponse);
    }

    public MascotaResponse actualizarMascota(Long id, MascotaRequest request) {
        Mascota mascota = mascotaRepository.findById(id)
                .orElseThrow(() -> new MascotaNotFoundException(id));
        mascota.setNombre(request.getNombre());
        mascota.setEspecie(request.getEspecie());
        mascota.setRaza(request.getRaza());
        mascota.setEdad(request.getEdad());
        mascota.setTamano(request.getTamano());
        mascota.setSexo(request.getSexo());
        mascota.setPeso(request.getPeso());
        mascota.setColor(request.getColor());
        mascota.setFecha_nacimineto(request.getFecha_nacimineto());
        mascota.setObservaciones(request.getObservaciones());
        mascota.setInfo_medica_basica(request.getInfo_medica_basica());
        return toResponse(mascotaRepository.save(mascota));
    }

    public void eliminarMascota(Long id) {
        Mascota mascota = mascotaRepository.findById(id)
                .orElseThrow(() -> new MascotaNotFoundException(id));
        mascotaRepository.delete(mascota);
    }

    private Mascota toEntity(MascotaRequest request) {
        Mascota m = new Mascota();
        m.setNombre(request.getNombre());
        m.setEspecie(request.getEspecie());
        m.setRaza(request.getRaza());
        m.setEdad(request.getEdad());
        m.setTamano(request.getTamano());
        m.setUsuarioId(request.getUsuarioId());
        m.setSexo(request.getSexo());
        m.setPeso(request.getPeso());
        m.setColor(request.getColor());
        m.setFecha_nacimineto(request.getFecha_nacimineto());
        m.setObservaciones(request.getObservaciones());
        m.setInfo_medica_basica(request.getInfo_medica_basica());
        return m;
    }

    private MascotaResponse toResponse(Mascota m) {
        MascotaResponse r = new MascotaResponse();
        r.setId(m.getId());
        r.setNombre(m.getNombre());
        r.setEspecie(m.getEspecie());
        r.setRaza(m.getRaza());
        r.setEdad(m.getEdad());
        r.setTamano(m.getTamano());
        r.setUsuarioId(m.getUsuarioId());
        r.setSexo(m.getSexo());
        r.setPeso(m.getPeso());
        r.setColor(m.getColor());
        r.setFecha_nacimineto(m.getFecha_nacimineto());
        r.setObservaciones(m.getObservaciones());
        r.setInfo_medica_basica(m.getInfo_medica_basica());
        return r;
    }
}
