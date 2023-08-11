package com.dutaduta.sketchme.product.dao;

import com.dutaduta.sketchme.product.domain.Timelapse;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TimelapseRepository extends JpaRepository<Timelapse, Long> {
}
