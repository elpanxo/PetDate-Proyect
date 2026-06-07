package cl.PetDate.api_gateway.repositories;

import cl.PetDate.api_gateway.models.RegistroAuditoria;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;

public interface RegistroAuditoriaRepository extends MongoRepository<RegistroAuditoria, String> {

    Page<RegistroAuditoria> findByUsuarioId(Long usuarioId, Pageable pageable);

    Page<RegistroAuditoria> findByRecurso(String recurso, Pageable pageable);

    Page<RegistroAuditoria> findByUsuarioIdAndFechaHoraBetween(
            Long usuarioId, LocalDateTime desde, LocalDateTime hasta, Pageable pageable);

    Page<RegistroAuditoria> findByFechaHoraBetween(
            LocalDateTime desde, LocalDateTime hasta, Pageable pageable);
}
