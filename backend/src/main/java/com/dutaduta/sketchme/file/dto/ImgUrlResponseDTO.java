package com.dutaduta.sketchme.file.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@ToString
@Getter
@AllArgsConstructor
@NoArgsConstructor(access= AccessLevel.PROTECTED)
public class ImgUrlResponseDTO {
    @NotBlank
    private String profileImgUrl;

    @NotBlank
    private String profileThumbnailUrl;
}
