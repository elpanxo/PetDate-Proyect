package cl.PetDate.ms_servicios.models;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "promociones")
public class Promocion {

    @Id
    private Long idPromocion;

    private Long idServicio;

    @NotBlank
    private String titulo;

    private String descripcion;

    @NotNull
    private LocalDate fechaInicio;

    @NotNull
    private LocalDate fechaTermino;

    public Long getIdPromocion() { return idPromocion; }
    public void setIdPromocion(Long idPromocion) { this.idPromocion = idPromocion; }
    public Long getIdServicio() { return idServicio; }
    public void setIdServicio(Long idServicio) { this.idServicio = idServicio; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public LocalDate getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDate fechaInicio) { this.fechaInicio = fechaInicio; }
    public LocalDate getFechaTermino() { return fechaTermino; }
    public void setFechaTermino(LocalDate fechaTermino) { this.fechaTermino = fechaTermino; }
}
