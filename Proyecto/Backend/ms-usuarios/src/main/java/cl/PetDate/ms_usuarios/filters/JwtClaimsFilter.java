package cl.PetDate.ms_usuarios.filters;

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
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * Extrae las claims del JWT y las inyecta como headers X-Usuario-Id / X-Usuario-Rol
 * directamente en ms-usuarios, sin depender de que el gateway las propague.
 *
 * Garantiza que DELETE /usuarios/{id} y demás endpoints protegidos funcionen
 * aunque Spring Cloud Gateway WebMVC no reenvíe los headers del wrapper.
 */
@Component
public class JwtClaimsFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtClaimsFilter.class);

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
                    rol = claims.get("tipo", String.class);
                }

                MutableHttpServletRequest mutableRequest = new MutableHttpServletRequest(request);
                if (id != null) {
                    mutableRequest.addHeader("X-Usuario-Id", String.valueOf(id));
                }
                if (rol != null) {
                    mutableRequest.addHeader("X-Usuario-Rol", rol);
                }

                log.debug("Claims JWT inyectados — id: {}, rol: {}", id, rol);
                filterChain.doFilter(mutableRequest, response);
                return;

            } catch (Exception e) {
                log.debug("JWT no parseable en ms-usuarios: {}", e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }
}
