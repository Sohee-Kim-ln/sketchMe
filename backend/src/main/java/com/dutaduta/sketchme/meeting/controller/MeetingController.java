package com.dutaduta.sketchme.meeting.controller;

import com.dutaduta.sketchme.global.ResponseFormat;
import com.dutaduta.sketchme.meeting.dto.DeterminateMeetingRequest;
import com.dutaduta.sketchme.meeting.dto.MeetingInfoDTO;
import com.dutaduta.sketchme.meeting.dto.ReservationDTO;
import com.dutaduta.sketchme.meeting.service.MeetingService;
import com.dutaduta.sketchme.oidc.jwt.JwtProvider;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Log4j2
public class MeetingController {

    private final MeetingService meetingService;

    @PostMapping("/meeting")
    public ResponseEntity<ResponseFormat<Long>> makeReservation(
            @RequestBody ReservationDTO reservationDto,
            HttpServletRequest request
    ) {
        String secretKey = JwtProvider.getSecretKey();
        String token = JwtProvider.resolveToken(request);
        reservationDto.setUserID(JwtProvider.getUserId(token, secretKey));  //유저의 요청이므로
        Long meetingId = meetingService.createMeeting(reservationDto);
        return ResponseFormat.success(meetingId).toEntity();
    }

    @GetMapping("/meeting/{id}")
    public ResponseEntity<ResponseFormat<MeetingInfoDTO>> getMeetingInformation(@PathVariable Long id) {
        MeetingInfoDTO meetingInfoDto = meetingService.getMeetingInformation(id);
        return ResponseFormat.success(meetingInfoDto).toEntity();
    }

    @PutMapping("/meeting")
    public ResponseEntity<?> determinateMeeting(
            @RequestBody @Valid DeterminateMeetingRequest determinateMeetingRequest,
            HttpServletRequest request
    ) {
        String secretKey = JwtProvider.getSecretKey();
        String token = JwtProvider.resolveToken(request);
        determinateMeetingRequest.setArtistID(JwtProvider.getArtistId(token, secretKey)); //artist의 요청이므로
        meetingService.determinate(determinateMeetingRequest);
        return ResponseFormat.success("").toEntity();
    }
}
