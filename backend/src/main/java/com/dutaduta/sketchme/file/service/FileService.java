package com.dutaduta.sketchme.file.service;

import com.dutaduta.sketchme.file.dto.UploadResponseDTO;
import com.dutaduta.sketchme.file.exception.InvalidTypeException;
import com.dutaduta.sketchme.file.exception.NoFileException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import net.coobird.thumbnailator.Thumbnailator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Log4j2
public class FileService {
    @Value("${org.zero-ck.upload.path}")
    private String uploadPath;

    public List<UploadResponseDTO> uploadFile(MultipartFile[] uploadFiles) {
        log.info(uploadFiles.length);
        if(uploadFiles[0].isEmpty()) {
            throw new NoFileException();
        }
        List<UploadResponseDTO> responseDTOList = new ArrayList<>();

        for (MultipartFile uploadFile : uploadFiles) {

            // 확장자 검사 -> 이미지 파일만 업로드 가능하도록
            if (!uploadFile.getContentType().startsWith("image")) {
                log.warn("이 파일은 image 타입이 아닙니다 ㅡ.ㅡ");
                throw new InvalidTypeException();
            }

            String originalName = uploadFile.getOriginalFilename();
            String fileName = originalName.substring(originalName.lastIndexOf("\\") + 1);
            log.info("originalName : " + originalName);
            log.info("fileName : " + fileName);

            // 날짜 폴더 생성
            String folderPath = makeFolder();

            // UUID 적용해서 파일 이름 만들기 (고유한 파일 이름, 추후에 우리 서비스의 이름 지정 형식에 맞게 수정 필요)
            String uuid = UUID.randomUUID().toString();
            String saveName = uploadPath + File.separator + folderPath + File.separator + uuid + "_" + fileName;
            String thumbnailSaveName = uploadPath + File.separator + folderPath + File.separator + "s_" + uuid + "_" + fileName;

            // 파일 저장
            try {
                // 원본 이미지 저장
                Path savePath = Paths.get(saveName);
                uploadFile.transferTo(savePath);

                // 썸네일 생성 및 저장
                File thumbnailfile = new File(thumbnailSaveName);
                Thumbnailator.createThumbnail(savePath.toFile(), thumbnailfile, 100, 100);

                // 결과 반환할 리스트에도 담기
                responseDTOList.add(new UploadResponseDTO(fileName, uuid, folderPath));
            } catch (IOException e) {
                e.printStackTrace();
            }
        } // for

        // 여기를 ResponseEntity에 담아야 하는지, 아니면 list만 반환해서 다른 api에서 사용하도록 해야하는지 의논해봐야 함!!
        return responseDTOList;
    } // uploadFile

    private String makeFolder() {
        // 파일이 저장되는 시점의 시각을 가져와서 폴더 저장 경로 설정
        String str = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
        String folderPath = str.replace("/", File.separator);

        // 폴더 만들기
        File uploadPathFolder = new File(uploadPath, folderPath);

        if (!uploadPathFolder.exists()) {
            uploadPathFolder.mkdirs();
        }
        return folderPath;
    }

    public Boolean removeFile(String fileName) {

        String srcFileName = null;

        try {
            srcFileName = URLDecoder.decode(fileName, "UTF-8");

            // 원본 파일 삭제
            File file = new File(uploadPath + File.separator + srcFileName);
            boolean result = file.delete();

            // 썸네일 삭제
            File thumbnail = new File(file.getParent(), "s_" + file.getName());
            result = thumbnail.delete();

            return true;
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            return false;
        }
    }
}
