package cl.PetDate.ms_usuarios.repositories;

import cl.PetDate.ms_usuarios.models.PasswordResetToken;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository extends MongoRepository<PasswordResetToken, String> {

    Optional<PasswordResetToken> findByCorreoAndCodigoAndUsadoFalse(String correo, String codigo);

    void deleteByCorreo(String correo);
}
