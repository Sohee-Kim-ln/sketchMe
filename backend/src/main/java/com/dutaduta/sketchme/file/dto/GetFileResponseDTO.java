package com.dutaduta.sketchme.file.dto;

import lombok.*;
import org.springframework.http.HttpHeaders;

import java.io.File;

@ToString
@Getter

@NoArgsConstructor(access= AccessLevel.PROTECTED)
public class GetFileResponseDTO {
    private File file;
    private HttpHeaders header;


}
