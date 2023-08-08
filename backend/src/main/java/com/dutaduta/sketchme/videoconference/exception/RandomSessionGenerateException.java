package com.dutaduta.sketchme.videoconference.exception;

import com.dutaduta.sketchme.global.exception.BusinessException;
import com.dutaduta.sketchme.videoconference.controller.response.SessionGetResponse;
import lombok.RequiredArgsConstructor;


public class RandomSessionGenerateException extends BusinessException {
    public RandomSessionGenerateException(String message){
        super(message);
    }
}
