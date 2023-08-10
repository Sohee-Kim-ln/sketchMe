package com.dutaduta.sketchme.oidc.controller;

import com.dutaduta.sketchme.global.ResponseFormat;
import com.dutaduta.sketchme.oidc.dto.TokenResponseDTO;
import com.dutaduta.sketchme.oidc.service.KakaoService;
import com.dutaduta.sketchme.oidc.service.LoginService;
import lombok.extern.log4j.Log4j2;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Log4j2
@RestController
public class LoginController {

    @Autowired
    private LoginService loginService;

    @Autowired
    private KakaoService kakaoService;


    @ResponseBody
    @GetMapping("/oidc/kakao")
    public ResponseEntity<?> kakaoCallback(@RequestParam String code) {
        TokenResponseDTO tokenResponseDto = loginService.KakaoLogin(code);
        return ResponseFormat.success(tokenResponseDto).toEntity();
    }


    @Cacheable(cacheNames = "KakaoOIDC", cacheManager = "oidcCacheManager")
    @GetMapping("/oidc/kakao/openkeys")
    public String getOpenKeys() throws JSONException {
        return kakaoService.getOpenKeysFromKakaoOIDC();
    };
}
