package cl.PetDate.api_gateway.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * Registro de auditoría de acceso a datos personales (Ley 19.628).
 * Permite rastrear quién accedió a qué dato, cuándo y con qué resultado.
 */
@Document(collection = "auditoria_accesos")
public class RegistroAuditoria {

    @Id
    private String id;

    // Identidad de quien realizó la solicitud (puede ser null si no hay token / acceso anónimo)
    private Long usuarioId;
    private String rol; // USER, ADMIN, SERVICIO o "ANONIMO" si no hay token

    // Detalles de la solicitud
    private String metodo;       // GET, POST, PUT, PATCH, DELETE
    private String ruta;         // ej: /usuarios/5
    private String recurso;      // ej: usuarios, mascotas, citas, servicios, promociones
    private String recursoId;    // id del recurso accedido, si aplica

    // Resultado
    private Integer status;      // código HTTP de la respuesta
    private String resultado;    // EXITOSO, DENEGADO, ERROR

    // Contexto
    private String direccionIp;
    private LocalDateTime fechaHora;

    public RegistroAuditoria() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public String getMetodo() {
        return metodo;
    }

    public void setMetodo(String metodo) {
        this.metodo = metodo;
    }

    public String getRuta() {
        return ruta;
    }

    public void setRuta(String ruta) {
        this.ruta = ruta;
    }

    public String getRecurso() {
        return recurso;
    }

    public void setRecurso(String recurso) {
        this.recurso = recurso;
    }

    public String getRecursoId() {
        return recursoId;
    }

    public void setRecursoId(String recursoId) {
        this.recursoId = recursoId;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getResultado() {
        return resultado;
    }

    public void setResultado(String resultado) {
        this.resultado = resultado;
    }

    public String getDireccionIp() {
        return direccionIp;
    }

    public void setDireccionIp(String direccionIp) {
        this.direccionIp = direccionIp;
    }

    public LocalDateTime getFechaHora() {
        return fechaHora;
    }

    public void setFechaHora(LocalDateTime fechaHora) {
        this.fechaHora = fechaHora;
    }
}
