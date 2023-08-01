package com.dutaduta.sketchme.chat.dto;


import com.dutaduta.sketchme.chat.domain.Chat;
import com.dutaduta.sketchme.member.constant.MemberType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@ToString
@Builder
@AllArgsConstructor
public class ChatHistoryResponse {

    Long chatRoomID;
    Long senderID;
    Long receiverID;
    MemberType senderType;
    LocalDateTime chatCreatedTime;


    public static ChatHistoryResponse toDTO(Chat chat) {
        return ChatHistoryResponse.builder()
                .chatRoomID(chat.getChatRoom().getId())
                .senderID(chat.getSender().getId())
                .senderType(chat.getMemberType())
                .chatCreatedTime(chat.getCreatedDateTime())
                .receiverID(chat.getReceiver().getId())
                .build();
    }
}
