package cl.PetDate.api_gateway.filters;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * Filtro que extrae las claims del JWT (id, rol) y las propaga
 * como headers X-Usuario-Id y X-Usuario-Rol hacia los microservicios.
 *
 * Corre ANTES del HandlerInterceptor (JwtAuthFilter) para que los
 * microservicios reciban los headers en cada request autenticado.
 */
@Component
@Order(1)
public class JwtHeaderPropagationFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtHeaderPropagationFilter.class);

    @Value("${jwt.secret}")
    private String secret;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                String token = authHeader.substring(7);
                Claims claims = Jwts.parser()
                        .verifyWith(Keys.hmacShaKeyFor(
                                secret.getBytes(StandardCharsets.UTF_8)))
                        .build()
                        .parseSignedClaims(token)
                        .getPayload();

                Long id = claims.get("id", Long.class);
                String rol = claims.get("rol", String.class);
                if (rol == null) {
                    // Tokens de ms-servicios usan la claim "tipo": "SERVICIO"
                    rol = claims.get("tipo", String.class);
                }

                MutableHttpServletRequest mutableRequest =
                        new MutableHttpServletRequest(request);

                if (id != null) {
                    mutableRequest.addHeader("X-Usuario-Id", String.valueOf(id));
                }
                if (rol != null) {
                    mutableRequest.addHeader("X-Usuario-Rol", rol);
                }

                log.debug("Headers propagados — id: {}, rol: {}", id, rol);
                filterChain.doFilter(mutableRequest, response);
                return;

            } catch (Exception e) {
                // Token inválido — el JwtAuthFilter devolverá 401
                log.debug("JWT no parseable en propagación de headers: {}", e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }
}
