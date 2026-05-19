package cl.PetDate.ms_servicios.dto;

import java.time.LocalDate;

public class PromocionResponse {

    private Long idPromocion;
    private Long idServicio;
    private String titulo;
    private String descripcion;
    private LocalDate fechaInicio;
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
