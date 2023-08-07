package com.dutaduta.sketchme.meeting.dto;

import com.dutaduta.sketchme.meeting.domain.Meeting;
import com.dutaduta.sketchme.meeting.domain.MeetingStatus;
import com.dutaduta.sketchme.meeting.domain.Payment;
import com.dutaduta.sketchme.meeting.domain.PaymentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Date;

@ToString
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access= AccessLevel.PROTECTED)
public class MeetingInfoDto {
    @NotNull
    private Long meetingID;

    @NotNull
    private String categoryName;

    @NotNull
    private String userNickname;

    @NotNull
    private String artistNickname;

    @NotNull
    private Long userID;

    @NotNull
    private Long artistID;

    private String userEmail;

    private String artistEmail;

    private String content;

    @NotNull
    private LocalDateTime startDatetime; // 예약 일시

    @NotNull
    private LocalDateTime createDatetime; // 신청 일시

    @NotNull
    private Long exactPrice;

    @NotNull
    private MeetingStatus meetingStatus;

    private Payment payment;

    private PaymentStatus paymentStatus;

    @NotNull
    private Boolean isOpen;

    public static MeetingInfoDto toDTO(Meeting meeting){
        return MeetingInfoDto.builder()
                .meetingID(meeting.getId())
                .categoryName(meeting.getCategory().getName())
                .userNickname(meeting.getUser().getNickname())  // user, artist 정보가 다 필요함...
                .artistNickname(meeting.getArtist().getNickname())
                .userID(meeting.getUser().getId())
                .artistID(meeting.getArtist().getId())
                .userEmail(meeting.getUser().getEmail())
                .artistEmail(meeting.getArtist().getUser().getEmail())
                .content(meeting.getContent())
                .startDatetime(meeting.getStartDateTime())
                .createDatetime(meeting.getCreatedDateTime())
                .exactPrice(meeting.getExactPrice())
                .meetingStatus(meeting.getMeetingStatus())
                .payment(meeting.getPayment())
                .paymentStatus(meeting.getPaymentStatus())
                .isOpen(meeting.isOpen())
                .build();
    }
}
