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
    NO_PERMISSION(403,"NO_PERMISSION","권한이 없습니다.(인가 실패)"),

    // Member //1000번부터 1999번까지
    EMAIL_DUPLICATION(400, "E004", "Email is Duplication"),
    LOGIN_INPUT_INVALID(400, "E005", "Login input is invalid"),
    USER_NOT_FOUND(404, "E006", "User Not Found")

    // CHAT //2000번부터 2999번까지 이런식으로
    ,INVALID_CHAT_USER(400, "E006", "Unknown User"),

    // VideoConference
    SESSION_NOT_FOUND(400, "E007", "방이 존재하지 않습니다. (Session이 존재하지 않습니다.)"),
    API_FORMAT_NOT_VALID(400, "E008", "API 스펙에 맞지 않는 요청을 하였습니다. 요청 포맷을 다시 확인하고, 제대로 된 요청을 보내주세요.");


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