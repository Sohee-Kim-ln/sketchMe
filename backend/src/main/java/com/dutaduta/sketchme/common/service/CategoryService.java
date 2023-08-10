package com.dutaduta.sketchme.common.service;

import com.dutaduta.sketchme.common.dao.CategoryRepository;
import com.dutaduta.sketchme.common.domain.Category;
import com.dutaduta.sketchme.common.dto.CategoryRequestDto;
import com.dutaduta.sketchme.common.exception.CategoryNotFoundException;
import com.dutaduta.sketchme.global.exception.ForbiddenException;
import com.dutaduta.sketchme.member.dao.ArtistRepository;
import com.dutaduta.sketchme.member.domain.Artist;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Log4j2
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;

    private final ArtistRepository artistRepository;


    public void registCategory(CategoryRequestDto categoryRequestDto, Long artistID) {
        Artist artist = artistRepository.getReferenceById(artistID);
        Category category = Category.createCategory(categoryRequestDto, artist);
        categoryRepository.save(category);
    }

    public void modifyCategory(CategoryRequestDto categoryRequestDto, Long artistID) {
        // 본인이 아니면 카테고리 수정할 수 없도록
        Category category = categoryRepository.findById(categoryRequestDto.getCategoryID()).orElseThrow(CategoryNotFoundException::new);
        if(Objects.equals(category.getArtist().getId(),artistID)) {
            category.updateCategory(categoryRequestDto);
        } else {
            throw new ForbiddenException("본인만 카테고리를 수정할 수 있습니다.");
        }
    }

    public void deleteCategory(Long categoryID, Long artistID) {
        // 본인이 아니면 카테고리 삭제할 수 없도록
        Category category = categoryRepository.findById(categoryID).orElseThrow(CategoryNotFoundException::new);
        if(Objects.equals(category.getArtist().getId(), artistID)) {
            category.deleteCategory();
        } else {
            throw new ForbiddenException("본인만 카테고리를 삭제할 수 있습니다.");
        }
    }

    public void changeCategoryIsOpen(Long categoryID, Long artistID, Boolean isOpen) {
        // 본인이 아니면 카테고리 공개여부 바꿀 수 없도록
        Category category= categoryRepository.findById(categoryID).orElseThrow(CategoryNotFoundException::new);
        if(Objects.equals(category.getArtist().getId(), artistID)) {
            category.updateIsOpen(isOpen);
        } else {
            throw new ForbiddenException("본인만 카테고리 공개 여부를 수정할 수 있습니다.");
        }
    }
}
