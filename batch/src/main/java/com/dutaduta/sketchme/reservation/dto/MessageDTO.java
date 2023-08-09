package com.dutaduta.sketchme.reservation.dto;


import com.dutaduta.sketchme.reservation.domain.Meeting;
import com.dutaduta.sketchme.reservation.domain.MemberType;
import lombok.*;
import lombok.extern.log4j.Log4j2;

import java.time.LocalDateTime;

@Getter
@ToString
@Builder
@Log4j2
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MessageDTO {
    private Long senderID;
    private Long receiverID;
    private LocalDateTime timestamp;
    private String content;
    private Long chatRoomID;
    private MemberType senderType; //token에 userType 담고나면 변경해야될 사항

    public static MessageDTO toDTO(Meeting meeting) {
        if(meeting.getArtist()==null) return null;
        return MessageDTO.builder()
                .chatRoomID(meeting.getChatRoom())
                .senderID(meeting.getArtist().getUser().getId())
                .receiverID(meeting.getUser())
                .content("meetingID : " + meeting.getId() +
                        "\n startDateTime: " + meeting.getStartDateTime())//여기 메세지 집어놔야 함
                .senderType(MemberType.BOT_LIVE_INFO)
                .timestamp(LocalDateTime.now())
                .build();
    }
}
