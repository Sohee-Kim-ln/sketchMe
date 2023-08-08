package com.dutaduta.sketchme.member.service;

import com.dutaduta.sketchme.file.constant.FileType;
import com.dutaduta.sketchme.file.dto.UploadResponseDTO;
import com.dutaduta.sketchme.file.service.FileService;
import com.dutaduta.sketchme.global.exception.BusinessException;
import com.dutaduta.sketchme.member.dao.ArtistRepository;
import com.dutaduta.sketchme.member.dao.UserRepository;
import com.dutaduta.sketchme.member.domain.Artist;
import com.dutaduta.sketchme.member.domain.User;
import com.dutaduta.sketchme.member.dto.MemberInfoResponseDto;
import com.dutaduta.sketchme.oidc.jwt.JwtProvider;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
@Log4j2
public class UserService {
    //@Autowired 사용 지양됨 -> @RequiredArgsConstructor 로 생성되는 생성자로 주입받기 위해 final 붙임.
    private final UserRepository userRepository;

    private final ArtistRepository artistRepository;

    private final FileService fileService;

    @Transactional // db 트랜잭션 자동으로 commit
    public MemberInfoResponseDto getUserInfo(String member, Long userId, Long artistId) throws BusinessException {
        // 일반 사용자인 경우
        if(member.equals("user")) {
            User user = userRepository.findById(userId).orElseThrow(() -> new BusinessException("존재하지 않는 사용자입니다."));
            log.info("user : " + user.toString());
            return new MemberInfoResponseDto(user);
        }

        // 작가인 경우
        Artist artist = artistRepository.findById(artistId).orElseThrow(() -> new BusinessException("존재하지 않는 작가입니다."));
        return new MemberInfoResponseDto(artist);
    }

    @Transactional
    public boolean checkNickname(String nickname) {
        return userRepository.existsByNickname(nickname);
    }

    @Transactional
    public void modifyUserInformation(String nickname, Long userId) {
        log.info(nickname);
        User user = userRepository.findById(userId).orElseThrow(()->new BusinessException("존재하지 않는 사용자입니다."));
        user.updateNickname(nickname);
    }

    @Transactional
    public void updateProfileImage(MultipartFile uploadFile, String member, Long userId, Long artistId) {
        Long ID;
        FileType fileType;
        if(member.equals("user")) {
            ID = userId;
            fileType = FileType.PROFILEUSER;
            // 서버에 저장되어 있는 기존 이미지 삭제 (원본, 썸네일 둘 다 삭제)
            User user = userRepository.getReferenceById(ID);
            String profileImgUrl = user.getProfileImgUrl();
            fileService.removeFile(profileImgUrl);
            // 새로운 이미지 저장
            MultipartFile[] uploadFiles = new MultipartFile[]{uploadFile};
            UploadResponseDTO dto = fileService.uploadFile(uploadFiles, fileType, ID).get(0);
            profileImgUrl = dto.getImageURL();
            String profileThumbnailUrl = dto.getThumbnailURL();
            // DB 정보도 갱신해주기 (파일 이름이 같아도, 날짜가 다르면 폴더 경로가 달라지면서 url이 달라짐)
            user.updateImgUrl(profileImgUrl, profileThumbnailUrl);
        } else {
            ID = artistId;
            fileType = FileType.PROFILEARTIST;
            // 서버에 저장되어 있는 기존 이미지 삭제
            Artist artist = artistRepository.getReferenceById(ID);
            String profileImgUrl = artist.getProfileImgUrl();
            fileService.removeFile(profileImgUrl);
            // 새로운 이미지 저장
            MultipartFile[] uploadFiles = new MultipartFile[]{uploadFile};
            UploadResponseDTO dto = fileService.uploadFile(uploadFiles, fileType, ID).get(0);
            profileImgUrl = dto.getImageURL();
            String profileThumbnailUrl = dto.getThumbnailURL();
            // DB 정보도 갱신해주기
            artist.updateImgUrl(profileImgUrl, profileThumbnailUrl);
        }
    }
}
