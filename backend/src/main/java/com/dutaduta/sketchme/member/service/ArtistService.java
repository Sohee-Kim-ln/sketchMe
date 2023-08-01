package com.dutaduta.sketchme.member.service;

import com.dutaduta.sketchme.global.exception.BusinessException;
import com.dutaduta.sketchme.member.dao.ArtistRepository;
import com.dutaduta.sketchme.member.dao.UserRepository;
import com.dutaduta.sketchme.member.domain.Artist;
import com.dutaduta.sketchme.member.domain.User;
import com.dutaduta.sketchme.oidc.dto.UserArtistIdDto;
import com.dutaduta.sketchme.oidc.jwt.JwtProvider;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Log4j2
public class ArtistService {
    private final ArtistRepository artistRepository;

    private final UserRepository userRepository;

    public Optional<String> getDescription(Long id) {
        Optional<Artist> artist = artistRepository.findById(id);
        return artist.map(Artist::getDescription);
    }

    @Transactional
    public String registArtist(HttpServletRequest request) throws BusinessException {
        // 현재 사용자 id
        String secretKey = JwtProvider.getSecretKey();
        String token = JwtProvider.resolveToken(request);
        Long userId = JwtProvider.getUserId(token, secretKey);
        User user = userRepository.findById(userId).orElseThrow(() -> new BusinessException("존재하지 않는 사용자입니다."));

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
        return JwtProvider.createAccessToken(new UserArtistIdDto(userId, artist.getId()), secretKey);
    }
}
