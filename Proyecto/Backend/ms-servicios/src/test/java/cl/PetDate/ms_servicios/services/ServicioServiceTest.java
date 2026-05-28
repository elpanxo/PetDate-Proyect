package cl.PetDate.ms_servicios.services;

import cl.PetDate.ms_servicios.dto.ServicioRequest;
import cl.PetDate.ms_servicios.dto.ServicioResponse;
import cl.PetDate.ms_servicios.exceptions.CorreoDuplicadoException;
import cl.PetDate.ms_servicios.exceptions.ServicioNotFoundException;
import cl.PetDate.ms_servicios.models.Servicio;
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
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Tests unitarios - ServicioService")
class ServicioServiceTest {

    @Mock
    private ServicioRepository servicioRepository;

    @Mock
    private SequenceGeneratorService sequenceGeneratorService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private ServicioService servicioService;

    private ServicioRequest requestValido;
    private Servicio servicioGuardado;
    private Pageable pageable;

    @BeforeEach
    void setUp() {
        requestValido = new ServicioRequest();
        requestValido.setNombreServicio("Veterinaria PetCare");
        requestValido.setTipoServicio("Veterinaria");
        requestValido.setRutEmpresa("76123456-7");
        requestValido.setCorreo("petcare@mail.com");
        requestValido.setContrasena("pass123");
        requestValido.setDescripcion("Servicios veterinarios");
        requestValido.setDireccion("Av. Principal 123");
        requestValido.setComuna("Santiago");
        requestValido.setHorario("Lunes a Viernes 9-18");
        requestValido.setTelefono("222334455");
        requestValido.setWhatsApp("912345678");
        requestValido.setSitioWeb("www.petcare.cl");
        requestValido.setInstagram("@petcare");
        requestValido.setFacebook("facebook.com/petcare");

        servicioGuardado = new Servicio();
        servicioGuardado.setIdServicio(1L);
        servicioGuardado.setNombreServicio("Veterinaria PetCare");
        servicioGuardado.setTipoServicio("Veterinaria");
        servicioGuardado.setRutEmpresa("76123456-7");
        servicioGuardado.setCorreo("petcare@mail.com");
        servicioGuardado.setContrasena("$2a$hashed");
        servicioGuardado.setDescripcion("Servicios veterinarios");
        servicioGuardado.setDireccion("Av. Principal 123");
        servicioGuardado.setComuna("Santiago");
        servicioGuardado.setHorario("Lunes a Viernes 9-18");
        servicioGuardado.setTelefono("222334455");
        servicioGuardado.setWhatsApp("912345678");
        servicioGuardado.setSitioWeb("www.petcare.cl");
        servicioGuardado.setInstagram("@petcare");
        servicioGuardado.setFacebook("facebook.com/petcare");

        pageable = PageRequest.of(0, 10);
    }

    // ─────────────────────────────────────────────
    // crearServicio
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("crearServicio - debe crear y retornar el servicio correctamente")
    void crearServicio_exitoso() {
        when(servicioRepository.findByCorreo("petcare@mail.com")).thenReturn(Optional.empty());
        when(sequenceGeneratorService.generateSequence(anyString())).thenReturn(1L);
        when(passwordEncoder.encode("pass123")).thenReturn("$2a$hashed");
        when(servicioRepository.save(any(Servicio.class))).thenReturn(servicioGuardado);

        ServicioResponse response = servicioService.crearServicio(requestValido);

        assertThat(response).isNotNull();
        assertThat(response.getIdServicio()).isEqualTo(1L);
        assertThat(response.getNombreServicio()).isEqualTo("Veterinaria PetCare");
        assertThat(response.getTipoServicio()).isEqualTo("Veterinaria");
        assertThat(response.getCorreo()).isEqualTo("petcare@mail.com");
        assertThat(response.getComuna()).isEqualTo("Santiago");

        verify(servicioRepository).save(any(Servicio.class));
        verify(passwordEncoder).encode("pass123");
    }

    @Test
    @DisplayName("crearServicio - debe lanzar CorreoDuplicadoException si el correo ya existe")
    void crearServicio_correoDuplicado() {
        when(servicioRepository.findByCorreo("petcare@mail.com"))
                .thenReturn(Optional.of(servicioGuardado));

        assertThatThrownBy(() -> servicioService.crearServicio(requestValido))
                .isInstanceOf(CorreoDuplicadoException.class);

        verify(servicioRepository, never()).save(any());
    }

    @Test
    @DisplayName("crearServicio - la contraseña debe quedar encriptada")
    void crearServicio_contrasenaEncriptada() {
        when(servicioRepository.findByCorreo(anyString())).thenReturn(Optional.empty());
        when(sequenceGeneratorService.generateSequence(anyString())).thenReturn(1L);
        when(passwordEncoder.encode("pass123")).thenReturn("$2a$hashed");
        when(servicioRepository.save(any(Servicio.class))).thenReturn(servicioGuardado);

        servicioService.crearServicio(requestValido);

        verify(passwordEncoder).encode("pass123");
        verify(servicioRepository).save(argThat(s ->
                !s.getContrasena().equals("pass123")
        ));
    }

    @Test
    @DisplayName("crearServicio - la respuesta no debe incluir la contraseña")
    void crearServicio_responseNoIncluieContrasena() {
        when(servicioRepository.findByCorreo(anyString())).thenReturn(Optional.empty());
        when(sequenceGeneratorService.generateSequence(anyString())).thenReturn(1L);
        when(passwordEncoder.encode(anyString())).thenReturn("$2a$hashed");
        when(servicioRepository.save(any(Servicio.class))).thenReturn(servicioGuardado);

        ServicioResponse response = servicioService.crearServicio(requestValido);

        // ServicioResponse no tiene campo contrasena — verificamos que no expone datos sensibles
        assertThat(response.getClass().getDeclaredFields())
                .noneMatch(f -> f.getName().equalsIgnoreCase("contrasena"));
    }

    // ─────────────────────────────────────────────
    // listarServicios
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("listarServicios - debe retornar página de servicios")
    void listarServicios_retornaPagina() {
        Servicio segundo = new Servicio();
        segundo.setIdServicio(2L);
        segundo.setNombreServicio("Peluquería Canina");
        segundo.setTipoServicio("Peluquería");
        segundo.setCorreo("peluqueria@mail.com");

        when(servicioRepository.findAll(pageable))
                .thenReturn(new PageImpl<>(List.of(servicioGuardado, segundo)));

        Page<ServicioResponse> resultado = servicioService.listarServicios(pageable);

        assertThat(resultado.getContent()).hasSize(2);
        assertThat(resultado.getContent().get(0).getNombreServicio()).isEqualTo("Veterinaria PetCare");
        assertThat(resultado.getContent().get(1).getNombreServicio()).isEqualTo("Peluquería Canina");
    }

    @Test
    @DisplayName("listarServicios - debe retornar página vacía si no hay servicios")
    void listarServicios_paginaVacia() {
        when(servicioRepository.findAll(pageable)).thenReturn(Page.empty());

        Page<ServicioResponse> resultado = servicioService.listarServicios(pageable);

        assertThat(resultado.getContent()).isEmpty();
    }

    // ─────────────────────────────────────────────
    // buscarPorId
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("buscarPorId - debe retornar el servicio si existe")
    void buscarPorId_servicioExiste() {
        when(servicioRepository.findById(1L)).thenReturn(Optional.of(servicioGuardado));

        ServicioResponse response = servicioService.buscarPorId(1L);

        assertThat(response).isNotNull();
        assertThat(response.getIdServicio()).isEqualTo(1L);
        assertThat(response.getNombreServicio()).isEqualTo("Veterinaria PetCare");
    }

    @Test
    @DisplayName("buscarPorId - debe lanzar ServicioNotFoundException si no existe")
    void buscarPorId_servicioNoExiste() {
        when(servicioRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> servicioService.buscarPorId(99L))
                .isInstanceOf(ServicioNotFoundException.class);
    }

    // ─────────────────────────────────────────────
    // buscarPorTipo
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("buscarPorTipo - debe retornar servicios del tipo indicado")
    void buscarPorTipo_retornaServicios() {
        when(servicioRepository.findByTipoServicio("Veterinaria", pageable))
                .thenReturn(new PageImpl<>(List.of(servicioGuardado)));

        Page<ServicioResponse> resultado = servicioService.buscarPorTipo("Veterinaria", pageable);

        assertThat(resultado.getContent()).hasSize(1);
        assertThat(resultado.getContent().get(0).getTipoServicio()).isEqualTo("Veterinaria");
    }

    @Test
    @DisplayName("buscarPorTipo - debe retornar página vacía si no hay servicios de ese tipo")
    void buscarPorTipo_sinResultados() {
        when(servicioRepository.findByTipoServicio("Spa", pageable)).thenReturn(Page.empty());

        Page<ServicioResponse> resultado = servicioService.buscarPorTipo("Spa", pageable);

        assertThat(resultado.getContent()).isEmpty();
    }

    // ─────────────────────────────────────────────
    // buscarPorComuna
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("buscarPorComuna - debe retornar servicios de la comuna indicada")
    void buscarPorComuna_retornaServicios() {
        when(servicioRepository.findByComuna("Santiago", pageable))
                .thenReturn(new PageImpl<>(List.of(servicioGuardado)));

        Page<ServicioResponse> resultado = servicioService.buscarPorComuna("Santiago", pageable);

        assertThat(resultado.getContent()).hasSize(1);
        assertThat(resultado.getContent().get(0).getComuna()).isEqualTo("Santiago");
    }

    @Test
    @DisplayName("buscarPorComuna - debe retornar página vacía si no hay servicios en esa comuna")
    void buscarPorComuna_sinResultados() {
        when(servicioRepository.findByComuna("Valdivia", pageable)).thenReturn(Page.empty());

        Page<ServicioResponse> resultado = servicioService.buscarPorComuna("Valdivia", pageable);

        assertThat(resultado.getContent()).isEmpty();
    }

    // ─────────────────────────────────────────────
    // actualizarServicio
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("actualizarServicio - debe actualizar y retornar el servicio")
    void actualizarServicio_exitoso() {
        ServicioRequest requestActualizado = new ServicioRequest();
        requestActualizado.setNombreServicio("Veterinaria PetCare Plus");
        requestActualizado.setTipoServicio("Veterinaria");
        requestActualizado.setRutEmpresa("76123456-7");
        requestActualizado.setCorreo("petcare_plus@mail.com");
        requestActualizado.setContrasena("newpass123");
        requestActualizado.setComuna("Providencia");

        Servicio servicioActualizado = new Servicio();
        servicioActualizado.setIdServicio(1L);
        servicioActualizado.setNombreServicio("Veterinaria PetCare Plus");
        servicioActualizado.setTipoServicio("Veterinaria");
        servicioActualizado.setCorreo("petcare_plus@mail.com");
        servicioActualizado.setComuna("Providencia");

        when(servicioRepository.findById(1L)).thenReturn(Optional.of(servicioGuardado));
        when(passwordEncoder.encode("newpass123")).thenReturn("$2a$nuevo_hash");
        when(servicioRepository.save(any(Servicio.class))).thenReturn(servicioActualizado);

        ServicioResponse response = servicioService.actualizarServicio(1L, requestActualizado);

        assertThat(response.getNombreServicio()).isEqualTo("Veterinaria PetCare Plus");
        assertThat(response.getComuna()).isEqualTo("Providencia");
        verify(servicioRepository).save(any(Servicio.class));
        verify(passwordEncoder).encode("newpass123");
    }

    @Test
    @DisplayName("actualizarServicio - debe lanzar ServicioNotFoundException si no existe")
    void actualizarServicio_servicioNoExiste() {
        when(servicioRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> servicioService.actualizarServicio(99L, requestValido))
                .isInstanceOf(ServicioNotFoundException.class);

        verify(servicioRepository, never()).save(any());
    }

    // ─────────────────────────────────────────────
    // eliminarServicio
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("eliminarServicio - debe eliminar el servicio si existe")
    void eliminarServicio_exitoso() {
        when(servicioRepository.findById(1L)).thenReturn(Optional.of(servicioGuardado));

        servicioService.eliminarServicio(1L);

        verify(servicioRepository).delete(servicioGuardado);
    }

    @Test
    @DisplayName("eliminarServicio - debe lanzar ServicioNotFoundException si no existe")
    void eliminarServicio_servicioNoExiste() {
        when(servicioRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> servicioService.eliminarServicio(99L))
                .isInstanceOf(ServicioNotFoundException.class);

        verify(servicioRepository, never()).delete(any());
    }

    // ─────────────────────────────────────────────
    // toResponse - verificar mapeo correcto
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("buscarPorId - debe mapear todos los campos correctamente")
    void buscarPorId_mapeoCorrectoDeResponse() {
        when(servicioRepository.findById(1L)).thenReturn(Optional.of(servicioGuardado));

        ServicioResponse response = servicioService.buscarPorId(1L);

        assertThat(response.getIdServicio()).isEqualTo(1L);
        assertThat(response.getNombreServicio()).isEqualTo("Veterinaria PetCare");
        assertThat(response.getTipoServicio()).isEqualTo("Veterinaria");
        assertThat(response.getRutEmpresa()).isEqualTo("76123456-7");
        assertThat(response.getCorreo()).isEqualTo("petcare@mail.com");
        assertThat(response.getDescripcion()).isEqualTo("Servicios veterinarios");
        assertThat(response.getDireccion()).isEqualTo("Av. Principal 123");
        assertThat(response.getComuna()).isEqualTo("Santiago");
        assertThat(response.getHorario()).isEqualTo("Lunes a Viernes 9-18");
        assertThat(response.getTelefono()).isEqualTo("222334455");
        assertThat(response.getWhatsApp()).isEqualTo("912345678");
        assertThat(response.getSitioWeb()).isEqualTo("www.petcare.cl");
        assertThat(response.getInstagram()).isEqualTo("@petcare");
        assertThat(response.getFacebook()).isEqualTo("facebook.com/petcare");
    }
}
