package com.dutaduta.sketchme.oidc.jwt;

import com.dutaduta.sketchme.global.exception.BusinessException;
import com.dutaduta.sketchme.member.domain.Artist;
import com.dutaduta.sketchme.member.domain.User;
import com.dutaduta.sketchme.oidc.dto.UserInfoInAccessTokenDTO;
import jakarta.servlet.http.HttpServletRequest;


public class JwtUtil {
    public static UserInfoInAccessTokenDTO extractUserInfo(HttpServletRequest request){
        String secretKey = JwtProvider.getSecretKey();
        String token = JwtProvider.resolveToken(request);
        Long userId = JwtProvider.getUserId(token, secretKey);
        Long artistId = JwtProvider.getArtistId(token, secretKey);
        return UserInfoInAccessTokenDTO.builder()
                .userId(userId)
                .artistId(artistId).build();
    }
}
