package cl.PetDate.ms_usuarios.services;

import cl.PetDate.ms_usuarios.clients.CitaMedicaClient;
import cl.PetDate.ms_usuarios.clients.ComentarioClient;
import cl.PetDate.ms_usuarios.clients.MascotaClient;
import cl.PetDate.ms_usuarios.dto.UsuarioRequest;
import cl.PetDate.ms_usuarios.dto.UsuarioResponse;
import cl.PetDate.ms_usuarios.exceptions.ConsentimientoRequeridoException;
import cl.PetDate.ms_usuarios.exceptions.CorreoDuplicadoException;
import cl.PetDate.ms_usuarios.exceptions.UsuarioNotFoundException;
import cl.PetDate.ms_usuarios.models.Rol;
import cl.PetDate.ms_usuarios.models.Usuario;
import cl.PetDate.ms_usuarios.repositories.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class UsuarioService {

    private static final Logger log = LoggerFactory.getLogger(UsuarioService.class);
    private static final String SEQUENCE_NAME = "usuarios_sequence";

    private final UsuarioRepository usuarioRepository;
    private final SequenceGeneratorService sequenceGeneratorService;
    private final PasswordEncoder passwordEncoder;
    private final MascotaClient mascotaClient;
    private final CitaMedicaClient citaMedicaClient;
    private final ComentarioClient comentarioClient;

    public UsuarioService(
            UsuarioRepository usuarioRepository,
            SequenceGeneratorService sequenceGeneratorService,
            PasswordEncoder passwordEncoder,
            MascotaClient mascotaClient,
            CitaMedicaClient citaMedicaClient,
            ComentarioClient comentarioClient) {
        this.usuarioRepository = usuarioRepository;
        this.sequenceGeneratorService = sequenceGeneratorService;
        this.passwordEncoder = passwordEncoder;
        this.mascotaClient = mascotaClient;
        this.citaMedicaClient = citaMedicaClient;
        this.comentarioClient = comentarioClient;
    }

    public UsuarioResponse crearUsuario(UsuarioRequest request) {
        // Consentimiento informado (Ley 19.628): el tratamiento de datos
        // personales requiere aceptación previa, libre, informada y expresa
        // del titular. Sin esto, no se permite crear la cuenta.
        if (request.getConsentimientoInformado() == null || !request.getConsentimientoInformado()) {
            throw new ConsentimientoRequeridoException();
        }
        if (usuarioRepository.findByCorreo(request.getCorreo()).isPresent()) {
            throw new CorreoDuplicadoException(request.getCorreo());
        }
        Usuario usuario = toEntity(request);
        usuario.setId(sequenceGeneratorService.generateSequence(SEQUENCE_NAME));
        usuario.setContrasena(passwordEncoder.encode(request.getContrasena()));
        usuario.setRol(Rol.USER); // siempre USER al registrarse
        usuario.setConsentimientoInformado(true);
        usuario.setFechaConsentimiento(LocalDateTime.now());
        log.info("Consentimiento informado registrado para el nuevo usuario (correo={})", request.getCorreo());
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

    // Solo para uso interno entre microservicios — no exponer en controller público
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

        // Borrado en cascada (política de retención y eliminación de datos):
        // se notifica a ms-mascotas y ms-citas-medicas en paralelo (sin encadenar llamadas)
        // para que eliminen toda la información asociada a este usuario.
        try {
            mascotaClient.eliminarMascotasPorUsuario(id);
            log.info("Mascotas del usuario id={} eliminadas en cascada", id);
        } catch (Exception e) {
            log.error("Fallo cascada mascotas para usuario id={}: {}", id, e.getMessage(), e);
        }
        try {
            citaMedicaClient.eliminarCitasPorUsuario(id);
            log.info("Citas del usuario id={} eliminadas en cascada", id);
        } catch (Exception e) {
            log.error("Fallo cascada citas para usuario id={}: {}", id, e.getMessage(), e);
        }
        try {
            comentarioClient.eliminarComentariosBlogPorUsuario(id);
            log.info("Comentarios de blog del usuario id={} eliminados en cascada", id);
        } catch (Exception e) {
            log.error("Fallo cascada comentarios-blog para usuario id={}: {}", id, e.getMessage(), e);
        }
        try {
            comentarioClient.eliminarComentariosServicioPorUsuario(id);
            log.info("Comentarios de servicio del usuario id={} eliminados en cascada", id);
        } catch (Exception e) {
            log.error("Fallo cascada comentarios-servicio para usuario id={}: {}", id, e.getMessage(), e);
        }
    }

    public UsuarioResponse subirImagen(Long id, MultipartFile imagen) throws IOException {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new UsuarioNotFoundException(id));

        String uploadDir = "/app/uploads/usuarios/";
        Path dirPath = Paths.get(uploadDir);
        if (!Files.exists(dirPath)) {
            Files.createDirectories(dirPath);
        }

        String extension = StringUtils.getFilenameExtension(imagen.getOriginalFilename());
        String nombreArchivo = "usuario_" + id + "_" + System.currentTimeMillis() + "." + extension;
        Path rutaArchivo = dirPath.resolve(nombreArchivo);

        if (usuario.getImagen() != null) {
            Path anterior = Paths.get("/app/uploads/usuarios/",
                    usuario.getImagen().replace("/uploads/usuarios/", ""));
            Files.deleteIfExists(anterior);
        }

        Files.copy(imagen.getInputStream(), rutaArchivo, StandardCopyOption.REPLACE_EXISTING);

        usuario.setImagen("/uploads/usuarios/" + nombreArchivo);
        return toResponse(usuarioRepository.save(usuario));
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
        r.setImagen(u.getImagen());
        r.setFechaRegistro(u.getFechaRegistro());
        r.setRol(u.getRol());
        r.setConsentimientoInformado(u.getConsentimientoInformado());
        r.setFechaConsentimiento(u.getFechaConsentimiento());
        return r;
    }
}
