package cl.PetDate.ms_usuarios.repositories;

import cl.PetDate.ms_usuarios.models.Usuario;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UsuarioRepository extends MongoRepository<Usuario,Integer> {

    Optional<Usuario> findByCorreo(String correo);

    Optional<Usuario> findByNombre(String nombre);
}
