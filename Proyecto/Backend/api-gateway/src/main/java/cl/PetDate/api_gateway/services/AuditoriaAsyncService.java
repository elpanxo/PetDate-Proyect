package cl.PetDate.api_gateway.services;

import cl.PetDate.api_gateway.models.RegistroAuditoria;
import cl.PetDate.api_gateway.repositories.RegistroAuditoriaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * Persiste los registros de auditoría de forma ASÍNCRONA (en otro hilo), para
 * que la escritura en MongoDB no bloquee ni retrase la respuesta HTTP que recibe
 * el cliente. La auditoría debe ser confiable, pero no debe afectar el rendimiento
 * de las solicitudes normales (login, consultas, etc.).
 */
@Service
public class AuditoriaAsyncService {

    private static final Logger log = LoggerFactory.getLogger(AuditoriaAsyncService.class);

    private final RegistroAuditoriaRepository auditoriaRepository;

    public AuditoriaAsyncService(RegistroAuditoriaRepository auditoriaRepository) {
        this.auditoriaRepository = auditoriaRepository;
    }

    @Async
    public void guardar(RegistroAuditoria registro) {
        try {
            auditoriaRepository.save(registro);
        } catch (Exception e) {
            // La auditoría nunca debe interrumpir el flujo normal de la solicitud
            log.warn("No se pudo registrar el acceso en la auditoría: {}", e.getMessage());
        }
    }
}
