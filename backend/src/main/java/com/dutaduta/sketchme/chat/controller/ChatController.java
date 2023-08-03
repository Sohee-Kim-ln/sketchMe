package com.dutaduta.sketchme.chat.controller;

import com.dutaduta.sketchme.chat.constant.KafkaConstants;
import com.dutaduta.sketchme.chat.dto.ChatHistoryRequestDTO;
import com.dutaduta.sketchme.chat.dto.ChatHistoryResponse;
import com.dutaduta.sketchme.chat.dto.MessageDTO;
import com.dutaduta.sketchme.chat.service.ChatService;
import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@Log4j2
@CrossOrigin
@RestController
public class ChatController {

    private KafkaTemplate<String, MessageDTO> kafkaTemplate;
    private ChatService chatService;

    public ChatController(KafkaTemplate<String, MessageDTO> kafkaTemplate, ChatService chatService) {
        this.kafkaTemplate = kafkaTemplate;
        this.chatService = chatService;
    }

    //kafka cluster에 메세지 전송 ->
    @MessageMapping("/publish")
    public void sendMessage(@RequestBody @Valid MessageDTO messageDTO) {
        messageDTO.setTimestamp(LocalDateTime.now()); //여기 로직 애매. 그냥 repository에서 가져와야되나?
        kafkaTemplate.send(KafkaConstants.KAFKA_TOPIC, messageDTO.getSenderID().toString(), messageDTO);
        kafkaTemplate.send(KafkaConstants.KAFKA_TOPIC, messageDTO.getReceiverID().toString(), messageDTO);
    }

    @GetMapping(value = "chat/data")
    public List<ChatHistoryResponse> getPastMessage(@ModelAttribute @Valid ChatHistoryRequestDTO requestDTO) {
        //요청자의 신원 확인해야함 -> roomID와 PageNum 비교
        List<ChatHistoryResponse> result = chatService.getPastMessage(requestDTO);
        return result;
    }
}
