package cl.PetDate.ms_citas_medicas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class MsCitasMedicasApplication {
    public static void main(String[] args) {
        SpringApplication.run(MsCitasMedicasApplication.class, args);
    }
}
