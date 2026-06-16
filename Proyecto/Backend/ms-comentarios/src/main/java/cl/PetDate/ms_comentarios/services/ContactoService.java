package cl.PetDate.ms_comentarios.services;

import cl.PetDate.ms_comentarios.dto.ContactoRequest;
import cl.PetDate.ms_comentarios.models.Contacto;
import cl.PetDate.ms_comentarios.repositories.ContactoRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ContactoService {

    private final ContactoRepository contactoRepository;
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String from;

    @Value("${contacto.destino}")
    private String destino;

    public ContactoService(ContactoRepository contactoRepository, JavaMailSender mailSender) {
        this.contactoRepository = contactoRepository;
        this.mailSender = mailSender;
    }

    public Contacto enviar(ContactoRequest request) {
        Contacto contacto = new Contacto();
        contacto.setNombre(request.getNombre());
        contacto.setCorreo(request.getCorreo());
        contacto.setMensaje(request.getMensaje());
        contacto.setFecha(LocalDateTime.now());

        Contacto guardado = contactoRepository.save(contacto);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(destino);
        message.setSubject("Nuevo mensaje de contacto - PetDate");
        message.setText(
            "Nuevo mensaje recibido desde el formulario de contacto:\n\n" +
            "Nombre: " + request.getNombre() + "\n" +
            "Correo: " + request.getCorreo() + "\n\n" +
            "Mensaje:\n" + request.getMensaje() + "\n\n" +
            "---\nEquipo PetDate"
        );
        mailSender.send(message);

        return guardado;
    }
}
