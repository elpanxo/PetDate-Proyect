package cl.PetDate.ms_servicios.services;

import cl.PetDate.ms_servicios.models.PasswordResetToken;
import cl.PetDate.ms_servicios.models.Servicio;
import cl.PetDate.ms_servicios.repositories.PasswordResetTokenRepository;
import cl.PetDate.ms_servicios.repositories.ServicioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class PasswordResetService {

    private final PasswordResetTokenRepository tokenRepository;
    private final ServicioRepository servicioRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    private static final int EXPIRACION_MINUTOS = 15;

    public PasswordResetService(PasswordResetTokenRepository tokenRepository,
                                ServicioRepository servicioRepository,
                                EmailService emailService,
                                PasswordEncoder passwordEncoder) {
        this.tokenRepository = tokenRepository;
        this.servicioRepository = servicioRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    public void solicitarRestablecimiento(String correo) {
        // Verificar que el servicio existe (respuesta genérica siempre para evitar enumeración)
        Optional<Servicio> servicioOpt = servicioRepository.findByCorreo(correo);
        if (servicioOpt.isEmpty()) {
            return;
        }

        // Eliminar tokens previos del mismo correo
        tokenRepository.deleteByCorreo(correo);

        String codigo = generarCodigo();
        LocalDateTime expiracion = LocalDateTime.now().plusMinutes(EXPIRACION_MINUTOS);

        tokenRepository.save(new PasswordResetToken(correo, codigo, expiracion));
        emailService.enviarCodigoRestablecimiento(correo, codigo);
    }

    public boolean restablecerContrasena(String correo, String codigo, String nuevaContrasena) {
        Optional<PasswordResetToken> tokenOpt =
                tokenRepository.findByCorreoAndCodigoAndUsadoFalse(correo, codigo);

        if (tokenOpt.isEmpty()) {
            return false;
        }

        PasswordResetToken token = tokenOpt.get();

        if (LocalDateTime.now().isAfter(token.getExpiracion())) {
            tokenRepository.delete(token);
            return false;
        }

        Optional<Servicio> servicioOpt = servicioRepository.findByCorreo(correo);
        if (servicioOpt.isEmpty()) {
            return false;
        }

        Servicio servicio = servicioOpt.get();
        servicio.setContrasena(passwordEncoder.encode(nuevaContrasena));
        servicioRepository.save(servicio);

        token.setUsado(true);
        tokenRepository.save(token);

        return true;
    }

    private String generarCodigo() {
        SecureRandom random = new SecureRandom();
        int codigo = 100000 + random.nextInt(900000);
        return String.valueOf(codigo);
    }
}
