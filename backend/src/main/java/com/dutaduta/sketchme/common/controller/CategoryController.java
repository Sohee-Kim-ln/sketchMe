package com.dutaduta.sketchme.common.controller;

import com.dutaduta.sketchme.common.dto.CategoryRequestDto;
import com.dutaduta.sketchme.common.service.CategoryService;
import com.dutaduta.sketchme.global.ResponseFormat;
import com.dutaduta.sketchme.oidc.jwt.JwtProvider;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Log4j2
public class CategoryController {

    private final CategoryService categoryService;
    @PostMapping("/category")
    public ResponseEntity<ResponseFormat<String>> registCategory(@RequestBody CategoryRequestDto categoryRequestDto, HttpServletRequest request){
        Long artistID = JwtProvider.getArtistId(JwtProvider.resolveToken(request), JwtProvider.getSecretKey());
        categoryService.registCategory(categoryRequestDto, artistID);
        return ResponseFormat.success("카테고리가 성공적으로 등록되었습니다.").toEntity();
    }
}
