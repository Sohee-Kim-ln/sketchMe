package com.dutaduta.sketchme.chat.service;

import com.dutaduta.sketchme.chat.constant.KafkaConstants;
import com.dutaduta.sketchme.chat.dao.ChatCustomRepository;
import com.dutaduta.sketchme.chat.dao.ChatRepository;
import com.dutaduta.sketchme.chat.dao.ChatRoomRepository;
import com.dutaduta.sketchme.chat.domain.Chat;
import com.dutaduta.sketchme.chat.constant.ChatConstant;
import com.dutaduta.sketchme.chat.domain.ChatRoom;
import com.dutaduta.sketchme.chat.dto.ChatHistoryRequestDTO;
import com.dutaduta.sketchme.chat.dto.ChatHistoryResponse;
import com.dutaduta.sketchme.chat.dto.MessageDTO;
import com.dutaduta.sketchme.member.dao.ArtistRepository;
import com.dutaduta.sketchme.member.dao.UserRepository;
import com.dutaduta.sketchme.member.domain.User;
import lombok.AllArgsConstructor;
import lombok.ToString;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.annotation.RetryableTopic;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static com.dutaduta.sketchme.chat.constant.KafkaConstants.GROUP_ID;
import static com.dutaduta.sketchme.chat.constant.KafkaConstants.KAFKA_TOPIC;
import static com.dutaduta.sketchme.chat.constant.WebSocketConstant.SUBSCRIBER_URL;


@Log4j2
@ToString
@AllArgsConstructor
@Service
@Transactional
public class ChatService {

    private final SimpMessagingTemplate template;
    private final ChatCustomRepository chatCustomRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final UserRepository userRepository;
    private final ChatRepository chatRepository;
    private final ArtistRepository artistRepository;

    /**
     * template.convertAndSend가 message 받고 WebSocket topic으로 전송함
     * 그러면 구독중인 웹소켓 토픽을 읽고 전송하는 것을 controller에서 수행함
     */
    @KafkaListener(
            topics = KAFKA_TOPIC,
            groupId = GROUP_ID
    )
    @RetryableTopic
    public void communicate(@Payload MessageDTO messageDTO, @Header(KafkaHeaders.RECEIVED_KEY) String userID) {
        /**
         * DB에 저장하는 과정에서 오류가 발생하면 계속 Kafka가 메시지를 보낼 겁니다.
         * 그러면 5번 정도 재반복하다가,
         * 그래도 DB에 저장이 안 되면 그 때 오류 이벤트를 카프카에 보내서 카프카가 메시지 큐로서 메시지를 저장하게 만들어 보세요.
         */
        if (messageDTO.getSenderID().toString().equals(userID)) {
            Optional<User> sender = userRepository.findById(messageDTO.getSenderID());
            Optional<User> receiver = userRepository.findById(messageDTO.getReceiverID());
            Optional<ChatRoom> chatRoom = chatRoomRepository.findById(messageDTO.getChatRoomID());

            chatRepository.save(Chat.builder()
                    .content(messageDTO.getContent())
                    .memberType(messageDTO.getSenderType())
                    .receiver(receiver.get())
                    .sender(sender.get())
                    .chatRoom(chatRoom.get())
                    .memberType(messageDTO.getSenderType())
                    .build());
        }
        String destination = SUBSCRIBER_URL + userID;
        template.convertAndSend(destination, messageDTO);
    }

    public List<ChatHistoryResponse> getPastMessage(ChatHistoryRequestDTO requestDTO) {
        Pageable pageable = PageRequest.of(requestDTO.getPageNum(), ChatConstant.NUMBER_OF_CHAT.getCount(), Sort.by("createdDateTime"));
        List<Chat> chats = chatRepository.findChatsByChatRoom_Id(requestDTO.getRoomID(), pageable);
        List<ChatHistoryResponse> responses = new ArrayList<>();
        for (Chat chat : chats) {
            responses.add(ChatHistoryResponse.toDTO(chat));
        }
        return responses;
    }
}
