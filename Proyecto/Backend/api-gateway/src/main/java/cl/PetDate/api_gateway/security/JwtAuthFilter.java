package cl.PetDate.api_gateway.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.nio.charset.StandardCharsets;

@Component
public class JwtAuthFilter implements HandlerInterceptor {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthFilter.class);

    @Value("${jwt.secret}")
    private String secret;

    @Override
    public boolean preHandle(HttpServletRequest request,
            HttpServletResponse response,
            Object handler) throws Exception {

        String path = request.getRequestURI();
        String method = request.getMethod();

        log.info("GATEWAY >> {} {}", method, path);

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
            Claims claims = Jwts.parser()
                    .verifyWith(Keys.hmacShaKeyFor(
                            secret.getBytes(StandardCharsets.UTF_8)))
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            String rol = claims.get("rol", String.class);
            if (rol == null) {
                // Tokens de ms-servicios usan la claim "tipo": "SERVICIO"
                rol = claims.get("tipo", String.class);
            }

            // Rutas que solo pueden usarse con una cuenta de usuario (no de servicio)
            if (esRutaSoloUsuario(path, method) && "SERVICIO".equals(rol)) {
                escribirError(response, HttpStatus.FORBIDDEN, "Esta acción requiere una cuenta de usuario");
                return false;
            }

            // Rutas que solo pueden usarse con una cuenta de servicio
            if (esRutaSoloServicio(path, method) && !"SERVICIO".equals(rol)) {
                escribirError(response, HttpStatus.FORBIDDEN, "Esta acción requiere una cuenta de servicio");
                return false;
            }

            // Endpoints que requieren rol ADMIN
            if (esRutaAdmin(path, method) && !"ADMIN".equals(rol)) {
                escribirError(response, HttpStatus.FORBIDDEN, "Acceso denegado: se requiere rol ADMIN");
                return false;
            }

            // Propagar identidad del usuario a los microservicios
            request.setAttribute("usuarioId", claims.get("id"));
            request.setAttribute("usuarioRol", rol);

            return true;
        } catch (Exception e) {
            escribirError(response, HttpStatus.UNAUTHORIZED, "Token invalido o expirado");
            return false;
        }
    }

    private boolean esRutaPublica(String path, String method) {
        if (method.equals("OPTIONS"))
            return true;
        if (path.startsWith("/auth/"))
            return true;
        if (path.equals("/error"))
            return true;
        if (path.equals("/usuarios") && method.equals("POST"))
            return true;
        if (path.startsWith("/uploads/"))
            return true;
        // Listados y búsquedas de servicios son públicos (GET en cualquier sub-ruta)
        if (path.startsWith("/servicios") && method.equals("GET"))
            return true;
        // Solo el registro de un nuevo servicio (POST exacto a /servicios) es público;
        // sub-rutas como /servicios/{id}/imagen quedan protegidas (requieren ser dueño)
        if (path.equals("/servicios") && method.equals("POST"))
            return true;
        if (path.startsWith("/promociones") && method.equals("GET"))
            return true;
        // Listar y buscar entradas de blog son públicos; crear/editar/eliminar
        // requieren cuenta de servicio (ver esRutaSoloServicio y el ownership check del controller)
        if (path.startsWith("/blogs") && method.equals("GET"))
            return true;
        // Listar y buscar comentarios (de blog y de servicio) son públicos
        if (path.startsWith("/comentarios") && method.equals("GET"))
            return true;
        return false;
    }

    private boolean esRutaAdmin(String path, String method) {
        // Endpoints internos bloqueados desde el exterior
        if (path.startsWith("/usuarios/interno/"))
            return true;
        if (path.startsWith("/mascotas/interno/"))
            return true;
        if (path.startsWith("/citas/interno/"))
            return true;
        if (path.startsWith("/comentarios/blog/interno/"))
            return true;
        if (path.startsWith("/comentarios/servicio/interno/"))
            return true;
        // Solo ADMIN puede listar todos los usuarios
        if (path.equals("/usuarios") && method.equals("GET"))
            return true;
        // Solo ADMIN puede consultar usuario por correo
        if (path.startsWith("/usuarios/correo/"))
            return true;
        // Solo ADMIN puede listar todas las mascotas (el dueño usa /mascotas/usuario/{id})
        if (path.equals("/mascotas") && method.equals("GET"))
            return true;
        // Solo ADMIN puede listar todas las citas o filtrarlas por estado/mascota
        // (el dueño usa /citas/usuario/{id} y /citas/usuario/{id}/estado/{estado})
        if (path.equals("/citas") && method.equals("GET"))
            return true;
        if (path.startsWith("/citas/estado/"))
            return true;
        if (path.startsWith("/citas/mascota/"))
            return true;
        // Solo ADMIN puede consultar el registro de auditoría de accesos (Ley 19.628)
        if (path.startsWith("/auditoria"))
            return true;
        return false;
    }

    // Rutas que requieren específicamente un token de USUARIO (no de servicio)
    private boolean esRutaSoloUsuario(String path, String method) {
        if (path.equals("/mascotas") && method.equals("POST"))
            return true;
        if (path.equals("/citas") && method.equals("POST"))
            return true;
        // Crear comentarios (de blog o de servicio) requiere cuenta de usuario;
        // modificar/eliminar se valida por dueño dentro del propio microservicio
        if (path.equals("/comentarios/blog") && method.equals("POST"))
            return true;
        if (path.equals("/comentarios/servicio") && method.equals("POST"))
            return true;
        return false;
    }

    // Rutas que requieren específicamente un token de SERVICIO
    private boolean esRutaSoloServicio(String path, String method) {
        if (path.equals("/promociones") && method.equals("POST"))
            return true;
        // Crear una entrada de blog requiere cuenta de servicio; modificar/eliminar/subir
        // imagen se valida por dueño (idServicio del token) dentro del propio controller
        if (path.equals("/blogs") && method.equals("POST"))
            return true;
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
