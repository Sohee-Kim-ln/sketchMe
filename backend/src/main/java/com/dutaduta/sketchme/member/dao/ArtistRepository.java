package com.dutaduta.sketchme.member.dao;


import com.dutaduta.sketchme.member.domain.Artist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ArtistRepository extends JpaRepository<Artist, Long> {

    List<Artist> findByIsDeactivatedAndIsOpenOrderByCreatedDateTimeDesc(Boolean isDeactivated, Boolean isOpen);
}
