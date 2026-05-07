package cl.PetDate.ms_mascotas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class MsMascotasApplication {

	public static void main(String[] args) {
		SpringApplication.run(MsMascotasApplication.class, args);
	}

}
