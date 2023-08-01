package com.dutaduta.sketchme.oidc.service;

import com.dutaduta.sketchme.member.domain.OAuthType;
import com.dutaduta.sketchme.member.domain.User;
import com.dutaduta.sketchme.member.dao.UserRepository;
import com.dutaduta.sketchme.oidc.dto.OIDCDecodePayloadDto;
import com.dutaduta.sketchme.oidc.dto.OIDCPublicKeyDto;
import com.dutaduta.sketchme.oidc.dto.TokenDto;
import com.dutaduta.sketchme.oidc.dto.UserArtistIdDto;
import com.dutaduta.sketchme.oidc.jwt.JwtOIDCProvider;
import com.dutaduta.sketchme.oidc.jwt.JwtProvider;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
@Log4j2
@RequiredArgsConstructor
public class LoginService {

    @Autowired
    private KakaoService kakaoService;

    @Autowired
    private JwtOIDCProvider jwtOIDCProvider;

    private final UserRepository userRepository;

    // 내 어플리케이션 key
    private final String REST_API_KEY = "2a805c77d6a3195034a21d25753a401f";
    private final String ISS = "https://kauth.kakao.com";

    private final RedisTemplate<String, String> redisTemplate;

    // 만료되면서 redis에서 삭제되는 것 확인 완료
    private final Long refreshTokenValidTime = Duration.ofDays(14).toMillis();

    /**
     * 카카오 로그인 전체 과정 (인가코드 받은 이후 ~ access, refresh 토큰 반환)
     * @param code
     * @return
     */
    public ResponseEntity<TokenDto> KakaoLogin(String code) {
        // 코드 성공적으로 받아옴
        log.info("code : " + code);

        // 인가 코드 이용해서 idToken 받아오기
        String idToken = kakaoService.getKakaoIdToken(code, REST_API_KEY);
        log.info("idToken : " + idToken);

        // idToken 페이로드(iss, aud, exp) 검증 후 kid 값 가져오기
        String kid = jwtOIDCProvider.getKidFromUnsignedTokenHeader(idToken, ISS, REST_API_KEY);
        log.info("kid : " + kid);

        // 공개키 목록 조회 (JSON으로 받은 것 객체로 파싱해서 가져옴)
        List<OIDCPublicKeyDto> OIDCPublicKeys = kakaoService.getKakaoOIDCOpenKeys();

        // kid와 동일한 키값을 가진 공개키로 ID 토큰 유효성 검증
        // kid와 동일한 키값 가진 공개키 가져오기
        OIDCPublicKeyDto oidcPublicKeyDto = OIDCPublicKeys.stream()
                .filter(o -> o.getKid().equals(kid))
                .findFirst()
                .orElseThrow();

        // 검증이 된 토큰에서 바디를 꺼내온다.
        OIDCDecodePayloadDto payload = jwtOIDCProvider.getOIDCTokenBody(idToken, oidcPublicKeyDto.getN(), oidcPublicKeyDto.getE());
        log.info("OIDCDecodePayload : " + payload.toString());

        // 회원가입 된 회원인지 찾기 -> 회원 정보(sub) 없다면 회원가입 처리
        // user 테이블 - oauth_id, o_auth_type, (email), nickname, profile_img_url, is_logined
        UserArtistIdDto UserArtistIdDto = signUp(payload, OAuthType.KAKAO);
        log.info(UserArtistIdDto.toString());

        // 로그인 처리를 위해 jwt 토큰 생성 (access token, refresh token)
        String secretKey = JwtProvider.getSecretKey();
        log.info("secretKey : " + secretKey);
        String refreshToken = JwtProvider.createRefreshToken(UserArtistIdDto, secretKey);
        String accessToken = JwtProvider.createAccessToken(UserArtistIdDto, secretKey);
        log.info("SketchMe refreshToken : " + refreshToken);
        log.info("SketchMe accessToken : " + accessToken);

        // refresh token은 redis에 저장
        TokenDto tokenDto = new TokenDto(accessToken, refreshToken);

        String redisSub = UserArtistIdDto.getUser_id().toString();
        // Redis에 저장 - 만료 시간 설정을 통해 자동 삭제 처리
        redisTemplate.opsForValue().set(
                redisSub,
                refreshToken,
                refreshTokenValidTime,
                TimeUnit.MILLISECONDS
        );

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("Authorization", "Bearer " + accessToken); // 인증타입 Bearer

        // client에게 access token, refresh token 반환
        return new ResponseEntity<>(tokenDto, httpHeaders, HttpStatus.OK);

        // 로그인/회원가입은 끝!!
    }

    /**
     * OICD로 받아온 사용자 정보를 토대로 회원가입이 된 유저인지 확인
     * 회원가입이 안 되어 있다면 회원가입 처리하기
     * 카카오, 구글 상관없이 전부 진행하는 과정.
     * @param payload   유저 식별 정보 (카카오 or 구글에서의 회원번호), 사용자 이메일 등 ID TOKEN의 body
     * @param oauthType KAKAO / GOOGLE
     */
    public UserArtistIdDto signUp(OIDCDecodePayloadDto payload, OAuthType oauthType) {

        // sub로 판단하려면.. 구글이랑 겹치지는 않나??
        // => oauth_id, o_auth_type 같이 조회!

        // 회원인지 여부 판단
        User signedUser = userRepository.findByOauthIdAndOauthType(payload.getSub(), oauthType);
        Long artist_id = 0L;

        // 회원 아니면 회원가입 처리
        if(signedUser == null) {
            log.info("SignUp NO");
            User user = User.builder()
                    .oauthId(payload.getSub())
                    .oauthType(oauthType)
                    .email(payload.getEmail())
                    .nickname(payload.getNickname())
                    .profileImgUrl(payload.getProfile_img_url())
                    .isLogined(true).build();
            log.info(user.toString());
            userRepository.save(user);
            log.info(user.getId());
            return UserArtistIdDto.builder().user_id(user.getId()).artist_id(artist_id).build();
        }

        // 작가 전환 api 개발 후 작가 PK도 함께 넘겨줘야 함
        log.info("SignUp YES");
        log.info(signedUser.toString());
        if(signedUser.getArtist() != null) artist_id = signedUser.getArtist().getId();
        return UserArtistIdDto.builder().user_id(signedUser.getId()).artist_id(artist_id).build();
    }

    /**
     *
     * @param request
     * @return
     */
    public ResponseEntity<?> regenerateToken(HttpServletRequest request) {
        log.info("----------access token REGENERATE-----------");

        // 헤더에서 refresh 토큰 가져오기
        String refreshToken = JwtProvider.resolveToken(request);
        if(refreshToken == null) { // refresh 토큰 없는 경우
            return new ResponseEntity<>("refresh 토큰이 없습니다!", HttpStatus.BAD_REQUEST); // 응답 리팩토링 필요★
        }
        log.info("refreshToken : " + refreshToken);

        // 사용자가 보낸 refresh token 검증
        String secretKey = JwtProvider.getSecretKey();
        log.info("secretKey : " + secretKey);
        if(!JwtProvider.validateToken(refreshToken, secretKey)) { // 유효하지 않은 경우
            return new ResponseEntity<>("refresh 토큰이 유효하지 않습니다!", HttpStatus.BAD_REQUEST); // 응답 리팩토링 필요★
        }

        // 검증된 refresh token에서 userId & artistId 가져오기
        Long userId = JwtProvider.getUserId(refreshToken, secretKey);
        Long artistId = JwtProvider.getArtistId(refreshToken, secretKey);
        log.info("userId : "+userId);
        log.info("artistId : "+artistId);


        // redis에 저장된 refresh token 값을 가져오기.
        String redis_refreshToken = redisTemplate.opsForValue().get(userId.toString());
        log.info("redis_refreshToken : " + redis_refreshToken);

        // 1) refresh token 만료됐다면 redis에 없을거임(null). access token 재발급 불가
        // 2) redis에서 가져온 refresh token과 사용자에게 받은 refresh token이 다르면 재발급 불가
        if(redis_refreshToken == null || !redis_refreshToken.equals(refreshToken)) {
            return new ResponseEntity<>("refresh 토큰이 만료되었거나, 같지 않습니다!", HttpStatus.BAD_REQUEST); // 응답 리팩토링 필요★
        }

        // 같다면, access token 재발급
        String accessToken = JwtProvider.createAccessToken(new UserArtistIdDto(userId, artistId), secretKey);

        // response header에 새로 발급한 access token 저장
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("Authorization", "Bearer " + accessToken);

        return new ResponseEntity<>(accessToken, httpHeaders, HttpStatus.OK);
    }
}
