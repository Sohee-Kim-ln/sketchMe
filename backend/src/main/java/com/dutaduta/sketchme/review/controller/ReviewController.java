package com.dutaduta.sketchme.review.controller;

import com.dutaduta.sketchme.global.ResponseFormat;
import com.dutaduta.sketchme.oidc.dto.UserInfoInAccessTokenDTO;
import com.dutaduta.sketchme.oidc.jwt.JwtUtil;
import com.dutaduta.sketchme.review.controller.request.ReviewCreateRequest;
import com.dutaduta.sketchme.review.service.ReviewService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ReviewController {

	private final ReviewService reviewService;

	@PostMapping("api/meeting/{meetingId}/review")
	public ResponseEntity<ResponseFormat<Long>> registerReview(@Valid @RequestBody ReviewCreateRequest request, HttpServletRequest httpServletRequest, @PathVariable("meetingId") long meetingId){
		UserInfoInAccessTokenDTO userInfo = JwtUtil.extractUserInfo(httpServletRequest);
		long reviewId = reviewService.registerReview(userInfo, meetingId, request.toServiceRequest());
		return ResponseFormat.success(reviewId).toEntity();
	}

}
