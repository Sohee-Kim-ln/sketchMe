package com.dutaduta.sketchme.common.service;

import com.dutaduta.sketchme.common.dao.CategoryRepository;
import com.dutaduta.sketchme.common.domain.Category;
import com.dutaduta.sketchme.common.dto.CategoryRequestDto;
import com.dutaduta.sketchme.common.dto.CategoryResponseDTO;
import com.dutaduta.sketchme.global.exception.BusinessException;
import com.dutaduta.sketchme.member.dao.ArtistRepository;
import com.dutaduta.sketchme.member.domain.Artist;
import com.dutaduta.sketchme.oidc.jwt.JwtProvider;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.List;
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
}
