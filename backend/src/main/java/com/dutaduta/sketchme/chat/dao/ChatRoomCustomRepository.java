package com.dutaduta.sketchme.chat.dao;

import com.dutaduta.sketchme.chat.domain.ChatRoom;
import com.dutaduta.sketchme.chat.domain.QChatRoom;
import com.dutaduta.sketchme.chat.exception.InvalidUserForUseChatRoomException;
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

    public List<ChatRoom> findBunchOfChatRoomByUser(Long userID, MemberType memberType) {
        QChatRoom chatRoom = QChatRoom.chatRoom;
        return queryFactory.selectFrom(chatRoom)
                .where(createUserCondition(userID, memberType, chatRoom))
                .fetch();
    }

    public ChatRoom findChatRoomByUserAndUserTypeAndRoomNumber(Long roomID, Long userID, MemberType memberType) {
        QChatRoom chatRoom = QChatRoom.chatRoom;
        return queryFactory.selectFrom(chatRoom)
                .where(createUserCondition(userID, memberType, chatRoom).and(chatRoom.id.eq(roomID)))
                .fetchOne();
    }

    private BooleanBuilder createUserCondition(Long userID, MemberType memberType, QChatRoom chatRoom) {
        BooleanBuilder builder = new BooleanBuilder();
        if (MemberType.USER.equals(memberType)) {
            builder.and(chatRoom.user.id.eq(userID));
        } else if (MemberType.ARTIST.equals(memberType) ||
                MemberType.BOT_LIVE_INFO.equals(memberType)) {
            builder.and(chatRoom.artist.user.id.eq(userID));
        } else {
            throw new InvalidUserForUseChatRoomException();
        }
        return builder;
    }
}
