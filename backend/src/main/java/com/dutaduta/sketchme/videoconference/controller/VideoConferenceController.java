package com.dutaduta.sketchme.videoconference.controller;

import com.dutaduta.sketchme.global.CustomStatus;
import com.dutaduta.sketchme.global.ResponseFormat;
import com.dutaduta.sketchme.oidc.dto.UserInfoInAccessTokenDTO;
import com.dutaduta.sketchme.oidc.jwt.JwtUtil;
import com.dutaduta.sketchme.videoconference.dto.response.*;
import com.dutaduta.sketchme.videoconference.service.VideoConferenceService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
public class VideoConferenceController {
    private final VideoConferenceService videoConferenceService;
//    private final ReservationService reservationService;

    @PostMapping("meeting/{meetingId}/videoconference/room")
    public ResponseEntity<ResponseFormat<GetSessionResponseDTO>> openRoom(@PathVariable("meetingId")long meetingId){
        GetSessionResponseDTO responseDTO = videoConferenceService.makeSession(meetingId);
        return ResponseFormat.success(responseDTO).toEntity();
    }

    @PostMapping("meeting/{meetingId}/videoconference/connection")
    public ResponseEntity<ResponseFormat<CreateConnectionResponseDTO>> getConnection(@PathVariable("meetingId")long meetingId, HttpServletRequest request){
        UserInfoInAccessTokenDTO userInfo= JwtUtil.extractUserInfo(request);
        CreateConnectionResponseDTO responseDTO = videoConferenceService.createConnection(meetingId,userInfo);
        return ResponseFormat.success(responseDTO).toEntity();
    }

    @GetMapping("meeting/{meetingId}/reservation-info")
    public ResponseEntity<ResponseFormat<ReservationInfoResponseDTO>> getReservationInfo(@PathVariable("meetingId") long meetingId, HttpServletRequest request){
        UserInfoInAccessTokenDTO userInfo = JwtUtil.extractUserInfo(request);
//        ReservationInfoResponseDTO responseDTO = reservationService.getReservationInfo(userInfo, meetingId);
//        return ResponseFormat.success(responseDTO).toEntity();
        return null;
    }

    @PostMapping("meeting/{meetingId}/videoconference/picture")
    public ResponseEntity<ResponseFormat<Boolean>> receivePicture(@PathVariable("meetingId") long meetingId, HttpServletRequest request){
        UserInfoInAccessTokenDTO userInfo = JwtUtil.extractUserInfo(request);
        LocalDateTime now = LocalDateTime.now();
        videoConferenceService.savePicture(userInfo, meetingId, now);
        return ResponseFormat.success(true).toEntity();
    }

    @DeleteMapping("meeting/{meetingId}/videoconference/room")
    public ResponseEntity<ResponseFormat<Boolean>> closeRoom(@PathVariable("meetingId") long meetingId, HttpServletRequest request){
        UserInfoInAccessTokenDTO userInfo = JwtUtil.extractUserInfo(request);
        videoConferenceService.closeRoom(meetingId, userInfo);
        return ResponseFormat.success(true).toEntity();
    }

    @PostMapping("meeting/{meetingId}/videoconference/final-picture")
    public ResponseEntity<ResponseFormat<Boolean>> saveFinalPicture(@PathVariable("meetingId") long meetingId, HttpServletRequest request, MultipartFile[] finalPictures){
        UserInfoInAccessTokenDTO userInfo = JwtUtil.extractUserInfo(request);
        if(finalPictures.length!=1){
            return ResponseFormat.fail(false, CustomStatus.API_FORMAT_NOT_VALID).toEntity();
        }
        videoConferenceService.saveFinalPicture(meetingId, userInfo, finalPictures[0]);
        return ResponseFormat.success(true).toEntity();
    }

    @GetMapping("meeting/{meetingId}/videoconference/final-picture")
    public ResponseEntity<ResponseFormat<FinalPictureResponseDTO>> getFinalPicture(@PathVariable("meetingId") long meetingId, HttpServletRequest request){
        UserInfoInAccessTokenDTO userInfo = JwtUtil.extractUserInfo(request);
        FinalPictureResponseDTO responseDTO = videoConferenceService.getFinalPicture(userInfo,meetingId);
        return ResponseFormat.success(responseDTO).toEntity();
    }

    @GetMapping("meeting/{meetingId}/videoconference/time-lapse")
    public ResponseEntity<ResponseFormat<TimelapseResponseDTO>> getTimelapse(@PathVariable("meetingId") long meetingId, HttpServletRequest request){
        UserInfoInAccessTokenDTO userInfo = JwtUtil.extractUserInfo(request);
        TimelapseResponseDTO responseDTO = videoConferenceService.getTimelapse(userInfo,meetingId);
        return ResponseFormat.success(responseDTO).toEntity();
    }

    @PostMapping("meeting/{meetingId}/rating-and-review")
    public ResponseEntity<ResponseFormat<Boolean>> registerRatingAndReview(@RequestBody RegisterRatingAndReviewRequestDTO requestDTO, HttpServletRequest request){
        UserInfoInAccessTokenDTO userInfo = JwtUtil.extractUserInfo(request);
        videoConferenceService.registerRatingAndReview(requestDTO);
        return ResponseFormat.success(true).toEntity();
    }





}
