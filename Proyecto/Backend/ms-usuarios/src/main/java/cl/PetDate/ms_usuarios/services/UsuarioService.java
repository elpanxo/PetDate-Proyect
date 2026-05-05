package cl.PetDate.ms_usuarios.services;

import cl.PetDate.ms_usuarios.models.Usuario;
import cl.PetDate.ms_usuarios.repositories.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    private static final String SEQUENCE_NAME = "usuarios_sequence";

    private final UsuarioRepository usuarioRepository;
    private final SequenceGeneratorService sequenceGeneratorService;

    public UsuarioService(
            UsuarioRepository usuarioRepository,
            SequenceGeneratorService sequenceGeneratorService
    ) {
        this.usuarioRepository = usuarioRepository;
        this.sequenceGeneratorService = sequenceGeneratorService;
    }

    public Usuario crearUsuario(Usuario usuario) {

        // Validar correo duplicado
        if (usuarioRepository.findByCorreo(usuario.getCorreo()).isPresent()) {
            throw new RuntimeException("El correo ya está registrado");
        }

        // Generar ID autoincremental
        usuario.setId(
                sequenceGeneratorService.generateSequence(SEQUENCE_NAME)
        );

        return usuarioRepository.save(usuario);
    }

    public Usuario buscarPorCorreo(String correo) {
        return usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public Usuario buscarPorNombre(String nombre) {
        return usuarioRepository.findByNombre(nombre)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    public Usuario actualizarUsuario(String id, Usuario usuarioActualizado) {

        Usuario usuario = usuarioRepository.findById(Long.valueOf(id))
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setNombre(usuarioActualizado.getNombre());
        usuario.setCorreo(usuarioActualizado.getCorreo());
        usuario.setContrasena(usuarioActualizado.getContrasena());
        usuario.setTelefono(usuarioActualizado.getTelefono());
        usuario.setDireccion(usuarioActualizado.getDireccion());

        return usuarioRepository.save(usuario);
    }

    public Usuario buscarPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public void eliminarUsuario(Long id) {

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuarioRepository.delete(usuario);
    }
}
