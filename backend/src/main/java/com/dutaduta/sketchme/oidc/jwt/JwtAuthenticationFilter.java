package com.dutaduta.sketchme.oidc.jwt;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;


@Log4j2
public class JwtAuthenticationFilter extends OncePerRequestFilter {

//    private JwtProvider JwtProvider;


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String path = request.getServletPath();
        log.info(path);

        // 로그인일 경우 jwt 토큰 검사 생략하고 다음 필터 단계로 넘어감
        if (
                true //이거 다시 바꿔줘야함 테스트용도로 냅둔거
//                path.startsWith("/api/oidc") || path.startsWith("/kakao.html")
        ) {
            log.info("JWT filter - doing Login (filter pass~~)");
            filterChain.doFilter(request, response);
            return;
        }

        String secretKey = JwtProvider.getSecretKey();


        String token = JwtProvider.resolveToken(request);
        if(token == null) { //토큰 없는 경우
            log.info("No Token");
            return; // 응답 리팩토링 필요★
        }

        // Token Expired 되었는지 여부
        if (JwtProvider.validateToken(token, secretKey)) {
            filterChain.doFilter(request, response);
            return;
        }

        // UserId Token에서 꺼내기
        String userId = JwtProvider.getUserId(token, secretKey);
        log.info("user oauth_id: {}", userId);

        // 토큰 재발급일 경우 리프레쉬 토큰 확인
        // 위에서 만료됐는지 확인했기 때문에 따로 만료확인 필요 없음
        // 리프레쉬 토큰이 유효한지와 path 정보를 통해 확인이 끝났기 때문에 컨트롤러에서는 바로 토큰 재발행해주고 보내주면 됨
        if (
                !(
                        (path.startsWith("/api/token") && JwtProvider.isRefreshToken(token, secretKey))
                                || JwtProvider.isAccessToken(token, secretKey)
                )
        ) {
            // 재발행 요청 api인데, access token을 전달했을 경우
            // 아니면 access token을 넣어줘야하는데, 다른 토큰을 넣었을 경우
            throw new JwtException("");
        }

        // 권한 부여
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userId, null, List.of(new SimpleGrantedAuthority("USER")));

        // Detail을 넣어줌
        authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authenticationToken); // Spring context에 저장
        log.info("[+] Token in SecurityContextHolder");

        // 다음 필터 단계로 넘어감
        filterChain.doFilter(request, response);
    }
}
