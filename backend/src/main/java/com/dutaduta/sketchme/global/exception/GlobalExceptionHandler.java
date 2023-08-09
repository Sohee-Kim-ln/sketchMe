package com.dutaduta.sketchme.global.exception;


import com.dutaduta.sketchme.global.ResponseFormat;

import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Log4j2
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
     ResponseEntity<ResponseFormat<Object>> handleBusinessException(BusinessException e) {
        log.error(e.getMessage());
        return ResponseFormat.fail(HttpStatus.valueOf(e.getStatusCode()),e.getMessage()).toEntity();
    }
}