package cl.PetDate.ms_citas_medicas.services;

import cl.PetDate.ms_citas_medicas.clients.MascotaClient;
import cl.PetDate.ms_citas_medicas.clients.UsuarioClient;
import cl.PetDate.ms_citas_medicas.dto.CitaMedicaRequest;
import cl.PetDate.ms_citas_medicas.dto.CitaMedicaResponse;
import cl.PetDate.ms_citas_medicas.exceptions.CitaMedicaNotFoundException;
import cl.PetDate.ms_citas_medicas.exceptions.MascotaNotFoundException;
import cl.PetDate.ms_citas_medicas.exceptions.UsuarioNotFoundException;
import cl.PetDate.ms_citas_medicas.models.CitaMedica;
import cl.PetDate.ms_citas_medicas.models.EstadoEvento;
import cl.PetDate.ms_citas_medicas.repositories.CitaMedicaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class CitaMedicaService {

    private static final Logger log = LoggerFactory.getLogger(CitaMedicaService.class);
    private static final String SEQUENCE_NAME = "citas_medicas_sequence";

    private final CitaMedicaRepository citaMedicaRepository;
    private final SequenceGeneratorService sequenceGeneratorService;
    private final UsuarioClient usuarioClient;
    private final MascotaClient mascotaClient;

    public CitaMedicaService(
            CitaMedicaRepository citaMedicaRepository,
            SequenceGeneratorService sequenceGeneratorService,
            UsuarioClient usuarioClient,
            MascotaClient mascotaClient) {
        this.citaMedicaRepository = citaMedicaRepository;
        this.sequenceGeneratorService = sequenceGeneratorService;
        this.usuarioClient = usuarioClient;
        this.mascotaClient = mascotaClient;
    }

    public CitaMedicaResponse crearCita(CitaMedicaRequest request) {
        try {
            usuarioClient.buscarUsuarioPorId(request.getIdUsuario());
        } catch (Exception e) {
            throw new UsuarioNotFoundException(request.getIdUsuario());
        }
        try {
            mascotaClient.buscarMascotaPorId(request.getIdMascota());
        } catch (Exception e) {
            throw new MascotaNotFoundException(request.getIdMascota());
        }

        CitaMedica cita = toEntity(request);
        cita.setIdEvento(sequenceGeneratorService.generateSequence(SEQUENCE_NAME));
        cita.setEstado(EstadoEvento.PENDIENTE);
        log.info("Creando cita medica para mascota id={}", request.getIdMascota());
        return toResponse(citaMedicaRepository.save(cita));
    }

    public Page<CitaMedicaResponse> listarCitas(Pageable pageable) {
        return citaMedicaRepository.findAll(pageable).map(this::toResponse);
    }

    public CitaMedicaResponse buscarPorId(Long id) {
        return citaMedicaRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new CitaMedicaNotFoundException(id));
    }

    public Page<CitaMedicaResponse> buscarPorUsuario(Long idUsuario, Pageable pageable) {
        return citaMedicaRepository.findByIdUsuario(idUsuario, pageable)
                .map(this::toResponse);
    }

    public Page<CitaMedicaResponse> buscarPorMascota(Long idMascota, Pageable pageable) {
        return citaMedicaRepository.findByIdMascota(idMascota, pageable)
                .map(this::toResponse);
    }

    public Page<CitaMedicaResponse> buscarPorEstado(EstadoEvento estado, Pageable pageable) {
        return citaMedicaRepository.findByEstado(estado, pageable)
                .map(this::toResponse);
    }

    public Page<CitaMedicaResponse> buscarPorUsuarioYEstado(Long idUsuario, EstadoEvento estado, Pageable pageable) {
        return citaMedicaRepository.findByIdUsuarioAndEstado(idUsuario, estado, pageable)
                .map(this::toResponse);
    }

    // Citas de una mascota puntual, acotadas al dueño que las consulta
    // (evita exponer /citas/mascota/{id}, que es de uso exclusivo de ADMIN)
    public Page<CitaMedicaResponse> buscarPorUsuarioYMascota(Long idUsuario, Long idMascota, Pageable pageable) {
        return citaMedicaRepository.findByIdUsuarioAndIdMascota(idUsuario, idMascota, pageable)
                .map(this::toResponse);
    }

    public CitaMedicaResponse actualizarCita(Long id, CitaMedicaRequest request) {
        CitaMedica cita = citaMedicaRepository.findById(id)
                .orElseThrow(() -> new CitaMedicaNotFoundException(id));
        cita.setTipoEvento(request.getTipoEvento());
        cita.setFecha(request.getFecha());
        cita.setHora(request.getHora());
        cita.setDescripcion(request.getDescripcion());
        cita.setObservacion(request.getObservacion());
        if (request.getEstado() != null) {
            cita.setEstado(request.getEstado());
        }
        log.info("Actualizando cita id={}", id);
        return toResponse(citaMedicaRepository.save(cita));
    }

    public CitaMedicaResponse cambiarEstado(Long id, EstadoEvento estado) {
        CitaMedica cita = citaMedicaRepository.findById(id)
                .orElseThrow(() -> new CitaMedicaNotFoundException(id));
        cita.setEstado(estado);
        log.info("Cambiando estado de cita id={} a {}", id, estado);
        return toResponse(citaMedicaRepository.save(cita));
    }

    public void eliminarCita(Long id) {
        CitaMedica cita = citaMedicaRepository.findById(id)
                .orElseThrow(() -> new CitaMedicaNotFoundException(id));
        citaMedicaRepository.delete(cita);
        log.info("Cita id={} eliminada", id);
    }

    // ── Borrado en cascada (política de retención de datos) ───────────────────
    // Invocados internamente cuando se elimina el usuario o la mascota dueños.

    public void eliminarPorUsuario(Long idUsuario) {
        citaMedicaRepository.deleteByIdUsuario(idUsuario);
        log.info("Citas del usuario id={} eliminadas en cascada", idUsuario);
    }

    public void eliminarPorMascota(Long idMascota) {
        citaMedicaRepository.deleteByIdMascota(idMascota);
        log.info("Citas de la mascota id={} eliminadas en cascada", idMascota);
    }

    private CitaMedica toEntity(CitaMedicaRequest r) {
        CitaMedica c = new CitaMedica();
        c.setIdUsuario(r.getIdUsuario());
        c.setIdMascota(r.getIdMascota());
        c.setTipoEvento(r.getTipoEvento());
        c.setFecha(r.getFecha());
        c.setHora(r.getHora());
        c.setDescripcion(r.getDescripcion());
        c.setObservacion(r.getObservacion());
        return c;
    }

    private CitaMedicaResponse toResponse(CitaMedica c) {
        CitaMedicaResponse r = new CitaMedicaResponse();
        r.setIdEvento(c.getIdEvento());
        r.setIdUsuario(c.getIdUsuario());
        r.setIdMascota(c.getIdMascota());
        r.setTipoEvento(c.getTipoEvento());
        r.setFecha(c.getFecha());
        r.setHora(c.getHora());
        r.setDescripcion(c.getDescripcion());
        r.setObservacion(c.getObservacion());
        r.setEstado(c.getEstado());
        return r;
    }
}
