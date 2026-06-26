package cl.PetDate.api_gateway.filters;

import cl.PetDate.api_gateway.models.RegistroAuditoria;
import cl.PetDate.api_gateway.services.AuditoriaAsyncService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Set;

/**
 * Filtro de auditoría de accesos a datos personales (Ley 19.628 — derecho a la
 * trazabilidad: poder rastrear quién accedió a qué dato y cuándo).
 *
 * Registra en MongoDB (colección auditoria_accesos) cada solicitud a recursos
 * que contienen datos personales: quién (usuarioId/rol del token), qué (ruta,
 * recurso, id del recurso), cuándo (fecha y hora) y el resultado (status HTTP,
 * EXITOSO/DENEGADO/ERROR), además de la IP de origen.
 *
 * Corre DESPUÉS de JwtHeaderPropagationFilter (@Order(1)) para poder leer los
 * headers X-Usuario-Id / X-Usuario-Rol ya propagados desde el JWT.
 */
@Component
@Order(2)
public class AuditoriaFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(AuditoriaFilter.class);

    // Recursos que contienen datos personales y deben quedar auditados
    private static final Set<String> RECURSOS_AUDITABLES = Set.of(
            "usuarios", "mascotas", "citas", "servicios", "promociones", "auth", "uploads",
            "blogs", "comentarios"
    );

    private final AuditoriaAsyncService auditoriaAsyncService;

    public AuditoriaFilter(AuditoriaAsyncService auditoriaAsyncService) {
        this.auditoriaAsyncService = auditoriaAsyncService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {
        try {
            filterChain.doFilter(request, response);
        } finally {
            try {
                registrarAcceso(request, response);
            } catch (Exception e) {
                // La auditoría nunca debe interrumpir el flujo normal de la solicitud
                log.warn("No se pudo preparar el registro de auditoría: {}", e.getMessage());
            }
        }
    }

    private void registrarAcceso(HttpServletRequest request, HttpServletResponse response) {
        String path = request.getRequestURI();
        String recurso = extraerRecurso(path);

        if (recurso == null || !RECURSOS_AUDITABLES.contains(recurso)) {
            return; // No es un recurso con datos personales — no se audita (evita ruido innecesario)
        }
        // El tráfico interno entre microservicios ya está bloqueado en el gateway; no se audita
        if (path.contains("/interno/")) {
            return;
        }

        RegistroAuditoria registro = new RegistroAuditoria();

        String usuarioIdHeader = request.getHeader("X-Usuario-Id");
        String rol = request.getHeader("X-Usuario-Rol");
        if (usuarioIdHeader != null) {
            try {
                registro.setUsuarioId(Long.valueOf(usuarioIdHeader));
            } catch (NumberFormatException ignored) {
                // header no numérico — se deja sin usuarioId
            }
        }
        registro.setRol(rol != null ? rol : "ANONIMO");

        registro.setMetodo(request.getMethod());
        registro.setRuta(path);
        registro.setRecurso(recurso);
        registro.setRecursoId(extraerRecursoId(path));

        int status = response.getStatus();
        registro.setStatus(status);
        registro.setResultado(clasificarResultado(status));

        registro.setDireccionIp(obtenerIp(request));
        registro.setFechaHora(LocalDateTime.now());

        // Guardado asíncrono: no bloquea ni retrasa la respuesta al cliente
        auditoriaAsyncService.guardar(registro);
    }

    private String extraerRecurso(String path) {
        if (path == null || path.isBlank()) {
            return null;
        }
        for (String parte : path.split("/")) {
            if (!parte.isBlank()) {
                return parte.toLowerCase();
            }
        }
        return null;
    }

    private String extraerRecursoId(String path) {
        for (String parte : path.split("/")) {
            if (parte.matches("\\d+")) {
                return parte;
            }
        }
        return null;
    }

    private String clasificarResultado(int status) {
        if (status == 401 || status == 403) {
            return "DENEGADO";
        }
        if (status >= 200 && status < 400) {
            return "EXITOSO";
        }
        return "ERROR";
    }

    private String obtenerIp(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-Forwarded-For");
        if (forwardedFor != null && !forwardedFor.isBlank()) {
            return forwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
