package com.dutaduta.sketchme.file.dto;


<<<<<<< HEAD
import com.dutaduta.sketchme.file.constant.FileType;
import lombok.*;

import java.io.File;
=======
import lombok.*;

>>>>>>> 00e83d6a ([BE] Feat: 파일 업로드(저장 및 썸네일 이미지를 화면에 출력하도록), 삭제 기능 구현)
import java.io.Serializable;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

@ToString
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access= AccessLevel.PROTECTED)
public class UploadResponseDTO implements Serializable {

    private String fileName;
    private String folderPath;
    private FileType fileType;
    private String uuid;

    /**
     * 전체 경로가 필요한 경우 사용
     * @return
     */
    public String getImageURL() {
        try {
            return URLEncoder.encode(folderPath + File.separator + "o_"+fileName,"UTF-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return "";
    }

    /**
     * 썸네일의 전체 경로가 필요한 경우 사용
     * @return
     */
    public String getThumbnailURL() {
        try {
            return URLEncoder.encode(folderPath + File.separator + "s_" + fileName, "UTF-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return "";
    }
}
