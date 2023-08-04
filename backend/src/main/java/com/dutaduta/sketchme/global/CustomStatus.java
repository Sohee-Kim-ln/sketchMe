package com.dutaduta.sketchme.global;

import lombok.Getter;

@Getter
public enum CustomStatus {


    //예시. 협의 후 변경해야함
    OK(200, "C001", "Success"),
    // Common / 0번부터 999번까지
    INTERNAL_SERVER_ERROR(500, "E000", "Internal server error"),
    INVALID_INPUT_VALUE(400, "E001", " Invalid Input Value"),
    METHOD_NOT_ALLOWED(405, "E002", " Invalid 뭐시기"),
    HANDLE_ACCESS_DENIED(403, "E003", "Access is Denied"),

    // Member //1000번부터 1999번까지
    EMAIL_DUPLICATION(400, "E004", "Email is Duplication"),
    LOGIN_INPUT_INVALID(400, "E005", "Login input is invalid"),
    USER_NOT_FOUND(404, "E006", "User Not Found"),
    INVALID_ARTIST_CREATION(400, "E007", "이미 등록된 아티스트 정보가 존재하는 유저입니다."),
    ARTIST_ALREADY_REGISTERED(400, "E1001", "Already Registered As Artist"),
    NICKNAME_DUPLICATION(409, "E1002","Nickname is Duplicated"),

    // CHAT //2000번부터 2999번까지 이런식으로
    INVALID_CHAT_USER(400, "E006", "Unknown User"),

    // TOKEN // 3000 ~ 3999
    NO_REFRESH_TOKEN(400, "E3000", "No Refresh Token"),
    NO_ACCESS_TOKEN(400, "E3001", "No Access Token"),
    INVALID_TOKEN(400, "E3002", "Invalid Token"),
    EXPIRED_TOKEN(400,"E3003","Token is expired"),
    LOGOUT_TOKEN(400, "E3004", "This User Is Already Logged Out"),
    NO_TOKEN(400,"E3005", "Token Not Found"),
    NEED_ACCESS_TOKEN(400, "E3006", "Access Token Is Needed"),
    NEED_REFRESH_TOKEN(400, "E3007", "Refresh Token Is Needed");


    private final String customCode;
    private final String message;
    private final int httpStatusCode;

    CustomStatus(final int httpStatusCode, final String customCode, final String message) {
        this.httpStatusCode= httpStatusCode;
        this.customCode= customCode;
        this.message = message;
    }

    @Override
    public String toString() {
        return String.format("%s (%d)", this.name(), this.httpStatusCode);
    }
}