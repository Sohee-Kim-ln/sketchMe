package com.dutaduta.sketchme.meeting.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Date;

@ToString
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access= AccessLevel.PROTECTED)
public class ReservationDto {
    @NotNull
    private Long categoryID;

    @NotNull
    private Long userID;

    @NotNull
    private Long artistID;

    @NotNull
    private LocalDateTime datetime;

    private String content;

    @NotNull
    private Boolean isOpen;
}
