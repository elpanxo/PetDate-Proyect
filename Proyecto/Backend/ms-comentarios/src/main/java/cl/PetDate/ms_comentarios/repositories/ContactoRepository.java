package cl.PetDate.ms_comentarios.repositories;

import cl.PetDate.ms_comentarios.models.Contacto;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ContactoRepository extends MongoRepository<Contacto, String> {
}
