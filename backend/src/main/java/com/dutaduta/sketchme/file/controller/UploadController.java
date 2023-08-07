package com.dutaduta.sketchme.file.controller;

import com.dutaduta.sketchme.file.constant.FileType;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.file.Files;


@RestController
@Log4j2
public class UploadController {

    @Value("${org.zero-ck.upload.path}")
    private String uploadPath;

    @GetMapping("/display")
    public ResponseEntity<byte[]> getFile(String fileName) {
        ResponseEntity<byte[]> result = null;

        try {
            String srcFileName = URLDecoder.decode(fileName, "UTF-8");
            log.info("fileName : " + srcFileName);

            File file = new File(uploadPath + File.separator + srcFileName);
            log.info("file : " + file);

            HttpHeaders header = new HttpHeaders();

            // MIME 타입 처리 (파일 확장자에 따라 브라우저에 전송하는 MIME 타입이 달라져야 함)
            header.add("Content-Type", Files.probeContentType(file.toPath()));
            // 파일 데이터 처리
            result = new ResponseEntity<>(FileCopyUtils.copyToByteArray(file), header, HttpStatus.OK);
        } catch (Exception e) {
            log.error(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return result;
    }


    // MIME 타입은 다운로드가 가능한 application/octet-stream으로 지정
    @GetMapping(value = "/download", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public ResponseEntity<byte[]> downloadFile(@RequestHeader("User-Agent") String userAgent, String imgURL) {

        ResponseEntity<byte[]> result = null;

        try {
            // srcFileName은 파일타입 + 폴더경로(=날짜) + 파일 이름 으로 구성됨
            String srcFileName = URLDecoder.decode(imgURL, "UTF-8");
            log.info("fileName : " + srcFileName);

            // 다운로드 할 때 UUID 제외하고 원래 이미지 이름으로 저장되도록
            String srcOriginalName = "🎨SketchMe🎨_";
            if (srcFileName.contains(FileType.PICTURE.toString())) {
                srcOriginalName += "작품🖼_";
            } else if (srcFileName.contains(FileType.TIMELAPSE.toString())) {
                srcOriginalName += "타임랩스🎞_";
            } else if (srcFileName.contains(FileType.PROFILEARTIST.toString())||srcFileName.contains(FileType.PROFILEUSER.toString())) {
                srcOriginalName += "프로필😊_";
            }

            String[] filenameArr = srcFileName.split("\\\\");
            srcOriginalName += (filenameArr[1] + filenameArr[2] + filenameArr[3]); // 날짜
            srcOriginalName += ("."+ srcFileName.substring(srcFileName.lastIndexOf(".")+1)); // 확장자
            log.info("srcOriginalName : " + srcOriginalName);

            File file = new File(uploadPath + File.separator + srcFileName);
            log.info("file : " + file);

            // 찾는 파일이 없는 경우
            if(!file.exists()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            HttpHeaders header = new HttpHeaders();

            // IE 브라우저에서 제목에 한글이 들어간 파일이 제대로 다운로드되지 않는 문제를 해결하기 위해 IE인 경우 별도의 처리를 해줌
            String downloadName = "";
            if(userAgent.contains("Trident")) {
                log.info("IE browser");
                downloadName = URLEncoder.encode(srcOriginalName, "UTF-8").replaceAll("\\+", " ");
            } else if(userAgent.contains("Edge")) {
                log.info("Edge browser");
                downloadName = URLEncoder.encode(srcOriginalName, "UTF-8");
            } else {
                log.info("Chrome browser");
                downloadName = new String(srcOriginalName.getBytes("UTF-8"), "ISO-8859-1");
            }


            // 다운로드 할 때 저장되는 이름 지정
            // 파일 이름이 한글인 경우 저장할 때 깨지는 문제를 막기 위해 파일 이름에 대해 문자열 처리를 해줌
            header.add("Content-Disposition", "attachment; filename=" + downloadName);
            // 파일 데이터 처리
            result = new ResponseEntity<>(FileCopyUtils.copyToByteArray(file), header, HttpStatus.OK);
        } catch (Exception e) {
            log.error(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return result;
    }

}
