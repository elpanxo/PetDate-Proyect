package cl.PetDate.ms_servicios.repositories;

import cl.PetDate.ms_servicios.models.Servicio;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ServicioRepository extends MongoRepository<Servicio, Long> {
    Optional<Servicio> findByCorreo(String correo);
    Page<Servicio> findByTipoServicio(String tipoServicio, Pageable pageable);
    Page<Servicio> findByComuna(String comuna, Pageable pageable);
}
