package com.dutaduta.sketchme.member.service;

import com.dutaduta.sketchme.common.dao.CategoryRepository;
import com.dutaduta.sketchme.common.dao.HashtagRepository;
import com.dutaduta.sketchme.common.domain.Category;
import com.dutaduta.sketchme.common.domain.CategoryHashtag;
import com.dutaduta.sketchme.common.domain.Hashtag;
import com.dutaduta.sketchme.common.dto.HashtagResponse;
import com.dutaduta.sketchme.global.ResponseFormat;
import com.dutaduta.sketchme.global.exception.BadRequestException;
import com.dutaduta.sketchme.global.exception.BusinessException;
import com.dutaduta.sketchme.global.exception.NotFoundException;
import com.dutaduta.sketchme.member.dao.ArtistHashtagRepository;
import com.dutaduta.sketchme.member.dao.ArtistRepository;
import com.dutaduta.sketchme.member.dao.UserRepository;
import com.dutaduta.sketchme.member.domain.Artist;
import com.dutaduta.sketchme.member.domain.ArtistHashtag;
import com.dutaduta.sketchme.member.domain.User;
import com.dutaduta.sketchme.member.dto.ArtistInfoRequest;
import com.dutaduta.sketchme.member.dto.ArtistResponse;
import com.dutaduta.sketchme.oidc.dto.UserArtistIdDTO;
import com.dutaduta.sketchme.oidc.jwt.JwtProvider;
import com.dutaduta.sketchme.review.dao.ReviewRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
@Log4j2
@Transactional
public class ArtistService {
    private final ArtistRepository artistRepository;

    private final UserRepository userRepository;

    private final UserService userService;

    private final HashtagRepository hashtagRepository;

    private final ArtistHashtagRepository artistHashtagRepository;

    private final CategoryRepository categoryRepository;

    private final ReviewRepository reviewRepository;



    public String getDescription(Long id) {
        Artist artist = artistRepository.findById(id).orElseThrow(() -> new BadRequestException("존재하지 않는 작가입니다."));
        if(artist.isDeactivated()) throw new BadRequestException("탈퇴한 작가입니다.");
        if(!artist.isOpen()) throw new BadRequestException("비공개 상태의 작가입니다.");
        return artist.getDescription();
    }

    public ResponseFormat registArtist(Long userId) {
        log.info(userId);
        User user = userRepository.findById(userId).orElseThrow(() -> new BadRequestException("존재하지 않는 사용자입니다."));

        // 이미 작가 등록된 경우는 추가 등록 막기
        if(user.isDebuted()) {
            throw new BadRequestException("이미 작가로 등록되었습니다.");
        }

        // 작가 생성 및 등록
        Artist artist = Artist.builder()
                .nickname(user.getNickname())
                .profileImgUrl(user.getProfileImgUrl())
                .profileThumbnailImgUrl(user.getProfileThumbnailImgUrl())
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

    @Transactional
    public void modifyArtistInformation(ArtistInfoRequest artistInfoRequest, MultipartFile uploadFile, Long artistId) {
        Artist artist = artistRepository.findById(artistId).orElseThrow(()->new BadRequestException("존재하지 않는 작가입니다."));
        if(artist.isDeactivated()) throw new BadRequestException("탈퇴한 작가입니다.");
        // artist 프로필 이미지 수정
        userService.updateProfileImage(uploadFile, "artist", 0L, artistId);
        // 닉네임 수정
        artist.updateNickname(artistInfoRequest.getNickname());
        // 해시태그 수정 로직 추가해야 함
        for (Long hashtagID : artistInfoRequest.getHashtags()) {
            Hashtag hashtag = hashtagRepository.findById(hashtagID).orElseThrow(() -> new NotFoundException("존재하지 않는 해시태그입니다."));
            // 중복되지 않는 해시태그들만 추가해주기
            if (artistHashtagRepository.findByArtistAndHashtag(artist, hashtag) == null){
                artistHashtagRepository.save(ArtistHashtag.of(artist, hashtag));
            }
        }
    }


    public void changeArtistIsOpen(Boolean isOpen, Long artistId) {
        Artist artist = artistRepository.findById(artistId).orElseThrow(()->new BadRequestException("존재하지 않는 작가입니다."));
        if(artist.isDeactivated()) throw new BadRequestException("탈퇴한 작가입니다.");
        artist.updateIsOpen(isOpen);
    }

    public void deactivateArtist(Long artistId, Long userId) {
        Artist artist = artistRepository.findById(artistId).orElseThrow(()->new BadRequestException("존재하지 않는 작가입니다."));
        if(artist.isDeactivated()) throw new BadRequestException("탈퇴한 작가입니다.");
        User user = userRepository.findById(userId).orElseThrow(()->new BadRequestException("존재하지 않는 사용자입니다."));
        artist.deactivate();
        user.updateIsDebuted(false);
    }

    public void modifyArtistDescription(String description, Long artistId){
        Artist artist = artistRepository.getReferenceById(artistId);
        if(artist.isDeactivated()) throw new BadRequestException("탈퇴한 작가입니다.");
        artist.updateDescription(description);
    }

    public void reactivateArtist(Long artistId) {
        Artist artist = artistRepository.findById(artistId).orElseThrow(()->new BadRequestException("존재하지 않는 작가입니다."));
        artist.reactivate();
        artist.getUser().updateIsDebuted(true);
    }

    public List<ArtistResponse> searchArtists(String keyword) {
        List<ArtistResponse> result = new ArrayList<>();

        // 비활성화, 비공개인 작가들 제외하고 모든 작가를 최신순으로 반환한다.
        List<Artist> artists = null;
        if(keyword == null) {
            artists = artistRepository.findByIsDeactivatedAndIsOpenOrderByCreatedDateTimeDesc(false, true);
        } else {
            artists = artistRepository.findByIsDeactivatedAndIsOpenAndNicknameContainingOrderByCreatedDateTimeDesc(false, true, keyword);
        }

        // 반환을 위한 데이터 가공
        for(Artist artist : artists) {
            log.info("작가" + artist.getId());
            // 해시태그 반환 형식 가공
            List<HashtagResponse> hashtags = new ArrayList<>();
            for(ArtistHashtag hashtag : artist.getArtistHashtagList()) {
                hashtags.add(HashtagResponse.of(hashtag.getHashtag()));
            }

            // 해당 작가의 카테고리 최소 가격 구하기
            Long minPrice = null;
            Category category = categoryRepository.findTopByArtistAndIsDeletedAndIsOpenOrderByApproximatePrice(artist, false, true);
            // 카테고리가 없는 경우!
            if(category != null){
                minPrice = category.getApproximatePrice();
            }

            // 별점
            BigDecimal avgRating = reviewRepository.calculateAvgRating(artist);

            // 결과에 넣기
            result.add(ArtistResponse.of(artist, hashtags, minPrice, avgRating));
        }

        return result;
    }

    public ArtistResponse getArtistInfo(Long artistId) {

        log.info("작가 정보 조회" + artistId);
        Artist artist = artistRepository.findById(artistId).orElseThrow(() -> new BadRequestException("존재하지 않는 작가입니다."));

        if(artist.isDeactivated()) throw new BadRequestException("탈퇴한 작가입니다.");
        if(!artist.isOpen()) throw new BadRequestException("비공개 상태의 작가입니다.");

        // 해시태그 반환 형식 가공
        List<HashtagResponse> hashtags = new ArrayList<>();
        for(ArtistHashtag hashtag : artist.getArtistHashtagList()) {
            hashtags.add(HashtagResponse.of(hashtag.getHashtag()));
        }

        // 해당 작가의 카테고리 최소 가격 구하기
        Long minPrice = null;
        Category category = categoryRepository.findTopByArtistAndIsDeletedAndIsOpenOrderByApproximatePrice(artist, false, true);
        // 카테고리가 없는 경우!
        if(category != null){
            minPrice = category.getApproximatePrice();
        }

        // 별점
        BigDecimal avgRating = reviewRepository.calculateAvgRating(artist);


        // 해당 작가가 나의 작가 계정과 다를 경우, 해당 작가를 관심 작가로 등록했는지 여부도 반환 (추후에 로직 추가해야 함)


        return ArtistResponse.of(artist, hashtags, minPrice, avgRating);
    }
}
