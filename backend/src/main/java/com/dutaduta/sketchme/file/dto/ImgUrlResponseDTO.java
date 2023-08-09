package com.dutaduta.sketchme.file.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@ToString
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access= AccessLevel.PROTECTED)
public class ImgUrlResponseDTO {
    @NotBlank
    private String profileImgUrl;

    @NotBlank
    private String profileThumbnailUrl;

    public static ImgUrlResponseDTO of(UploadResponseDTO uploadResponseDTO) {
        return ImgUrlResponseDTO.builder()
                .profileImgUrl(uploadResponseDTO.getImageURL())
                .profileThumbnailUrl(uploadResponseDTO.getThumbnailURL()).build();
    }
}
