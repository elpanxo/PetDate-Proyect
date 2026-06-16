package cl.PetDate.ms_comentarios.controllers;

import cl.PetDate.ms_comentarios.dto.ContactoRequest;
import cl.PetDate.ms_comentarios.models.Contacto;
import cl.PetDate.ms_comentarios.services.ContactoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/contacto")
public class ContactoController {

    private final ContactoService contactoService;

    public ContactoController(ContactoService contactoService) {
        this.contactoService = contactoService;
    }

    @PostMapping
    public ResponseEntity<Contacto> enviar(@Valid @RequestBody ContactoRequest request) {
        Contacto contacto = contactoService.enviar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(contacto);
    }
}
