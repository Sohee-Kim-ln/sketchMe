package com.dutaduta.sketchme.videoconference.service;

import com.dutaduta.sketchme.oidc.dto.UserInfoInAccessTokenDTO;
import com.dutaduta.sketchme.videoconference.dto.response.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@Service
public class VideoConferenceService {


    public GetSessionResponseDTO makeSession(long meetingId) {
        return null;
    }

    public CreateConnectionResponseDTO createConnection(long meetingId, UserInfoInAccessTokenDTO userInfo) {
        return null;
    }

    public void savePicture(UserInfoInAccessTokenDTO userInfo, long meetingId, LocalDateTime now) {
    }

    public void closeRoom(long meetingId, UserInfoInAccessTokenDTO userInfo) {
    }

    public void saveFinalPicture(long meetingId, UserInfoInAccessTokenDTO userInfo, MultipartFile finalPicture) {
    }

    public FinalPictureResponseDTO getFinalPicture(UserInfoInAccessTokenDTO userInfo, long meetingId) {
        return null;
    }

    public TimelapseResponseDTO getTimelapse(UserInfoInAccessTokenDTO userInfo, long meetingId) {
        return null;
    }

    public void registerRatingAndReview(RegisterRatingAndReviewRequestDTO requestDTO) {
    }
}
