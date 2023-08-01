package com.dutaduta.sketchme.member.controller;

import com.dutaduta.sketchme.global.CustomStatus;
import com.dutaduta.sketchme.global.ResponseFormat;
import com.dutaduta.sketchme.global.exception.BusinessException;
import com.dutaduta.sketchme.member.service.ArtistService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@Log4j2
@CrossOrigin
public class ArtistController {
    private final ArtistService artistService;

    @GetMapping("/artist/desc/{id}")
    public ResponseEntity<ResponseFormat<String>> getArtistDescription(@PathVariable(name = "id") Long id) {
        log.info("id " + id);
        Optional<String> description = artistService.getDescription(id);
        if (description.isPresent()) {
            return ResponseFormat.success(description.get()).toEntity();
        }
        return ResponseFormat.fail("", CustomStatus.INVALID_INPUT_VALUE).toEntity();
    }

    @PostMapping("/artist/regist")
    public ResponseEntity<?> registArtist(HttpServletRequest request) {
        try {
            Map<String, String> result = new HashMap<>();
            String access_token = artistService.registArtist(request);
            result.put("access_token", access_token);

            // response header에 새로 발급한 access token 저장
//            HttpHeaders httpHeaders = new HttpHeaders();
//            httpHeaders.add("Authorization", "Bearer " + accessToken);

            return ResponseFormat.success(result).toEntity();
        } catch (BusinessException e) {
            return ResponseFormat.fail(CustomStatus.USER_NOT_FOUND).toEntity();
        }
    }

}
