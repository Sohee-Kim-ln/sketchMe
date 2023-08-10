package com.dutaduta.sketchme.product.service;

import com.dutaduta.sketchme.file.constant.FileType;
import com.dutaduta.sketchme.file.dto.ImgUrlResponse;
import com.dutaduta.sketchme.file.dto.UploadResponse;
import com.dutaduta.sketchme.file.service.FileService;
import com.dutaduta.sketchme.global.exception.BadRequestException;
import com.dutaduta.sketchme.global.exception.BusinessException;
import com.dutaduta.sketchme.member.dao.ArtistRepository;
import com.dutaduta.sketchme.member.domain.Artist;
import com.dutaduta.sketchme.oidc.dto.UserInfoInAccessTokenDTO;
import com.dutaduta.sketchme.product.dao.PictureRepository;
import com.dutaduta.sketchme.product.domain.Picture;
import com.dutaduta.sketchme.product.dto.PictureResponseDTO;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Log4j2
@Transactional
public class ProductService {

    private final FileService fileService;

    private final PictureRepository pictureRepository;

    private final ArtistRepository artistRepository;

    public List<ImgUrlResponse> registDrawingsOfArtist(MultipartFile[] uploadFiles, Long artistID) {

        Artist artist = artistRepository.getReferenceById(artistID);
        if(artist.isDeactivated()) throw new BusinessException();

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
        if(artist.isDeactivated()) throw new BusinessException();

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
        if(artist.isDeactivated()) throw new BusinessException();

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

    public String saveLivePicture(UserInfoInAccessTokenDTO userInfo, Long id, LocalDateTime of, MultipartFile multipartFile) {
        return null;
    }
}
