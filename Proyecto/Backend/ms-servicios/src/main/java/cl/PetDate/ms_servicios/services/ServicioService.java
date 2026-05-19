package cl.PetDate.ms_servicios.services;

import cl.PetDate.ms_servicios.dto.ServicioRequest;
import cl.PetDate.ms_servicios.dto.ServicioResponse;
import cl.PetDate.ms_servicios.exceptions.CorreoDuplicadoException;
import cl.PetDate.ms_servicios.exceptions.ServicioNotFoundException;
import cl.PetDate.ms_servicios.models.Servicio;
import cl.PetDate.ms_servicios.repositories.ServicioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class ServicioService {

    private static final Logger log = LoggerFactory.getLogger(ServicioService.class);
    private static final String SEQUENCE_NAME = "servicios_sequence";

    private final ServicioRepository servicioRepository;
    private final SequenceGeneratorService sequenceGeneratorService;
    private final PasswordEncoder passwordEncoder;

    public ServicioService(
            ServicioRepository servicioRepository,
            SequenceGeneratorService sequenceGeneratorService,
            PasswordEncoder passwordEncoder) {
        this.servicioRepository = servicioRepository;
        this.sequenceGeneratorService = sequenceGeneratorService;
        this.passwordEncoder = passwordEncoder;
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
        return r;
    }
}
