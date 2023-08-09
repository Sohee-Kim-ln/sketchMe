package com.dutaduta.sketchme.member.service;

import com.dutaduta.sketchme.global.CustomStatus;
import com.dutaduta.sketchme.global.ResponseFormat;
import com.dutaduta.sketchme.global.exception.BusinessException;
import com.dutaduta.sketchme.member.dao.ArtistRepository;
import com.dutaduta.sketchme.member.dao.UserRepository;
import com.dutaduta.sketchme.member.domain.Artist;
import com.dutaduta.sketchme.member.domain.User;
import com.dutaduta.sketchme.member.dto.ArtistInfoRequestDto;
import com.dutaduta.sketchme.oidc.dto.UserArtistIdDto;
import com.dutaduta.sketchme.oidc.jwt.JwtProvider;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Log4j2
@Transactional
public class ArtistService {
    private final ArtistRepository artistRepository;

    private final UserRepository userRepository;

    private final UserService userService;

    public String getDescription(Long id) {
        Artist artist = artistRepository.findById(id).orElseThrow(() -> new BusinessException("존재하지 않는 작가입니다."));
        if(artist.isDeactivated()) throw new BusinessException("탈퇴한 작가입니다.");
        return artist.getDescription();
    }

    @Transactional
    public ResponseFormat registArtist(Long userId) throws BusinessException {
        log.info(userId);
        User user = userRepository.findById(userId).orElseThrow(() -> new BusinessException("존재하지 않는 사용자입니다."));

        // 이미 작가 등록된 경우는 추가 등록 막기
        if(user.isDebuted()) {
            log.info("이미 등록됨");
            return ResponseFormat.fail(CustomStatus.ARTIST_ALREADY_REGISTERED);
        }

        // 작가 생성 및 등록
        Artist artist = Artist.builder()
                .nickname(user.getNickname())
                .profileImgUrl(user.getProfileImgUrl())
                .profileThumbnailImgUrl(user.getProfileThumbnailImgUrl())
                .description(user.getDescription())
                .isOpen(true).build();
        log.info("작가 생성됨");
        log.info("이거 true여야 함... "+ user.getArtist().isDeactivated());
        artistRepository.save(artist);
        log.info("save 뒤");
        user.setArtist(artist);
        user.updateIsDebuted(true);


        log.info(artist.getId());
        Map<String, String> result = new HashMap<>();
        String accessToken = JwtProvider.createAccessToken(new UserArtistIdDto(userId, artist.getId()), JwtProvider.getSecretKey());
        result.put("access_token", accessToken);
        return ResponseFormat.success(result);
    }

    @Transactional
    public void modifyArtistInformation(ArtistInfoRequestDto artistInfoRequestDto, MultipartFile uploadFile, Long artistId) {
        Artist artist = artistRepository.getReferenceById(artistId);
        if(artist.isDeactivated()) throw new BusinessException("탈퇴한 작가입니다.");
        // artist 프로필 이미지 수정
        userService.updateProfileImage(uploadFile, "artist", 0L, artistId);
        // 닉네임 수정
        artist.updateNickname(artistInfoRequestDto.getNickname());
        // 해시태그 수정 로직 추가해야 함
    }


    @Transactional
    public void changeArtistIsOpen(Boolean isOpen, Long artistId) {
        Artist artist = artistRepository.findById(artistId).orElseThrow(()->new BusinessException("존재하지 않는 작가입니다."));
        if(artist.isDeactivated()) throw new BusinessException("탈퇴한 작가입니다.");
        artist.updateIsOpen(isOpen);
    }

    @Transactional
    public void deactivateArtist(Long artistId, Long userId) {
        Artist artist = artistRepository.findById(artistId).orElseThrow(()->new BusinessException("존재하지 않는 작가입니다."));
        if(artist.isDeactivated()) throw new BusinessException("탈퇴한 작가입니다.");
        User user = userRepository.findById(userId).orElseThrow(()->new BusinessException("존재하지 않는 사용자입니다."));
        artist.deactivate();
        user.updateIsDebuted(false);
    }

    public void modifyArtistDescription(String description, Long artistId){
        Artist artist = artistRepository.getReferenceById(artistId);
        if(artist.isDeactivated()) throw new BusinessException("탈퇴한 작가입니다.");
        if(Objects.equals(artist.getId(), artistId)){
            artist.updateDescription(description);
        } else {
            throw new BusinessException("접근 권한이 없습니다.");
        }
    }
}
