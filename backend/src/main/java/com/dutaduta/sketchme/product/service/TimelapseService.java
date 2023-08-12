package com.dutaduta.sketchme.product.service;

import com.dutaduta.sketchme.common.Constant;
import com.dutaduta.sketchme.file.service.FileService;
import com.dutaduta.sketchme.global.exception.BadRequestException;
import com.dutaduta.sketchme.global.exception.InternalServerErrorException;
import com.dutaduta.sketchme.meeting.dao.MeetingRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import net.coobird.thumbnailator.Thumbnailator;
import org.apache.tomcat.util.bcel.Const;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import javax.imageio.stream.FileImageOutputStream;
import javax.imageio.stream.ImageOutputStream;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Future;

@Service
@RequiredArgsConstructor
@Log4j2
@Transactional
public class TimelapseService {

    public static final int DELAY_BETWEEN_FRAMES = 250;
    public static final int TIMELAPSE_WIDTH = 100;
    public static final int TIMELAPSE_HEIGHT = 100;

    /**
     * 타임랩스를 '비동기적'으로 만드는 API
     * @param meetingId 미팅 ID
     */
    @Async
    public CompletableFuture<String> makeTimelapse(long meetingId){
        // meeting ID를 가지고서 라이브 사진 경로에 있는 1~{마지막 사진 번호}.png를 가져온다.
        String path = String.format("%s/%d", Constant.LIVE_PICTURE_DIRECTORY,meetingId);
        File dir = new File(path);
        log.info("라이브 사진 위치: {}", path);
        if(!dir.exists()) {
            throw new BadRequestException("타임랩스를 만들기 위해 필요한 라이브 사진들이 없습니다. 미팅이 아직 진행되지 않았는지 확인해보세요.");
        }

        File[] files = dir.listFiles();
        if(files==null){
            throw new InternalServerErrorException("타임랩스를 만들던 도중 서버 오류가 발생했습니다. 다시 시도해주세요.");
        }
        List<String> livePicturePaths = Arrays.stream(files).map(File::getAbsolutePath).toList();

        // gif 툴을 가지고서 타임랩스를 만든다.
        String timelapsePath = String.format("%s/%d/%s", Constant.TIMELAPSE_DIRECTORY,meetingId,Constant.TIMELAPSE_GIF_NAME);
        // gif를 만들고 이를 {타임랩스 경로}에 저장한다.
        createGifFromImages(livePicturePaths,timelapsePath);
        return CompletableFuture.completedFuture(timelapsePath);
    }

    /**
     * 타임랩스 썸네일을 만든다 .
     * @param meetingId 미팅 ID
     * @param timelapsePath 원본 타임랩스 경로
     */
    @Async
    public CompletableFuture<String> makeTimelapseThumbnail(long meetingId, String timelapsePath) {
        String thumbnailPath = String.format("%s/%d/" + Constant.TIMELAPSE_THUMBNAIL_PNG_NAME, Constant.TIMELAPSE_DIRECTORY, meetingId);

        // Thumbnailator를 사용해서 Thumbnail을 만든다.
        try {
            Thumbnailator.createThumbnail(new File(timelapsePath),new File(thumbnailPath), TIMELAPSE_WIDTH, TIMELAPSE_HEIGHT);
        } catch (IOException e) {
            log.info("썸네일을 만들던 도중에 예외가 발생했습니다. 예외 내용은 다음과 같습니다. ");
            e.printStackTrace();
            throw new InternalServerErrorException("썸네일을 만들던 도중에 에러가 발생했습니다.");
        }
        return CompletableFuture.completedFuture(thumbnailPath);
    }

    private void createGifFromImages(List<String> imagePaths, String outputFilePath) {
        try {
            ImageOutputStream output = new FileImageOutputStream(new File(outputFilePath));

            // 첫 번째 이미지를 기준으로 GIF 파일을 생성합니다.
            BufferedImage firstImage = ImageIO.read(new File(imagePaths.get(0)));
            GifSequenceWriter writer = new GifSequenceWriter(output, firstImage.getType(), TimelapseService.DELAY_BETWEEN_FRAMES, true);

            // 첫 번째 이미지를 추가합니다.
            writer.writeToSequence(firstImage);

            // 나머지 이미지를 추가합니다.
            for (int i = 1; i < imagePaths.size(); i++) {
                BufferedImage nextImage = ImageIO.read(new File(imagePaths.get(i)));
                writer.writeToSequence(nextImage);
            }

            writer.close();
            output.close();

            log.info("GIF 파일 생성 완료: " + outputFilePath);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
