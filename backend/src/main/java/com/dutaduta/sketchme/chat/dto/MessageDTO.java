package com.dutaduta.sketchme.chat.dto;


import com.dutaduta.sketchme.global.LocalDateTimeFormat;
import com.dutaduta.sketchme.member.constant.MemberType;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;


@ToString
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access= AccessLevel.PROTECTED)
public class MessageDTO {

    @NotNull
    private Long senderID;
    @NotNull
    private Long receiverID;
    @Setter
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = LocalDateTimeFormat.DEFAULT)
    private LocalDateTime timestamp;
    @NotNull
    private String content;
    @NotNull
    private Long chatRoomID;
    @NotNull
    private MemberType senderType; //token에 userType 담고나면 변경해야될 사항
}
