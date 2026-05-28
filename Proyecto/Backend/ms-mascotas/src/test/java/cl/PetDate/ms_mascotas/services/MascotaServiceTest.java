package cl.PetDate.ms_mascotas.services;

import cl.PetDate.ms_mascotas.clients.UsuarioClient;
import cl.PetDate.ms_mascotas.clients.dto.UsuarioDTO;
import cl.PetDate.ms_mascotas.dto.MascotaRequest;
import cl.PetDate.ms_mascotas.dto.MascotaResponse;
import cl.PetDate.ms_mascotas.exceptions.MascotaNotFoundException;
import cl.PetDate.ms_mascotas.exceptions.UsuarioNotFoundException;
import cl.PetDate.ms_mascotas.models.Mascota;
import cl.PetDate.ms_mascotas.repositories.MascotaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Tests unitarios - MascotaService")
class MascotaServiceTest {

    @Mock
    private MascotaRepository mascotaRepository;

    @Mock
    private SequenceGeneratorService sequenceGeneratorService;

    @Mock
    private UsuarioClient usuarioClient;

    @InjectMocks
    private MascotaService mascotaService;

    // ── Datos de prueba reutilizables ──
    private MascotaRequest requestValido;
    private Mascota mascotaGuardada;
    private Pageable pageable;

    @BeforeEach
    void setUp() {
        requestValido = new MascotaRequest();
        requestValido.setNombre("Firulais");
        requestValido.setEspecie("Perro");
        requestValido.setRaza("Labrador");
        requestValido.setEdad(3);
        requestValido.setTamano("Mediano");
        requestValido.setUsuarioId(1L);
        requestValido.setPeso(15.5f);
        requestValido.setSexo("Macho");
        requestValido.setColor("Dorado");
        requestValido.setObservaciones("Ninguna");
        requestValido.setInfo_medica_basica("Vacunas al día");

        mascotaGuardada = new Mascota();
        mascotaGuardada.setId(1L);
        mascotaGuardada.setNombre("Firulais");
        mascotaGuardada.setEspecie("Perro");
        mascotaGuardada.setRaza("Labrador");
        mascotaGuardada.setEdad(3);
        mascotaGuardada.setTamano("Mediano");
        mascotaGuardada.setUsuarioId(1L);
        mascotaGuardada.setPeso(15.5f);
        mascotaGuardada.setSexo("Macho");
        mascotaGuardada.setColor("Dorado");
        mascotaGuardada.setObservaciones("Ninguna");
        mascotaGuardada.setInfo_medica_basica("Vacunas al día");

        pageable = PageRequest.of(0, 10);
    }

    // ─────────────────────────────────────────────
    // crearMascota
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("crearMascota - debe crear y retornar la mascota correctamente")
    void crearMascota_exitoso() {
        UsuarioDTO usuarioDTO = new UsuarioDTO();
        usuarioDTO.setId(1L);
        when(usuarioClient.buscarUsuarioPorId(1L)).thenReturn(usuarioDTO);
        when(sequenceGeneratorService.generateSequence(anyString())).thenReturn(1L);
        when(mascotaRepository.save(any(Mascota.class))).thenReturn(mascotaGuardada);

        MascotaResponse response = mascotaService.crearMascota(requestValido);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getNombre()).isEqualTo("Firulais");
        assertThat(response.getEspecie()).isEqualTo("Perro");
        assertThat(response.getUsuarioId()).isEqualTo(1L);

        verify(mascotaRepository).save(any(Mascota.class));
        verify(usuarioClient).buscarUsuarioPorId(1L);
    }

    @Test
    @DisplayName("crearMascota - debe lanzar UsuarioNotFoundException si el usuario no existe")
    void crearMascota_usuarioNoExiste() {
        doThrow(new RuntimeException("Usuario no encontrado"))
                .when(usuarioClient).buscarUsuarioPorId(1L);

        assertThatThrownBy(() -> mascotaService.crearMascota(requestValido))
                .isInstanceOf(UsuarioNotFoundException.class);

        verify(mascotaRepository, never()).save(any());
    }

    // ─────────────────────────────────────────────
    // listarMascotas
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("listarMascotas - debe retornar página de mascotas")
    void listarMascotas_retornaPagina() {
        Mascota segunda = new Mascota();
        segunda.setId(2L);
        segunda.setNombre("Luna");
        segunda.setEspecie("Gato");
        segunda.setRaza("Siamés");
        segunda.setUsuarioId(1L);
        segunda.setSexo("Hembra");
        segunda.setTamano("Pequeño");

        Page<Mascota> paginaMascotas = new PageImpl<>(List.of(mascotaGuardada, segunda));
        when(mascotaRepository.findAll(pageable)).thenReturn(paginaMascotas);

        Page<MascotaResponse> resultado = mascotaService.listarMascotas(pageable);

        assertThat(resultado.getContent()).hasSize(2);
        assertThat(resultado.getContent().get(0).getNombre()).isEqualTo("Firulais");
        assertThat(resultado.getContent().get(1).getNombre()).isEqualTo("Luna");
    }

    @Test
    @DisplayName("listarMascotas - debe retornar página vacía si no hay mascotas")
    void listarMascotas_paginaVacia() {
        when(mascotaRepository.findAll(pageable)).thenReturn(Page.empty());

        Page<MascotaResponse> resultado = mascotaService.listarMascotas(pageable);

        assertThat(resultado.getContent()).isEmpty();
    }

    // ─────────────────────────────────────────────
    // buscarPorId
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("buscarPorId - debe retornar la mascota si existe")
    void buscarPorId_mascotaExiste() {
        when(mascotaRepository.findById(1L)).thenReturn(Optional.of(mascotaGuardada));

        MascotaResponse response = mascotaService.buscarPorId(1L);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getNombre()).isEqualTo("Firulais");
    }

    @Test
    @DisplayName("buscarPorId - debe lanzar MascotaNotFoundException si no existe")
    void buscarPorId_mascotaNoExiste() {
        when(mascotaRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> mascotaService.buscarPorId(99L))
                .isInstanceOf(MascotaNotFoundException.class);
    }

    // ─────────────────────────────────────────────
    // buscarPorUsuario
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("buscarPorUsuario - debe retornar mascotas del usuario")
    void buscarPorUsuario_retornaMascotas() {
        Page<Mascota> pagina = new PageImpl<>(List.of(mascotaGuardada));
        when(mascotaRepository.findByUsuarioId(1L, pageable)).thenReturn(pagina);

        Page<MascotaResponse> resultado = mascotaService.buscarPorUsuario(1L, pageable);

        assertThat(resultado.getContent()).hasSize(1);
        assertThat(resultado.getContent().get(0).getUsuarioId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("buscarPorUsuario - debe retornar página vacía si el usuario no tiene mascotas")
    void buscarPorUsuario_sinMascotas() {
        when(mascotaRepository.findByUsuarioId(99L, pageable)).thenReturn(Page.empty());

        Page<MascotaResponse> resultado = mascotaService.buscarPorUsuario(99L, pageable);

        assertThat(resultado.getContent()).isEmpty();
    }

    // ─────────────────────────────────────────────
    // actualizarMascota
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("actualizarMascota - debe actualizar y retornar la mascota")
    void actualizarMascota_exitoso() {
        MascotaRequest requestActualizado = new MascotaRequest();
        requestActualizado.setNombre("Firulais Updated");
        requestActualizado.setEspecie("Perro");
        requestActualizado.setRaza("Golden Retriever");
        requestActualizado.setEdad(4);
        requestActualizado.setTamano("Grande");
        requestActualizado.setUsuarioId(1L);
        requestActualizado.setPeso(20f);
        requestActualizado.setSexo("Macho");

        Mascota mascotaActualizada = new Mascota();
        mascotaActualizada.setId(1L);
        mascotaActualizada.setNombre("Firulais Updated");
        mascotaActualizada.setEspecie("Perro");
        mascotaActualizada.setRaza("Golden Retriever");
        mascotaActualizada.setEdad(4);
        mascotaActualizada.setTamano("Grande");
        mascotaActualizada.setUsuarioId(1L);
        mascotaActualizada.setPeso(20f);
        mascotaActualizada.setSexo("Macho");

        when(mascotaRepository.findById(1L)).thenReturn(Optional.of(mascotaGuardada));
        when(mascotaRepository.save(any(Mascota.class))).thenReturn(mascotaActualizada);

        MascotaResponse response = mascotaService.actualizarMascota(1L, requestActualizado);

        assertThat(response.getNombre()).isEqualTo("Firulais Updated");
        assertThat(response.getRaza()).isEqualTo("Golden Retriever");
        assertThat(response.getEdad()).isEqualTo(4);
        verify(mascotaRepository).save(any(Mascota.class));
    }

    @Test
    @DisplayName("actualizarMascota - debe lanzar MascotaNotFoundException si no existe")
    void actualizarMascota_mascotaNoExiste() {
        when(mascotaRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> mascotaService.actualizarMascota(99L, requestValido))
                .isInstanceOf(MascotaNotFoundException.class);

        verify(mascotaRepository, never()).save(any());
    }

    // ─────────────────────────────────────────────
    // eliminarMascota
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("eliminarMascota - debe eliminar la mascota si existe")
    void eliminarMascota_exitoso() {
        when(mascotaRepository.findById(1L)).thenReturn(Optional.of(mascotaGuardada));

        mascotaService.eliminarMascota(1L);

        verify(mascotaRepository).delete(mascotaGuardada);
    }

    @Test
    @DisplayName("eliminarMascota - debe lanzar MascotaNotFoundException si no existe")
    void eliminarMascota_mascotaNoExiste() {
        when(mascotaRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> mascotaService.eliminarMascota(99L))
                .isInstanceOf(MascotaNotFoundException.class);

        verify(mascotaRepository, never()).delete(any());
    }

    // ─────────────────────────────────────────────
    // toResponse - verificar mapeo correcto
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("buscarPorId - debe mapear todos los campos correctamente")
    void buscarPorId_mapeoCorrectoDeResponse() {
        Date fecha = new Date();
        mascotaGuardada.setFecha_nacimineto(fecha);
        mascotaGuardada.setImagenUrl("/uploads/mascotas/foto.png");

        when(mascotaRepository.findById(1L)).thenReturn(Optional.of(mascotaGuardada));

        MascotaResponse response = mascotaService.buscarPorId(1L);

        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getNombre()).isEqualTo("Firulais");
        assertThat(response.getEspecie()).isEqualTo("Perro");
        assertThat(response.getRaza()).isEqualTo("Labrador");
        assertThat(response.getEdad()).isEqualTo(3);
        assertThat(response.getTamano()).isEqualTo("Mediano");
        assertThat(response.getUsuarioId()).isEqualTo(1L);
        assertThat(response.getPeso()).isEqualTo(15.5f);
        assertThat(response.getSexo()).isEqualTo("Macho");
        assertThat(response.getColor()).isEqualTo("Dorado");
        assertThat(response.getObservaciones()).isEqualTo("Ninguna");
        assertThat(response.getInfo_medica_basica()).isEqualTo("Vacunas al día");
        assertThat(response.getFecha_nacimineto()).isEqualTo(fecha);
        assertThat(response.getImagenUrl()).isEqualTo("/uploads/mascotas/foto.png");
    }
}
