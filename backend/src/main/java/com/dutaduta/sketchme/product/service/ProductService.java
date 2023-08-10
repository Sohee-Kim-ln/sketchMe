package com.dutaduta.sketchme.product.service;

import com.dutaduta.sketchme.common.Constant;
import com.dutaduta.sketchme.global.exception.BadRequestException;
import com.dutaduta.sketchme.global.exception.InternalServerErrorException;
import com.dutaduta.sketchme.meeting.dao.MeetingRepository;
import com.dutaduta.sketchme.meeting.domain.Meeting;
import com.dutaduta.sketchme.meeting.domain.MeetingStatus;
import com.dutaduta.sketchme.oidc.dto.UserInfoInAccessTokenDTO;
import com.dutaduta.sketchme.product.dao.PictureRepository;
import com.dutaduta.sketchme.product.dao.TimelapseRepository;
import com.dutaduta.sketchme.product.service.response.FinalPictureGetResponse;
import com.dutaduta.sketchme.product.service.response.TimelapseGetResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Stream;

@Log4j2
@Service
@RequiredArgsConstructor
public class ProductService {
    private final PictureRepository pictureRepository;
    private final TimelapseRepository timelapseRepository;
    private final MeetingRepository meetingRepository;

    public String saveLivePicture(UserInfoInAccessTokenDTO userInfo, long meetingId, LocalDateTime now, MultipartFile picture) {
        // 실시간 사진의 다음 Index 값을 가져온다.
        // 어디서? DB에 저장하나? No! DB에 저장하지 않고, 해당 디렉토리에서 파일 목록을 불러온다.
        File filePath = new File(String.format("%s/%d", Constant.LIVE_PICTURE_DIRECTORY,meetingId));
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
            throw new InternalServerErrorException("실시간 이미지 파일 저장 오류");
        }

        return newFileName;
    }
    public String saveFinalPicture(long meetingId, UserInfoInAccessTokenDTO userInfo, MultipartFile finalPicture) {
        // 미팅 ID에 해당하는 미팅에 지금 작가로서 참여 중인지 확인
        Meeting meeting = meetingRepository.findById(meetingId).orElseThrow(()-> new BadRequestException("존재하지 않는 미팅입니다."));
        if(meeting.getArtist().getId()!=userInfo.getArtistId()){
            throw new BadRequestException("작가로 참여하고 있지 않은 미팅입니다");
        }

        // 미팅 상태가 현재 리뷰 대기 또는 완료 상태인지 확인
        if(!meeting.getMeetingStatus().equals(MeetingStatus.WAITING_REVIEW) &&
        !meeting.getMeetingStatus().equals(MeetingStatus.COMPLETED)){
            throw new BadRequestException("최종 그림을 아직 저장할 수 없습니다.");
        }

        // 해당 경로에 최종 그림을 저장함
        String newFileName = "final-picture.png";
        String newFilePath = String.format("%s/%d/%s", Constant.FINAL_PICTURE_DIRECTORY,meetingId,newFileName);
        File newFile = new File(newFilePath);

        try {
            newFile.createNewFile();
            finalPicture.transferTo(newFile);
        } catch (IOException e) {
            log.debug("최종 이미지 파일을 저장하다가 오류가 발생했습니다.");
            e.printStackTrace();
            throw new InternalServerErrorException("최종 이미지 파일 저장 오류");
        }

        return newFileName;
    }
    public FinalPictureGetResponse getFinalPicture(UserInfoInAccessTokenDTO userInfo, long meetingId) {
        // 클라이언트가 유저 또는 작가로 참여하고 있는지 확인

        // 종료되거나 리뷰를 기다리고 있는 미팅인지 확인

        // 클라이언트가 유저 또는 작가로 참여하고 있지 않지만, 최종 사진이 남들에게 공개되어 있으면 조회할 수 있다.
        // 남들에게 공개되어 있는지 확인

        // 최종 그림의 path 리턴
        return null;
    }

    public TimelapseGetResponse getTimelapse(UserInfoInAccessTokenDTO userInfo, long meetingId) {
        // 클라이언트가 유저 또는 작가로 참여하고 있는지 확인

        // 종료되거나 리뷰를 기다리고 있는 미팅인지 확인

        // 클라이언트가 유저 또는 작가로 참여하고 있지 않지만, 타임랩스가 남들에게 공개되어 있으면 조회할 수 있다.
        // 남들에게 공개되어 있는지 확인

        // 타임랩스의 path 리턴
        return null;
    }
}
