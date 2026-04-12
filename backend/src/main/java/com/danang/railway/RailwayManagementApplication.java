package com.danang.railway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class RailwayManagementApplication {
    public static void main(String[] args) {
        SpringApplication.run(RailwayManagementApplication.class, args);
    }
}
