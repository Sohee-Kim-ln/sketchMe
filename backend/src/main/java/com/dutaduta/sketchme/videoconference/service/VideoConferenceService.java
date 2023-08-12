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

    // 입장
    public GetIntoRoomResponse getIntoRoom(UserInfoInAccessTokenDTO userInfo, long meetingId){
        Meeting meeting = getMeeting(userInfo, meetingId);
        String sessionId = meeting.getVideoConferenceRoomSessionId();
        if(!openViduAPIService.isSessionActive(sessionId)){
            log.debug("세션을 다시 만듭니다. 기존 세션 : {}",sessionId);
            sessionId = createSession();
            log.debug("새로운 세션 : {}",sessionId);
            meeting.setMeetingStatus(MeetingStatus.RUNNING);
            meeting.setVideoConferenceRoomSessionId(sessionId);
        }

        // 연결 생성
        Connection connection = openViduAPIService.createConnection(sessionId);
        if(connection==null){
            log.debug("세션을 다시 만듭니다. 기존 세션 : {}",sessionId);
            sessionId = createSession();
            log.debug("새로운 세션 : {}",sessionId);
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
        if(!meeting.getMeetingStatus().equals(MeetingStatus.APPROVED) &&
                !(meeting.getMeetingStatus().equals(MeetingStatus.RUNNING))){
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

        String sessionId = meeting.getVideoConferenceRoomSessionId();
        // 화상 방이 열려 있지 않은 경우 (세션이 발급되지 않은 경우) 예외 발생
        if(!meeting.getMeetingStatus().equals(MeetingStatus.RUNNING)){
            throw new BadRequestException("화상 방이 아직 열려 있지 않습니다.");
        }

        openViduAPIService.deleteSession(sessionId);
    }

    /**
     * Session 발급
     * 1.  Meeting ID와 user Info를 통해 Meeting 정보를 확인한다.
     * 2.  Session이 저장되어 있으면 해당 Session이 이용 가능한지 확인한다.
     * 3.  Session을 이용할 수 있으면 그대로 리턴한다.
     * 4.  Session을 이용할 수 없으면 새로 발급한다.
     *
     * Connection 발급
     * 1.  Meeting ID와 user Info를 통해 Meeting 정보를 확인한다.
     * 2.  Session이 저장되어 있으면 해당 Session이 이용 가능한지 확인한다.
     * 3.  Session을 이용할 수 없으면 새로 발급한다.
     * 4.  Session을 이용할 수 있으면 그대로 리턴한다.
     * 5.  Session을 가지고 Connection을 만든다.
     *
     * 방 입장
     * 1. Meeting ID와 user Info를 통해 Meeting 정보를 확인한다.
     * 2. Session이 저장되어 있으면 해당 Session이 이용 가능한지 확인한다.
     * 3.
     */

}
