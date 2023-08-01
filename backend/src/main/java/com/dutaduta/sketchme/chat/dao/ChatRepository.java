package com.dutaduta.sketchme.chat.dao;


import com.dutaduta.sketchme.chat.domain.Chat;
import com.dutaduta.sketchme.chat.domain.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {
    List<Chat> findChatsByChatRoom_Id(Long id);
}
