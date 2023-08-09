package com.dutaduta.sketchme.videoconference.controller;

import com.dutaduta.sketchme.global.CustomStatus;
import com.dutaduta.sketchme.global.ResponseFormat;
import com.dutaduta.sketchme.meeting.service.MeetingService;
import com.dutaduta.sketchme.oidc.dto.UserInfoInAccessTokenDTO;
import com.dutaduta.sketchme.oidc.jwt.JwtUtil;
import com.dutaduta.sketchme.videoconference.controller.request.RatingAndReviewCreateRequest;
import com.dutaduta.sketchme.videoconference.controller.response.*;
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
    private final MeetingService meetingService;

    @PostMapping("meeting/{meetingId}/videoconference/room")
    public ResponseEntity<ResponseFormat<SessionGetResponse>> openRoom(@PathVariable("meetingId")long meetingId, HttpServletRequest request){
        UserInfoInAccessTokenDTO userInfo= JwtUtil.extractUserInfo(request);
        SessionGetResponse responseDTO = videoConferenceService.makeSession(userInfo, meetingId);
        return ResponseFormat.success(responseDTO).toEntity();
    }

    @PostMapping("meeting/{meetingId}/videoconference/connection")
    public ResponseEntity<ResponseFormat<ConnectionCreateResponse>> getConnection(@PathVariable("meetingId")long meetingId, HttpServletRequest request){
        UserInfoInAccessTokenDTO userInfo= JwtUtil.extractUserInfo(request);
        ConnectionCreateResponse responseDTO = videoConferenceService.createConnection(meetingId,userInfo);
        return ResponseFormat.success(responseDTO).toEntity();
    }

    @GetMapping("meeting/{meetingId}/reservation-info")
    public ResponseEntity<ResponseFormat<ReservationInfoGetResponse>> getReservationInfo(@PathVariable("meetingId") long meetingId, HttpServletRequest request){
        UserInfoInAccessTokenDTO userInfo = JwtUtil.extractUserInfo(request);
//        ReservationInfoResponseDTO responseDTO = reservationService.getReservationInfo(userInfo, meetingId);
//        return ResponseFormat.success(responseDTO).toEntity();
        return null;
    }

    @PostMapping("meeting/{meetingId}/videoconference/picture")
    public ResponseEntity<ResponseFormat<Boolean>> receivePicture(@PathVariable("meetingId") long meetingId, HttpServletRequest request, MultipartFile[] multipartFiles){
        UserInfoInAccessTokenDTO userInfo = JwtUtil.extractUserInfo(request);
        LocalDateTime now = LocalDateTime.now();
        if(multipartFiles.length!=1){
            return ResponseFormat.fail(false, CustomStatus.INVALID_INPUT_VALUE).toEntity();
        }
        videoConferenceService.savePicture(userInfo, meetingId, now, multipartFiles[0]);
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
    public ResponseEntity<ResponseFormat<FinalPictureGetResponse>> getFinalPicture(@PathVariable("meetingId") long meetingId, HttpServletRequest request){
        UserInfoInAccessTokenDTO userInfo = JwtUtil.extractUserInfo(request);
        FinalPictureGetResponse responseDTO = videoConferenceService.getFinalPicture(userInfo,meetingId);
        return ResponseFormat.success(responseDTO).toEntity();
    }

    @GetMapping("meeting/{meetingId}/videoconference/time-lapse")
    public ResponseEntity<ResponseFormat<TimelapseGetResponse>> getTimelapse(@PathVariable("meetingId") long meetingId, HttpServletRequest request){
        UserInfoInAccessTokenDTO userInfo = JwtUtil.extractUserInfo(request);
        TimelapseGetResponse responseDTO = videoConferenceService.getTimelapse(userInfo,meetingId);
        return ResponseFormat.success(responseDTO).toEntity();
    }

    @PostMapping("meeting/{meetingId}/rating-and-review")
    public ResponseEntity<ResponseFormat<Boolean>> registerRatingAndReview(@RequestBody RatingAndReviewCreateRequest requestDTO, HttpServletRequest request){
        UserInfoInAccessTokenDTO userInfo = JwtUtil.extractUserInfo(request);
        videoConferenceService.registerRatingAndReview(requestDTO.toServiceRequest());
        return ResponseFormat.success(true).toEntity();
    }





}
