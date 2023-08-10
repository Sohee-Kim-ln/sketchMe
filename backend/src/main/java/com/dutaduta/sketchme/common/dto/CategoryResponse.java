package com.dutaduta.sketchme.common.dto;

import com.dutaduta.sketchme.product.dto.PictureResponseDTO;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@ToString
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access= AccessLevel.PROTECTED)
public class CategoryResponse {

    @NotNull
    private Long categoryID;

    private String name;

    private String description;

    private Long price;

    @NotNull
    private boolean isOpen;

    private LocalDateTime createdDateTime;

    private LocalDateTime updatedDateTime;

    private List<PictureResponseDTO> drawings;
}
