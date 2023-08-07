package com.dutaduta.sketchme.meeting.dto;

import com.dutaduta.sketchme.meeting.domain.Meeting;
import com.dutaduta.sketchme.member.constant.MemberType;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@ToString
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access= AccessLevel.PROTECTED)
public class MeetingReservationMessageResponseDTO {

    @NotNull
    private Long messageID;
    @NotNull
    private Long meetingID;
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
    @NotNull
    private MemberType senderType; //token에 userType 담고나면 변경해야될 사항
//
//    public MeetingReservationMessageResponseDTO toDTO(Meeting meeting) {
//
//    }
}
