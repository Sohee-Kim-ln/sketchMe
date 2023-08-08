package com.dutaduta.sketchme.videoconference.service;

import com.dutaduta.sketchme.videoconference.exception.OpenViduException;
import io.openvidu.java.client.*;
import jakarta.annotation.PostConstruct;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Log4j2
public class OpenViduAPIService {
    @Value("${openvidu.api.url}")
    private String url;

    @Value("${openvidu.api.secret}")
    private String secret;

    private OpenVidu openVidu;

    @PostConstruct
    public void initOpenVidu(){
        openVidu = new OpenVidu(url,secret);
    }

    public String createSession(String sessionId) throws OpenViduJavaClientException, OpenViduHttpException {

        SessionProperties sessionProperties = new SessionProperties.Builder().customSessionId(sessionId).build();
        return openVidu.createSession(sessionProperties).getSessionId();
    }

    public void deleteSession(String sessionId) {
        Session session = getSession(sessionId);
        try {
            session.close();
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            throw new OpenViduException("세션을 닫을 수 없습니다.");
        }
    }

    public Session getSession(String sessionId) {
        Session session = openVidu.getActiveSession(sessionId);
        if(session == null){
            throw new OpenViduException("세션이 존재하지 않습니다.");
        }
        return session;
    }

    public Connection createConnection(String sessionId) {
        Session session = getSession(sessionId);
        ConnectionProperties connectionProperties = new ConnectionProperties.Builder()
                .type(ConnectionType.WEBRTC)
                .role(OpenViduRole.PUBLISHER)
                .data("user_data")
                .build();
        try {
             return session.createConnection(connectionProperties);
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            throw new OpenViduException("연결을 만들 수 없습니다.");
        }
    }


}
