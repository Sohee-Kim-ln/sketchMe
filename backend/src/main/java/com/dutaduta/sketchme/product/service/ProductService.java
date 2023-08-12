package com.dutaduta.sketchme.product.service;

import com.dutaduta.sketchme.common.Constant;
import com.dutaduta.sketchme.common.dao.CategoryHashtagRepository;
import com.dutaduta.sketchme.common.dao.CategoryRepository;
import com.dutaduta.sketchme.common.domain.Category;
import com.dutaduta.sketchme.common.domain.CategoryHashtag;
import com.dutaduta.sketchme.common.dto.HashtagResponse;
import com.dutaduta.sketchme.file.constant.FileType;
import com.dutaduta.sketchme.file.dto.ImgUrlResponse;
import com.dutaduta.sketchme.file.dto.UploadResponse;
import com.dutaduta.sketchme.file.service.FileService;
import com.dutaduta.sketchme.global.exception.*;
import com.dutaduta.sketchme.meeting.dao.MeetingRepository;
import com.dutaduta.sketchme.meeting.domain.Meeting;
import com.dutaduta.sketchme.meeting.domain.MeetingStatus;
import com.dutaduta.sketchme.member.dao.ArtistRepository;
import com.dutaduta.sketchme.member.domain.Artist;
import com.dutaduta.sketchme.oidc.dto.UserInfoInAccessTokenDTO;
import com.dutaduta.sketchme.product.dao.PictureRepository;
import com.dutaduta.sketchme.product.domain.Picture;
import com.dutaduta.sketchme.product.dto.PictureResponseDTO;
import com.dutaduta.sketchme.product.service.response.TimelapseGetResponse;
import jakarta.transaction.Transactional;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.apache.hc.core5.http.ContentType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log4j2
@Transactional
public class ProductService {

    private final FileService fileService;

    private final PictureRepository pictureRepository;

    private final ArtistRepository artistRepository;

    private final CategoryRepository categoryRepository;

    private final CategoryHashtagRepository categoryHashtagRepository;

    private final MeetingRepository meetingRepository;

    public List<ImgUrlResponse> registDrawingsOfArtist(MultipartFile[] uploadFiles, Long artistID) {

        Artist artist = artistRepository.getReferenceById(artistID);
        if(artist.isDeactivated()) throw new BadRequestException("탈퇴한 작가입니다.");

        List<ImgUrlResponse> result = new ArrayList<>();

        for(MultipartFile uploadFile : uploadFiles) {
            // 일단 DB에 picture 저장(이미지 url 없는 상태로)
            // 외부그림, 비공개, 삭제안됨 여부는 전부 default값으로 하면 되니까 별도 설정 필요없음
            Picture picture = Picture.builder().artist(artist).build();
            Long pictureID = pictureRepository.save(picture).getId();

            // picture id 받아와서 서버에 실제 이미지 파일 저장
            UploadResponse uploadResponse = fileService.uploadFile(uploadFile, FileType.PICTURE, pictureID);
            result.add(ImgUrlResponse.of(uploadResponse));

            // DB에 저장했던 picture에 이미지 url 추가
            picture.updateImgUrl(uploadResponse.getImageURL(), uploadResponse.getThumbnailURL());
        } // for

        return result;
    }

    public void deleteDrawingOfArtist(Long pictureID, Long artistID) {
        Artist artist = artistRepository.getReferenceById(artistID);
        if(artist.isDeactivated()) throw new BadRequestException("탈퇴한 작가입니다.");

        Picture picture = pictureRepository.findById(pictureID).orElseThrow(() -> new BusinessException());
        if(!Objects.equals(picture.getArtist().getId(), artistID)) throw new BadRequestException("잘못된 요청입니다");

        if(picture.isDeleted()) throw new BusinessException();

        // 실제 이미지 파일 삭제
        fileService.removeFile(picture.getUrl());

        // DB에서 정보 삭제
        picture.updateIsDeleted(true);
    }

    public List<PictureResponseDTO> selectDrawingsOfArtist(Long artistID) {

        Artist artist = artistRepository.getReferenceById(artistID);
        if(artist.isDeactivated()) throw new BadRequestException("탈퇴한 작가입니다.");

        List<PictureResponseDTO> result = new ArrayList<>();

        // 작가가 내가 소유한 그림들을 본다.
        // 공개, 비공개 여부도 함께 반환해야 할 듯! 작가가 자신의 그림을 확인할 수는 있어도, 그걸 카테고리에 추가하는건 안됨
        List<Picture> pictures = pictureRepository.findByArtistAndIsDeleted(artist, false);
        for(Picture picture : pictures) {
            ImgUrlResponse imgUrlResponse = ImgUrlResponse.of(picture);
            PictureResponseDTO pictureResponseDTO = PictureResponseDTO.of(picture, imgUrlResponse);
            result.add(pictureResponseDTO);
        }

        return result;
    }

    /**
     * 작가 클라이언트가 보낸 라이브 그림 파일을 파일 시스템 안에 저장한다.
     * @param userInfo 작가 클라이언트의 토큰에 담긴 정보
     * @param meetingId 미팅 ID
     * @param now 현재 시간
     * @param multipartFile 작가 클라이언트가 보낸 라이브 그림 파일
     * @return 저장한 파일 경로
     */
    public String saveLivePicture(UserInfoInAccessTokenDTO userInfo, Long meetingId, LocalDateTime now, MultipartFile multipartFile) {
        // 미팅에 참여 중인 작가의 신분으로 요청을 보낸 것인지 검증
        Meeting meeting = meetingRepository.findById(meetingId).orElseThrow(()->new BadRequestException("존재하지 않는 미팅입니다. 다른 미팅 ID로 요청을 보내주세요."));
        if(meeting.getArtist().getId()!=userInfo.getArtistId()){
            throw new ForbiddenException("해당 미팅에 작가로서 참여하고 있지 않습니다. 다시 요청해주세요.");
        }

        // 미팅이 현재 진행 중인지 체크
        if(!meeting.getMeetingStatus().equals(MeetingStatus.RUNNING)){
            throw new BadRequestException("아직 화상 미팅이 진행되고 있지 않습니다. 라이브 그림을 보내기 이전에 화상 미팅을 먼저 시작해주세요.");
        }


        // 보낸 파일이 PNG 파일 형식의 이미지 파일인지 검증
        if(!"image/png".equals(multipartFile.getContentType())){
            throw new BadRequestException("PNG 파일 형식의 이미지를 보내주세요. 다른 파일 형식은 허용하지 않습니다.");
        }

        // 파일을 저장할 경로명을 구함
        String livePictureDir = String.format("%s/%d", Constant.LIVE_PICTURE_DIRECTORY,meetingId);
        File dir = new File(livePictureDir);
        int fileIndex = 1;
        if(!dir.exists()){
            dir.mkdirs();
        } else{
            Integer[] fileIndexArr = (Integer[]) Arrays.stream(dir.listFiles()).map(f->f.getName().split(".")[0]).map(Integer::parseInt).toArray();
            Arrays.sort(fileIndexArr,Collections.reverseOrder());
            fileIndex = fileIndexArr[0]+1;
        }
        String livePicturePath = String.format("%s/%d.png",fileIndex);

        // 파일을 저장함 (저장하면서 로그를 찍음)
        try {
            multipartFile.transferTo(new File(livePicturePath));
        } catch (IOException e) {
            e.printStackTrace();
            throw new InternalServerErrorException("라이브 그림 파일을 저장할 수 없습니다.");
        }
        return livePicturePath;
    }




    public List<PictureResponseDTO> searchPictures() {
        List<PictureResponseDTO> result = new ArrayList<>();

        // 비공개인 그림들을 제외하고 모든 그림을 반환한다.
        List<Picture> pictures = pictureRepository.findByIsDeletedAndIsOpen(false, true);

        // 반환을 위한 데이터 가공
        for(Picture picture : pictures) {
            // 그림이 속해 있는 카테고리의 해시태그들을 반환해줘야 함
            Category category = picture.getCategory();
            // 해당 카테고리의 해시태그들
            List<HashtagResponse> hashtags = new ArrayList<>();
            for(CategoryHashtag categoryHashtag : categoryHashtagRepository.findByCategory(category)) {
                hashtags.add(HashtagResponse.of(categoryHashtag.getHashtag()));
            }
            result.add(PictureResponseDTO.of(picture, ImgUrlResponse.of(picture),hashtags));
        }

        return result;
    }

    public List<ImgUrlResponse> registDrawingsOfCategory(MultipartFile[] uploadFiles, Long categoryID, Long artistID) {
        Artist artist = artistRepository.getReferenceById(artistID);
        if(artist.isDeactivated()) throw new BadRequestException("탈퇴한 작가입니다.");

        Category category = categoryRepository.findById(categoryID).orElseThrow(() -> new NotFoundException("카테고리 정보가 없습니다."));
        log.info(artistID);
        log.info(category.getArtist().getId());
        if(category.getArtist().getId() != artistID) throw new UnauthorizedException("카테고리 주인만 그림을 등록할 수 있습니다.");

        List<ImgUrlResponse> result = new ArrayList<>();

        for(MultipartFile uploadFile : uploadFiles) {
            // 일단 DB에 picture 저장(이미지 url 없는 상태로)
            // 외부그림, 비공개, 삭제안됨 여부는 전부 default값으로 하면 되니까 별도 설정 필요없음
            Picture picture = Picture.builder().artist(artist).category(category).build();
            picture.updateIsOpen(true);
            Long pictureID = pictureRepository.save(picture).getId();

            // picture id 받아와서 서버에 실제 이미지 파일 저장
            UploadResponse uploadResponse = fileService.uploadFile(uploadFile, FileType.PICTURE, pictureID);
            result.add(ImgUrlResponse.of(uploadResponse));

            // DB에 저장했던 picture에 이미지 url 추가
            picture.updateImgUrl(uploadResponse.getImageURL(), uploadResponse.getThumbnailURL());
        } // for

        return result;
    }

    /**
     * 타임랩스를 가져와서 반환한다.
     * @param userInfo 클라이언트의 신분
     * @param meetingId 미팅 ID
     * @return 타임랩스 파일을 담고 있는 DTO
     */
    public TimelapseGetResponse getTimelapse(UserInfoInAccessTokenDTO userInfo, Long meetingId) {
        // 미팅에 참여 중인 작가 또는 유저 신분으로 요청을 보낸 것인지 검증
        Meeting meeting = meetingRepository.findById(meetingId).orElseThrow(()->new BadRequestException("존재하지 않는 미팅입니다. 다른 미팅 ID로 요청을 보내주세요."));
        if(meeting.getArtist().getId()!=userInfo.getArtistId() && meeting.getUser().getId()!=userInfo.getUserId()){
            throw new ForbiddenException("해당 미팅에 작가로서 참여하고 있지 않습니다. 다시 요청해주세요.");
        }

        // 타임랩스 파일이 존재하는지 확인
        String timelapseFilePath = String.format("%s/%d/timelapse.png",Constant.TIMELAPSE_DIRECTORY,meetingId);
        File path = new File(timelapseFilePath);
        if(!path.exists()){
            throw new BadRequestException("타임랩스 파일이 존재하지 않습니다.");
        }

        // 타임랩스 파일 리턴
        return TimelapseGetResponse.builder().timelapseUrl(timelapseFilePath).build();
    }

    public String saveFinalPicture(UserInfoInAccessTokenDTO userInfo, Long meetingId, MultipartFile multipartFile) {
        // 미팅에 참여 중인 작가의 신분으로 요청을 보낸 것인지 검증
        Meeting meeting = meetingRepository.findById(meetingId).orElseThrow(()->new BadRequestException("존재하지 않는 미팅입니다. 다른 미팅 ID로 요청을 보내주세요."));
        if(meeting.getArtist().getId()!=userInfo.getArtistId()){
            throw new ForbiddenException("해당 미팅에 작가로서 참여하고 있지 않습니다. 다시 요청해주세요.");
        }

        // 미팅이 현재 진행 중인지 체크
        if(!meeting.getMeetingStatus().equals(MeetingStatus.WAITING_REVIEW) &&
        !meeting.getMeetingStatus().equals(MeetingStatus.COMPLETED)){
            throw new BadRequestException("화상 미팅이 아직 끝나지 않았습니다. 화상 미팅 종료를 누른 후에 최종 그림 파일을 등록할 수 있습니다.");
        }

        // 보낸 파일이 PNG 파일 형식의 이미지 파일인지 검증
        if(!"image/png".equals(multipartFile.getContentType())){
            throw new BadRequestException("PNG 파일 형식의 이미지를 보내주세요. 다른 파일 형식은 허용하지 않습니다.");
        }

        // 파일을 저장할 경로명을 구함
        String finalPictureDir = String.format("%s/%d", Constant.FINAL_PICTURE_DIRECTORY,meetingId);
        File dir = new File(finalPictureDir);
        if(!dir.exists()){
            dir.mkdirs();
        }
        String finalPicturePath = String.format("%s/final-picture.png",finalPictureDir);

        // 파일을 저장함 (저장하면서 로그를 찍음)
        try {
            multipartFile.transferTo(new File(finalPicturePath));
        } catch (IOException e) {
            e.printStackTrace();
            throw new InternalServerErrorException("최종 그림 파일을 저장할 수 없습니다.");
        }
        return finalPicturePath;
    }
}
