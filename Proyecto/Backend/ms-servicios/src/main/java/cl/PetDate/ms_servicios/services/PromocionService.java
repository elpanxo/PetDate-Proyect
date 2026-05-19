package cl.PetDate.ms_servicios.services;

import cl.PetDate.ms_servicios.dto.PromocionRequest;
import cl.PetDate.ms_servicios.dto.PromocionResponse;
import cl.PetDate.ms_servicios.exceptions.PromocionNotFoundException;
import cl.PetDate.ms_servicios.exceptions.ServicioNotFoundException;
import cl.PetDate.ms_servicios.models.Promocion;
import cl.PetDate.ms_servicios.repositories.PromocionRepository;
import cl.PetDate.ms_servicios.repositories.ServicioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class PromocionService {

    private static final Logger log = LoggerFactory.getLogger(PromocionService.class);
    private static final String SEQUENCE_NAME = "promociones_sequence";

    private final PromocionRepository promocionRepository;
    private final ServicioRepository servicioRepository;
    private final SequenceGeneratorService sequenceGeneratorService;

    public PromocionService(
            PromocionRepository promocionRepository,
            ServicioRepository servicioRepository,
            SequenceGeneratorService sequenceGeneratorService) {
        this.promocionRepository = promocionRepository;
        this.servicioRepository = servicioRepository;
        this.sequenceGeneratorService = sequenceGeneratorService;
    }

    public PromocionResponse crearPromocion(PromocionRequest request) {
        if (servicioRepository.findById(request.getIdServicio()).isEmpty()) {
            throw new ServicioNotFoundException(request.getIdServicio());
        }
        Promocion promocion = toEntity(request);
        promocion.setIdPromocion(sequenceGeneratorService.generateSequence(SEQUENCE_NAME));
        log.info("Creando promocion para servicio id={}", request.getIdServicio());
        return toResponse(promocionRepository.save(promocion));
    }

    public Page<PromocionResponse> listarPromociones(Pageable pageable) {
        return promocionRepository.findAll(pageable).map(this::toResponse);
    }

    public PromocionResponse buscarPorId(Long id) {
        return promocionRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new PromocionNotFoundException(id));
    }

    public Page<PromocionResponse> buscarPorServicio(Long idServicio, Pageable pageable) {
        return promocionRepository.findByIdServicio(idServicio, pageable)
                .map(this::toResponse);
    }

    public PromocionResponse actualizarPromocion(Long id, PromocionRequest request) {
        Promocion promocion = promocionRepository.findById(id)
                .orElseThrow(() -> new PromocionNotFoundException(id));
        promocion.setTitulo(request.getTitulo());
        promocion.setDescripcion(request.getDescripcion());
        promocion.setFechaInicio(request.getFechaInicio());
        promocion.setFechaTermino(request.getFechaTermino());
        log.info("Actualizando promocion id={}", id);
        return toResponse(promocionRepository.save(promocion));
    }

    public void eliminarPromocion(Long id) {
        Promocion promocion = promocionRepository.findById(id)
                .orElseThrow(() -> new PromocionNotFoundException(id));
        promocionRepository.delete(promocion);
        log.info("Promocion id={} eliminada", id);
    }

    private Promocion toEntity(PromocionRequest r) {
        Promocion p = new Promocion();
        p.setIdServicio(r.getIdServicio());
        p.setTitulo(r.getTitulo());
        p.setDescripcion(r.getDescripcion());
        p.setFechaInicio(r.getFechaInicio());
        p.setFechaTermino(r.getFechaTermino());
        return p;
    }

    private PromocionResponse toResponse(Promocion p) {
        PromocionResponse r = new PromocionResponse();
        r.setIdPromocion(p.getIdPromocion());
        r.setIdServicio(p.getIdServicio());
        r.setTitulo(p.getTitulo());
        r.setDescripcion(p.getDescripcion());
        r.setFechaInicio(p.getFechaInicio());
        r.setFechaTermino(p.getFechaTermino());
        return r;
    }
}
