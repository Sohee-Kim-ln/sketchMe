package com.dutaduta.sketchme.chat.controller;

import com.dutaduta.sketchme.chat.config.KafkaConstants;
import com.dutaduta.sketchme.chat.domain.Chat;
import com.dutaduta.sketchme.chat.dto.ChatHistoryResponse;
import com.dutaduta.sketchme.chat.dto.MessageDTO;
import com.dutaduta.sketchme.chat.service.ChatService;
import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;
import org.springframework.kafka.core.KafkaTemplate;
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

    //kafka cluster에 메세지 전송
    @PostMapping(value = "communicate/publish")
    public void sendMessage(@RequestBody @Valid MessageDTO messageDTO) {
        messageDTO.setTimestamp(LocalDateTime.now());
        //key값 설정해서 kafka에 전송
        log.info(messageDTO.toString());

        kafkaTemplate.send(KafkaConstants.KAFKA_TOPIC, messageDTO.getSenderID().toString(), messageDTO);
        kafkaTemplate.send(KafkaConstants.KAFKA_TOPIC, messageDTO.getReceiverID().toString(), messageDTO);
    }

    //parameter 변동 필요
    @GetMapping(value = "chat/data")
    public List<ChatHistoryResponse> getPastMessage(@RequestParam("roomID") Long roomId) {
        //요청자의 신원 확인해야함 -> sub 추출해야한다 -> 이건 나중에
        //요청자가 방에 있는지 체크하는 로직이 필요하다
        List<ChatHistoryResponse> result = chatService.getPastMessage(roomId);
        return result;
    }
}
