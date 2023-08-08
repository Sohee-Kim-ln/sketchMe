package com.dutaduta.sketchme.videoconference.service;

import com.dutaduta.sketchme.IntegrationTestSupport;
import com.dutaduta.sketchme.videoconference.exception.OpenViduException;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.*;

class OpenViduAPIServiceTest extends IntegrationTestSupport {

    @Autowired
    private OpenViduAPIService openViduAPIService;

    @Test
    @DisplayName("세션을 만든다")
    void createSessionHappyCase() throws OpenViduJavaClientException, OpenViduHttpException {
        // given
        String sessionId = "session-id";

        // when
        String sessionIdFromServer =openViduAPIService.createSession(sessionId);

        // then
        assertThat(sessionIdFromServer).isEqualTo(sessionId);
    }

    @Test
    @DisplayName("세션이 존재하지 않는데 세션을 삭제하려고 하는 경우, 예외가 방출된다.")
    void closeSessionIfSessionIsNotExisted() {
        // given
        String sessionId = "not-existed-session-id";
        // when

        // then
        assertThatThrownBy(()->openViduAPIService.deleteSession(sessionId)).isInstanceOf(OpenViduException.class).hasMessage("세션이 없어서 세션을 닫을 수 없습니다.");
    }

    @Test
    @DisplayName("")
    void createSessionBadCase() {
        // given

        // when

        // then
    }

    @Test
    @DisplayName("")
    void createConnectionHappyCase() {
        // given

        // when

        // then
    }

    @Test
    @DisplayName("")
    void createConnectionBadCase() {
        // given

        // when

        // then
    }

    @Test
    void createConnection() {
    }
}