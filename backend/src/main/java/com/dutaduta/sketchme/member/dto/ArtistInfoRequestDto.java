package com.dutaduta.sketchme.member.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@ToString
@NoArgsConstructor
public class ArtistInfoRequestDto {
    private String nickname;

    private String description;

    private String profileImgUrl;

    private Long[] hashtags;
}
