package com.dutaduta.sketchme.member.service;

import com.dutaduta.sketchme.global.exception.BadRequestException;
import com.dutaduta.sketchme.global.exception.BusinessException;
import com.dutaduta.sketchme.member.dao.ArtistRepository;
import com.dutaduta.sketchme.member.dao.UserRepository;
import com.dutaduta.sketchme.member.domain.Artist;
import com.dutaduta.sketchme.member.domain.User;
import com.dutaduta.sketchme.member.dto.MemberInfoResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Log4j2
@Transactional
public class UserService {

    private final UserRepository userRepository;

    private final ArtistRepository artistRepository;

    public MemberInfoResponse getUserInfo(String member, Long userId, Long artistId) throws BusinessException {
        // 일반 사용자인 경우
        if(member.equals("user")) {
            User user = userRepository.findById(userId).orElseThrow(() -> new BadRequestException("존재하지 않는 사용자입니다."));
            log.info("user : " + user.toString());
            return new MemberInfoResponse(user, userId);
        }

        // 작가인 경우
        Artist artist = artistRepository.findById(artistId).orElseThrow(() -> new BadRequestException("존재하지 않는 작가입니다."));
        return new MemberInfoResponse(artist, artistId);
    }

    public boolean checkNickname(String nickname) {
        return userRepository.existsByNickname(nickname);
    }

    public void modifyUserInformation(String nickname, Long userId) {
        log.info(nickname);
        User user = userRepository.findById(userId).orElseThrow(()->new BadRequestException("존재하지 않는 사용자입니다."));
        user.updateNickname(nickname);
    }
}
