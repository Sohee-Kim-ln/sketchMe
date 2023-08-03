package com.dutaduta.sketchme.config;

import com.dutaduta.sketchme.oidc.jwt.JwtAuthenticationFilter;
import com.dutaduta.sketchme.oidc.jwt.JwtExceptionHandlerFilter;
import com.dutaduta.sketchme.oidc.jwt.JwtProvider;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import lombok.extern.log4j.Log4j2;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;


@Configuration
@EnableWebSecurity // 현재 클래스를 스프링 필터체인에 등록
@Log4j2
@RequiredArgsConstructor
public class WebSecurityConfig {

    private final com.dutaduta.sketchme.oidc.jwt.JwtProvider JwtProvider;
    private final RedisTemplate<String, String> redisTemplate;
    private final JwtExceptionHandlerFilter jwtExceptionHandlerFilter;

    /**
     * 인가가 필요한 리소스 설정 (특정 경로에 대한 설정 변경)
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http.httpBasic((basic) -> basic.disable());


        /** API 개발을 위해 Spring Security 비활성화 */
        http
                // Use httpBasic with default configuration
                .httpBasic(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                // CORS (기본 설정으로 활성화)
                .cors(Customizer.withDefaults())
                // 접근권한 설정 (요청에 의해 보안 검사 시작)
                .authorizeRequests(requests -> {
                    requests.requestMatchers(new AntPathRequestMatcher("/**")).permitAll(); // 로그인 경로는 모든 사용자에게 허락
//                    requests.requestMatchers(new AntPathRequestMatcher("/api/*")).authenticated(); // 그 외에는 인증된 사용자만 허락
                })
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // JWT 쓸 때 사용
                )
                .addFilterBefore(jwtExceptionHandlerFilter, UsernamePasswordAuthenticationFilter.class) // ExceptionHandler 필터가 앞에 와야 함!
                .addFilterBefore(new JwtAuthenticationFilter(JwtProvider, redisTemplate), UsernamePasswordAuthenticationFilter.class) // UsernamePasswordAuthenticationFilter 앞에 JwtFilter 추가
                ;


        return http.build();
    }
}