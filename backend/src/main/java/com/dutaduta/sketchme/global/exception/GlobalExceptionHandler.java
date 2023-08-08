package com.dutaduta.sketchme.global.exception;


import com.dutaduta.sketchme.chat.exception.InvalidUserForCreateChatRoomException;
import com.dutaduta.sketchme.chat.exception.InvalidUserForUseChatRoomException;
import com.dutaduta.sketchme.chat.exception.UnknownChatUserException;
import com.dutaduta.sketchme.common.exception.CategoryNotFoundException;
import com.dutaduta.sketchme.global.CustomStatus;
import com.dutaduta.sketchme.global.ResponseFormat;
import com.dutaduta.sketchme.meeting.exception.MeetingNotFoundException;
import com.dutaduta.sketchme.member.exception.AccessNotAllowedException;
import com.dutaduta.sketchme.member.exception.InvalidCreateArtistException;
import com.dutaduta.sketchme.oidc.exception.ExpiredTokenException;
import com.dutaduta.sketchme.oidc.exception.InvalidTokenException;
import com.dutaduta.sketchme.review.exception.DuplicatedReviewException;
import com.dutaduta.sketchme.review.exception.ReviewNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.NoSuchElementException;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {


//    @ExceptionHandler(BusinessException.class)
//    protected ResponseEntity<ResponseFormat<?>> handleException(Exception e) {
//        log.error("handleEntityNotFoundException", e);
//        return new ResponseEntity<>()
////        return new ResponseEntity(new ResponseFormat<>(CustomStatus.INVALID_INPUT_VALUE,
////                new TestResponseDTO(1, "error")), HttpStatus.OK);
//    }

    @ExceptionHandler(InvalidUserForCreateChatRoomException.class)
     ResponseEntity<ResponseFormat<String>> handleInvalidUserForCreateChatRoomException(Exception e) {
        log.error(e.getMessage());
        return ResponseFormat.fail("", CustomStatus.INVALID_INPUT_VALUE).toEntity();
    }

    @ExceptionHandler(InvalidCreateArtistException.class)
    ResponseEntity<ResponseFormat<String>> handleInvalidCreateArtistException(InvalidCreateArtistException e) {
        e.printStackTrace();
        return ResponseFormat.fail("", CustomStatus.INVALID_ARTIST_CREATION).toEntity();
    }

    @ExceptionHandler(InvalidUserForUseChatRoomException.class)
    ResponseEntity<ResponseFormat<String>> handleInvalidUserForUseChatRoomException(InvalidUserForUseChatRoomException e) {
        e.printStackTrace();
        return ResponseFormat.fail("", CustomStatus.INVALID_CHAT_USER).toEntity();
    }

    @ExceptionHandler(UnknownChatUserException.class)
    ResponseEntity<ResponseFormat<String>> handleUnknownChatUserException(Exception e) {
        log.error(e.getMessage());
        return ResponseFormat.fail("", CustomStatus.INVALID_CHAT_USER).toEntity();
    }

    @ExceptionHandler(Exception.class)
    ResponseEntity<ResponseFormat<String>> handleInternalServerError(Exception e) {
        e.printStackTrace();
        return ResponseFormat.fail("", CustomStatus.INTERNAL_SERVER_ERROR).toEntity();
    }

    @ExceptionHandler(ExpiredTokenException.class)
    ResponseEntity<ResponseFormat<String>> handleExpiredTokenException(Exception e) {
        log.error(e.getMessage());
        return ResponseFormat.fail("만료된 토큰입니다.", CustomStatus.EXPIRED_TOKEN).toEntity();
    }

    @ExceptionHandler(InvalidTokenException.class)
    ResponseEntity<ResponseFormat<String>> handleInvalidTokenException(Exception e) {
        log.error(e.getMessage());
        return ResponseFormat.fail("유효하지 않은 토큰입니다.", CustomStatus.INVALID_TOKEN).toEntity();
    }

    @ExceptionHandler(MeetingNotFoundException.class)
    ResponseEntity<ResponseFormat<String>> handleMeetingNotFoundException(Exception e) {
        log.error(e.getMessage());
        return ResponseFormat.fail("예약 정보가 존재하지 않습니다.", CustomStatus.MEETING_NOT_FOUND).toEntity();
    }

    @ExceptionHandler(AccessNotAllowedException.class)
    ResponseEntity<ResponseFormat<String>> handleAccessNotAllowedException(Exception e) {
        log.error(e.getMessage());
        return ResponseFormat.fail("접근 권한이 없습니다.", CustomStatus.ACCESS_NOT_ALLOWED).toEntity();
    }

    @ExceptionHandler(DuplicatedReviewException.class)
    ResponseEntity<ResponseFormat<String>> handleDuplicatedReviewException(Exception e) {
        log.error(e.getMessage());
        return ResponseFormat.fail("한 건의 예약에 대해서는 하나의 리뷰만 작성 가능합니다.", CustomStatus.REVIEW_DUPLICATION).toEntity();
    }

    @ExceptionHandler(ReviewNotFoundException.class)
    ResponseEntity<ResponseFormat<String>> handleReviewNotFoundException(Exception e) {
        log.error(e.getMessage());
        return ResponseFormat.fail("리뷰 정보가 존재하지 않습니다.",CustomStatus.REVIEW_NOT_FOUND).toEntity();
    }

    @ExceptionHandler(CategoryNotFoundException.class)
    ResponseEntity<ResponseFormat<String>> handleCategoryNotFoundException(Exception e) {
        log.error(e.getMessage());
        return ResponseFormat.fail("카테고리 정보가 존재하지 않습니다.", CustomStatus.CATEGORY_NOT_FOUND).toEntity();
    }
}