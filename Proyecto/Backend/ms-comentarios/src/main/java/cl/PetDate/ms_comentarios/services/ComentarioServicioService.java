package cl.PetDate.ms_comentarios.services;

import cl.PetDate.ms_comentarios.dto.ComentarioServicioRequest;
import cl.PetDate.ms_comentarios.dto.ComentarioServicioResponse;
import cl.PetDate.ms_comentarios.exceptions.ComentarioServicioNotFoundException;
import cl.PetDate.ms_comentarios.models.ComentarioServicio;
import cl.PetDate.ms_comentarios.repositories.ComentarioServicioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ComentarioServicioService {

    private static final Logger log = LoggerFactory.getLogger(ComentarioServicioService.class);
    private static final String SEQUENCE_NAME = "comentarios_servicio_sequence";

    private final ComentarioServicioRepository comentarioServicioRepository;
    private final SequenceGeneratorService sequenceGeneratorService;

    public ComentarioServicioService(
            ComentarioServicioRepository comentarioServicioRepository,
            SequenceGeneratorService sequenceGeneratorService) {
        this.comentarioServicioRepository = comentarioServicioRepository;
        this.sequenceGeneratorService = sequenceGeneratorService;
    }

    public ComentarioServicioResponse crearComentario(Long idUsuario, ComentarioServicioRequest request) {
        ComentarioServicio comentario = toEntity(request);
        comentario.setId(sequenceGeneratorService.generateSequence(SEQUENCE_NAME));
        comentario.setIdUsuario(idUsuario);
        comentario.setFecha(LocalDateTime.now());
        log.info("Creando comentario de servicio id={} para servicio id={} por usuario id={}",
                comentario.getId(), request.getIdServicio(), idUsuario);
        return toResponse(comentarioServicioRepository.save(comentario));
    }

    public Page<ComentarioServicioResponse> listarComentarios(Pageable pageable) {
        return comentarioServicioRepository.findAll(pageable).map(this::toResponse);
    }

    public ComentarioServicioResponse buscarPorId(Long id) {
        return comentarioServicioRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ComentarioServicioNotFoundException(id));
    }

    public Page<ComentarioServicioResponse> buscarPorServicio(Long idServicio, Pageable pageable) {
        return comentarioServicioRepository.findByIdServicio(idServicio, pageable)
                .map(this::toResponse);
    }

    public Page<ComentarioServicioResponse> buscarPorUsuario(Long idUsuario, Pageable pageable) {
        return comentarioServicioRepository.findByIdUsuario(idUsuario, pageable)
                .map(this::toResponse);
    }

    public ComentarioServicio obtenerEntidad(Long id) {
        return comentarioServicioRepository.findById(id)
                .orElseThrow(() -> new ComentarioServicioNotFoundException(id));
    }

    public ComentarioServicioResponse actualizarComentario(Long id, ComentarioServicioRequest request) {
        ComentarioServicio comentario = comentarioServicioRepository.findById(id)
                .orElseThrow(() -> new ComentarioServicioNotFoundException(id));
        comentario.setTexto(request.getTexto());
        comentario.setCalificacion(request.getCalificacion());
        log.info("Actualizando comentario de servicio id={}", id);
        return toResponse(comentarioServicioRepository.save(comentario));
    }

    public void eliminarComentario(Long id) {
        ComentarioServicio comentario = comentarioServicioRepository.findById(id)
                .orElseThrow(() -> new ComentarioServicioNotFoundException(id));
        comentarioServicioRepository.delete(comentario);
        log.info("Comentario de servicio id={} eliminado", id);
    }

    // Usado para la eliminación en cascada al eliminar un servicio (política de retención de datos)
    public void eliminarPorServicio(Long idServicio) {
        comentarioServicioRepository.deleteByIdServicio(idServicio);
        log.info("Comentarios del servicio id={} eliminados en cascada", idServicio);
    }

    // Usado para la eliminación en cascada al eliminar un usuario (política de retención de datos)
    public void eliminarPorUsuario(Long idUsuario) {
        comentarioServicioRepository.deleteByIdUsuario(idUsuario);
        log.info("Comentarios de servicio del usuario id={} eliminados en cascada", idUsuario);
    }

    private ComentarioServicio toEntity(ComentarioServicioRequest r) {
        ComentarioServicio c = new ComentarioServicio();
        c.setIdServicio(r.getIdServicio());
        c.setNombreUsuario(r.getNombreUsuario());
        c.setTexto(r.getTexto());
        c.setCalificacion(r.getCalificacion());
        return c;
    }

    private ComentarioServicioResponse toResponse(ComentarioServicio c) {
        ComentarioServicioResponse r = new ComentarioServicioResponse();
        r.setId(c.getId());
        r.setIdServicio(c.getIdServicio());
        r.setIdUsuario(c.getIdUsuario());
        r.setNombreUsuario(c.getNombreUsuario());
        r.setTexto(c.getTexto());
        r.setCalificacion(c.getCalificacion());
        r.setFecha(c.getFecha());
        return r;
    }
}
