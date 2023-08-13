package com.dutaduta.sketchme.member.dao;


import com.dutaduta.sketchme.member.domain.Artist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ArtistRepository extends JpaRepository<Artist, Long> {

    // 검색어 없이 조회하는 경우
    List<Artist> findByIsDeactivatedAndIsOpenOrderByCreatedDateTimeDesc(Boolean isDeactivated, Boolean isOpen);

    // 검색어와 함께 조회하는 경우
    List<Artist> findByIsDeactivatedAndIsOpenAndNicknameContainingOrderByCreatedDateTimeDesc(Boolean isDeactivated, Boolean isOpen, String nickname);
}
