package cl.PetDate.ms_servicios.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "password_reset_tokens_servicios")
public class PasswordResetToken {

    @Id
    private String id;

    @Indexed
    private String correo;

    private String codigo;

    private LocalDateTime expiracion;

    private boolean usado;

    public PasswordResetToken() {}

    public PasswordResetToken(String correo, String codigo, LocalDateTime expiracion) {
        this.correo = correo;
        this.codigo = codigo;
        this.expiracion = expiracion;
        this.usado = false;
    }

    public String getId() { return id; }
    public String getCorreo() { return correo; }
    public String getCodigo() { return codigo; }
    public LocalDateTime getExpiracion() { return expiracion; }
    public boolean isUsado() { return usado; }

    public void setId(String id) { this.id = id; }
    public void setCorreo(String correo) { this.correo = correo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }
    public void setExpiracion(LocalDateTime expiracion) { this.expiracion = expiracion; }
    public void setUsado(boolean usado) { this.usado = usado; }
}
