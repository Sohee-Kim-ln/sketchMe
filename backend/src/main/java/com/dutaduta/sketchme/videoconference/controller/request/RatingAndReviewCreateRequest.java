package com.dutaduta.sketchme.videoconference.controller.request;

import com.dutaduta.sketchme.videoconference.service.request.RatingAndReviewCreateServiceRequest;
import lombok.*;

@NoArgsConstructor
@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class RatingAndReviewCreateRequest {
    private double rating;
    private String review;

    public RatingAndReviewCreateServiceRequest toServiceRequest(){
        return RatingAndReviewCreateServiceRequest.builder()
                .rating(rating)
                .review(review)
                .build();
    }
}
