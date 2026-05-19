package cl.PetDate.ms_citas_medicas.repositories;

import cl.PetDate.ms_citas_medicas.models.CitaMedica;
import cl.PetDate.ms_citas_medicas.models.EstadoEvento;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CitaMedicaRepository extends MongoRepository<CitaMedica, Long> {
    Page<CitaMedica> findByIdUsuario(Long idUsuario, Pageable pageable);
    Page<CitaMedica> findByIdMascota(Long idMascota, Pageable pageable);
    Page<CitaMedica> findByEstado(EstadoEvento estado, Pageable pageable);
    Page<CitaMedica> findByIdUsuarioAndEstado(Long idUsuario, EstadoEvento estado, Pageable pageable);
}
