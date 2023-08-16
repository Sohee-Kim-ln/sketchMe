package com.dutaduta.sketchme.videoconference.service;

import com.dutaduta.sketchme.global.exception.BadRequestException;
import com.dutaduta.sketchme.global.exception.ForbiddenException;
import com.dutaduta.sketchme.global.exception.InternalServerErrorException;
import com.dutaduta.sketchme.meeting.dao.MeetingRepository;
import com.dutaduta.sketchme.meeting.domain.Meeting;
import com.dutaduta.sketchme.meeting.domain.MeetingStatus;
import com.dutaduta.sketchme.oidc.dto.UserInfoInAccessTokenDTO;
//import com.dutaduta.sketchme.videoconference.controller.response.*;
import com.dutaduta.sketchme.videoconference.service.response.GetIntoRoomResponse;
import io.openvidu.java.client.Connection;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Log4j2
@Transactional
public class VideoConferenceService {

    private final MeetingRepository meetingRepository;
    private final RandomSessionIdGenerator randomSessionIdGenerator;
    private final OpenViduAPIService openViduAPIService;

    @Value("${meeting.WHETHER_TO_CHECK_RUNNING}")
    private boolean WHETHER_TO_CHECK_RUNNING;

    @Value("${meeting.WHETHER_TO_SET_MEETING_CLOSE}")
    private boolean WHETHER_TO_SET_MEETING_CLOSE;

    // 입장
    public GetIntoRoomResponse getIntoRoom(UserInfoInAccessTokenDTO userInfo, long meetingId){
        Meeting meeting = getMeeting(userInfo, meetingId);
        String sessionId = meeting.getVideoConferenceRoomSessionId();
        if(!openViduAPIService.isSessionActive(sessionId)){
            sessionId = createSession();
            meeting.setMeetingStatus(MeetingStatus.RUNNING);
            meeting.setVideoConferenceRoomSessionId(sessionId);
        }

        // 연결 생성
        Connection connection = openViduAPIService.createConnection(sessionId);
        if(connection==null){
            sessionId = createSession();
            meeting.setMeetingStatus(MeetingStatus.RUNNING);
            meeting.setVideoConferenceRoomSessionId(sessionId);
            connection = openViduAPIService.createConnection(sessionId);
        }
        return GetIntoRoomResponse.builder().token(connection.getToken()).build();
    }

    private String createSession(){
        String sessionId = randomSessionIdGenerator.generate();

        for(int i=1;i<=6;i++){
            try{
                openViduAPIService.createSession(sessionId);
                if(i>=5){
                    throw  new InternalServerErrorException("랜덤한 세션 ID 생성에 실패했습니다.");
                }
                break;
            } catch (Exception e){
                e.printStackTrace();
            }
        }
        return sessionId;
    }


    private Meeting getMeeting(UserInfoInAccessTokenDTO userInfo, long meetingId) {
        // meetingID로 meeting 조회
        Optional<Meeting> optionalMeeting = meetingRepository.findById(meetingId);
        if(optionalMeeting.isEmpty()){
            throw new BadRequestException("존재하지 않는 미팅입니다.");
        }
        Meeting meeting = optionalMeeting.get();
        if(!MeetingStatus.APPROVED.equals(meeting.getMeetingStatus()) &&
                !MeetingStatus.RUNNING.equals(meeting.getMeetingStatus()) &&
                WHETHER_TO_CHECK_RUNNING){
            throw new BadRequestException("\"수락 중\" 상태가 아닌 미팅입니다.");
        }
        if(userInfo.getUserId()!=meeting.getUser().getId()
        && userInfo.getArtistId()!=meeting.getArtist().getId()){
            throw new ForbiddenException("참여할 권한이 없는 미팅입니다.");
        }
        if(meeting.getStartDateTime().isAfter(LocalDateTime.now())){
            throw new BadRequestException("아직 참여 시간이 되지 않은 미팅입니다.");
        }
        return meeting;
    }

    public void closeRoom(long meetingId, UserInfoInAccessTokenDTO userInfo) {
        // meeting 을 가져온다.
        Meeting meeting = getMeeting(userInfo, meetingId);
        // 화상 방이 열려 있지 않은 경우 예외 발생
        if(!meeting.getMeetingStatus().equals(MeetingStatus.RUNNING)){
            throw new BadRequestException("화상 방이 열려 있지 않습니다.");
        }
        if(WHETHER_TO_SET_MEETING_CLOSE){
            meeting.setMeetingStatus(MeetingStatus.WAITING_REVIEW);
        }
    }
}
