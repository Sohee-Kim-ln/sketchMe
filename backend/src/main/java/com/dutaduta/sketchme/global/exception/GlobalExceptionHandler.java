package com.dutaduta.sketchme.global.exception;


import com.dutaduta.sketchme.chat.exception.InvalidUserForCreateChatRoomException;
import com.dutaduta.sketchme.chat.exception.UnknownChatUserException;
import com.dutaduta.sketchme.global.CustomStatus;
import com.dutaduta.sketchme.global.ResponseFormat;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

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

    @ExceptionHandler(UnknownChatUserException.class)
    ResponseEntity<ResponseFormat<String>> handleUnknownChatUserException(Exception e) {
        log.error(e.getMessage());
        return ResponseFormat.fail("", CustomStatus.INVALID_CHAT_USER).toEntity();
    }

    @ExceptionHandler(Exception.class)
    ResponseEntity<ResponseFormat<String>> handleInternalServerError(Exception e) {
        log.error(e.getMessage());
        return ResponseFormat.fail("", CustomStatus.INTERNAL_SERVER_ERROR).toEntity();
    }
}