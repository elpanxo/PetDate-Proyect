package cl.PetDate.ms_servicios.services;

import cl.PetDate.ms_servicios.dto.ServicioRequest;
import cl.PetDate.ms_servicios.dto.ServicioResponse;
import cl.PetDate.ms_servicios.exceptions.CorreoDuplicadoException;
import cl.PetDate.ms_servicios.exceptions.ServicioNotFoundException;
import cl.PetDate.ms_servicios.models.Servicio;
import cl.PetDate.ms_servicios.repositories.BlogRepository;
import cl.PetDate.ms_servicios.repositories.PromocionRepository;
import cl.PetDate.ms_servicios.repositories.ServicioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class ServicioService {

    private static final Logger log = LoggerFactory.getLogger(ServicioService.class);
    private static final String SEQUENCE_NAME = "servicios_sequence";

    private final ServicioRepository servicioRepository;
    private final SequenceGeneratorService sequenceGeneratorService;
    private final PasswordEncoder passwordEncoder;
    private final PromocionRepository promocionRepository;
    private final BlogRepository blogRepository;

    public ServicioService(
            ServicioRepository servicioRepository,
            SequenceGeneratorService sequenceGeneratorService,
            PasswordEncoder passwordEncoder,
            PromocionRepository promocionRepository,
            BlogRepository blogRepository) {
        this.servicioRepository = servicioRepository;
        this.sequenceGeneratorService = sequenceGeneratorService;
        this.passwordEncoder = passwordEncoder;
        this.promocionRepository = promocionRepository;
        this.blogRepository = blogRepository;
    }

    public ServicioResponse crearServicio(ServicioRequest request) {
        if (servicioRepository.findByCorreo(request.getCorreo()).isPresent()) {
            throw new CorreoDuplicadoException(request.getCorreo());
        }
        Servicio servicio = toEntity(request);
        servicio.setIdServicio(sequenceGeneratorService.generateSequence(SEQUENCE_NAME));
        servicio.setContrasena(passwordEncoder.encode(request.getContrasena()));
        log.info("Creando servicio: {}", request.getNombreServicio());
        return toResponse(servicioRepository.save(servicio));
    }

    public Page<ServicioResponse> listarServicios(Pageable pageable) {
        return servicioRepository.findAll(pageable).map(this::toResponse);
    }

    public ServicioResponse buscarPorId(Long id) {
        return servicioRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ServicioNotFoundException(id));
    }

    public Page<ServicioResponse> buscarPorTipo(String tipoServicio, Pageable pageable) {
        return servicioRepository.findByTipoServicio(tipoServicio, pageable)
                .map(this::toResponse);
    }

    public Page<ServicioResponse> buscarPorComuna(String comuna, Pageable pageable) {
        return servicioRepository.findByComuna(comuna, pageable)
                .map(this::toResponse);
    }

    public ServicioResponse actualizarServicio(Long id, ServicioRequest request) {
        Servicio servicio = servicioRepository.findById(id)
                .orElseThrow(() -> new ServicioNotFoundException(id));
        servicio.setNombreServicio(request.getNombreServicio());
        servicio.setTipoServicio(request.getTipoServicio());
        servicio.setRutEmpresa(request.getRutEmpresa());
        servicio.setCorreo(request.getCorreo());
        servicio.setContrasena(passwordEncoder.encode(request.getContrasena()));
        servicio.setDescripcion(request.getDescripcion());
        servicio.setDireccion(request.getDireccion());
        servicio.setComuna(request.getComuna());
        servicio.setHorario(request.getHorario());
        servicio.setTelefono(request.getTelefono());
        servicio.setWhatsApp(request.getWhatsApp());
        servicio.setSitioWeb(request.getSitioWeb());
        servicio.setInstagram(request.getInstagram());
        servicio.setFacebook(request.getFacebook());
        log.info("Actualizando servicio id={}", id);
        return toResponse(servicioRepository.save(servicio));
    }

    public void eliminarServicio(Long id) {
        Servicio servicio = servicioRepository.findById(id)
                .orElseThrow(() -> new ServicioNotFoundException(id));
        servicioRepository.delete(servicio);
        log.info("Servicio id={} eliminado", id);

        // Borrado en cascada (política de retención y eliminación de datos):
        // las promociones viven en la misma base de datos, por lo que se eliminan directamente (sin Feign)
        promocionRepository.deleteByIdServicio(id);
        log.info("Promociones del servicio id={} eliminadas en cascada", id);

        blogRepository.deleteByIdServicio(id);
        log.info("Blogs del servicio id={} eliminados en cascada", id);
    }

    public ServicioResponse subirImagen(Long id, MultipartFile imagen) throws IOException {
        Servicio servicio = servicioRepository.findById(id)
                .orElseThrow(() -> new ServicioNotFoundException(id));

        // Crea el directorio si no existe (volumen compartido del servidor de imagenes)
        String uploadDir = "/app/uploads/servicios/";
        Path dirPath = Paths.get(uploadDir);
        if (!Files.exists(dirPath)) {
            Files.createDirectories(dirPath);
        }

        // Nombre unico para evitar colisiones
        String extension = StringUtils.getFilenameExtension(imagen.getOriginalFilename());
        String nombreArchivo = "servicio_" + id + "_" + System.currentTimeMillis() + "." + extension;
        Path rutaArchivo = dirPath.resolve(nombreArchivo);

        // Eliminar imagen anterior si existe
        if (servicio.getImagenUrl() != null) {
            Path anterior = Paths.get("/app/uploads/servicios/",
                    servicio.getImagenUrl().replace("/uploads/servicios/", ""));
            Files.deleteIfExists(anterior);
        }

        // Guardar el archivo en el volumen compartido
        Files.copy(imagen.getInputStream(), rutaArchivo, StandardCopyOption.REPLACE_EXISTING);

        // Guardar solo la URL relativa (servida por el servidor de imagenes via gateway)
        servicio.setImagenUrl("/uploads/servicios/" + nombreArchivo);
        log.info("Imagen actualizada para servicio id={}", id);
        return toResponse(servicioRepository.save(servicio));
    }

    private Servicio toEntity(ServicioRequest r) {
        Servicio s = new Servicio();
        s.setNombreServicio(r.getNombreServicio());
        s.setTipoServicio(r.getTipoServicio());
        s.setRutEmpresa(r.getRutEmpresa());
        s.setCorreo(r.getCorreo());
        s.setContrasena(r.getContrasena());
        s.setDescripcion(r.getDescripcion());
        s.setDireccion(r.getDireccion());
        s.setComuna(r.getComuna());
        s.setHorario(r.getHorario());
        s.setTelefono(r.getTelefono());
        s.setWhatsApp(r.getWhatsApp());
        s.setSitioWeb(r.getSitioWeb());
        s.setInstagram(r.getInstagram());
        s.setFacebook(r.getFacebook());
        return s;
    }

    private ServicioResponse toResponse(Servicio s) {
        ServicioResponse r = new ServicioResponse();
        r.setIdServicio(s.getIdServicio());
        r.setNombreServicio(s.getNombreServicio());
        r.setTipoServicio(s.getTipoServicio());
        r.setRutEmpresa(s.getRutEmpresa());
        r.setCorreo(s.getCorreo());
        r.setDescripcion(s.getDescripcion());
        r.setDireccion(s.getDireccion());
        r.setComuna(s.getComuna());
        r.setHorario(s.getHorario());
        r.setTelefono(s.getTelefono());
        r.setWhatsApp(s.getWhatsApp());
        r.setSitioWeb(s.getSitioWeb());
        r.setInstagram(s.getInstagram());
        r.setFacebook(s.getFacebook());
        r.setImagenUrl(s.getImagenUrl());
        return r;
    }
}
