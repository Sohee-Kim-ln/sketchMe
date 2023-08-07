package com.dutaduta.sketchme.file.service;

import com.dutaduta.sketchme.file.constant.FileType;
import com.dutaduta.sketchme.file.dto.UploadResponseDTO;
import com.dutaduta.sketchme.file.exception.InvalidTypeException;
import com.dutaduta.sketchme.file.exception.NoFileException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import net.coobird.thumbnailator.Thumbnailator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.net.URL;
import java.net.URLDecoder;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Log4j2
public class FileService {

    @Value("${org.zero-ck.upload.path}")
    private String uploadPath;


    /**
     * 파일 업로드. 처음에 업로드할 때는 파일 타입이 무엇인지 지정해줘야 함
     * @param uploadFiles
     * @param fileType 프로필, 타임랩스, 그림
     * @return
     */
    public List<UploadResponseDTO> uploadFile(MultipartFile[] uploadFiles, FileType fileType) {
        log.info(uploadFiles.length);

        // 업로드할 파일이 없는 경우
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

            // 파일타입 + 날짜 폴더 생성
            String folderPath = makeFolder(fileType);

            // UUID 적용해서 파일 이름 만들기 (고유한 파일 이름, 추후에 우리 서비스의 이름 지정 형식에 맞게 수정 필요)
//            String uuid = UUID.randomUUID().toString();
            String uuid = "";
//            String saveName = uploadPath + File.separator + folderPath + File.separator + uuid + "_" + fileName;
            String saveName = uploadPath + File.separator + folderPath + File.separator + "o_" + fileName;
//            String thumbnailSaveName = uploadPath + File.separator + folderPath + File.separator + "s_" + uuid + "_" + fileName;
            String thumbnailSaveName = uploadPath + File.separator + folderPath + File.separator + "s_" + fileName;

            // 파일 저장
            try {
                // 원본 이미지 저장
                Path savePath = Paths.get(saveName);
                uploadFile.transferTo(savePath);

                // 썸네일 생성 및 저장
                File thumbnailfile = new File(thumbnailSaveName);
                Thumbnailator.createThumbnail(savePath.toFile(), thumbnailfile, 100, 100);

                // 결과 반환할 리스트에도 담기
                UploadResponseDTO dto = new UploadResponseDTO(fileName, folderPath, fileType);
                log.info("dto imgURL : " + dto.getImageURL());
                responseDTOList.add(dto);
            } catch (IOException e) {
                e.printStackTrace();
            }
        } // for

        // 여기를 ResponseEntity에 담아야 하는지, 아니면 list만 반환해서 다른 api에서 사용하도록 해야하는지 의논해봐야 함!!
        return responseDTOList;
    } // uploadFile

    private String makeFolder(FileType fileType) {
        // 파일이 저장되는 시점의 시각을 가져와서 폴더 저장 경로 설정
        String str = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
        String folderPath = str.replace("/", File.separator);
        folderPath = fileType + File.separator + folderPath;  // folderPath가 파일 타입별로 달라짐

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


    private void saveImageUrl(String imageUrl) throws IOException {
        URL url = null;
        InputStream in = null;
        OutputStream out = null;

        try {
            url = new URL(imageUrl);
            in = url.openStream();

            // 컴퓨터 또는 서버의 저장할 경로(절대패스로 지정해 주세요.)
            out = new FileOutputStream(uploadPath + "/AkibaTV.png");

            while (true) {
                // 루프를 돌면서 이미지데이터를 읽어들이게 됩니다.
                int data = in.read();

                // 데이터값이 -1이면 루프를 종료하고 나오게 됩니다.
                if (data == -1) {
                    break;
                }

                // 읽어들인 이미지 데이터값을 컴퓨터 또는 서버공간에 저장하게 됩니다.
                out.write(data);
            }

            // 저장이 끝난후 사용한 객체는 클로즈를 해줍니다.
            in.close();
            out.close();

        } catch (Exception e) {
            // 예외처리
            e.printStackTrace();
        } finally {
            // 만일 에러가 발생해서 클로즈가 안됐을 가능성이 있기에
            // NULL값을 체크후 클로즈 처리를 합니다.
            if (in != null) {
                in.close();
            }
            if (out != null) {
                out.close();
            }
        }
    }
}
