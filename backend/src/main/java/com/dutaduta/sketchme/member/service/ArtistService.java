package com.dutaduta.sketchme.member.service;

import com.dutaduta.sketchme.global.ResponseFormat;
import com.dutaduta.sketchme.global.exception.BadRequestException;
import com.dutaduta.sketchme.global.exception.BusinessException;
import com.dutaduta.sketchme.member.dao.ArtistRepository;
import com.dutaduta.sketchme.member.dao.UserRepository;
import com.dutaduta.sketchme.member.domain.Artist;
import com.dutaduta.sketchme.member.domain.User;
import com.dutaduta.sketchme.member.dto.ArtistInfoRequest;
import com.dutaduta.sketchme.oidc.dto.UserArtistIdDTO;
import com.dutaduta.sketchme.oidc.jwt.JwtProvider;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Log4j2
@Transactional
public class ArtistService {
    private final ArtistRepository artistRepository;

    private final UserRepository userRepository;

    public String getDescription(Long id) {
        Artist artist = artistRepository.findById(id).orElseThrow(() -> new BadRequestException("존재하지 않는 작가입니다."));
        return artist.getDescription();
    }

    public ResponseFormat registerArtist(Long userId) throws BusinessException {

        User user = userRepository.findById(userId).orElseThrow(() -> new BadRequestException("존재하지 않는 사용자입니다."));

        // 이미 작가 등록된 경우는 추가 등록 막기
        if(user.getArtist() != null) {
            throw new BadRequestException("이미 작가로 등록되었습니다.");
        }

        // 작가 생성 및 등록
        Artist artist = Artist.builder()
                .nickname(user.getNickname())
                .profileImgUrl(user.getProfileImgUrl())
                .description(user.getDescription())
                .isOpen(true).build();
        artistRepository.save(artist);
        user.setArtist(artist);
        user.updateIsDebuted(true);


        log.info(artist.getId());
        Map<String, String> result = new HashMap<>();
        String accessToken = JwtProvider.createAccessToken(new UserArtistIdDTO(userId, artist.getId()), JwtProvider.getSecretKey());
        result.put("access_token", accessToken);
        return ResponseFormat.success(result);
    }

    public void modifyArtistInformation(ArtistInfoRequest artistInfoRequest, Long artistId) {
        Artist artist = artistRepository.findById(artistId).orElseThrow(()->new BadRequestException("존재하지 않는 작가입니다."));
        artist.updateArtistInformation(artistInfoRequest);
    }


    public void changeArtistIsOpen(Boolean isOpen, Long artistId) {
        Artist artist = artistRepository.findById(artistId).orElseThrow(()->new BadRequestException("존재하지 않는 작가입니다."));
        artist.updateIsOpen(isOpen);
    }

    public void deactivateArtist(Long artistId) {
        Artist artist = artistRepository.findById(artistId).orElseThrow(()->new BadRequestException("존재하지 않는 작가입니다."));
        artist.deactivate();
    }

    public void reactivateArtist(Long artistId) {
        Artist artist = artistRepository.findById(artistId).orElseThrow(()->new BadRequestException("존재하지 않는 작가입니다."));
        artist.reactivate();
    }
}
