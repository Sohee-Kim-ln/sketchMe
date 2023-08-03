package com.dutaduta.sketchme.oidc.dto;

import com.dutaduta.sketchme.oidc.jwt.JwtProvider;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.Date;

@AllArgsConstructor
@Builder
@Getter
public class TokenResponseDto {
    private String access_token;
    private String refresh_token;
}
