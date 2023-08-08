package com.dutaduta.sketchme.videoconference.controller.response;

import lombok.*;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class ConnectionCreateResponse {
    private final String token;
}
