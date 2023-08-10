package com.dutaduta.sketchme.product.controller;

import com.dutaduta.sketchme.global.ResponseFormat;
import com.dutaduta.sketchme.oidc.dto.UserInfoInAccessTokenDTO;
import com.dutaduta.sketchme.oidc.jwt.JwtUtil;
import com.dutaduta.sketchme.product.service.ProductService;
import com.dutaduta.sketchme.product.service.response.FinalPictureGetResponse;
import com.dutaduta.sketchme.product.service.response.TimelapseGetResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;
    private final JwtUtil jwtUtil;

    @PostMapping("meeting/{meetingId}/videoconference/picture")
    public ResponseEntity<ResponseFormat<Object>> receivePicture(@PathVariable("meetingId") long meetingId, HttpServletRequest request, MultipartFile[] multipartFiles){
        UserInfoInAccessTokenDTO userInfo = jwtUtil.extractUserInfo(request);
        LocalDateTime now = LocalDateTime.now();
        if(multipartFiles.length!=1){
            return ResponseFormat.fail(HttpStatus.BAD_REQUEST,"잘못된 값입니다.").toEntity();
        }
        productService.saveLivePicture(userInfo, meetingId, now, multipartFiles[0]);
        return ResponseFormat.success().toEntity();
    }

    @PostMapping("meeting/{meetingId}/videoconference/final-picture")
    public ResponseEntity<ResponseFormat<Object>> saveFinalPicture(@PathVariable("meetingId") long meetingId, HttpServletRequest request, MultipartFile[] finalPictures){
        UserInfoInAccessTokenDTO userInfo = jwtUtil.extractUserInfo(request);

        if(finalPictures.length!=1){
            return ResponseFormat.fail(HttpStatus.BAD_REQUEST,"최종 그림 파일이 없습니다.").toEntity();
        }

        productService.saveFinalPicture(meetingId, userInfo, finalPictures[0]);
        return ResponseFormat.success().toEntity();
    }

    @GetMapping("meeting/{meetingId}/videoconference/final-picture")
    public ResponseEntity<ResponseFormat<FinalPictureGetResponse>> getFinalPicture(@PathVariable("meetingId") long meetingId, HttpServletRequest request){
        UserInfoInAccessTokenDTO userInfo = jwtUtil.extractUserInfo(request);
        FinalPictureGetResponse responseDTO = productService.getFinalPicture(userInfo,meetingId);
        return ResponseFormat.success(responseDTO).toEntity();
    }

    @GetMapping("meeting/{meetingId}/videoconference/time-lapse")
    public ResponseEntity<ResponseFormat<TimelapseGetResponse>> getTimelapse(@PathVariable("meetingId") long meetingId, HttpServletRequest request){
        UserInfoInAccessTokenDTO userInfo = jwtUtil.extractUserInfo(request);
        TimelapseGetResponse responseDTO = productService.getTimelapse(userInfo,meetingId);
        return ResponseFormat.success(responseDTO).toEntity();
    }
}
