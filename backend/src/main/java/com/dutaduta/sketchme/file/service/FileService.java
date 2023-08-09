package com.dutaduta.sketchme.file.service;

import com.dutaduta.sketchme.file.constant.FileType;
import com.dutaduta.sketchme.file.dto.FileResponseDTO;
import com.dutaduta.sketchme.file.dto.UploadResponseDTO;
import com.dutaduta.sketchme.file.exception.InvalidTypeException;
import com.dutaduta.sketchme.file.exception.NoFileException;
import com.dutaduta.sketchme.global.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import net.coobird.thumbnailator.Thumbnailator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.net.URL;
import java.net.URLDecoder;
import java.net.URLEncoder;
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
    public UploadResponseDTO saveImageUrl(String imageUrl, Long userID) {

        // 파일타입 + 날짜 폴더 생성
        String folderPath = makeFolder(FileType.PROFILEUSER);

        try {
            String extension = imageUrl.substring(imageUrl.lastIndexOf(".") + 1);
            String saveName = uploadPath + File.separator + folderPath + File.separator + "o_" + userID + "." + extension;

            // 카카오에서 준 url로 원본 프로필 이미지 저장하기
            URL url = new URL(imageUrl);
            InputStream in = url.openStream();
            OutputStream out = new FileOutputStream(saveName); //저장경로

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

            return dto;

        } catch (Exception e) {
            e.printStackTrace();
            throw new BusinessException("회원가입 중 이미지 저장 실패");
        }
    }

    public FileResponseDTO getFile(String imgURL) throws IOException {
            String srcFileName = URLDecoder.decode(imgURL, "UTF-8");

            File file = new File(uploadPath + File.separator + srcFileName);

            HttpHeaders header = new HttpHeaders();

            // MIME 타입 처리 (파일 확장자에 따라 브라우저에 전송하는 MIME 타입이 달라져야 함)
            header.add("Content-Type", Files.probeContentType(file.toPath()));
            return new FileResponseDTO(file, header);
    }

    public FileResponseDTO downloadFile(String userAgent, String imgURL) throws UnsupportedEncodingException {
        // srcFileName은 파일타입 + 폴더경로(=날짜) + 파일 이름 으로 구성됨
        String srcFileName = URLDecoder.decode(imgURL, "UTF-8");

        File file = new File(uploadPath + File.separator + srcFileName);

        // 찾는 파일이 없는 경우
        if(!file.exists()) {
            throw new NoFileException();
        }

        // 다운로드 할 때 저장되는 이미지 이름 커스텀
        // (예시 : 🎨SketchMe🎨_작품🖼_[작품생성날짜].[확장자])
        String downloadName = "🎨SketchMe🎨_";
        if (srcFileName.contains(FileType.PICTURE.toString())) {
            downloadName += "작품🖼_";
        } else if (srcFileName.contains(FileType.TIMELAPSE.toString())) {
            downloadName += "타임랩스🎞_";
        } else if (srcFileName.contains(FileType.PROFILEARTIST.toString())) {
            downloadName += "작가프로필✍_";
        } else if (srcFileName.contains(FileType.PROFILEUSER.toString())) {
            downloadName += "사용자프로필😊_";
        }

        String[] filenameArr = srcFileName.split("\\\\");
        downloadName += (filenameArr[1] + filenameArr[2] + filenameArr[3]); // 생성날짜 (폴더구조에서 가져옴)
        downloadName += ("."+ srcFileName.substring(srcFileName.lastIndexOf(".")+1)); // 확장자

        // IE 브라우저에서 제목에 한글이 들어간 파일이 제대로 다운로드되지 않는 문제를 해결하기 위해 IE인 경우 별도의 처리를 해줌
        if(userAgent.contains("Trident")) {
            log.info("IE browser");
            downloadName = URLEncoder.encode(downloadName, "UTF-8").replaceAll("\\+", " ");
        } else if(userAgent.contains("Edge")) {
            log.info("Edge browser");
            downloadName = URLEncoder.encode(downloadName, "UTF-8");
        } else {
            log.info("Chrome browser");
            downloadName = new String(downloadName.getBytes("UTF-8"), "ISO-8859-1");
        }

        // 다운로드 할 때 저장되는 이름 지정
        // 파일 이름이 한글인 경우 저장할 때 깨지는 문제를 막기 위해 파일 이름에 대해 문자열 처리를 해줌
        HttpHeaders header = new HttpHeaders();
        header.add("Content-Disposition", "attachment; filename=" + downloadName);

        return new FileResponseDTO(file, header);
    }

}
