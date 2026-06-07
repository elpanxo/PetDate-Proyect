package cl.PetDate.ms_servicios.dto;

import java.time.LocalDateTime;

public class BlogResponse {

    private Long idBlog;
    private Long idServicio;
    private String titulo;
    private LocalDateTime fecha;
    private String texto;
    private String imagen;

    public Long getIdBlog() { return idBlog; }
    public void setIdBlog(Long idBlog) { this.idBlog = idBlog; }
    public Long getIdServicio() { return idServicio; }
    public void setIdServicio(Long idServicio) { this.idServicio = idServicio; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public LocalDateTime getFecha() { return fecha; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }
    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }
    public String getImagen() { return imagen; }
    public void setImagen(String imagen) { this.imagen = imagen; }
}
