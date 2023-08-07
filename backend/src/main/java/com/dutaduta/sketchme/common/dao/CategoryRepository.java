package com.dutaduta.sketchme.common.dao;

import com.dutaduta.sketchme.common.domain.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
}
