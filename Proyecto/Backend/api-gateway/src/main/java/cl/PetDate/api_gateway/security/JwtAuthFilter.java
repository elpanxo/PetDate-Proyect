package cl.PetDate.api_gateway.security;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.nio.charset.StandardCharsets;

@Component
public class JwtAuthFilter implements HandlerInterceptor {

    @Value("${jwt.secret}")
    private String secret;

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) throws Exception {

        String path = request.getRequestURI();
        String method = request.getMethod();

        System.out.println("GATEWAY >> PATH: " + path + " METHOD: " + method);

        if (esRutaPublica(path, method)) {
            return true;
        }

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            escribirError(response, HttpStatus.UNAUTHORIZED, "Token requerido");
            return false;
        }

        try {
            String token = authHeader.substring(7);
            Jwts.parser()
                    .verifyWith(Keys.hmacShaKeyFor(
                            secret.getBytes(StandardCharsets.UTF_8)))
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            escribirError(response, HttpStatus.UNAUTHORIZED, "Token invalido o expirado");
            return false;
        }
    }

    private boolean esRutaPublica(String path, String method) {
        if (path.startsWith("/auth/")) return true;
        if (path.equals("/error")) return true;
        if (path.equals("/usuarios") && method.equals("POST")) return true;
        if (path.startsWith("/servicios") && method.equals("POST")) return true;
        return false;
    }

    private void escribirError(HttpServletResponse response,
                               HttpStatus status, String mensaje) throws Exception {
        response.setStatus(status.value());
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write("{\"error\": \"" + mensaje + "\"}");
    }
}
