package cl.PetDate.api_gateway.controllers;

import cl.PetDate.api_gateway.models.RegistroAuditoria;
import cl.PetDate.api_gateway.repositories.RegistroAuditoriaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

/**
 * Consulta del registro de auditoría de accesos a datos personales (Ley 19.628).
 * Permite rastrear quién accedió a qué dato y cuándo.
 *
 * Solo accesible por ADMIN — protegido en JwtAuthFilter (esRutaAdmin: /auditoria).
 */
@RestController
@RequestMapping("/auditoria")
public class AuditoriaController {

    private final RegistroAuditoriaRepository auditoriaRepository;

    public AuditoriaController(RegistroAuditoriaRepository auditoriaRepository) {
        this.auditoriaRepository = auditoriaRepository;
    }

    // Lista general de accesos, paginada y ordenada por fecha descendente
    @GetMapping
    public Page<RegistroAuditoria> listar(
            @PageableDefault(size = 20, sort = "fechaHora", direction = Sort.Direction.DESC) Pageable pageable) {
        return auditoriaRepository.findAll(pageable);
    }

    // Accesos realizados POR un usuario específico (para responder "¿qué hizo este usuario?")
    @GetMapping("/usuario/{usuarioId}")
    public Page<RegistroAuditoria> porUsuario(
            @PathVariable Long usuarioId,
            @RequestParam(required = false) String desde,
            @RequestParam(required = false) String hasta,
            @PageableDefault(size = 20, sort = "fechaHora", direction = Sort.Direction.DESC) Pageable pageable) {

        if (desde != null && hasta != null) {
            return auditoriaRepository.findByUsuarioIdAndFechaHoraBetween(
                    usuarioId, LocalDateTime.parse(desde), LocalDateTime.parse(hasta), pageable);
        }
        return auditoriaRepository.findByUsuarioId(usuarioId, pageable);
    }

    // Accesos a un tipo de recurso específico (usuarios, mascotas, citas, servicios, promociones...)
    @GetMapping("/recurso/{recurso}")
    public Page<RegistroAuditoria> porRecurso(
            @PathVariable String recurso,
            @PageableDefault(size = 20, sort = "fechaHora", direction = Sort.Direction.DESC) Pageable pageable) {
        return auditoriaRepository.findByRecurso(recurso, pageable);
    }

    // Accesos dentro de un rango de fechas (para auditorías o requerimientos de un titular de datos)
    @GetMapping("/rango")
    public Page<RegistroAuditoria> porRangoDeFechas(
            @RequestParam String desde,
            @RequestParam String hasta,
            @PageableDefault(size = 20, sort = "fechaHora", direction = Sort.Direction.DESC) Pageable pageable) {
        return auditoriaRepository.findByFechaHoraBetween(
                LocalDateTime.parse(desde), LocalDateTime.parse(hasta), pageable);
    }
}
