package cl.PetDate.ms_servicios.models;

import jakarta.validation.constraints.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "servicios")
public class Servicio {

    @Id
    private Long idServicio;

    @NotBlank
    private String nombreServicio;

    @NotBlank
    private String tipoServicio;

    @NotBlank
    @Size(min = 8, max = 12)
    private String rutEmpresa;

    @NotBlank
    @Email
    @Indexed(unique = true)
    private String correo;

    @NotBlank
    private String contrasena;

    private String descripcion;
    private String direccion;
    private String comuna;
    private String horario;
    private String telefono;

    @Pattern(regexp = "^[0-9]+$", message = "WhatsApp solo debe contener numeros")
    private String whatsApp;

    private String sitioWeb;
    private String instagram;
    private String facebook;

    public Long getIdServicio() { return idServicio; }
    public void setIdServicio(Long idServicio) { this.idServicio = idServicio; }
    public String getNombreServicio() { return nombreServicio; }
    public void setNombreServicio(String nombreServicio) { this.nombreServicio = nombreServicio; }
    public String getTipoServicio() { return tipoServicio; }
    public void setTipoServicio(String tipoServicio) { this.tipoServicio = tipoServicio; }
    public String getRutEmpresa() { return rutEmpresa; }
    public void setRutEmpresa(String rutEmpresa) { this.rutEmpresa = rutEmpresa; }
    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }
    public String getContrasena() { return contrasena; }
    public void setContrasena(String contrasena) { this.contrasena = contrasena; }
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
