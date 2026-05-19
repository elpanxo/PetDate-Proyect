package cl.PetDate.ms_servicios.repositories;

import cl.PetDate.ms_servicios.models.Promocion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PromocionRepository extends MongoRepository<Promocion, Long> {
    Page<Promocion> findByIdServicio(Long idServicio, Pageable pageable);
}
