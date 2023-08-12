package com.dutaduta.sketchme.videoconference.service.response;

import lombok.*;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class GetIntoRoomResponse {
    private final String token;
}
