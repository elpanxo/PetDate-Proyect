package cl.PetDate.ms_mascotas.dto;
import jakarta.validation.constraints.*;

import java.util.Date;

public class MascotaRequest {

    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 2, max = 50)
    private String nombre;

    @NotBlank(message = "La especie es obligatoria")
    private String especie;

    @NotBlank(message = "La raza es obligatoria")
    private String raza;

    @Min(value = 0) @Max(value = 50)
    private int edad;

    @NotBlank(message = "El tamaño es obligatorio")
    private String tamano;

    @NotNull(message = "El usuarioId es obligatorio")
    private Long usuarioId;

    @Min(value = 0, message = "El peso no puede ser negativa")
    private float peso;

    @NotNull(message = "El sexo es obligatorio")
    private String sexo;

    private Date fecha_nacimineto;

    private String color;

    private String observaciones;

    private  String info_medica_basica;

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEspecie() {
        return especie;
    }

    public void setEspecie(String especie) {
        this.especie = especie;
    }

    public String getRaza() {
        return raza;
    }

    public void setRaza(String raza) {
        this.raza = raza;
    }

    public int getEdad() {
        return edad;
    }

    public void setEdad(int edad) {
        this.edad = edad;
    }

    public String getTamano() {
        return tamano;
    }

    public void setTamano(String tamano) {
        this.tamano = tamano;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public float getPeso() {
        return peso;
    }

    public void setPeso(float peso) {
        this.peso = peso;
    }

    public String getSexo() {
        return sexo;
    }

    public void setSexo(String sexo) {
        this.sexo = sexo;
    }

    public Date getFecha_nacimineto() {
        return fecha_nacimineto;
    }

    public void setFecha_nacimineto(Date fecha_nacimineto) {
        this.fecha_nacimineto = fecha_nacimineto;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    public String getInfo_medica_basica() {
        return info_medica_basica;
    }

    public void setInfo_medica_basica(String info_medica_basica) {
        this.info_medica_basica = info_medica_basica;
    }
}
