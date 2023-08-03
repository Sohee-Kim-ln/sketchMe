package com.dutaduta.sketchme.oidc.jwt;

import com.dutaduta.sketchme.global.CustomStatus;
import com.dutaduta.sketchme.global.ResponseFormat;
import com.dutaduta.sketchme.oidc.exception.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@RequiredArgsConstructor
@Component
public class JwtExceptionHandlerFilter extends OncePerRequestFilter {

    private final ObjectMapper objectMapper;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException{
        try{
            filterChain.doFilter(request, response);
        } catch (ExpiredTokenException e) {
            setErrorResponse(response, CustomStatus.EXPIRED_TOKEN);
        } catch (InvalidTokenException e) {
            setErrorResponse(response, CustomStatus.INVALID_TOKEN);
        } catch (LogoutTokenException e) {
            setErrorResponse(response, CustomStatus.LOGOUT_TOKEN);
        } catch (TokenNotFoundException e) {
            setErrorResponse(response, CustomStatus.NO_TOKEN);
        } catch (RefreshTokenNeededException e) {
            setErrorResponse(response, CustomStatus.NEED_REFRESH_TOKEN);
        } catch (AccessTokenNeededException e) {
            setErrorResponse(response, CustomStatus.NEED_ACCESS_TOKEN);
        }
    }
    private void setErrorResponse(
            HttpServletResponse response,
            CustomStatus customStatus
    ) throws IOException {
        response.setCharacterEncoding("UTF-8");
        response.setStatus(customStatus.getHttpStatusCode());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write(objectMapper.writeValueAsString(ResponseFormat.fail(customStatus)));
    }
}
