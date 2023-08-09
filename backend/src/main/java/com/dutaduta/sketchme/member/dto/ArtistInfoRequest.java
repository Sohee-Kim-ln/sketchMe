package com.dutaduta.sketchme.member.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.web.multipart.MultipartFile;

@Getter
@ToString
@NoArgsConstructor
public class ArtistInfoRequestDto {
    private String nickname;

    private Long[] hashtags;
}
