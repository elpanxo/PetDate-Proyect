package cl.PetDate.ms_comentarios.services;

import cl.PetDate.ms_comentarios.dto.ComentarioBlogRequest;
import cl.PetDate.ms_comentarios.dto.ComentarioBlogResponse;
import cl.PetDate.ms_comentarios.exceptions.ComentarioBlogNotFoundException;
import cl.PetDate.ms_comentarios.models.ComentarioBlog;
import cl.PetDate.ms_comentarios.repositories.ComentarioBlogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ComentarioBlogService {

    private static final Logger log = LoggerFactory.getLogger(ComentarioBlogService.class);
    private static final String SEQUENCE_NAME = "comentarios_blog_sequence";

    private final ComentarioBlogRepository comentarioBlogRepository;
    private final SequenceGeneratorService sequenceGeneratorService;

    public ComentarioBlogService(
            ComentarioBlogRepository comentarioBlogRepository,
            SequenceGeneratorService sequenceGeneratorService) {
        this.comentarioBlogRepository = comentarioBlogRepository;
        this.sequenceGeneratorService = sequenceGeneratorService;
    }

    public ComentarioBlogResponse crearComentario(Long idUsuario, ComentarioBlogRequest request) {
        ComentarioBlog comentario = toEntity(request);
        comentario.setId(sequenceGeneratorService.generateSequence(SEQUENCE_NAME));
        comentario.setIdUsuario(idUsuario);
        comentario.setFecha(LocalDateTime.now());
        log.info("Creando comentario de blog id={} para blog id={} por usuario id={}",
                comentario.getId(), request.getIdBlog(), idUsuario);
        return toResponse(comentarioBlogRepository.save(comentario));
    }

    public Page<ComentarioBlogResponse> listarComentarios(Pageable pageable) {
        return comentarioBlogRepository.findAll(pageable).map(this::toResponse);
    }

    public ComentarioBlogResponse buscarPorId(Long id) {
        return comentarioBlogRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ComentarioBlogNotFoundException(id));
    }

    public Page<ComentarioBlogResponse> buscarPorBlog(Long idBlog, Pageable pageable) {
        return comentarioBlogRepository.findByIdBlog(idBlog, pageable)
                .map(this::toResponse);
    }

    public Page<ComentarioBlogResponse> buscarPorUsuario(Long idUsuario, Pageable pageable) {
        return comentarioBlogRepository.findByIdUsuario(idUsuario, pageable)
                .map(this::toResponse);
    }

    public ComentarioBlog obtenerEntidad(Long id) {
        return comentarioBlogRepository.findById(id)
                .orElseThrow(() -> new ComentarioBlogNotFoundException(id));
    }

    public ComentarioBlogResponse actualizarComentario(Long id, ComentarioBlogRequest request) {
        ComentarioBlog comentario = comentarioBlogRepository.findById(id)
                .orElseThrow(() -> new ComentarioBlogNotFoundException(id));
        comentario.setTexto(request.getTexto());
        comentario.setCalificacion(request.getCalificacion());
        log.info("Actualizando comentario de blog id={}", id);
        return toResponse(comentarioBlogRepository.save(comentario));
    }

    public void eliminarComentario(Long id) {
        ComentarioBlog comentario = comentarioBlogRepository.findById(id)
                .orElseThrow(() -> new ComentarioBlogNotFoundException(id));
        comentarioBlogRepository.delete(comentario);
        log.info("Comentario de blog id={} eliminado", id);
    }

    // Usado para la eliminación en cascada al eliminar un blog (política de retención de datos)
    public void eliminarPorBlog(Long idBlog) {
        comentarioBlogRepository.deleteByIdBlog(idBlog);
        log.info("Comentarios del blog id={} eliminados en cascada", idBlog);
    }

    private ComentarioBlog toEntity(ComentarioBlogRequest r) {
        ComentarioBlog c = new ComentarioBlog();
        c.setIdBlog(r.getIdBlog());
        c.setNombreUsuario(r.getNombreUsuario());
        c.setTexto(r.getTexto());
        c.setCalificacion(r.getCalificacion());
        return c;
    }

    private ComentarioBlogResponse toResponse(ComentarioBlog c) {
        ComentarioBlogResponse r = new ComentarioBlogResponse();
        r.setId(c.getId());
        r.setIdBlog(c.getIdBlog());
        r.setIdUsuario(c.getIdUsuario());
        r.setNombreUsuario(c.getNombreUsuario());
        r.setTexto(c.getTexto());
        r.setCalificacion(c.getCalificacion());
        r.setFecha(c.getFecha());
        return r;
    }
}
