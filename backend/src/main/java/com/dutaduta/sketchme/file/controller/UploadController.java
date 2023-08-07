package com.dutaduta.sketchme.file.controller;

import com.dutaduta.sketchme.file.dto.UploadResponseDTO;
import lombok.extern.log4j.Log4j2;
import net.coobird.thumbnailator.Thumbnailator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;


@RestController
@Log4j2
public class UploadController {

    @Value("${org.zero-ck.upload.path}")
    private String uploadPath;

//    @PostMapping("/upload")
//    public ResponseEntity<List<UploadResponseDTO>> uploadFile(MultipartFile[] uploadFiles) {
//
//        if(uploadFiles == null || uploadFiles.length == 0) {
//            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
//        }
//        List<UploadResponseDTO> responseDTOList = new ArrayList<>();
//
//        for (MultipartFile uploadFile : uploadFiles) {
//
//            // 확장자 검사 -> 이미지 파일만 업로드 가능하도록
//            if (uploadFile.getContentType().startsWith("image") == false) {
//                log.warn("이 파일은 image 타입이 아닙니다 ㅡ.ㅡ");
//                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
//            }
//
//            String originalName = uploadFile.getOriginalFilename();
//            String fileName = originalName.substring(originalName.lastIndexOf("\\") + 1);
//            log.info("originalName : " + originalName);
//            log.info("fileName : " + fileName);
//
//            // 날짜 폴더 생성
//            String folderPath = makeFolder();
//
//            // UUID 적용해서 파일 이름 만들기 (고유한 파일 이름, 추후에 우리 서비스의 이름 지정 형식에 맞게 수정 필요)
//            String uuid = UUID.randomUUID().toString();
//            String saveName = uploadPath + File.separator + folderPath + File.separator + uuid + "_" + fileName;
//            String thumbnailSaveName = uploadPath + File.separator + folderPath + File.separator + "s_" + uuid + "_" + fileName;
//
//            // 파일 저장
//            try {
//                // 원본 이미지 저장
//                Path savePath = Paths.get(saveName);
//                uploadFile.transferTo(savePath);
//
//                // 썸네일 생성 및 저장
//                File thumbnailfile = new File(thumbnailSaveName);
//                Thumbnailator.createThumbnail(savePath.toFile(), thumbnailfile, 100, 100);
//
//                // 결과 반환할 리스트에도 담기
//                responseDTOList.add(new UploadResponseDTO(fileName, uuid, folderPath));
//            } catch (IOException e) {
//                e.printStackTrace();
//            }
//        } // for
//
//        // 여기를 ResponseEntity에 담아야 하는지, 아니면 list만 반환해서 다른 api에서 사용하도록 해야하는지 의논해봐야 함!!
//        return new ResponseEntity<>(responseDTOList, HttpStatus.OK);
//    } // uploadFile

//    private String makeFolder() {
//        // 파일이 저장되는 시점의 시각을 가져와서 폴더 저장 경로 설정
//        String str = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
//        String folderPath = str.replace("/", File.separator);
//
//        // 폴더 만들기
//        File uploadPathFolder = new File(uploadPath, folderPath);
//
//        if (!uploadPathFolder.exists()) {
//            uploadPathFolder.mkdirs();
//        }
//        return folderPath;
//    }


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

//    @PostMapping("/removeFile")
//    public ResponseEntity<Boolean> removeFile(String fileName) {
//
//        String srcFileName = null;
//
//        try {
//            srcFileName = URLDecoder.decode(fileName, "UTF-8");
//
//            // 원본 파일 삭제
//            File file = new File(uploadPath + File.separator + srcFileName);
//            boolean result = file.delete();
//
//            // 썸네일 삭제
//            File thumbnail = new File(file.getParent(), "s_" + file.getName());
//            result = thumbnail.delete();
//
//            return new ResponseEntity<>(result, HttpStatus.OK);
//        } catch (UnsupportedEncodingException e) {
//            e.printStackTrace();
//            return new ResponseEntity<>(false, HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }

    // MIME 타입은 다운로드가 가능한 application/octet-stream으로 지정
    @GetMapping(value = "/download", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public ResponseEntity<byte[]> downloadFile(@RequestHeader("User-Agent") String userAgent, String fileName) {

        ResponseEntity<byte[]> result = null;

        try {
            String srcFileName = URLDecoder.decode(fileName, "UTF-8");
            log.info("fileName : " + srcFileName);

            // 다운로드 할 때 UUID 제외하고 원래 이미지 이름으로 저장되도록
            String srcOriginalName = srcFileName.substring(srcFileName.indexOf("_") + 1);
            log.info("srcOriginalName : " + srcOriginalName);

            File file = new File(uploadPath + File.separator + srcFileName);
            log.info("file : " + file);

            // 찾는 파일이 없는 경우
            if(!file.exists()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            HttpHeaders header = new HttpHeaders();

            // IE 브라우저에서 제목에 한글이 들어간 파일이 제대로 다운로드되지 않는 문제를 해결하기 위해 IE인 경우 별도의 처리를 해줌
            String downloadName = null;
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
