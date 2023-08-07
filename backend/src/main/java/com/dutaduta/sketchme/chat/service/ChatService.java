package com.dutaduta.sketchme.chat.service;

import com.dutaduta.sketchme.chat.constant.ChatConstant;
import com.dutaduta.sketchme.chat.dao.ChatCustomRepository;
import com.dutaduta.sketchme.chat.dao.ChatRepository;
import com.dutaduta.sketchme.chat.dao.ChatRoomCustomRepository;
import com.dutaduta.sketchme.chat.dao.ChatRoomRepository;
import com.dutaduta.sketchme.chat.domain.Chat;
import com.dutaduta.sketchme.chat.domain.ChatRoom;
import com.dutaduta.sketchme.chat.dto.ChatHistoryRequestDTO;
import com.dutaduta.sketchme.chat.dto.ChatHistoryResponseDTO;
import com.dutaduta.sketchme.chat.dto.MessageDTO;
import com.dutaduta.sketchme.chat.exception.InvalidUserForUseChatRoomException;
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
    private final ChatRoomCustomRepository chatRoomCustomRepository;

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
        if (messageDTO.getSenderID().toString().equals(userID)) {
            User sender = userRepository.findById(messageDTO.getSenderID())
                    .orElseThrow(InvalidUserForUseChatRoomException::new);
            User receiver = userRepository.findById(messageDTO.getReceiverID())
                    .orElseThrow(InvalidUserForUseChatRoomException::new);
            ChatRoom chatRoom = chatRoomCustomRepository
                    .findChatRoomByUserAndUserTypeAndRoomNumber(messageDTO.getChatRoomID(),
                            messageDTO.getSenderID(), messageDTO.getSenderType());
            log.info(messageDTO.toString());
            if(chatRoom==null) throw new InvalidUserForUseChatRoomException();

            Chat newChat = chatRepository.save(Chat.builder()
                    .content(messageDTO.getContent())
                    .memberType(messageDTO.getSenderType())
                    .receiver(receiver)
                    .sender(sender)
                    .chatRoom(chatRoom)
                    .memberType(messageDTO.getSenderType())
                    .build());
            chatRoom.setLastChat(newChat);
        }
        String destination = SUBSCRIBER_URL + userID;
        template.convertAndSend(destination, messageDTO);
    }

    @Transactional(readOnly = true)
    public List<ChatHistoryResponseDTO> getPastMessage(ChatHistoryRequestDTO requestDTO, Long userID) {
        Pageable pageable = PageRequest.of(requestDTO.getPageNum(),
                ChatConstant.NUMBER_OF_CHAT.getCount(), Sort.by("createdDateTime").descending());

        //mongodb에서 가져와야 함. join이 불가능
        ChatRoom chatRoom =
                chatRoomCustomRepository.findChatRoomByUserAndUserTypeAndRoomNumber(
                    requestDTO.getRoomID(),userID, requestDTO.getMemberType()
                );

        if(chatRoom==null) throw new InvalidUserForUseChatRoomException();

        //1. roomID를 가져온다
        List<ChatHistoryResponseDTO> responses = new ArrayList<>();
        List<Chat> chats = chatRepository.findChatsByChatRoom_Id(chatRoom.getId(), pageable);
        //2. chats를 수행한다
        for (Chat chat : chats) {
            responses.add(ChatHistoryResponseDTO.toDTO(chat));
        }
        return responses;
    }
}
