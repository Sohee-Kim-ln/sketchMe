package com.dutaduta.sketchme.review.dao;

import com.dutaduta.sketchme.review.domain.Review;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {

}
