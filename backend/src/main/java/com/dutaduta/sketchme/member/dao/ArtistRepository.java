package com.dutaduta.sketchme.member.dao;


import com.dutaduta.sketchme.member.domain.Artist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ArtistRepository extends JpaRepository<Artist, Long> {

    // 이름으로 작가 검색
    @Query("SELECT a FROM Artist a WHERE a.isDeactivated = false AND a.isOpen = true AND a.nickname LIKE %:keyword% ORDER BY a.updatedDateTime DESC")
    List<Artist> searchArtistsByKeyword(@Param("keyword") String keyword);
}
