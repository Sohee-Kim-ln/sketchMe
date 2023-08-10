package com.dutaduta.sketchme.product.dto;

import com.dutaduta.sketchme.file.dto.ImgUrlResponse;
import com.dutaduta.sketchme.product.domain.Picture;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@ToString
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access= AccessLevel.PROTECTED)
public class PictureResponseDTO {

    @NotNull
    private ImgUrlResponse imgUrlResponse;

    @NotNull
    private Long pictureID;

    @NotNull
    private Boolean isOpen;

    @NotNull
    private boolean isDrawnInApp;

    private Long categoryID;

    private Long meetingID;

    private Long userID;

    @NotNull
    private Long artistID;

    public static PictureResponseDTO of(Picture picture, ImgUrlResponse imgUrlResponse) {
        PictureResponseDTOBuilder builder =  PictureResponseDTO.builder()
                .imgUrlResponse(imgUrlResponse)
                .pictureID(picture.getId())
                .isOpen(picture.isOpen())
                .isDrawnInApp(picture.isDrawnInApp())
                .artistID(picture.getArtist().getId());

        if(picture.getCategory() != null) {
            builder.categoryID(picture.getCategory().getId());
        }

        if(picture.getMeeting() != null) {
            builder.meetingID(picture.getMeeting().getId());
        }

        if(picture.getUser() != null) {
            builder.userID(picture.getUser().getId());
        }

        return builder.build();
    }
}
