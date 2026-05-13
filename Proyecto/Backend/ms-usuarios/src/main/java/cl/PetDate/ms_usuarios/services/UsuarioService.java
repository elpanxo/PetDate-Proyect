package cl.PetDate.ms_usuarios.services;

import cl.PetDate.ms_usuarios.dto.UsuarioRequest;
import cl.PetDate.ms_usuarios.dto.UsuarioResponse;
import cl.PetDate.ms_usuarios.exceptions.CorreoDuplicadoException;
import cl.PetDate.ms_usuarios.exceptions.UsuarioNotFoundException;
import cl.PetDate.ms_usuarios.models.Usuario;
import cl.PetDate.ms_usuarios.repositories.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    private static final String SEQUENCE_NAME = "usuarios_sequence";

    private final UsuarioRepository usuarioRepository;
    private final SequenceGeneratorService sequenceGeneratorService;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(
            UsuarioRepository usuarioRepository,
            SequenceGeneratorService sequenceGeneratorService,
            PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.sequenceGeneratorService = sequenceGeneratorService;
        this.passwordEncoder = passwordEncoder;
    }

    public UsuarioResponse crearUsuario(UsuarioRequest request) {
        if (usuarioRepository.findByCorreo(request.getCorreo()).isPresent()) {
            throw new CorreoDuplicadoException(request.getCorreo());
        }
        Usuario usuario = toEntity(request);
        usuario.setId(sequenceGeneratorService.generateSequence(SEQUENCE_NAME));
        usuario.setContrasena(passwordEncoder.encode(request.getContrasena()));
        return toResponse(usuarioRepository.save(usuario));
    }

    public List<UsuarioResponse> listarUsuarios() {
        return usuarioRepository.findAll()
                .stream().map(this::toResponse).toList();
    }

    public UsuarioResponse buscarPorId(Long id) {
        return usuarioRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new UsuarioNotFoundException(id));
    }

    public UsuarioResponse buscarPorCorreo(String correo) {
        return usuarioRepository.findByCorreo(correo)
                .map(this::toResponse)
                .orElseThrow(() -> new UsuarioNotFoundException("correo", correo));
    }

    public UsuarioResponse actualizarUsuario(Long id, UsuarioRequest request) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new UsuarioNotFoundException(id));
        usuario.setNombre(request.getNombre());
        usuario.setCorreo(request.getCorreo());
        usuario.setContrasena(passwordEncoder.encode(request.getContrasena()));
        usuario.setTelefono(request.getTelefono());
        usuario.setDireccion(request.getDireccion());
        return toResponse(usuarioRepository.save(usuario));
    }

    public void eliminarUsuario(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new UsuarioNotFoundException(id));
        usuarioRepository.delete(usuario);
    }

    private Usuario toEntity(UsuarioRequest r) {
        Usuario u = new Usuario();
        u.setNombre(r.getNombre());
        u.setCorreo(r.getCorreo());
        u.setContrasena(r.getContrasena());
        u.setTelefono(r.getTelefono());
        u.setDireccion(r.getDireccion());
        return u;
    }

    private UsuarioResponse toResponse(Usuario u) {
        UsuarioResponse r = new UsuarioResponse();
        r.setId(u.getId());
        r.setNombre(u.getNombre());
        r.setCorreo(u.getCorreo());
        r.setTelefono(u.getTelefono());
        r.setDireccion(u.getDireccion());
        r.setFechaRegistro(u.getFechaRegistro());
        return r;
    }
}
