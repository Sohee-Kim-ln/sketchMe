package com.dutaduta.sketchme.chat.dao;

import com.dutaduta.sketchme.chat.domain.ChatRoom;
import com.dutaduta.sketchme.chat.domain.QChatRoom;
import com.dutaduta.sketchme.member.constant.MemberType;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional(readOnly = true)
@Repository
public class ChatRoomCustomRepository {

    private final JPAQueryFactory queryFactory;

    public ChatRoomCustomRepository(JPAQueryFactory queryFactory) {
        this.queryFactory = queryFactory;
    }

    public List<ChatRoom> findChatRoomListByUser(Long id, MemberType memberType) {
        QChatRoom chatRoom = QChatRoom.chatRoom;
        BooleanBuilder builder = new BooleanBuilder();

        if(MemberType.USER.equals(memberType)) {
            builder.and(chatRoom.user.id.eq(id));
        }else if(MemberType.ARTIST.equals(memberType)) {
            builder.and(chatRoom.artist.id.eq(id));
        }else {
            throw new RuntimeException();
        }

        return queryFactory.selectFrom(chatRoom)
                .where(builder)
                .fetch();
    }
}
