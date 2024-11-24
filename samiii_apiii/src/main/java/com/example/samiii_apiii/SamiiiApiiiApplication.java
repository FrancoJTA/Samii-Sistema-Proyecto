package com.example.samiii_apiii;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class SamiiiApiiiApplication {

    public static void main(String[] args) {
        SpringApplication.run(SamiiiApiiiApplication.class, args);
    }

}