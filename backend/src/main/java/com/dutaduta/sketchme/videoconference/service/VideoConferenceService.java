package com.dutaduta.sketchme.videoconference.service;

import com.dutaduta.sketchme.meeting.dao.MeetingRepository;
import com.dutaduta.sketchme.meeting.domain.Meeting;
import com.dutaduta.sketchme.meeting.domain.MeetingStatus;
import com.dutaduta.sketchme.oidc.dto.UserInfoInAccessTokenDTO;
import com.dutaduta.sketchme.videoconference.controller.response.*;
import com.dutaduta.sketchme.videoconference.domain.Constant;
import com.dutaduta.sketchme.videoconference.exception.RandomSessionGenerateException;
import com.dutaduta.sketchme.videoconference.exception.VideoConferenceException;
import com.dutaduta.sketchme.videoconference.service.request.RatingAndReviewCreateServiceRequest;
import io.openvidu.java.client.Connection;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.io.FileUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.security.InvalidParameterException;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Log4j2
public class VideoConferenceService {

    private final MeetingRepository meetingRepository;
    private final RandomSessionIdGenerator randomSessionIdGenerator;
    private final OpenViduAPIService openViduAPIService;
    private final TimelapseService timelapseService;


    public SessionGetResponse makeSession(UserInfoInAccessTokenDTO userInfo, long meetingId) {
        Meeting meeting = getApprovedOrRunningMeeting(userInfo, meetingId);

        String sessionId = meeting.getVideoConferenceRoomSessionId();
        // 화상 방이 열려 있으면, 해당 세션 값을 가져와서 리턴
        if(isMeetingRunning(meeting, sessionId)){
            return SessionGetResponse.builder().sessionId(sessionId).build();
        }

        // 아직 세션이 발급되지 않았으면 세션 값을 만들어서 OpenVidu에 등록 후 DB에 저장
        sessionId = randomSessionIdGenerator.generate();

        for(int i=1;i<=6;i++){
            try{
                openViduAPIService.createSession(sessionId);
                meeting.setVideoConferenceRoomSessionId(sessionId);
                meeting.setMeetingStatus(MeetingStatus.RUNNING);
                if(i>=5){
                    throw  new RandomSessionGenerateException("랜덤한 세션 ID 생성에 실패했습니다.");
                }
            } catch (Exception ignored){}
        }
        return SessionGetResponse.builder().sessionId(sessionId).build();
    }

    private static boolean isMeetingRunning(Meeting meeting, String sessionId) {
        return sessionId != null && meeting.getMeetingStatus().equals(MeetingStatus.RUNNING);
    }

    private Meeting getApprovedOrRunningMeeting(UserInfoInAccessTokenDTO userInfo, long meetingId) {
        // meetingID로 meeting 조회
        Optional<Meeting> optionalMeeting = meetingRepository.findById(meetingId);
        if(optionalMeeting.isEmpty()){
            throw new InvalidParameterException("존재하지 않는 미팅입니다.");
        }
        Meeting meeting = optionalMeeting.get();
        if(!meeting.getMeetingStatus().equals(MeetingStatus.APPROVED) &&
                !(meeting.getMeetingStatus().equals(MeetingStatus.RUNNING))){
            throw new InvalidParameterException("\"수락 중\" 상태가 아닌 미팅입니다.");
        }
        if(userInfo.getUserId()!=meeting.getUser().getId()
        && userInfo.getArtistId()!=meeting.getArtist().getId()){
            throw new InvalidParameterException("참여할 권한이 없는 미팅입니다.");
        }
        if(meeting.getStartDateTime().isAfter(LocalDateTime.now())){
            throw new InvalidParameterException("아직 참여 시간이 되지 않은 미팅입니다.");
        }
        return meeting;
    }

    public ConnectionCreateResponse createConnection(long meetingId, UserInfoInAccessTokenDTO userInfo) {
        // meeting 을 가져온다.
        Meeting meeting = getApprovedOrRunningMeeting(userInfo, meetingId);

        String sessionId = meeting.getVideoConferenceRoomSessionId();
        // 화상 방이 열려 있지 않은 경우 (세션이 발급되지 않은 경우) 예외 발생
        if(!isMeetingRunning(meeting, sessionId)){
            throw new InvalidParameterException("화상 방이 아직 열려 있지 않습니다.");
        }

        // 세션을 가져와서 OpenVidu API 서버에게 Connection 발급을 요청한다.
        Connection connection = openViduAPIService.createConnection(sessionId);

        // 가져온 Connection 안에 담겨 있는 ConnectionCreateResponse에 담아서 전달한다.
        return ConnectionCreateResponse.builder().token(connection.getToken()).build();
    }



    public String savePicture(UserInfoInAccessTokenDTO userInfo, long meetingId, LocalDateTime now, MultipartFile picture) {
        // fileserver 폴더 삭제


        // 실시간 사진의 다음 Index 값을 가져온다.
        // 어디서? DB에 저장하나? No! DB에 저장하지 않고, 해당 디렉토리에서 파일 목록을 불러온다.
        File filePath = new File(String.format("%s/%d",Constant.PICTURE_DIRECTORY.getValue(),meetingId));
        File[] fileList = filePath.listFiles();
        // 디렉토리가 없는 경우, 해당 디렉토리를 생성한다.
        if(fileList==null){
            filePath.mkdirs();
        }
        List<Integer> indexList = new ArrayList<>(Stream.of(filePath.listFiles())
            .filter(file -> !file.isDirectory())
            .map(File::getName)
            .map(s->s.split("\\.")[0])
            .map(Integer::parseInt)
            .toList());

        Collections.sort(indexList, Collections.reverseOrder());

        int biggestFileIndex = 0;
        if(!indexList.isEmpty()){
            biggestFileIndex = indexList.get(0);
        }

        String newFileName = String.format("%d.png",biggestFileIndex+1);
        String newFilePath = String.format("%s/%s",filePath,newFileName);
        System.out.println("newFilePath = " + newFilePath);

        File newFile = new File(newFilePath);

        try {
            newFile.createNewFile();
            picture.transferTo(newFile);
        } catch (IOException e) {
            log.debug("이미지 파일을 저장하다가 오류가 발생했습니다.");
            e.printStackTrace();
            throw new VideoConferenceException("실시간 이미지 파일 저장 오류");
        }

        return newFileName;
    }



    public void closeRoom(long meetingId, UserInfoInAccessTokenDTO userInfo) {
        // meeting 을 가져온다.
        Meeting meeting = getApprovedOrRunningMeeting(userInfo, meetingId);

        String sessionId = meeting.getVideoConferenceRoomSessionId();
        // 화상 방이 열려 있지 않은 경우 (세션이 발급되지 않은 경우) 예외 발생
        if(!isMeetingRunning(meeting, sessionId)){
            throw new InvalidParameterException("화상 방이 아직 열려 있지 않습니다.");
        }

        openViduAPIService.deleteSession(sessionId);

        // 로컬에 저장된 이미지 파일을 가지고 타임랩스를 만들어달라고 요청한다
        // 별도의 서버를 만들고 거기에 요청을 보낸다.

    }

    public void saveFinalPicture(long meetingId, UserInfoInAccessTokenDTO userInfo, MultipartFile finalPicture) {

    }

    public FinalPictureGetResponse getFinalPicture(UserInfoInAccessTokenDTO userInfo, long meetingId) {
        return null;
    }

    public TimelapseGetResponse getTimelapse(UserInfoInAccessTokenDTO userInfo, long meetingId) {
        return null;
    }

    public void registerRatingAndReview(RatingAndReviewCreateServiceRequest requestDTO) {
    }
}
