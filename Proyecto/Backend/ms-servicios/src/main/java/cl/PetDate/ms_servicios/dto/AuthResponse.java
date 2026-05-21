package cl.PetDate.ms_servicios.dto;

public class AuthResponse {

    private String token;
    private String tipo;

    public AuthResponse(String token, String tipo) {
        this.token = token;
        this.tipo = tipo;
    }

    public String getToken() { return token; }
    public String getTipo() { return tipo; }
}
