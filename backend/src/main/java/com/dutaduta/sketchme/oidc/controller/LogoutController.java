package com.dutaduta.sketchme.oidc.controller;

import com.dutaduta.sketchme.global.ResponseFormat;
import com.dutaduta.sketchme.global.exception.BusinessException;
import com.dutaduta.sketchme.oidc.service.LogoutService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Log4j2
@RestController
@RequiredArgsConstructor
@CrossOrigin
public class LogoutController {

    private final LogoutService logoutService;

    @PostMapping("/user/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        logoutService.logout(request);
        return ResponseFormat.success("로그아웃이 완료되었습니다.").toEntity();
    }
}
