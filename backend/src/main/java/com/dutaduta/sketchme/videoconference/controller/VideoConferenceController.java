package com.dutaduta.sketchme.videoconference.controller;

import com.dutaduta.sketchme.global.CustomStatus;
import com.dutaduta.sketchme.global.ResponseFormat;
import com.dutaduta.sketchme.oidc.dto.UserInfoInAccessTokenDTO;
import com.dutaduta.sketchme.oidc.jwt.JwtUtil;
import com.dutaduta.sketchme.videoconference.dto.response.GetConnectionResponseDTO;
import com.dutaduta.sketchme.videoconference.dto.response.CreateSessionResponseDTO;
import com.dutaduta.sketchme.videoconference.dto.response.DisconnectResponseDTO;
import com.dutaduta.sketchme.videoconference.dto.response.SearchSessionResponseDTO;
import com.dutaduta.sketchme.videoconference.service.VideoConferenceService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController("/videoconference")
@RequiredArgsConstructor
public class VideoConferenceController {
    private final VideoConferenceService videoConferenceService;

    @GetMapping("/session/{sessionId}")
    public ResponseEntity<ResponseFormat<SearchSessionResponseDTO>> searchSession(@PathVariable("sessionId")String sessionId){
        SearchSessionResponseDTO responseDTO = videoConferenceService.searchSession(sessionId);
        if(responseDTO==null){
            return ResponseFormat.fail(responseDTO, CustomStatus.SESSION_NOT_FOUND).toEntity();
        }
        return ResponseFormat.success(responseDTO).toEntity();
    }

    @PostMapping("/session/{sessionId}")
    public ResponseEntity<ResponseFormat<CreateSessionResponseDTO>> makeSession(@PathVariable("sessionId")String sessionId){
        CreateSessionResponseDTO responseDTO = videoConferenceService.makeSession(sessionId);
        return ResponseFormat.success(responseDTO).toEntity();
    }

    @PostMapping("/connection/{sessionId}")
    public ResponseEntity<ResponseFormat<GetConnectionResponseDTO>> getConnection(@PathVariable("sessionId")String sessionId, HttpServletRequest request){
        UserInfoInAccessTokenDTO userInfo= JwtUtil.extractUserInfo(request);
        GetConnectionResponseDTO responseDTO = videoConferenceService.getConnection(sessionId,userInfo);
        return ResponseFormat.

    }

    @DeleteMapping("/connection/{sessionId}")
    public ResponseEntity<ResponseFormat<DisconnectResponseDTO>> disconnect(@PathVariable("sessionId")String sessionId){
        return null;
    }






}
