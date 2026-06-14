package cl.PetDate.ms_comentarios.repositories;

import cl.PetDate.ms_comentarios.models.ComentarioBlog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ComentarioBlogRepository extends MongoRepository<ComentarioBlog, Long> {
    Page<ComentarioBlog> findByIdBlog(Long idBlog, Pageable pageable);
    Page<ComentarioBlog> findByIdUsuario(Long idUsuario, Pageable pageable);
    void deleteByIdBlog(Long idBlog);
    void deleteByIdUsuario(Long idUsuario);
}
