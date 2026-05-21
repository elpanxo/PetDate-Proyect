package cl.PetDate.ms_servicios.controllers;
import cl.PetDate.ms_servicios.dto.AuthRequest;
import cl.PetDate.ms_servicios.dto.AuthResponse;
import cl.PetDate.ms_servicios.models.Servicio;
import cl.PetDate.ms_servicios.repositories.ServicioRepository;
import cl.PetDate.ms_servicios.services.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth/servicios")
public class AuthController {

    private final ServicioRepository servicioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(ServicioRepository servicioRepository,
                          PasswordEncoder passwordEncoder,
                          JwtService jwtService) {
        this.servicioRepository = servicioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
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
}
