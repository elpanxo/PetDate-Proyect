package cl.PetDate.ms_usuarios.services;

import cl.PetDate.ms_usuarios.dto.UsuarioRequest;
import cl.PetDate.ms_usuarios.dto.UsuarioResponse;
import cl.PetDate.ms_usuarios.exceptions.CorreoDuplicadoException;
import cl.PetDate.ms_usuarios.exceptions.UsuarioNotFoundException;
import cl.PetDate.ms_usuarios.models.Usuario;
import cl.PetDate.ms_usuarios.repositories.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Tests unitarios - UsuarioService")
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private SequenceGeneratorService sequenceGeneratorService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UsuarioService usuarioService;

    // ── Datos de prueba reutilizables ──
    private UsuarioRequest requestValido;
    private Usuario usuarioGuardado;

    @BeforeEach
    void setUp() {
        requestValido = new UsuarioRequest();
        requestValido.setNombre("Juan Pérez");
        requestValido.setCorreo("juan@mail.com");
        requestValido.setContrasena("password123");
        requestValido.setTelefono("912345678");
        requestValido.setDireccion("Av. Siempre Viva 123");

        usuarioGuardado = new Usuario();
        usuarioGuardado.setId(1L);
        usuarioGuardado.setNombre("Juan Pérez");
        usuarioGuardado.setCorreo("juan@mail.com");
        usuarioGuardado.setContrasena("$2a$hashed");
        usuarioGuardado.setTelefono("912345678");
        usuarioGuardado.setDireccion("Av. Siempre Viva 123");
        usuarioGuardado.setFechaRegistro(LocalDateTime.now());
    }

    // ─────────────────────────────────────────────
    // crearUsuario
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("crearUsuario - debe crear y retornar el usuario correctamente")
    void crearUsuario_exitoso() {
        when(usuarioRepository.findByCorreo("juan@mail.com")).thenReturn(Optional.empty());
        when(sequenceGeneratorService.generateSequence(anyString())).thenReturn(1L);
        when(passwordEncoder.encode("password123")).thenReturn("$2a$hashed");
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuarioGuardado);

        UsuarioResponse response = usuarioService.crearUsuario(requestValido);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getNombre()).isEqualTo("Juan Pérez");
        assertThat(response.getCorreo()).isEqualTo("juan@mail.com");
        assertThat(response.getTelefono()).isEqualTo("912345678");

        verify(usuarioRepository).save(any(Usuario.class));
        verify(passwordEncoder).encode("password123");
    }

    @Test
    @DisplayName("crearUsuario - debe lanzar CorreoDuplicadoException si el correo ya existe")
    void crearUsuario_correoYaExiste() {
        when(usuarioRepository.findByCorreo("juan@mail.com"))
                .thenReturn(Optional.of(usuarioGuardado));

        assertThatThrownBy(() -> usuarioService.crearUsuario(requestValido))
                .isInstanceOf(CorreoDuplicadoException.class);

        verify(usuarioRepository, never()).save(any());
    }

    @Test
    @DisplayName("crearUsuario - la contraseña debe quedar encriptada")
    void crearUsuario_contrasenaEncriptada() {
        when(usuarioRepository.findByCorreo(anyString())).thenReturn(Optional.empty());
        when(sequenceGeneratorService.generateSequence(anyString())).thenReturn(1L);
        when(passwordEncoder.encode("password123")).thenReturn("$2a$hashed");
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuarioGuardado);

        usuarioService.crearUsuario(requestValido);

        verify(passwordEncoder).encode("password123");
        // Verificar que nunca se guarda la contraseña en texto plano
        verify(usuarioRepository).save(argThat(u ->
                !u.getContrasena().equals("password123")
        ));
    }

    // ─────────────────────────────────────────────
    // listarUsuarios
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("listarUsuarios - debe retornar lista de usuarios")
    void listarUsuarios_retornaLista() {
        Usuario segundo = new Usuario();
        segundo.setId(2L);
        segundo.setNombre("María López");
        segundo.setCorreo("maria@mail.com");
        segundo.setFechaRegistro(LocalDateTime.now());

        when(usuarioRepository.findAll()).thenReturn(List.of(usuarioGuardado, segundo));

        List<UsuarioResponse> resultado = usuarioService.listarUsuarios();

        assertThat(resultado).hasSize(2);
        assertThat(resultado.get(0).getNombre()).isEqualTo("Juan Pérez");
        assertThat(resultado.get(1).getNombre()).isEqualTo("María López");
    }

    @Test
    @DisplayName("listarUsuarios - debe retornar lista vacía si no hay usuarios")
    void listarUsuarios_listaVacia() {
        when(usuarioRepository.findAll()).thenReturn(List.of());

        List<UsuarioResponse> resultado = usuarioService.listarUsuarios();

        assertThat(resultado).isEmpty();
    }

    // ─────────────────────────────────────────────
    // buscarPorId
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("buscarPorId - debe retornar el usuario si existe")
    void buscarPorId_usuarioExiste() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuarioGuardado));

        UsuarioResponse response = usuarioService.buscarPorId(1L);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getCorreo()).isEqualTo("juan@mail.com");
    }

    @Test
    @DisplayName("buscarPorId - debe lanzar UsuarioNotFoundException si no existe")
    void buscarPorId_usuarioNoExiste() {
        when(usuarioRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> usuarioService.buscarPorId(99L))
                .isInstanceOf(UsuarioNotFoundException.class);
    }

    // ─────────────────────────────────────────────
    // buscarPorCorreo
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("buscarPorCorreo - debe retornar el usuario si existe")
    void buscarPorCorreo_usuarioExiste() {
        when(usuarioRepository.findByCorreo("juan@mail.com"))
                .thenReturn(Optional.of(usuarioGuardado));

        UsuarioResponse response = usuarioService.buscarPorCorreo("juan@mail.com");

        assertThat(response).isNotNull();
        assertThat(response.getCorreo()).isEqualTo("juan@mail.com");
    }

    @Test
    @DisplayName("buscarPorCorreo - debe lanzar UsuarioNotFoundException si no existe")
    void buscarPorCorreo_usuarioNoExiste() {
        when(usuarioRepository.findByCorreo("noexiste@mail.com"))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> usuarioService.buscarPorCorreo("noexiste@mail.com"))
                .isInstanceOf(UsuarioNotFoundException.class);
    }

    // ─────────────────────────────────────────────
    // actualizarUsuario
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("actualizarUsuario - debe actualizar y retornar el usuario")
    void actualizarUsuario_exitoso() {
        UsuarioRequest requestActualizado = new UsuarioRequest();
        requestActualizado.setNombre("Juan Actualizado");
        requestActualizado.setCorreo("juan_nuevo@mail.com");
        requestActualizado.setContrasena("nuevaPass123");
        requestActualizado.setTelefono("987654321");
        requestActualizado.setDireccion("Nueva dirección 456");

        Usuario usuarioActualizado = new Usuario();
        usuarioActualizado.setId(1L);
        usuarioActualizado.setNombre("Juan Actualizado");
        usuarioActualizado.setCorreo("juan_nuevo@mail.com");
        usuarioActualizado.setContrasena("$2a$nuevo_hash");
        usuarioActualizado.setFechaRegistro(LocalDateTime.now());

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuarioGuardado));
        when(passwordEncoder.encode("nuevaPass123")).thenReturn("$2a$nuevo_hash");
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuarioActualizado);

        UsuarioResponse response = usuarioService.actualizarUsuario(1L, requestActualizado);

        assertThat(response.getNombre()).isEqualTo("Juan Actualizado");
        assertThat(response.getCorreo()).isEqualTo("juan_nuevo@mail.com");
        verify(usuarioRepository).save(any(Usuario.class));
    }

    @Test
    @DisplayName("actualizarUsuario - debe lanzar UsuarioNotFoundException si no existe")
    void actualizarUsuario_usuarioNoExiste() {
        when(usuarioRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> usuarioService.actualizarUsuario(99L, requestValido))
                .isInstanceOf(UsuarioNotFoundException.class);

        verify(usuarioRepository, never()).save(any());
    }

    // ─────────────────────────────────────────────
    // eliminarUsuario
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("eliminarUsuario - debe eliminar el usuario si existe")
    void eliminarUsuario_exitoso() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuarioGuardado));

        usuarioService.eliminarUsuario(1L);

        verify(usuarioRepository).delete(usuarioGuardado);
    }

    @Test
    @DisplayName("eliminarUsuario - debe lanzar UsuarioNotFoundException si no existe")
    void eliminarUsuario_usuarioNoExiste() {
        when(usuarioRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> usuarioService.eliminarUsuario(99L))
                .isInstanceOf(UsuarioNotFoundException.class);

        verify(usuarioRepository, never()).delete(any());
    }
}
