package cl.PetDate.ms_usuarios.services;

import cl.PetDate.ms_usuarios.models.PasswordResetToken;
import cl.PetDate.ms_usuarios.models.Usuario;
import cl.PetDate.ms_usuarios.repositories.PasswordResetTokenRepository;
import cl.PetDate.ms_usuarios.repositories.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class PasswordResetService {

    private final PasswordResetTokenRepository tokenRepository;
    private final UsuarioRepository usuarioRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    private static final int EXPIRACION_MINUTOS = 15;

    public PasswordResetService(PasswordResetTokenRepository tokenRepository,
                                UsuarioRepository usuarioRepository,
                                EmailService emailService,
                                PasswordEncoder passwordEncoder) {
        this.tokenRepository = tokenRepository;
        this.usuarioRepository = usuarioRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    public void solicitarRestablecimiento(String correo) {
        // Verificar que el usuario existe (respuesta genérica siempre para evitar enumeración)
        Optional<Usuario> usuarioOpt = usuarioRepository.findByCorreo(correo);
        if (usuarioOpt.isEmpty()) {
            return;
        }

        // Eliminar tokens previos del mismo correo
        tokenRepository.deleteByCorreo(correo);

        String codigo = generarCodigo();
        LocalDateTime expiracion = LocalDateTime.now().plusMinutes(EXPIRACION_MINUTOS);

        tokenRepository.save(new PasswordResetToken(correo, codigo, expiracion));
        try {
            emailService.enviarCodigoRestablecimiento(correo, codigo);
        } catch (Exception e) {
            // El token queda guardado; el envío de email puede fallar si las credenciales SMTP no están configuradas
            System.err.println("Error al enviar correo de restablecimiento: " + e.getMessage());
        }
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

        Optional<Usuario> usuarioOpt = usuarioRepository.findByCorreo(correo);
        if (usuarioOpt.isEmpty()) {
            return false;
        }

        Usuario usuario = usuarioOpt.get();
        usuario.setContrasena(passwordEncoder.encode(nuevaContrasena));
        usuarioRepository.save(usuario);

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
