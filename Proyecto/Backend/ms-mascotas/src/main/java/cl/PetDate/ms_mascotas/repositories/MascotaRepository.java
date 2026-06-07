package cl.PetDate.ms_mascotas.repositories;

import cl.PetDate.ms_mascotas.models.Mascota;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MascotaRepository extends MongoRepository<Mascota, Long> {

    List<Mascota> findByUsuarioId(Long usuarioId);

    Page<Mascota> findByUsuarioId(Long usuarioId, Pageable pageable);

    // Usado para la eliminación en cascada (política de retención de datos)
    void deleteByUsuarioId(Long usuarioId);
}
