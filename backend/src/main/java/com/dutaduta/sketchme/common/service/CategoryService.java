package com.dutaduta.sketchme.common.service;

import com.dutaduta.sketchme.common.dao.CategoryRepository;
import com.dutaduta.sketchme.common.domain.Category;
import com.dutaduta.sketchme.common.dto.CategoryRequest;
import com.dutaduta.sketchme.member.dao.ArtistRepository;
import com.dutaduta.sketchme.member.domain.Artist;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Log4j2
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;

    private final ArtistRepository artistRepository;

    public void registCategory(CategoryRequest categoryRequest, Long artistID) {
        Artist artist = artistRepository.getReferenceById(artistID);
        Category category = Category.createCategory(categoryRequest, artist);
        categoryRepository.save(category);
    }


    public void modifyCategory(CategoryRequest categoryRequest, Long artistID) {
    }

    public void deleteCategory(Long categoryID, Long artistID) {
    }

    public void changeCategoryIsOpen(Long categoryID, Long artistID, Boolean isOpen) {
    }
}
