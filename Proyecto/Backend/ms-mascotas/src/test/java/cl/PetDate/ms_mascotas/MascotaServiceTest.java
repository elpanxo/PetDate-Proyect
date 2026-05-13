package cl.PetDate.ms_mascotas;

import cl.PetDate.ms_mascotas.clients.UsuarioClient;
import cl.PetDate.ms_mascotas.dto.MascotaResponse;
import cl.PetDate.ms_mascotas.exceptions.MascotaNotFoundException;
import cl.PetDate.ms_mascotas.models.Mascota;
import cl.PetDate.ms_mascotas.repositories.MascotaRepository;
import cl.PetDate.ms_mascotas.services.MascotaService;
import cl.PetDate.ms_mascotas.services.SequenceGeneratorService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class MascotaServiceTest {

    @Mock
    MascotaRepository mascotaRepository;
    @Mock
    SequenceGeneratorService sequenceGeneratorService;
    @Mock
    UsuarioClient usuarioClient;
    @InjectMocks
    MascotaService mascotaService;

    @Test
    void buscarPorId_cuandoExiste_retornaMascota() {
        Mascota m = new Mascota();
        m.setId(1L);
        m.setNombre("Rex");

        when(mascotaRepository.findById(1L)).thenReturn(Optional.of(m));

        MascotaResponse resultado = mascotaService.buscarPorId(1L); // <- cambiar aquí
        assertEquals("Rex", resultado.getNombre());
    }

    @Test
    void buscarPorId_cuandoNoExiste_lanzaExcepcion() {
        when(mascotaRepository.findById(99L))
                .thenReturn(Optional.empty());

        assertThrows(MascotaNotFoundException.class,
                () -> mascotaService.buscarPorId(99L));
    }
}
