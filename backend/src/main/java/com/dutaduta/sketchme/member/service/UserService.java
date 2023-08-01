package com.dutaduta.sketchme.member.service;

import com.dutaduta.sketchme.global.exception.BusinessException;
import com.dutaduta.sketchme.member.dao.ArtistRepository;
import com.dutaduta.sketchme.member.dao.UserRepository;
import com.dutaduta.sketchme.member.domain.Artist;
import com.dutaduta.sketchme.member.domain.User;
import com.dutaduta.sketchme.member.dto.MemberInfoDto;
import com.dutaduta.sketchme.oidc.jwt.JwtProvider;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Log4j2
public class UserService {
    //@Autowired 사용 지양됨 -> @RequiredArgsConstructor 로 생성되는 생성자로 주입받기 위해 final 붙임.
    private final UserRepository userRepository;

    private final ArtistRepository artistRepository;

    @Transactional // db 트랜잭션 자동으로 commit
    public MemberInfoDto getUserInfo(String member, HttpServletRequest request) throws BusinessException {
        String secretKey = JwtProvider.getSecretKey();
        String token = JwtProvider.resolveToken(request);
        Long userId = JwtProvider.getUserId(token, secretKey);
        Long ArtistId = JwtProvider.getArtistId(token, secretKey);

        // 일반 사용자인 경우
        if(member.equals("user")) {
            User user = userRepository.findById(userId).orElseThrow(() -> new BusinessException("존재하지 않는 사용자입니다."));
            log.info("user : " + user.toString());
            return new MemberInfoDto(user);
        }

        // 작가인 경우
        Artist artist = artistRepository.findById(ArtistId).orElseThrow(() -> new BusinessException("존재하지 않는 작가입니다."));
        return new MemberInfoDto(artist);
    }
}
