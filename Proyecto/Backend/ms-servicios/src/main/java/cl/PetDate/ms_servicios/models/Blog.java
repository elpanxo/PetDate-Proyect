package cl.PetDate.ms_servicios.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "blogs")
public class Blog {

    @Id
    private Long idBlog;

    private Long idServicio;

    private String titulo;

    private LocalDateTime fecha;

    private String texto;

    // URL relativa de la imagen, servida por el servidor de imagenes compartido
    // (Data/image-server) a traves del gateway en /uploads/**
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
