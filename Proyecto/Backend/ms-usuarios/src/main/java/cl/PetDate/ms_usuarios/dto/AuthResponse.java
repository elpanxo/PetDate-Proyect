package cl.PetDate.ms_usuarios.dto;

public class AuthResponse {

    private String token;
    private String error;

    public AuthResponse(String token, String error) {
        this.token = token;
        this.error = error;
    }

    public String getToken() { return token; }
    public String getError() { return error; }
}
