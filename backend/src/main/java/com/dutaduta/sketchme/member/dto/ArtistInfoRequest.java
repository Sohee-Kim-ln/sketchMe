package com.dutaduta.sketchme.member.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@ToString
@NoArgsConstructor
public class ArtistInfoRequest {
    @NotBlank
    private String nickname;
    @NotBlank
    private String description;
    @NotBlank
    private String profileImgUrl;
    @NotNull
    private Long[] hashtags;
}
