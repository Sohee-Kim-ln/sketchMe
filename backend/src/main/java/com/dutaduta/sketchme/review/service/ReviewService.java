package com.dutaduta.sketchme.review.service;

import com.dutaduta.sketchme.meeting.dao.MeetingRepository;
import com.dutaduta.sketchme.meeting.domain.Meeting;
import com.dutaduta.sketchme.meeting.exception.MeetingNotFoundException;
import com.dutaduta.sketchme.member.exception.AccessNotAllowedException;
import com.dutaduta.sketchme.review.dao.ReviewRepository;
import com.dutaduta.sketchme.review.domain.Review;
import com.dutaduta.sketchme.review.dto.ReviewRequestDto;
import com.dutaduta.sketchme.review.exception.DuplicatedReviewException;
import com.dutaduta.sketchme.review.exception.ReviewNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
@RequiredArgsConstructor
@Log4j2
@Transactional
public class ReviewService {
    private final ReviewRepository reviewRepository;

    private final MeetingRepository meetingRepository;

    public void insertReview(ReviewRequestDto reviewRequestDto, Long userId) {
        Meeting meeting = meetingRepository.findById(reviewRequestDto.getMeetingID()).orElseThrow(MeetingNotFoundException::new);

        // 해당 미팅에 이미 리뷰가 작성되어 있다면 쓸 수 없도록 (하나의 미팅에 하나의 리뷰만 가능)
        if(reviewRepository.existsByMeetingId(reviewRequestDto.getMeetingID())){
            throw new DuplicatedReviewException();
        }

        // meeting의 userId와 현재 요청을 보낸 userId가 같지 않으면 리뷰 쓸 수 없도록
        if(Objects.equals(meeting.getUser().getId(), userId)){
            Review review = Review.createReview(meeting, reviewRequestDto);
            reviewRepository.save(review);
        } else{
            throw new AccessNotAllowedException();
        }
    }


    public void modifyReview(ReviewRequestDto reviewRequestDto, Long userId) {
        // 본인이 아니면 리뷰 수정할 수 없도록
        Review review = reviewRepository.findById(reviewRequestDto.getReviewID()).orElseThrow(ReviewNotFoundException::new);
        if(Objects.equals(review.getUser().getId(), userId)) {
            review.updateReview(reviewRequestDto);
        } else{
            throw new AccessNotAllowedException();
        }
    }

    public void deleteReview(Long reviewID, Long userId) {
        // 본인이 아니면 리뷰 삭제할 수 없도록
        Review review = reviewRepository.findById(reviewID).orElseThrow(ReviewNotFoundException::new);
        if(Objects.equals(review.getUser().getId(), userId)) {
            review.deleteReview();
        } else{
            throw new AccessNotAllowedException();
        }
    }
}
