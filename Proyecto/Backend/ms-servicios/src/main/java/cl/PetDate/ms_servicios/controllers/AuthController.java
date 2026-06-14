package cl.PetDate.ms_servicios.controllers;

import cl.PetDate.ms_servicios.dto.AuthRequest;
import cl.PetDate.ms_servicios.dto.AuthResponse;
import cl.PetDate.ms_servicios.dto.ForgotPasswordRequest;
import cl.PetDate.ms_servicios.dto.ResetPasswordRequest;
import cl.PetDate.ms_servicios.models.Servicio;
import cl.PetDate.ms_servicios.repositories.ServicioRepository;
import cl.PetDate.ms_servicios.services.JwtService;
import cl.PetDate.ms_servicios.services.PasswordResetService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth/servicios")
public class AuthController {

    private final ServicioRepository servicioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final PasswordResetService passwordResetService;

    public AuthController(ServicioRepository servicioRepository,
                          PasswordEncoder passwordEncoder,
                          JwtService jwtService,
                          PasswordResetService passwordResetService) {
        this.servicioRepository = servicioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        Servicio servicio = servicioRepository.findByCorreo(request.getCorreo())
                .orElse(null);

        if (servicio == null ||
                !passwordEncoder.matches(request.getContrasena(), servicio.getContrasena())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse(null, null));
        }

        String token = jwtService.generarToken(
                servicio.getCorreo(), servicio.getIdServicio());
        return ResponseEntity.ok(new AuthResponse(token, "SERVICIO"));
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
