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

import com.dutaduta.sketchme.file.constant.FileType;
import com.dutaduta.sketchme.file.dto.ImgUrlResponseDTO;
import com.dutaduta.sketchme.file.dto.UploadResponseDTO;
import com.dutaduta.sketchme.file.service.FileService;
import com.dutaduta.sketchme.global.exception.BusinessException;
import com.dutaduta.sketchme.member.dao.ArtistRepository;
import com.dutaduta.sketchme.member.domain.Artist;
import com.dutaduta.sketchme.product.dao.PictureRepository;
import com.dutaduta.sketchme.product.domain.Picture;
import com.dutaduta.sketchme.product.dto.PictureResponseDTO;
import jakarta.transaction.Transactional;
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
import java.util.Objects;

@Log4j2
@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {
    private final PictureRepository pictureRepository;
    private final TimelapseRepository timelapseRepository;
    private final MeetingRepository meetingRepository;
    private final FileService fileService;
    private final ArtistRepository artistRepository;

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

    public List<ImgUrlResponseDTO> registDrawingsOfArtist(MultipartFile[] uploadFiles, Long artistID) {

        Artist artist = artistRepository.getReferenceById(artistID);
        if(artist.isDeactivated()) throw new BusinessException("탈퇴한 작가입니다.");

        List<ImgUrlResponseDTO> result = new ArrayList<>();

        for(MultipartFile uploadFile : uploadFiles) {
            // 일단 DB에 picture 저장(이미지 url 없는 상태로)
            // 외부그림, 비공개, 삭제안됨 여부는 전부 default값으로 하면 되니까 별도 설정 필요없음
            Picture picture = Picture.builder().artist(artist).build();
            Long pictureID = pictureRepository.save(picture).getId();

            // picture id 받아와서 서버에 실제 이미지 파일 저장
            UploadResponseDTO uploadResponseDTO = fileService.uploadFile(uploadFile, FileType.PICTURE, pictureID);
            result.add(ImgUrlResponseDTO.of(uploadResponseDTO));

            // DB에 저장했던 picture에 이미지 url 추가
            picture.updateImgUrl(uploadResponseDTO.getImageURL(), uploadResponseDTO.getThumbnailURL());
        } // for

        return result;
    }

    public void deleteDrawingOfArtist(Long pictureID, Long artistID) {
        Artist artist = artistRepository.getReferenceById(artistID);
        if(artist.isDeactivated()) throw new BusinessException("탈퇴한 작가입니다.");

        Picture picture = pictureRepository.findById(pictureID).orElseThrow(() -> new BusinessException("그림 정보가 없습니다."));
        if(!Objects.equals(picture.getArtist().getId(), artistID)) throw new BusinessException("접근 권한이 없습니다.");

        if(picture.isDeleted()) throw new BusinessException("삭제된 그림입니다.");

        // 실제 이미지 파일 삭제
        fileService.removeFile(picture.getUrl());

        // DB에서 정보 삭제
        picture.updateIsDeleted(true);
    }

    public List<PictureResponseDTO> selectDrawingsOfArtist(Long artistID) {

        Artist artist = artistRepository.getReferenceById(artistID);
        if(artist.isDeactivated()) throw new BusinessException("탈퇴한 작가입니다.");

        List<PictureResponseDTO> result = new ArrayList<>();

        // 작가가 내가 소유한 그림들을 본다.
        // 공개, 비공개 여부도 함께 반환해야 할 듯! 작가가 자신의 그림을 확인할 수는 있어도, 그걸 카테고리에 추가하는건 안됨
        List<Picture> pictures = pictureRepository.findByArtistAndIsDeleted(artist, false);
        for(Picture picture : pictures) {
            ImgUrlResponseDTO imgUrlResponseDTO = ImgUrlResponseDTO.of(picture);
            PictureResponseDTO pictureResponseDTO = PictureResponseDTO.of(picture, imgUrlResponseDTO);
            result.add(pictureResponseDTO);
        }

        return result;
    }
}
