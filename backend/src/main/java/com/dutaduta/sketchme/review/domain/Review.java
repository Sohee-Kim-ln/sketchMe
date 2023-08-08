package com.dutaduta.sketchme.review.domain;

import com.dutaduta.sketchme.common.domain.BaseEntity;
import com.dutaduta.sketchme.meeting.domain.Meeting;
import com.dutaduta.sketchme.member.domain.Artist;
import com.dutaduta.sketchme.member.domain.User;
import com.dutaduta.sketchme.review.dto.ReviewRequestDto;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "review")
@Builder
@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Review extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(precision = 2, scale = 1)
    private BigDecimal rating;

    @Column(length = 2048)
    private String content;

    private boolean isDeleted;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "artist_id")
    private Artist artist;
    
    @OneToOne
    @JoinColumn(name = "meeting_id")
    private Meeting meeting;

    public static Review createReview(Meeting meeting, ReviewRequestDto reviewRequestDto){
        return Review.builder()
                .meeting(meeting)
                .user(meeting.getUser())
                .artist(meeting.getArtist())
                .rating(reviewRequestDto.getRating())
                .content(reviewRequestDto.getContent())
                .build();
    }

    public void updateReview(ReviewRequestDto reviewRequestDto) {
        this.rating = reviewRequestDto.getRating();
        this.content = reviewRequestDto.getContent();
    }

    public void deleteReview() {
        this.isDeleted = true;
    }
}
