package com.dutaduta.sketchme.chat.dto;


import com.dutaduta.sketchme.member.constant.MemberType;
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
    private LocalDateTime timestamp;
    @NotNull
    private String content;
    @NotNull
    private Long chatRoomID;
    private MemberType senderType; //token에 userType 담고나면 변경해야될 사항
}
