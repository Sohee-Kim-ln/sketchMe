package com.dutaduta.sketchme.review.service;

import com.dutaduta.sketchme.meeting.dao.MeetingRepository;
import com.dutaduta.sketchme.meeting.domain.Meeting;
import com.dutaduta.sketchme.meeting.domain.MeetingStatus;
import com.dutaduta.sketchme.member.dao.UserRepository;
import com.dutaduta.sketchme.oidc.dto.UserInfoInAccessTokenDTO;
import com.dutaduta.sketchme.review.dao.ReviewRepository;
import com.dutaduta.sketchme.review.domain.Review;
import com.dutaduta.sketchme.review.service.request.ReviewCreateServiceRequest;
import java.security.InvalidParameterException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReviewService {

	private final MeetingRepository meetingRepository;
	private final ReviewRepository reviewRepository;

	public long registerReview(UserInfoInAccessTokenDTO userInfo, long meetingId, ReviewCreateServiceRequest reviewCreateServiceRequest) {
		// 해당 유저가 미팅의 고객인지 확인한다.
		Meeting meeting = meetingRepository.findById(meetingId).orElseThrow(()->new InvalidParameterException("존재하지 않는 미팅입니다."));
		if(meeting.getUser().getId()!=userInfo.getUserId()){
			throw new InvalidParameterException("리뷰를 남길 수 없는 사용자입니다.");
		}

		// 상대방 유저가 미팅의 아티스트인지 확인한다.
		if(meeting.getArtist().getId()!=reviewCreateServiceRequest.getArtistId()){
			throw new InvalidParameterException("이 Artist는 미팅에 참여하고 있지 않습니다. 리뷰를 남길 수 없습니다.");
		}

		// 미팅이 끝난 상태인지 확인한다. (세션이 닫히면서 미팅이 종료됨을 DB에 기록하고 나서 Review를 등록한다.)
		if(!meeting.getMeetingStatus().equals(MeetingStatus.WAITING_REVIEW)){
			throw new InvalidParameterException("아직 리뷰를 남길 수 없습니다. 미팅이 끝나야 리뷰를 남길 수 있습니다.");
		}

		// 리뷰 정보를 등록한다.
		Review review = reviewCreateServiceRequest.toEntity(userInfo.getUserId());
		reviewRepository.save(review);
		meeting.setMeetingStatus(MeetingStatus.COMPLETED);
		// 등록한 리뷰의 ID 값을 리턴한다.
		return review.getId();
	}
}
