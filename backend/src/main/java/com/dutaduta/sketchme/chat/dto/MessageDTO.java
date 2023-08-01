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
    Long senderID;
    @NotNull
    Long receiverID;
    @Setter
    LocalDateTime timestamp;
    @NotNull
    String content;
    @NotNull
    Long chatRoomID;
    MemberType senderType; //token에 userType 담고나면 변경해야될 사항

}
