package com.dutaduta.sketchme.file.dto;

import com.dutaduta.sketchme.product.domain.Picture;
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

    public static ImgUrlResponseDTO of(Picture picture) {
        return ImgUrlResponseDTO.builder()
                .profileImgUrl(picture.getUrl())
                .profileThumbnailUrl(picture.getThumbnailUrl()).build();
    }
}
