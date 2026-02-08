package com.pxp.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class PxpBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(PxpBackendApplication.class, args);
	}

}
