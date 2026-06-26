package cl.PetDate.ms_servicios.dto;

import jakarta.validation.constraints.*;

/**
 * DTO exclusivo para actualizar un servicio existente.
 * No incluye contrasena: la contraseña solo se cambia a través del
 * flujo de recuperación de contraseña, nunca en la edición del perfil.
 * Esto evita que el frontend tenga que persistir la contraseña en
 * localStorage para poder enviarla en cada actualización.
 */
public class ServicioUpdateRequest {

    @NotBlank(message = "El nombre del servicio es obligatorio")
    private String nombreServicio;

    @NotBlank(message = "El tipo de servicio es obligatorio")
    private String tipoServicio;

    @NotBlank(message = "El RUT de la empresa es obligatorio")
    @Size(min = 8, max = 12, message = "RUT invalido")
    private String rutEmpresa;

    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "Correo invalido")
    private String correo;

    private String descripcion;
    private String direccion;
    private String comuna;
    private String horario;
    private String telefono;

    @Pattern(regexp = "^[0-9]*$", message = "WhatsApp solo debe contener numeros")
    private String whatsApp;

    private String sitioWeb;
    private String instagram;
    private String facebook;

    public String getNombreServicio() { return nombreServicio; }
    public void setNombreServicio(String nombreServicio) { this.nombreServicio = nombreServicio; }
    public String getTipoServicio() { return tipoServicio; }
    public void setTipoServicio(String tipoServicio) { this.tipoServicio = tipoServicio; }
    public String getRutEmpresa() { return rutEmpresa; }
    public void setRutEmpresa(String rutEmpresa) { this.rutEmpresa = rutEmpresa; }
    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }
    public String getComuna() { return comuna; }
    public void setComuna(String comuna) { this.comuna = comuna; }
    public String getHorario() { return horario; }
    public void setHorario(String horario) { this.horario = horario; }
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    public String getWhatsApp() { return whatsApp; }
    public void setWhatsApp(String whatsApp) { this.whatsApp = whatsApp; }
    public String getSitioWeb() { return sitioWeb; }
    public void setSitioWeb(String sitioWeb) { this.sitioWeb = sitioWeb; }
    public String getInstagram() { return instagram; }
    public void setInstagram(String instagram) { this.instagram = instagram; }
    public String getFacebook() { return facebook; }
    public void setFacebook(String facebook) { this.facebook = facebook; }
}
