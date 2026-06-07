package cl.PetDate.ms_comentarios.repositories;

import cl.PetDate.ms_comentarios.models.ComentarioServicio;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ComentarioServicioRepository extends MongoRepository<ComentarioServicio, Long> {
    Page<ComentarioServicio> findByIdServicio(Long idServicio, Pageable pageable);
    Page<ComentarioServicio> findByIdUsuario(Long idUsuario, Pageable pageable);
    void deleteByIdServicio(Long idServicio);
}
