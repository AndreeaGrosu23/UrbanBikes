package com.andreeagrosu.urbanBikes;

import com.andreeagrosu.urbanBikes.config.AppProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(AppProperties.class)
public class UrbanBikesApplication {

	public static void main(String[] args) {
		SpringApplication.run(UrbanBikesApplication.class, args);
	}

}
