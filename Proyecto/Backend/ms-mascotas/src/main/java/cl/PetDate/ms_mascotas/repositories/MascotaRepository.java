package cl.PetDate.ms_mascotas.repositories;

import cl.PetDate.ms_mascotas.models.Mascota;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MascotaRepository extends MongoRepository<Mascota, Long> {

    List<Mascota> findByUsuarioId(Long usuarioId);
}
