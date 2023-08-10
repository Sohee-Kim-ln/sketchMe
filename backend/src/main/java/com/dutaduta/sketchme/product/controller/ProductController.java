package com.dutaduta.sketchme.product.controller;

import com.dutaduta.sketchme.global.ResponseFormat;
import com.dutaduta.sketchme.oidc.dto.UserInfoInAccessTokenDTO;
import com.dutaduta.sketchme.oidc.jwt.JwtUtil;
import com.dutaduta.sketchme.product.service.ProductService;
import com.dutaduta.sketchme.product.service.response.FinalPictureGetResponse;
import com.dutaduta.sketchme.product.service.response.TimelapseGetResponse;
import com.dutaduta.sketchme.file.dto.ImgUrlResponseDTO;
import com.dutaduta.sketchme.oidc.jwt.JwtProvider;
import com.dutaduta.sketchme.product.dto.PictureResponseDTO;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Log4j2
public class ProductController {
    private final ProductService productService;
    private final JwtUtil jwtUtil;

    @PostMapping("/drawing/artist")
    public ResponseEntity<ResponseFormat<List<ImgUrlResponseDTO>>> registDrawingsOfArtist(MultipartFile[] uploadFiles, HttpServletRequest request) {
        Long artistID = JwtProvider.getArtistId(JwtProvider.resolveToken(request), JwtProvider.getSecretKey());
        List<ImgUrlResponseDTO> imgUrlResponseDTOs = productService.registDrawingsOfArtist(uploadFiles, artistID);
        return ResponseFormat.success(imgUrlResponseDTOs).toEntity();
    }

    @DeleteMapping("/drawing/artist")
    public ResponseEntity<ResponseFormat<String>> deleteDrawingOfArtist(@RequestBody Map<String, Long> pictureMap, HttpServletRequest request) {
        Long artistID = JwtProvider.getArtistId(JwtProvider.resolveToken(request), JwtProvider.getSecretKey());
        productService.deleteDrawingOfArtist(pictureMap.get("pictureID"), artistID);
        return ResponseFormat.success("그림 삭제 완료").toEntity();
    }

    @GetMapping("/drawing/artist")
    public ResponseEntity<ResponseFormat<List<PictureResponseDTO>>> seeDrawingsOfArtist(HttpServletRequest request) {
        Long artistID = JwtProvider.getArtistId(JwtProvider.resolveToken(request), JwtProvider.getSecretKey());
        List<PictureResponseDTO> pictureResponseDTOs = productService.selectDrawingsOfArtist(artistID);
        return ResponseFormat.success(pictureResponseDTOs).toEntity();
    }

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
    public ResponseEntity<ResponseFormat<TimelapseGetResponse>> getTimelapse(@PathVariable("meetingId") long meetingId, HttpServletRequest request) {
        UserInfoInAccessTokenDTO userInfo = jwtUtil.extractUserInfo(request);
        TimelapseGetResponse responseDTO = productService.getTimelapse(userInfo, meetingId);
        return ResponseFormat.success(responseDTO).toEntity();
    }
}
