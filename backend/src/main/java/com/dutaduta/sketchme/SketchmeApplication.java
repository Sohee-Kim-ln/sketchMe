package com.dutaduta.sketchme;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.ApplicationPidFileWriter;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@EnableJpaAuditing // auditing 활성화 (BaseEntity인 생성날짜, 수정날짜 자동 생성)
@EnableWebMvc
@EnableJpaAuditing
@SpringBootApplication
public class SketchmeApplication {

    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(SketchmeApplication.class);
        app.addListeners(new ApplicationPidFileWriter()); // pid 파일을 생성하는 writer 등록
        app.run(args);
    }
}
