package cl.PetDate.ms_citas_medicas.services;

import cl.PetDate.ms_citas_medicas.clients.MascotaClient;
import cl.PetDate.ms_citas_medicas.clients.UsuarioClient;
import cl.PetDate.ms_citas_medicas.dto.CitaMedicaRequest;
import cl.PetDate.ms_citas_medicas.dto.CitaMedicaResponse;
import cl.PetDate.ms_citas_medicas.exceptions.CitaMedicaNotFoundException;
import cl.PetDate.ms_citas_medicas.exceptions.MascotaNotFoundException;
import cl.PetDate.ms_citas_medicas.exceptions.UsuarioNotFoundException;
import cl.PetDate.ms_citas_medicas.models.CitaMedica;
import cl.PetDate.ms_citas_medicas.models.EstadoEvento;
import cl.PetDate.ms_citas_medicas.repositories.CitaMedicaRepository;
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

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Tests unitarios - CitaMedicaService")
class CitaMedicaServiceTest {

    @Mock
    private CitaMedicaRepository citaMedicaRepository;

    @Mock
    private SequenceGeneratorService sequenceGeneratorService;

    @Mock
    private UsuarioClient usuarioClient;

    @Mock
    private MascotaClient mascotaClient;

    @InjectMocks
    private CitaMedicaService citaMedicaService;

    private CitaMedicaRequest requestValido;
    private CitaMedica citaGuardada;
    private Pageable pageable;

    @BeforeEach
    void setUp() {
        requestValido = new CitaMedicaRequest();
        requestValido.setIdUsuario(1L);
        requestValido.setIdMascota(1L);
        requestValido.setTipoEvento("Control veterinario");
        requestValido.setFecha(LocalDate.of(2026, 6, 15));
        requestValido.setHora(LocalTime.of(10, 30));
        requestValido.setDescripcion("Control anual");
        requestValido.setObservacion("Sin observaciones");

        citaGuardada = new CitaMedica();
        citaGuardada.setIdEvento(1L);
        citaGuardada.setIdUsuario(1L);
        citaGuardada.setIdMascota(1L);
        citaGuardada.setTipoEvento("Control veterinario");
        citaGuardada.setFecha(LocalDate.of(2026, 6, 15));
        citaGuardada.setHora(LocalTime.of(10, 30));
        citaGuardada.setDescripcion("Control anual");
        citaGuardada.setObservacion("Sin observaciones");
        citaGuardada.setEstado(EstadoEvento.PENDIENTE);

        pageable = PageRequest.of(0, 10);
    }

    // ─────────────────────────────────────────────
    // crearCita
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("crearCita - debe crear y retornar la cita correctamente")
    void crearCita_exitoso() {
        when(usuarioClient.buscarUsuarioPorId(1L)).thenReturn(new Object());
        when(mascotaClient.buscarMascotaPorId(1L)).thenReturn(new Object());
        when(sequenceGeneratorService.generateSequence(anyString())).thenReturn(1L);
        when(citaMedicaRepository.save(any(CitaMedica.class))).thenReturn(citaGuardada);

        CitaMedicaResponse response = citaMedicaService.crearCita(requestValido);

        assertThat(response).isNotNull();
        assertThat(response.getIdEvento()).isEqualTo(1L);
        assertThat(response.getIdUsuario()).isEqualTo(1L);
        assertThat(response.getIdMascota()).isEqualTo(1L);
        assertThat(response.getTipoEvento()).isEqualTo("Control veterinario");
        assertThat(response.getEstado()).isEqualTo(EstadoEvento.PENDIENTE);

        verify(citaMedicaRepository).save(any(CitaMedica.class));
        verify(usuarioClient).buscarUsuarioPorId(1L);
        verify(mascotaClient).buscarMascotaPorId(1L);
    }

    @Test
    @DisplayName("crearCita - debe lanzar UsuarioNotFoundException si el usuario no existe")
    void crearCita_usuarioNoExiste() {
        when(usuarioClient.buscarUsuarioPorId(1L))
                .thenThrow(new RuntimeException("Usuario no encontrado"));

        assertThatThrownBy(() -> citaMedicaService.crearCita(requestValido))
                .isInstanceOf(UsuarioNotFoundException.class);

        verify(citaMedicaRepository, never()).save(any());
        verify(mascotaClient, never()).buscarMascotaPorId(any());
    }

    @Test
    @DisplayName("crearCita - debe lanzar MascotaNotFoundException si la mascota no existe")
    void crearCita_mascotaNoExiste() {
        when(usuarioClient.buscarUsuarioPorId(1L)).thenReturn(new Object());
        when(mascotaClient.buscarMascotaPorId(1L))
                .thenThrow(new RuntimeException("Mascota no encontrada"));

        assertThatThrownBy(() -> citaMedicaService.crearCita(requestValido))
                .isInstanceOf(MascotaNotFoundException.class);

        verify(citaMedicaRepository, never()).save(any());
    }

    @Test
    @DisplayName("crearCita - el estado inicial debe ser PENDIENTE")
    void crearCita_estadoInicialPendiente() {
        when(usuarioClient.buscarUsuarioPorId(1L)).thenReturn(new Object());
        when(mascotaClient.buscarMascotaPorId(1L)).thenReturn(new Object());
        when(sequenceGeneratorService.generateSequence(anyString())).thenReturn(1L);
        when(citaMedicaRepository.save(any(CitaMedica.class))).thenReturn(citaGuardada);

        CitaMedicaResponse response = citaMedicaService.crearCita(requestValido);

        assertThat(response.getEstado()).isEqualTo(EstadoEvento.PENDIENTE);
        verify(citaMedicaRepository).save(argThat(c ->
                c.getEstado() == EstadoEvento.PENDIENTE
        ));
    }

    // ─────────────────────────────────────────────
    // listarCitas
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("listarCitas - debe retornar página de citas")
    void listarCitas_retornaPagina() {
        CitaMedica segunda = new CitaMedica();
        segunda.setIdEvento(2L);
        segunda.setIdUsuario(2L);
        segunda.setIdMascota(2L);
        segunda.setTipoEvento("Vacuna");
        segunda.setFecha(LocalDate.of(2026, 7, 1));
        segunda.setHora(LocalTime.of(9, 0));
        segunda.setEstado(EstadoEvento.PENDIENTE);

        when(citaMedicaRepository.findAll(pageable))
                .thenReturn(new PageImpl<>(List.of(citaGuardada, segunda)));

        Page<CitaMedicaResponse> resultado = citaMedicaService.listarCitas(pageable);

        assertThat(resultado.getContent()).hasSize(2);
        assertThat(resultado.getContent().get(0).getTipoEvento()).isEqualTo("Control veterinario");
        assertThat(resultado.getContent().get(1).getTipoEvento()).isEqualTo("Vacuna");
    }

    @Test
    @DisplayName("listarCitas - debe retornar página vacía si no hay citas")
    void listarCitas_paginaVacia() {
        when(citaMedicaRepository.findAll(pageable)).thenReturn(Page.empty());

        Page<CitaMedicaResponse> resultado = citaMedicaService.listarCitas(pageable);

        assertThat(resultado.getContent()).isEmpty();
    }

    // ─────────────────────────────────────────────
    // buscarPorId
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("buscarPorId - debe retornar la cita si existe")
    void buscarPorId_citaExiste() {
        when(citaMedicaRepository.findById(1L)).thenReturn(Optional.of(citaGuardada));

        CitaMedicaResponse response = citaMedicaService.buscarPorId(1L);

        assertThat(response).isNotNull();
        assertThat(response.getIdEvento()).isEqualTo(1L);
        assertThat(response.getTipoEvento()).isEqualTo("Control veterinario");
    }

    @Test
    @DisplayName("buscarPorId - debe lanzar CitaMedicaNotFoundException si no existe")
    void buscarPorId_citaNoExiste() {
        when(citaMedicaRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> citaMedicaService.buscarPorId(99L))
                .isInstanceOf(CitaMedicaNotFoundException.class);
    }

    // ─────────────────────────────────────────────
    // buscarPorUsuario
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("buscarPorUsuario - debe retornar citas del usuario")
    void buscarPorUsuario_retornaCitas() {
        when(citaMedicaRepository.findByIdUsuario(1L, pageable))
                .thenReturn(new PageImpl<>(List.of(citaGuardada)));

        Page<CitaMedicaResponse> resultado = citaMedicaService.buscarPorUsuario(1L, pageable);

        assertThat(resultado.getContent()).hasSize(1);
        assertThat(resultado.getContent().get(0).getIdUsuario()).isEqualTo(1L);
    }

    // ─────────────────────────────────────────────
    // buscarPorMascota
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("buscarPorMascota - debe retornar citas de la mascota")
    void buscarPorMascota_retornaCitas() {
        when(citaMedicaRepository.findByIdMascota(1L, pageable))
                .thenReturn(new PageImpl<>(List.of(citaGuardada)));

        Page<CitaMedicaResponse> resultado = citaMedicaService.buscarPorMascota(1L, pageable);

        assertThat(resultado.getContent()).hasSize(1);
        assertThat(resultado.getContent().get(0).getIdMascota()).isEqualTo(1L);
    }

    // ─────────────────────────────────────────────
    // buscarPorEstado
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("buscarPorEstado - debe retornar citas filtradas por estado")
    void buscarPorEstado_retornaCitas() {
        when(citaMedicaRepository.findByEstado(EstadoEvento.PENDIENTE, pageable))
                .thenReturn(new PageImpl<>(List.of(citaGuardada)));

        Page<CitaMedicaResponse> resultado = citaMedicaService.buscarPorEstado(EstadoEvento.PENDIENTE, pageable);

        assertThat(resultado.getContent()).hasSize(1);
        assertThat(resultado.getContent().get(0).getEstado()).isEqualTo(EstadoEvento.PENDIENTE);
    }

    // ─────────────────────────────────────────────
    // buscarPorUsuarioYEstado
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("buscarPorUsuarioYEstado - debe retornar citas filtradas por usuario y estado")
    void buscarPorUsuarioYEstado_retornaCitas() {
        when(citaMedicaRepository.findByIdUsuarioAndEstado(1L, EstadoEvento.PENDIENTE, pageable))
                .thenReturn(new PageImpl<>(List.of(citaGuardada)));

        Page<CitaMedicaResponse> resultado = citaMedicaService.buscarPorUsuarioYEstado(1L, EstadoEvento.PENDIENTE, pageable);

        assertThat(resultado.getContent()).hasSize(1);
        assertThat(resultado.getContent().get(0).getIdUsuario()).isEqualTo(1L);
        assertThat(resultado.getContent().get(0).getEstado()).isEqualTo(EstadoEvento.PENDIENTE);
    }

    // ─────────────────────────────────────────────
    // actualizarCita
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("actualizarCita - debe actualizar y retornar la cita")
    void actualizarCita_exitoso() {
        CitaMedicaRequest requestActualizado = new CitaMedicaRequest();
        requestActualizado.setTipoEvento("Vacuna");
        requestActualizado.setFecha(LocalDate.of(2026, 8, 1));
        requestActualizado.setHora(LocalTime.of(11, 0));
        requestActualizado.setDescripcion("Vacuna anual");
        requestActualizado.setObservacion("Actualizado");
        requestActualizado.setEstado(EstadoEvento.COMPLETADO);

        CitaMedica citaActualizada = new CitaMedica();
        citaActualizada.setIdEvento(1L);
        citaActualizada.setTipoEvento("Vacuna");
        citaActualizada.setFecha(LocalDate.of(2026, 8, 1));
        citaActualizada.setHora(LocalTime.of(11, 0));
        citaActualizada.setEstado(EstadoEvento.COMPLETADO);

        when(citaMedicaRepository.findById(1L)).thenReturn(Optional.of(citaGuardada));
        when(citaMedicaRepository.save(any(CitaMedica.class))).thenReturn(citaActualizada);

        CitaMedicaResponse response = citaMedicaService.actualizarCita(1L, requestActualizado);

        assertThat(response.getTipoEvento()).isEqualTo("Vacuna");
        assertThat(response.getEstado()).isEqualTo(EstadoEvento.COMPLETADO);
        verify(citaMedicaRepository).save(any(CitaMedica.class));
    }

    @Test
    @DisplayName("actualizarCita - debe lanzar CitaMedicaNotFoundException si no existe")
    void actualizarCita_citaNoExiste() {
        when(citaMedicaRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> citaMedicaService.actualizarCita(99L, requestValido))
                .isInstanceOf(CitaMedicaNotFoundException.class);

        verify(citaMedicaRepository, never()).save(any());
    }

    // ─────────────────────────────────────────────
    // cambiarEstado
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("cambiarEstado - debe cambiar el estado correctamente")
    void cambiarEstado_exitoso() {
        CitaMedica citaCompletada = new CitaMedica();
        citaCompletada.setIdEvento(1L);
        citaCompletada.setEstado(EstadoEvento.COMPLETADO);
        citaCompletada.setTipoEvento("Control veterinario");
        citaCompletada.setFecha(LocalDate.of(2026, 6, 15));
        citaCompletada.setHora(LocalTime.of(10, 30));

        when(citaMedicaRepository.findById(1L)).thenReturn(Optional.of(citaGuardada));
        when(citaMedicaRepository.save(any(CitaMedica.class))).thenReturn(citaCompletada);

        CitaMedicaResponse response = citaMedicaService.cambiarEstado(1L, EstadoEvento.COMPLETADO);

        assertThat(response.getEstado()).isEqualTo(EstadoEvento.COMPLETADO);
        verify(citaMedicaRepository).save(argThat(c ->
                c.getEstado() == EstadoEvento.COMPLETADO
        ));
    }

    @Test
    @DisplayName("cambiarEstado - debe lanzar CitaMedicaNotFoundException si no existe")
    void cambiarEstado_citaNoExiste() {
        when(citaMedicaRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> citaMedicaService.cambiarEstado(99L, EstadoEvento.COMPLETADO))
                .isInstanceOf(CitaMedicaNotFoundException.class);

        verify(citaMedicaRepository, never()).save(any());
    }

    // ─────────────────────────────────────────────
    // eliminarCita
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("eliminarCita - debe eliminar la cita si existe")
    void eliminarCita_exitoso() {
        when(citaMedicaRepository.findById(1L)).thenReturn(Optional.of(citaGuardada));

        citaMedicaService.eliminarCita(1L);

        verify(citaMedicaRepository).delete(citaGuardada);
    }

    @Test
    @DisplayName("eliminarCita - debe lanzar CitaMedicaNotFoundException si no existe")
    void eliminarCita_citaNoExiste() {
        when(citaMedicaRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> citaMedicaService.eliminarCita(99L))
                .isInstanceOf(CitaMedicaNotFoundException.class);

        verify(citaMedicaRepository, never()).delete(any());
    }

    // ─────────────────────────────────────────────
    // toResponse - verificar mapeo correcto
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("buscarPorId - debe mapear todos los campos correctamente")
    void buscarPorId_mapeoCorrectoDeResponse() {
        when(citaMedicaRepository.findById(1L)).thenReturn(Optional.of(citaGuardada));

        CitaMedicaResponse response = citaMedicaService.buscarPorId(1L);

        assertThat(response.getIdEvento()).isEqualTo(1L);
        assertThat(response.getIdUsuario()).isEqualTo(1L);
        assertThat(response.getIdMascota()).isEqualTo(1L);
        assertThat(response.getTipoEvento()).isEqualTo("Control veterinario");
        assertThat(response.getFecha()).isEqualTo(LocalDate.of(2026, 6, 15));
        assertThat(response.getHora()).isEqualTo(LocalTime.of(10, 30));
        assertThat(response.getDescripcion()).isEqualTo("Control anual");
        assertThat(response.getObservacion()).isEqualTo("Sin observaciones");
        assertThat(response.getEstado()).isEqualTo(EstadoEvento.PENDIENTE);
    }
}
