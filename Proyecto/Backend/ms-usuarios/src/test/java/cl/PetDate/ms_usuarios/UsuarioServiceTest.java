package cl.PetDate.ms_usuarios;
import cl.PetDate.ms_usuarios.dto.UsuarioRequest;
import cl.PetDate.ms_usuarios.exceptions.CorreoDuplicadoException;
import cl.PetDate.ms_usuarios.exceptions.UsuarioNotFoundException;
import cl.PetDate.ms_usuarios.models.Usuario;
import cl.PetDate.ms_usuarios.repositories.UsuarioRepository;
import cl.PetDate.ms_usuarios.services.SequenceGeneratorService;
import cl.PetDate.ms_usuarios.services.UsuarioService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UsuarioServiceTest {

    @Mock
    UsuarioRepository usuarioRepository;
    @Mock
    SequenceGeneratorService sequenceGeneratorService;
    @Mock
    PasswordEncoder passwordEncoder;
    @InjectMocks
    UsuarioService usuarioService;

    @Test
    void crearUsuario_correoExistente_lanzaExcepcion() {
        UsuarioRequest req = new UsuarioRequest();
        req.setCorreo("test@test.com");

        when(usuarioRepository.findByCorreo("test@test.com"))
                .thenReturn(Optional.of(new Usuario()));

        assertThrows(CorreoDuplicadoException.class,
                () -> usuarioService.crearUsuario(req));
    }

    @Test
    void buscarPorId_noExiste_lanzaExcepcion() {
        when(usuarioRepository.findById(99L))
                .thenReturn(Optional.empty());

        assertThrows(UsuarioNotFoundException.class,
                () -> usuarioService.buscarPorId(99L));
    }
}
