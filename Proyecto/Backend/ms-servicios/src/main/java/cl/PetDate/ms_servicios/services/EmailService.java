package cl.PetDate.ms_servicios.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String from;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void enviarCodigoRestablecimiento(String correoDestino, String codigo) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(correoDestino);
        message.setSubject("Restablecer contraseña - PetDate Servicios");
        message.setText(
                "Hola,\n\n" +
                "Recibimos una solicitud para restablecer la contraseña de tu cuenta de servicio en PetDate.\n\n" +
                "Tu código de verificación es:\n\n" +
                "    " + codigo + "\n\n" +
                "Este código expira en 15 minutos.\n\n" +
                "Si no solicitaste este cambio, puedes ignorar este correo.\n\n" +
                "Equipo PetDate"
        );
        mailSender.send(message);
    }
}
