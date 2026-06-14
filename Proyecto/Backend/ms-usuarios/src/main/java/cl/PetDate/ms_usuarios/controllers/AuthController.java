package cl.PetDate.ms_usuarios.controllers;

import cl.PetDate.ms_usuarios.dto.AuthRequest;
import cl.PetDate.ms_usuarios.dto.AuthResponse;
import cl.PetDate.ms_usuarios.dto.ForgotPasswordRequest;
import cl.PetDate.ms_usuarios.dto.ResetPasswordRequest;
import cl.PetDate.ms_usuarios.models.Usuario;
import cl.PetDate.ms_usuarios.repositories.UsuarioRepository;
import cl.PetDate.ms_usuarios.security.JwtService;
import cl.PetDate.ms_usuarios.services.PasswordResetService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final PasswordResetService passwordResetService;

    public AuthController(UsuarioRepository usuarioRepository,
                          PasswordEncoder passwordEncoder,
                          JwtService jwtService,
                          PasswordResetService passwordResetService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        // Mismo mensaje para usuario no encontrado y contraseña incorrecta
        // — evita enumeración de usuarios
        Optional<Usuario> usuarioOpt = usuarioRepository.findByCorreo(request.getCorreo());

        if (usuarioOpt.isEmpty() ||
            !passwordEncoder.matches(request.getContrasena(), usuarioOpt.get().getContrasena())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse(null, "Credenciales inválidas"));
        }

        Usuario usuario = usuarioOpt.get();
        String token = jwtService.generarToken(usuario.getCorreo(), usuario.getId(), usuario.getRol());
        return ResponseEntity.ok(new AuthResponse(token, null));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {
        passwordResetService.solicitarRestablecimiento(request.getCorreo());
        return ResponseEntity.ok(Map.of(
                "mensaje", "Si el correo existe, recibirás un código de verificación en breve."
        ));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {
        boolean exito = passwordResetService.restablecerContrasena(
                request.getCorreo(), request.getCodigo(), request.getNuevaContrasena());

        if (!exito) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Código inválido, expirado o ya utilizado."));
        }

        return ResponseEntity.ok(Map.of("mensaje", "Contraseña restablecida correctamente."));
    }
}
