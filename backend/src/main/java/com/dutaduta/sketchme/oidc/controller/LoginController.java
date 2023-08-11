package com.dutaduta.sketchme.oidc.controller;

import com.dutaduta.sketchme.global.ResponseFormat;
import com.dutaduta.sketchme.oidc.dto.TokenResponseDTO;
import com.dutaduta.sketchme.oidc.service.KakaoService;
import com.dutaduta.sketchme.oidc.service.LoginService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.IOException;

@Log4j2
@RestController
public class LoginController {

    @Autowired
    private LoginService loginService;

    @Autowired
    private KakaoService kakaoService;


    @ResponseBody
    @GetMapping("/oidc/kakao")
    public void kakaoCallback(@RequestParam String code, RedirectAttributes redirectAttributes, HttpServletResponse response) throws IOException {
        TokenResponseDTO tokenResponseDto = loginService.KakaoLogin(code);
        redirectAttributes.addAttribute("access_token", tokenResponseDto.getAccess_token());
        redirectAttributes.addAttribute("refresh_token", tokenResponseDto.getRefresh_token());

        String rediret_uri = "https://sketchme.ddns.net/login/kakao/?access_token="+tokenResponseDto.getAccess_token()+"&refresh_token="+tokenResponseDto.getRefresh_token();
        response.sendRedirect(rediret_uri);
    }


    @Cacheable(cacheNames = "KakaoOIDC", cacheManager = "oidcCacheManager")
    @GetMapping("/oidc/kakao/openkeys")
    public String getOpenKeys() throws JSONException {
        return kakaoService.getOpenKeysFromKakaoOIDC();
    };
}
