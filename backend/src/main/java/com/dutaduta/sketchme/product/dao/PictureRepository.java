package com.dutaduta.sketchme.product.dao;

import com.dutaduta.sketchme.product.domain.Picture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PictureRepository extends JpaRepository<Picture, Long> {

}
