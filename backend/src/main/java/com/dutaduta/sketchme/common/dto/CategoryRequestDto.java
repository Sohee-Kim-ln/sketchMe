package com.dutaduta.sketchme.common.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@ToString
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access= AccessLevel.PROTECTED)
public class CategoryRequestDto {

    @NotNull
    private String name;

    @NotNull
    private String description;

    private Long approximatePrice;

    private Long[] hashtags;

}
