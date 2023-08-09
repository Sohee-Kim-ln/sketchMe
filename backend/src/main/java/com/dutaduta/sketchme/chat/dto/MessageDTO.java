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

    @NotNull(message = "senderID는 비어있으면 안됩니다")
    private Long senderID;
    @NotNull(message = "receiverID는 비어있으면 안됩니다")
    private Long receiverID;

    @Setter
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = LocalDateTimeFormat.DEFAULT)
    private LocalDateTime timestamp;

    @NotNull(message = "content는 비어있으면 안됩니다")
    private String content;
    @NotNull(message = "채팅방이 설정되어있어야 합니다")
    private Long chatRoomID;
    @NotNull(message = "senderType이 정해져있지 않습니다")
    private MemberType senderType; //token에 userType 담고나면 변경해야될 사항
}
