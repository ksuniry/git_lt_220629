package com;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.ComponentScan;


@SpringBootApplication
@ComponentScan(basePackages = {"com.mvc","com.core"})
public class Lt220629Application extends SpringBootServletInitializer{
	/*
	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
		return builder.sources(Lt220629Application.class);
	}
*/
	public static void main(String[] args) {
		SpringApplication.run(Lt220629Application.class, args);
	}

}
