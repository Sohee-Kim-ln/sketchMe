package com.dutaduta.sketchme.product.dao;

import com.dutaduta.sketchme.member.domain.Artist;
import com.dutaduta.sketchme.product.domain.Picture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PictureRepository extends JpaRepository<Picture, Long> {

    List<Picture> findByArtistAndIsDeleted(Artist artist, Boolean isDeleted);

}
