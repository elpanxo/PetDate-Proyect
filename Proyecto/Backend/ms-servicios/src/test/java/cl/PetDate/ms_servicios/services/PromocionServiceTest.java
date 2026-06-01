package cl.PetDate.ms_servicios.services;

import cl.PetDate.ms_servicios.dto.PromocionRequest;
import cl.PetDate.ms_servicios.dto.PromocionResponse;
import cl.PetDate.ms_servicios.exceptions.PromocionNotFoundException;
import cl.PetDate.ms_servicios.exceptions.ServicioNotFoundException;
import cl.PetDate.ms_servicios.models.Promocion;
import cl.PetDate.ms_servicios.models.Servicio;
import cl.PetDate.ms_servicios.repositories.PromocionRepository;
import cl.PetDate.ms_servicios.repositories.ServicioRepository;
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
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Tests unitarios - PromocionService")
class PromocionServiceTest {

    @Mock
    private PromocionRepository promocionRepository;

    @Mock
    private ServicioRepository servicioRepository;

    @Mock
    private SequenceGeneratorService sequenceGeneratorService;

    @InjectMocks
    private PromocionService promocionService;

    private PromocionRequest requestValido;
    private Promocion promocionGuardada;
    private Servicio servicioExistente;
    private Pageable pageable;

    @BeforeEach
    void setUp() {
        requestValido = new PromocionRequest();
        requestValido.setIdServicio(1L);
        requestValido.setTitulo("50% en consultas");
        requestValido.setDescripcion("Descuento especial de verano");
        requestValido.setFechaInicio(LocalDate.of(2026, 6, 1));
        requestValido.setFechaTermino(LocalDate.of(2026, 6, 30));

        promocionGuardada = new Promocion();
        promocionGuardada.setIdPromocion(1L);
        promocionGuardada.setIdServicio(1L);
        promocionGuardada.setTitulo("50% en consultas");
        promocionGuardada.setDescripcion("Descuento especial de verano");
        promocionGuardada.setFechaInicio(LocalDate.of(2026, 6, 1));
        promocionGuardada.setFechaTermino(LocalDate.of(2026, 6, 30));

        servicioExistente = new Servicio();
        servicioExistente.setIdServicio(1L);
        servicioExistente.setNombreServicio("Veterinaria PetCare");

        pageable = PageRequest.of(0, 10);
    }

    // ─────────────────────────────────────────────
    // crearPromocion
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("crearPromocion - debe crear y retornar la promoción correctamente")
    void crearPromocion_exitoso() {
        when(servicioRepository.findById(1L)).thenReturn(Optional.of(servicioExistente));
        when(sequenceGeneratorService.generateSequence(anyString())).thenReturn(1L);
        when(promocionRepository.save(any(Promocion.class))).thenReturn(promocionGuardada);

        PromocionResponse response = promocionService.crearPromocion(requestValido);

        assertThat(response).isNotNull();
        assertThat(response.getIdPromocion()).isEqualTo(1L);
        assertThat(response.getIdServicio()).isEqualTo(1L);
        assertThat(response.getTitulo()).isEqualTo("50% en consultas");
        assertThat(response.getFechaInicio()).isEqualTo(LocalDate.of(2026, 6, 1));
        assertThat(response.getFechaTermino()).isEqualTo(LocalDate.of(2026, 6, 30));

        verify(promocionRepository).save(any(Promocion.class));
        verify(servicioRepository).findById(1L);
    }

    @Test
    @DisplayName("crearPromocion - debe lanzar ServicioNotFoundException si el servicio no existe")
    void crearPromocion_servicioNoExiste() {
        when(servicioRepository.findById(99L)).thenReturn(Optional.empty());
        requestValido.setIdServicio(99L);

        assertThatThrownBy(() -> promocionService.crearPromocion(requestValido))
                .isInstanceOf(ServicioNotFoundException.class);

        verify(promocionRepository, never()).save(any());
    }

    // ─────────────────────────────────────────────
    // listarPromociones
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("listarPromociones - debe retornar página de promociones")
    void listarPromociones_retornaPagina() {
        Promocion segunda = new Promocion();
        segunda.setIdPromocion(2L);
        segunda.setIdServicio(1L);
        segunda.setTitulo("Vacuna gratis");
        segunda.setFechaInicio(LocalDate.of(2026, 7, 1));
        segunda.setFechaTermino(LocalDate.of(2026, 7, 31));

        when(promocionRepository.findAll(pageable))
                .thenReturn(new PageImpl<>(List.of(promocionGuardada, segunda)));

        Page<PromocionResponse> resultado = promocionService.listarPromociones(pageable);

        assertThat(resultado.getContent()).hasSize(2);
        assertThat(resultado.getContent().get(0).getTitulo()).isEqualTo("50% en consultas");
        assertThat(resultado.getContent().get(1).getTitulo()).isEqualTo("Vacuna gratis");
    }

    @Test
    @DisplayName("listarPromociones - debe retornar página vacía si no hay promociones")
    void listarPromociones_paginaVacia() {
        when(promocionRepository.findAll(pageable)).thenReturn(Page.empty());

        Page<PromocionResponse> resultado = promocionService.listarPromociones(pageable);

        assertThat(resultado.getContent()).isEmpty();
    }

    // ─────────────────────────────────────────────
    // buscarPorId
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("buscarPorId - debe retornar la promoción si existe")
    void buscarPorId_promocionExiste() {
        when(promocionRepository.findById(1L)).thenReturn(Optional.of(promocionGuardada));

        PromocionResponse response = promocionService.buscarPorId(1L);

        assertThat(response).isNotNull();
        assertThat(response.getIdPromocion()).isEqualTo(1L);
        assertThat(response.getTitulo()).isEqualTo("50% en consultas");
    }

    @Test
    @DisplayName("buscarPorId - debe lanzar PromocionNotFoundException si no existe")
    void buscarPorId_promocionNoExiste() {
        when(promocionRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> promocionService.buscarPorId(99L))
                .isInstanceOf(PromocionNotFoundException.class);
    }

    // ─────────────────────────────────────────────
    // buscarPorServicio
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("buscarPorServicio - debe retornar promociones del servicio")
    void buscarPorServicio_retornaPromociones() {
        when(promocionRepository.findByIdServicio(1L, pageable))
                .thenReturn(new PageImpl<>(List.of(promocionGuardada)));

        Page<PromocionResponse> resultado = promocionService.buscarPorServicio(1L, pageable);

        assertThat(resultado.getContent()).hasSize(1);
        assertThat(resultado.getContent().get(0).getIdServicio()).isEqualTo(1L);
    }

    @Test
    @DisplayName("buscarPorServicio - debe retornar página vacía si el servicio no tiene promociones")
    void buscarPorServicio_sinPromociones() {
        when(promocionRepository.findByIdServicio(99L, pageable)).thenReturn(Page.empty());

        Page<PromocionResponse> resultado = promocionService.buscarPorServicio(99L, pageable);

        assertThat(resultado.getContent()).isEmpty();
    }

    // ─────────────────────────────────────────────
    // actualizarPromocion
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("actualizarPromocion - debe actualizar y retornar la promoción")
    void actualizarPromocion_exitoso() {
        PromocionRequest requestActualizado = new PromocionRequest();
        requestActualizado.setIdServicio(1L);
        requestActualizado.setTitulo("30% en baños");
        requestActualizado.setDescripcion("Promo invierno");
        requestActualizado.setFechaInicio(LocalDate.of(2026, 8, 1));
        requestActualizado.setFechaTermino(LocalDate.of(2026, 8, 31));

        Promocion promocionActualizada = new Promocion();
        promocionActualizada.setIdPromocion(1L);
        promocionActualizada.setIdServicio(1L);
        promocionActualizada.setTitulo("30% en baños");
        promocionActualizada.setDescripcion("Promo invierno");
        promocionActualizada.setFechaInicio(LocalDate.of(2026, 8, 1));
        promocionActualizada.setFechaTermino(LocalDate.of(2026, 8, 31));

        when(promocionRepository.findById(1L)).thenReturn(Optional.of(promocionGuardada));
        when(promocionRepository.save(any(Promocion.class))).thenReturn(promocionActualizada);

        PromocionResponse response = promocionService.actualizarPromocion(1L, requestActualizado);

        assertThat(response.getTitulo()).isEqualTo("30% en baños");
        assertThat(response.getDescripcion()).isEqualTo("Promo invierno");
        assertThat(response.getFechaInicio()).isEqualTo(LocalDate.of(2026, 8, 1));
        verify(promocionRepository).save(any(Promocion.class));
    }

    @Test
    @DisplayName("actualizarPromocion - debe lanzar PromocionNotFoundException si no existe")
    void actualizarPromocion_promocionNoExiste() {
        when(promocionRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> promocionService.actualizarPromocion(99L, requestValido))
                .isInstanceOf(PromocionNotFoundException.class);

        verify(promocionRepository, never()).save(any());
    }

    // ─────────────────────────────────────────────
    // eliminarPromocion
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("eliminarPromocion - debe eliminar la promoción si existe")
    void eliminarPromocion_exitoso() {
        when(promocionRepository.findById(1L)).thenReturn(Optional.of(promocionGuardada));

        promocionService.eliminarPromocion(1L);

        verify(promocionRepository).delete(promocionGuardada);
    }

    @Test
    @DisplayName("eliminarPromocion - debe lanzar PromocionNotFoundException si no existe")
    void eliminarPromocion_promocionNoExiste() {
        when(promocionRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> promocionService.eliminarPromocion(99L))
                .isInstanceOf(PromocionNotFoundException.class);

        verify(promocionRepository, never()).delete(any());
    }

    // ─────────────────────────────────────────────
    // toResponse - verificar mapeo correcto
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("buscarPorId - debe mapear todos los campos correctamente")
    void buscarPorId_mapeoCorrectoDeResponse() {
        when(promocionRepository.findById(1L)).thenReturn(Optional.of(promocionGuardada));

        PromocionResponse response = promocionService.buscarPorId(1L);

        assertThat(response.getIdPromocion()).isEqualTo(1L);
        assertThat(response.getIdServicio()).isEqualTo(1L);
        assertThat(response.getTitulo()).isEqualTo("50% en consultas");
        assertThat(response.getDescripcion()).isEqualTo("Descuento especial de verano");
        assertThat(response.getFechaInicio()).isEqualTo(LocalDate.of(2026, 6, 1));
        assertThat(response.getFechaTermino()).isEqualTo(LocalDate.of(2026, 6, 30));
    }
}
