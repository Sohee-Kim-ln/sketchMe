package com.dutaduta.sketchme.chat.dto;


import lombok.*;

@Getter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChatHistoryRequestDTO {
    private Long roomID;
    private int pageNum;
}
