package cl.PetDate.api_gateway.filters;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.Order;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Rate limiting / protección contra fuerza bruta en /auth/login.
 *
 * Cuenta los intentos fallidos (401) por dirección IP. Al superar el umbral
 * dentro de la ventana de tiempo, bloquea temporalmente nuevos intentos desde
 * esa IP devolviendo 429 (Too Many Requests) — sin siquiera reenviar la
 * solicitud a ms-usuarios. Un login exitoso (200) reinicia el contador.
 *
 * Corre PRIMERO (@Order(0), antes que JwtHeaderPropagationFilter y
 * AuditoriaFilter) para frenar los intentos abusivos lo antes posible y no
 * sobrecargar el resto de la cadena ni el backend.
 */
@Component
@Order(0)
public class LoginRateLimitFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(LoginRateLimitFilter.class);

    // Tras 5 intentos fallidos seguidos...
    private static final int MAX_INTENTOS_FALLIDOS = 5;
    // ...se bloquea esa IP por 5 minutos
    private static final long DURACION_BLOQUEO_MS = 5 * 60_000L;
    // Entradas sin actividad por más de 30 minutos se eliminan (limpieza de memoria)
    private static final long TIEMPO_INACTIVIDAD_MS = 30 * 60_000L;

    private final Map<String, RegistroIntentos> intentosPorIp = new ConcurrentHashMap<>();

    private static class RegistroIntentos {
        final AtomicInteger fallidos = new AtomicInteger(0);
        volatile long bloqueadoHasta = 0L;
        volatile long ultimaActividad = System.currentTimeMillis();
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                     HttpServletResponse response,
                                     FilterChain filterChain)
            throws ServletException, IOException {

        if (!esIntentoDeLogin(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        String ip = obtenerIp(request);
        RegistroIntentos registro = intentosPorIp.computeIfAbsent(ip, k -> new RegistroIntentos());
        registro.ultimaActividad = System.currentTimeMillis();

        long ahora = System.currentTimeMillis();
        long restante = registro.bloqueadoHasta - ahora;
        if (restante > 0) {
            responderBloqueado(response, restante);
            log.warn("Intento de login bloqueado por rate limiting — IP {} (quedan {}s de bloqueo)",
                    ip, restante / 1000);
            return;
        }

        filterChain.doFilter(request, response);

        int status = response.getStatus();
        if (status == 401) {
            int fallos = registro.fallidos.incrementAndGet();
            if (fallos >= MAX_INTENTOS_FALLIDOS) {
                registro.bloqueadoHasta = System.currentTimeMillis() + DURACION_BLOQUEO_MS;
                registro.fallidos.set(0);
                log.warn("IP {} bloqueada {} minutos por {} intentos fallidos de login consecutivos",
                        ip, DURACION_BLOQUEO_MS / 60_000, MAX_INTENTOS_FALLIDOS);
            }
        } else if (status == 200) {
            registro.fallidos.set(0);
            registro.bloqueadoHasta = 0L;
        }
    }

    private boolean esIntentoDeLogin(HttpServletRequest request) {
        return "POST".equalsIgnoreCase(request.getMethod())
                && "/auth/login".equals(request.getRequestURI());
    }

    private void responderBloqueado(HttpServletResponse response, long restanteMs) throws IOException {
        long segundosRestantes = Math.max(1, restanteMs / 1000);
        response.setStatus(429); // Too Many Requests
        response.setHeader("Retry-After", String.valueOf(segundosRestantes));
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write(String.format(
                "{\"error\":\"Demasiados intentos fallidos de inicio de sesión. " +
                        "Intenta nuevamente en %d segundos.\"}",
                segundosRestantes));
    }

    private String obtenerIp(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-Forwarded-For");
        if (forwardedFor != null && !forwardedFor.isBlank()) {
            return forwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    /**
     * Limpieza periódica: elimina entradas inactivas para que el mapa en
     * memoria no crezca indefinidamente con IPs que ya no vuelven a intentar.
     */
    @Scheduled(fixedRate = 10 * 60_000L) // cada 10 minutos
    public void limpiarRegistrosInactivos() {
        long limite = System.currentTimeMillis() - TIEMPO_INACTIVIDAD_MS;
        int eliminados = 0;
        for (Map.Entry<String, RegistroIntentos> entry : intentosPorIp.entrySet()) {
            if (entry.getValue().ultimaActividad < limite) {
                intentosPorIp.remove(entry.getKey());
                eliminados++;
            }
        }
        if (eliminados > 0) {
            log.debug("Rate limiting: {} registro(s) de IP inactivos eliminados de memoria", eliminados);
        }
    }
}
