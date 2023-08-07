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

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;
import java.net.URL;
import java.net.URLDecoder;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

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
    public List<UploadResponseDTO> uploadFile(MultipartFile[] uploadFiles, FileType fileType, Long ID) {
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
            String extension = originalName.substring(originalName.indexOf(".") + 1);

            // 파일타입 + 날짜 폴더 생성
            String folderPath = makeFolder(fileType);

            // UUID 적용해서 파일 이름 만들기 (고유한 파일 이름, 추후에 우리 서비스의 이름 지정 형식에 맞게 수정 필요)
            String saveName = uploadPath + File.separator + folderPath + File.separator + "o_" + ID + "." + extension;
            String thumbnailSaveName = uploadPath + File.separator + folderPath + File.separator + "s_" + ID + "." + extension;

            // 파일 저장
            try {
                // 원본 이미지 저장
                Path savePath = Paths.get(saveName);
                log.info("savePath : " + savePath);
                uploadFile.transferTo(savePath);

                // 썸네일 생성 및 저장
                File thumbnailfile = new File(thumbnailSaveName);
                Thumbnailator.createThumbnail(savePath.toFile(), thumbnailfile, 100, 100);

                // 결과 반환할 리스트에도 담기
                UploadResponseDTO dto = new UploadResponseDTO(ID + "." + extension, folderPath, fileType);
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

    public Boolean removeFile(String imgURL) {
        try {
            String srcFileName = URLDecoder.decode(imgURL, "UTF-8");
            String extension = imgURL.substring(imgURL.lastIndexOf(".") + 1);

            // 원본 파일 삭제
            File file = new File(uploadPath + File.separator + srcFileName);
            boolean result = file.delete();

            // 썸네일 삭제
            File thumbnail = new File(file.getParent()+ File.separator+ "s_" + file.getName().substring(2));
            result = thumbnail.delete();

            return true;
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            return false;
        }
    }


    /**
     * 회원가입 시, 카카오에서 받은 프로필 이미지 url을 이용해서 우리 서버에 이미지 파일로 저장하는 과정
     * @param imageUrl
     * @throws IOException
     */
    public String saveImageUrl(String imageUrl, Long userID) {

        // 파일타입 + 날짜 폴더 생성
        String folderPath = makeFolder(FileType.PROFILEUSER);

        URL url = null;
        InputStream in = null;
        OutputStream out = null;

        try {
            String extension = imageUrl.substring(imageUrl.lastIndexOf(".") + 1);
            String saveName = uploadPath + File.separator + folderPath + File.separator + "o_" + userID + "." + extension;

            // 카카오에서 준 url로 원본 프로필 이미지 저장하기
            url = new URL(imageUrl);
            in = url.openStream();
            out = new FileOutputStream(saveName); //저장경로

            while(true){
                //이미지를 읽어온다.
                int data = in.read();
                if(data == -1){
                    break;
                }
                //이미지를 쓴다.
                out.write(data);

            }

            in.close();
            out.close();

            // 썸네일 생성 및 저장
            Path savePath = Paths.get(saveName);
            String thumbnailSaveName = uploadPath + File.separator + folderPath + File.separator + "s_" + userID + "." + extension;
            File thumbnailfile = new File(thumbnailSaveName);
            Thumbnailator.createThumbnail(savePath.toFile(), thumbnailfile, 100, 100);

            // 반환값 준비
            UploadResponseDTO dto = new UploadResponseDTO(userID + "." + extension, folderPath, FileType.PROFILEUSER);
            log.info("ImageURL  :  " + dto.getImageURL());

            return dto.getImageURL();

        } catch (Exception e) {
            e.printStackTrace();
            return "";
        }
    }
}
