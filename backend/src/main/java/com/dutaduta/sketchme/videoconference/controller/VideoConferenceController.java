package com.dutaduta.sketchme.videoconference.controller;

import com.dutaduta.sketchme.global.ResponseFormat;
import com.dutaduta.sketchme.oidc.dto.UserInfoInAccessTokenDTO;
import com.dutaduta.sketchme.oidc.jwt.JwtUtil;
//import com.dutaduta.sketchme.videoconference.controller.response.*;
import com.dutaduta.sketchme.videoconference.service.VideoConferenceService;
import com.dutaduta.sketchme.videoconference.service.response.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class VideoConferenceController {
    private final VideoConferenceService videoConferenceService;
    private final JwtUtil jwtUtil;

    @GetMapping("meeting/{meetingId}/videoconference/get-into-room")
    public ResponseEntity<ResponseFormat<ConnectionGetResponse>> openRoom(@PathVariable("meetingId")long meetingId, HttpServletRequest request){
        UserInfoInAccessTokenDTO userInfo= jwtUtil.extractUserInfo(request);
        ConnectionGetResponse responseDTO = videoConferenceService.getIntoRoom(userInfo, meetingId);
        return ResponseFormat.success(responseDTO).toEntity();
    }

    @GetMapping("meeting/{meetingId}/videoconference/token/new")
    public ResponseEntity<ResponseFormat<ConnectionGetResponse>> getToken(@PathVariable("meetingId") long meetingId, HttpServletRequest request, @RequestParam("propose") String propose){
        UserInfoInAccessTokenDTO userInfo = jwtUtil.extractUserInfo(request);
        ConnectionGetResponse response = videoConferenceService.makeToken(userInfo, meetingId, propose);
        return ResponseFormat.success(response).toEntity();
    }
    @DeleteMapping("meeting/{meetingId}/videoconference/room")
    public ResponseEntity<ResponseFormat<Object>> closeRoom(@PathVariable("meetingId") long meetingId, HttpServletRequest request){
        UserInfoInAccessTokenDTO userInfo = jwtUtil.extractUserInfo(request);
        videoConferenceService.closeRoom(meetingId, userInfo);
        return ResponseFormat.success().toEntity();
    }
}
