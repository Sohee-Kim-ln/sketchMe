package com.dutaduta.sketchme.review.controller;

import com.dutaduta.sketchme.global.ResponseFormat;
import com.dutaduta.sketchme.oidc.jwt.JwtProvider;
import com.dutaduta.sketchme.review.dto.ReviewRequestDto;
import com.dutaduta.sketchme.review.service.ReviewService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@Log4j2
@CrossOrigin
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/review")
    public ResponseEntity<ResponseFormat<String>> writeReview(@RequestBody @Valid ReviewRequestDto reviewRequestDto, HttpServletRequest request){
        log.info(reviewRequestDto.toString());
        Long userId = JwtProvider.getUserId(JwtProvider.resolveToken(request), JwtProvider.getSecretKey());
        reviewService.insertReview(reviewRequestDto, userId);
        return ResponseFormat.success("리뷰가 입력되었습니다.").toEntity();
    }

    @PutMapping("/review")
    public ResponseEntity<ResponseFormat<String>> modifyReview(@RequestBody @Valid ReviewRequestDto reviewRequestDto, HttpServletRequest request){
        Long userId = JwtProvider.getUserId(JwtProvider.resolveToken(request), JwtProvider.getSecretKey());
        reviewService.modifyReview(reviewRequestDto, userId);
        return ResponseFormat.success("리뷰 수정이 완료되었습니다.").toEntity();
    }

    @DeleteMapping("/review")
    public ResponseEntity<ResponseFormat<String>> deleteReview(@RequestBody Map<String, Long> reviewMap, HttpServletRequest request) {
        Long userId = JwtProvider.getUserId(JwtProvider.resolveToken(request), JwtProvider.getSecretKey());
        reviewService.deleteReview(reviewMap.get("reviewID"), userId);
        return ResponseFormat.success("리뷰가 삭제되었습니다.").toEntity();
    }
}
