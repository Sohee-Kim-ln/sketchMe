package com.dutaduta.sketchme.oidc.controller;

import com.dutaduta.sketchme.oidc.dto.TokenDto;
import com.dutaduta.sketchme.oidc.jwt.JwtProvider;
import com.dutaduta.sketchme.oidc.service.KakaoService;
import com.dutaduta.sketchme.oidc.service.LoginService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.log4j.Log4j2;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Log4j2
@RestController
@RequestMapping("/api/oidc")
public class LoginController {

    @Autowired
    private LoginService loginService;

    @Autowired
    private KakaoService kakaoService;


    @ResponseBody
    @GetMapping("/kakao")
    public ResponseEntity<TokenDto> kakaoCallback(@RequestParam String code) {
        return loginService.KakaoLogin(code);
    }

    @Cacheable(cacheNames = "KakaoOIDC", cacheManager = "oidcCacheManager")
    @GetMapping("/kakao/openkeys")
    public String getOpenKeys() throws JSONException {
        return kakaoService.getOpenKeysFromKakaoOIDC();
    };
}
