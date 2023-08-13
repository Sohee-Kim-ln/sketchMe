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
import com.dutaduta.sketchme.member.dao.UserRepository;
import com.dutaduta.sketchme.member.domain.Artist;
import com.dutaduta.sketchme.member.domain.User;
import com.dutaduta.sketchme.oidc.dto.UserInfoInAccessTokenDTO;
import com.dutaduta.sketchme.product.dao.PictureRepository;
import com.dutaduta.sketchme.product.domain.Picture;
import com.dutaduta.sketchme.product.domain.Timelapse;
import com.dutaduta.sketchme.product.service.response.TimelapseGetResponse;
import com.dutaduta.sketchme.product.dto.MyPictureResponse;
import com.dutaduta.sketchme.product.dto.PictureDeleteRequest;
import com.dutaduta.sketchme.product.dto.PictureResponse;
import com.dutaduta.sketchme.review.dao.ReviewRepository;
import com.dutaduta.sketchme.review.domain.Review;
import jakarta.transaction.Transactional;

import java.io.File;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@Service
@RequiredArgsConstructor
@Log4j2
@Transactional
public class ProductService {

    public static final int THUMBNAIL_WIDTH = 100;
    public static final int THUMBNAIL_HEGITH = 100;

    private final FileService fileService;

    private final PictureRepository pictureRepository;

    private final ArtistRepository artistRepository;

    private final CategoryRepository categoryRepository;

    private final CategoryHashtagRepository categoryHashtagRepository;

    private final MeetingRepository meetingRepository;

    private final ReviewRepository reviewRepository;

    private final UserRepository userRepository;

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

    public List<PictureResponse> selectDrawingsOfArtist(Long artistID) {

        Artist artist = artistRepository.getReferenceById(artistID);
        if(artist.isDeactivated()) throw new BadRequestException("탈퇴한 작가입니다.");

        List<PictureResponse> result = new ArrayList<>();

        // 작가가 내가 소유한 그림들을 본다.
        // 공개, 비공개 여부도 함께 반환해야 할 듯! 작가가 자신의 그림을 확인할 수는 있어도, 그걸 카테고리에 추가하는건 안됨
        List<Picture> pictures = pictureRepository.findByArtistAndIsDeleted(artist, false);
        for(Picture picture : pictures) {
            ImgUrlResponse imgUrlResponse = ImgUrlResponse.of(picture);
            PictureResponse pictureResponse = PictureResponse.of(picture, imgUrlResponse);
            result.add(pictureResponse);
        }

        return result;
    }

    private File getNextLivePicturePath(File dir) {
        int fileIndex;
        List<Integer> fileIndexList =  new ArrayList<>(Arrays.stream(dir.listFiles()).map(f->f.getName().split(".")[0]).map(Integer::parseInt).toList());
        if(fileIndexList.isEmpty()){
            fileIndex = 1;
        } else{
            Collections.sort(fileIndexList,Collections.reverseOrder());
            fileIndex = fileIndexList.get(0)+1;
        }
        return new File(dir.getAbsolutePath()+"/"+fileIndex+".png");
    }


    public List<PictureResponse> searchPictures() {
        List<PictureResponse> result = new ArrayList<>();

        // 비공개인 그림들을 제외하고 모든 그림을 반환한다.
        List<Picture> pictures = pictureRepository.findByIsDeletedAndIsOpen(false, true);

        // 반환을 위한 데이터 가공
        for(Picture picture : pictures) {
            // 그림이 속해 있는 카테고리의 해시태그들을 반환해줘야 함
            Category category = picture.getCategory();

            // 그림이 속해있는 카테고리가 비공개라면 그림 검색 안되도록
            if(!category.isOpen()) continue;
            // 그림을 소유한 작가 계정이 비공개라면 그림 검색 안되도록
            if(!picture.getArtist().isOpen()) continue;

            // 해당 카테고리의 해시태그들
            List<HashtagResponse> hashtags = new ArrayList<>();
            for(CategoryHashtag categoryHashtag : categoryHashtagRepository.findByCategory(category)) {
                hashtags.add(HashtagResponse.of(categoryHashtag.getHashtag()));
            }

            // 그림의 리뷰 정보
            Review review = reviewRepository.findByMeeting(picture.getMeeting());

            result.add(PictureResponse.of(picture, ImgUrlResponse.of(picture),hashtags, review));
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

    public void deleteDrawingFromCategory(PictureDeleteRequest pictureDeleteRequest, Long artistID) {
        Artist artist = artistRepository.getReferenceById(artistID);
        if(artist.isDeactivated()) throw new BadRequestException("탈퇴한 작가입니다.");

        Long categoryID = pictureDeleteRequest.getCategoryID();
        Category category = categoryRepository.findById(categoryID).orElseThrow(() -> new NotFoundException("카테고리 정보가 없습니다."));
        log.info(artistID);
        log.info(category.getArtist().getId());
        if(category.getArtist().getId() != artistID) throw new UnauthorizedException("카테고리 주인만 그림을 삭제할 수 있습니다.");

        Long pictureID = pictureDeleteRequest.getPictureID();
        Picture picture = pictureRepository.findById(pictureID).orElseThrow(() -> new NotFoundException("그림 정보가 없습니다."));

        // 서버에서 해당 그림 파일을 지운다. (원본, 썸네일 전부)
        fileService.removeFile(picture.getUrl());

        // DB에 저장된 정보도 삭제해준다.
        picture.updateIsDeleted(true);
    }

    public List<MyPictureResponse> seePicturesIBought(Long userId) {
        User user = userRepository.getReferenceById(userId);

        List<MyPictureResponse> result = new ArrayList<>();

        // 해당 사용자의 그림들 전부 반환 (작가가 삭제했더라도 사용자는 자신의 구매한 그림이라면 볼 수 있어야 함. 따라서 deleted 여부는 고려하지 않음)
        List<Picture> pictures = pictureRepository.findByUser(user);

        for(Picture picture : pictures) {
            result.add(MyPictureResponse.of(picture));
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
        Meeting meeting = getMeeting(meetingId);
        checkMeetingIsOwnedByThisArtist(userInfo,meeting);
        checkMeetingIsRunning(meeting);
        fileService.checkImageIsPNG(multipartFile);
        File dir = fileService.getDir(Constant.LIVE_PICTURE_DIRECTORY+"/"+meetingId);
        File filePath = getNextLivePicturePath(dir);
        fileService.saveMultipartFile(multipartFile, filePath, "라이브 그림 파일");
        log.info("meeting ID: {} | file path: {} | 라이브 그림 파일이 저장되었습니다.", meetingId, filePath);
        return filePath.getAbsolutePath();
    }

    /**
     * 타임랩스를 가져와서 반환한다.
     * @param userInfo 클라이언트의 신분
     * @param meetingId 미팅 ID
     * @return 타임랩스 파일을 담고 있는 DTO
     */
    public TimelapseGetResponse getTimelapse(UserInfoInAccessTokenDTO userInfo, Long meetingId) {
        Meeting meeting = getMeeting(meetingId);
        Timelapse timelapse = meeting.getTimelapse();
        checkIfTimelapseIsExisted(timelapse);
        if(!timelapse.isOpen()){
            checkMeetingIsOwnedByThisUserOrThisArtist(userInfo, meeting);
        }
        File dir = fileService.getDir(String.format("%s/%d",Constant.TIMELAPSE_DIRECTORY,meetingId));
        File file = fileService.getFile(dir.getAbsolutePath()+"/"+"o_timelapse.png","타임랩스");
        // TODO: 절대 경로를 리턴해도 되는가? 보안적인 이슈는 없는가?
        return TimelapseGetResponse.builder().timelapseUrl(file.getPath()).build();
    }

    private static void checkIfTimelapseIsExisted(Timelapse timelapse) {
        if(timelapse ==null){
            throw new BadRequestException("타임랩스가 등록되어 있지 않습니다.");
        }
    }

    /**
     * 최종 그림 파일을 저장한다.
     * fileserver/PICTURE/년/월/일/그림ID.png 경로에 저장한다.
     *
     * @param userInfo
     * @param meetingId
     * @param multipartFile
     * @param now
     * @param isOpen
     */
    public void saveFinalPicture(UserInfoInAccessTokenDTO userInfo, Long meetingId, MultipartFile multipartFile, LocalDateTime now, boolean isOpen) {
        Meeting meeting = getMeeting(meetingId);
        checkMeetingIsOwnedByThisArtist(userInfo,meeting);
        checkMeetingIsRunning(meeting);
        fileService.checkImageIsPNG(multipartFile);
        Picture picture = Picture.builder()
                .isOpen(true)
                .user(meeting.getUser())
                .artist(meeting.getArtist())
                .meeting(meeting)
                .isDeleted(false)
                .isOpen(isOpen)
                .isDrawnInApp(true)
                .build();
        pictureRepository.save(picture);
        File pictureDir = fileService.getDir(now,Constant.FINAL_PICTURE_DIRECTORY);
        File picturePath = fileService.getOrigImagePath(picture, pictureDir);
        // 파일을 저장함 (저장하면서 로그를 찍음)
        fileService.saveMultipartFile(multipartFile, picturePath, "최종 그림 파일을 저장할 수 없습니다.");
        File thumbnailPath = fileService.getThumbnailPath(picture, pictureDir);
        fileService.makeThumbnail(picturePath, thumbnailPath);
        // DB에 최종 그림 파일의 경로를 저장한다.
        picture.setUrl(picturePath.getAbsolutePath());
        picture.setThumbnailUrl(thumbnailPath.getPath());
    }

    private static void checkMeetingIsOwnedByThisUserOrThisArtist(UserInfoInAccessTokenDTO userInfo, Meeting meeting) {
        if(meeting.getArtist().getId()!= userInfo.getArtistId() && meeting.getUser().getId()!= userInfo.getUserId()){
            throw new ForbiddenException("해당 미팅에 작가로서 참여하고 있지 않습니다. 다시 요청해주세요.");
        }
    }

    private void checkMeetingIsRunning(Meeting meeting) {
        if(!meeting.getMeetingStatus().equals(MeetingStatus.WAITING_REVIEW) &&
        !meeting.getMeetingStatus().equals(MeetingStatus.COMPLETED)){
            throw new BadRequestException("화상 미팅이 아직 끝나지 않았습니다. 화상 미팅 종료를 누른 후에 최종 그림 파일을 등록할 수 있습니다.");
        }
    }

    private void checkMeetingIsOwnedByThisArtist(UserInfoInAccessTokenDTO userInfo, Meeting meeting) {
        if(meeting.getArtist().getId()!= userInfo.getArtistId()){
            throw new ForbiddenException("해당 미팅에 작가로서 참여하고 있지 않습니다. 다시 요청해주세요.");
        }
    }

    /**
     * 미팅 ID를 가지고서 미팅을 찾는다.
     * @param meetingId 미팅 ID
     * @return 미팅
     * @throws BadRequestException 미팅이 존재하지 않는 경우, 발생
     */
    private Meeting getMeeting(Long meetingId) throws BadRequestException {
        Meeting meeting = meetingRepository.findById(meetingId).orElseThrow(()->new BadRequestException("존재하지 않는 미팅입니다. 다른 미팅 ID로 요청을 보내주세요."));
        return meeting;
    }
}
