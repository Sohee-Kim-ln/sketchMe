package com.dutaduta.sketchme.oidc.service;

import com.dutaduta.sketchme.member.domain.OAuthType;
import com.dutaduta.sketchme.member.domain.User;
import com.dutaduta.sketchme.member.domain.repository.UserRepository;
import com.dutaduta.sketchme.oidc.dto.OIDCDecodePayload;
import com.dutaduta.sketchme.oidc.dto.OIDCPublicKeyDto;
import com.dutaduta.sketchme.oidc.dto.TokenDto;
import com.dutaduta.sketchme.oidc.jwt.JwtOIDCProvider;
import com.dutaduta.sketchme.oidc.jwt.JwtProvider;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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
        OIDCDecodePayload payload = jwtOIDCProvider.getOIDCTokenBody(idToken, oidcPublicKeyDto.getN(), oidcPublicKeyDto.getE());
        log.info("OIDCDecodePayload : " + payload.toString());

        // 회원가입 된 회원인지 찾기 -> 회원 정보(sub) 없다면 회원가입 처리
        // user 테이블 - oauth_id, o_auth_type, (email), is_logined
        signUp(payload.getSub(), payload.getEmail(), OAuthType.KAKAO);

        // 로그인 처리를 위해 jwt 토큰 생성 (access token, refresh token)
        String secretKey = JwtProvider.getSecretKey();
        log.info("secretKey : " + secretKey);
        String refreshToken = JwtProvider.createRefreshToken(payload.getSub(), OAuthType.KAKAO, secretKey);
        String accessToken = JwtProvider.createAccessToken(payload.getSub(), OAuthType.KAKAO, secretKey);
        log.info("SketchMe refreshToken : " + refreshToken);
        log.info("SketchMe accessToken : " + accessToken);

        // JwtProvider 테스트 (확인 완료!)
//        String userId = JwtProvider.getUserId(accessToken, secretKey);
//        log.info("sub : " + userId);
//        log.info("isExpired : " + JwtProvider.isExpired(accessToken, secretKey));
//        log.info("isRefreshToken : " + JwtProvider.isRefreshToken(refreshToken, secretKey));
//        log.info("isAccessToken : " + JwtProvider.isAccessToken(accessToken, secretKey));
//        log.info("isRefreshToken - false : " + JwtProvider.isRefreshToken(accessToken, secretKey));
//        log.info("isAccessToken - false : " + JwtProvider.isAccessToken(refreshToken, secretKey));

        // refresh token은 redis에 저장
        TokenDto tokenDto = new TokenDto(accessToken, refreshToken);

        StringBuilder sb = new StringBuilder();
        String redisSub = sb.append(OAuthType.KAKAO).append(payload.getSub()).toString();
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
     * @param sub   유저 식별 정보 (카카오 or 구글에서의 회원번호)
     * @param email   사용자 이메일
     * @param oauthType KAKAO / GOOGLE
     */
    public void signUp(String sub, String email, OAuthType oauthType) {
        log.info("sub : " + sub);
        log.info("email : " + email);
        log.info("oauthType : " + oauthType);

        // sub로 판단하려면.. 구글이랑 겹치지는 않나??
        // => oauth_id, o_auth_type 같이 조회!

        // 회원인지 여부 판단
        User signedUser = userRepository.findByOauthIdAndOauthType(sub, oauthType);
        // 회원 아니면 회원가입 처리
        if(signedUser == null) {
            log.info("SignUp NO");
            User user = new User(sub, oauthType, email);
            userRepository.save(user);
            return;
        }
        log.info("SignUp YES");
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

        // 검증된 refresh token에서 userId(= sub)&oAuthType 가져오기
        String userId = JwtProvider.getUserId(refreshToken, secretKey);
        String type = JwtProvider.getUserOauthType(refreshToken, secretKey);
        OAuthType oAuthType = OAuthType.valueOf(type);

        // redis에 저장한 키값으로 변환 (KAKAO or GOOGLE+userId)
        StringBuilder sb = new StringBuilder();
        String redisSub = sb.append(oAuthType).append(userId).toString();
        log.info("redisSub : " + redisSub);

        // redis에 저장된 refresh token 값을 가져오기.
        String redis_refreshToken = redisTemplate.opsForValue().get(redisSub);
        log.info("redis_refreshToken : " + redis_refreshToken);

        // 1) refresh token 만료됐다면 redis에 없을거임(null). access token 재발급 불가
        // 2) redis에서 가져온 refresh token과 사용자에게 받은 refresh token이 다르면 재발급 불가
        if(redis_refreshToken == null || !redis_refreshToken.equals(refreshToken)) {
            return new ResponseEntity<>("refresh 토큰이 만료되었거나, 같지 않습니다!", HttpStatus.BAD_REQUEST); // 응답 리팩토링 필요★
        }

        // 같다면, access token 재발급
        String accessToken = JwtProvider.createAccessToken("sub", oAuthType, secretKey);

        // response header에 새로 발급한 access token 저장
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("Authorization", "Bearer " + accessToken);

        return new ResponseEntity<>(accessToken, httpHeaders, HttpStatus.OK);
    }
}
