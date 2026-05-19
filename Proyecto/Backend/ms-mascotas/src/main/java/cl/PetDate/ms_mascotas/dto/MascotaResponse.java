package cl.PetDate.ms_mascotas.dto;

import jakarta.validation.constraints.NotNull;

import java.util.Date;

public class MascotaResponse {

    private Long id;
    private String nombre;
    private String especie;
    private String raza;
    private int edad;
    private String tamano;
    private Long usuarioId;
    private float peso;
    private String sexo;
    private Date fecha_nacimineto;
    private String color;
    private String observaciones;
    private  String info_medica_basica;

    public MascotaResponse() {
    }

    public MascotaResponse(Long id, String nombre, String especie, String raza, int edad, String tamano, Long usuarioId, Float peso, String sexo,Date fecha_nacimineto , String color, String observaciones, String info_medica_basica) {
        this.id = id;
        this.nombre = nombre;
        this.especie = especie;
        this.raza = raza;
        this.edad = edad;
        this.tamano = tamano;
        this.usuarioId = usuarioId;
        this.peso = peso;
        this.sexo = sexo;
        this.fecha_nacimineto = fecha_nacimineto;
        this.color = color;
        this.observaciones = observaciones;
        this.info_medica_basica = info_medica_basica;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public int getEdad() {
        return edad;
    }

    public void setEdad(int edad) {
        this.edad = edad;
    }

    public String getRaza() {
        return raza;
    }

    public void setRaza(String raza) {
        this.raza = raza;
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
