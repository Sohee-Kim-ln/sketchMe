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
    LOGIN_INPUT_INVALID(400, "E05", "Login input is invalid"),

    // CHAT //2000번부터 2999번까지 이런식으로
    INVALID_CHAT_USER(400, "E006", "Unknown User");

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