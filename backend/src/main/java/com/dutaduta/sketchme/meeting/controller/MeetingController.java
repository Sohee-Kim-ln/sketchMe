package com.dutaduta.sketchme.meeting.controller;

import com.dutaduta.sketchme.global.CustomStatus;
import com.dutaduta.sketchme.global.ResponseFormat;
import com.dutaduta.sketchme.global.exception.BusinessException;
import com.dutaduta.sketchme.meeting.dto.MeetingInfoDto;
import com.dutaduta.sketchme.meeting.dto.ReservationDto;
import com.dutaduta.sketchme.meeting.service.MeetingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Date;

@RestController
@RequiredArgsConstructor
@Log4j2
public class MeetingController {

    private final MeetingService meetingService;

    @PostMapping("/meeting")
    public ResponseEntity<ResponseFormat<Long>> makeReservation(@RequestBody ReservationDto reservationDto){
        log.info(reservationDto.toString());
        Long meetingId = meetingService.createMeeting(reservationDto);
        return ResponseFormat.success(meetingId).toEntity();
    }

    @GetMapping("/meeting/{id}")
    public ResponseEntity<?> getMeetingInformation(@PathVariable Long id) {
        try {
            MeetingInfoDto meetingInfoDto = meetingService.getMeetingInformation(id);
            return ResponseFormat.success(meetingInfoDto).toEntity();
        } catch (BusinessException e) {
            return ResponseFormat.fail(CustomStatus.INVALID_INPUT_VALUE).toEntity();
        }
    }
}
