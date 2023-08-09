package com.dutaduta.sketchme.oidc.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@AllArgsConstructor
@Getter
@Builder
@ToString
public class UserArtistIdDTO {
    private Long user_id = 0L;
    private Long artist_id = 0L;
}
