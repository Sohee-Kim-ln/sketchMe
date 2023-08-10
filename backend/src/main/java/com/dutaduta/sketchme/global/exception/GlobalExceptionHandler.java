package com.dutaduta.sketchme.global.exception;



import com.dutaduta.sketchme.global.ResponseFormat;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {


    @ExceptionHandler(BusinessException.class)
    protected ResponseEntity<ResponseFormat<Object>> handleException(BusinessException e) {
        log.error("BusinessException", e);
        return ResponseFormat.fail(HttpStatus.valueOf(e.getStatusCode()),e.getMessage()).toEntity();
    }
}