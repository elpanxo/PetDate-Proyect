package cl.PetDate.ms_comentarios.dto;

import java.time.LocalDateTime;

public class ComentarioBlogResponse {

    private Long id;
    private Long idBlog;
    private Long idUsuario;
    private String nombreUsuario;
    private String texto;
    private Integer calificacion;
    private LocalDateTime fecha;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getIdBlog() { return idBlog; }
    public void setIdBlog(Long idBlog) { this.idBlog = idBlog; }
    public Long getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Long idUsuario) { this.idUsuario = idUsuario; }
    public String getNombreUsuario() { return nombreUsuario; }
    public void setNombreUsuario(String nombreUsuario) { this.nombreUsuario = nombreUsuario; }
    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }
    public Integer getCalificacion() { return calificacion; }
    public void setCalificacion(Integer calificacion) { this.calificacion = calificacion; }
    public LocalDateTime getFecha() { return fecha; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }
}
