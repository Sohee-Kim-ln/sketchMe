package com.dutaduta.sketchme.member.controller;

import com.dutaduta.sketchme.global.CustomStatus;
import com.dutaduta.sketchme.global.ResponseFormat;
import com.dutaduta.sketchme.global.exception.BusinessException;
import com.dutaduta.sketchme.member.dto.MemberInfoDto;
import com.dutaduta.sketchme.member.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Log4j2
@CrossOrigin
public class UserController {

    private final UserService userService;

    @GetMapping("/user/profile")
    public ResponseEntity<?> getUserProfile(@RequestParam String member, HttpServletRequest request) {
        log.info(member);
        try {
            MemberInfoDto memberInfoDto = userService.getUserInfo(member, request);
            return ResponseFormat.success(memberInfoDto).toEntity();
        } catch (BusinessException e) {
            return ResponseFormat.fail(CustomStatus.USER_NOT_FOUND).toEntity();
        }
    }
}
