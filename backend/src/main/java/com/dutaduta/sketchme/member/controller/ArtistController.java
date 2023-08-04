package com.dutaduta.sketchme.member.controller;

import com.dutaduta.sketchme.global.CustomStatus;
import com.dutaduta.sketchme.global.ResponseFormat;
import com.dutaduta.sketchme.global.exception.BusinessException;
import com.dutaduta.sketchme.member.dto.ArtistInfoRequestDto;
import com.dutaduta.sketchme.member.service.ArtistService;
import com.dutaduta.sketchme.oidc.jwt.JwtProvider;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
@Log4j2
@CrossOrigin
public class ArtistController {

    private final ArtistService artistService;

    @GetMapping("/artist/desc/{id}")
    public ResponseEntity<ResponseFormat<String>> getArtistDescription(@PathVariable(name = "id") Long id) {
        log.info("id " + id);
        try {
            String description = artistService.getDescription(id);
            description = description == null ? "" : description;
            return ResponseFormat.success(description).toEntity();
        } catch (BusinessException e){
            return ResponseFormat.fail("", CustomStatus.INVALID_INPUT_VALUE).toEntity();
        }
    }

    @PostMapping("/artist/regist")
    public ResponseEntity<?> registArtist(HttpServletRequest request) {
        // 현재 사용자 id
        Long userId = JwtProvider.getUserId(JwtProvider.resolveToken(request), JwtProvider.getSecretKey());
        try {
            return artistService.registArtist(userId).toEntity();
        } catch (BusinessException e) {
            return ResponseFormat.fail(CustomStatus.USER_NOT_FOUND).toEntity();
        }
    }

    @PutMapping("/artist/info")
    public ResponseEntity<?> modifyArtistInformation(@RequestBody ArtistInfoRequestDto artistInfoRequestDto, HttpServletRequest request){
        Long artistId = JwtProvider.getArtistId(JwtProvider.resolveToken(request), JwtProvider.getSecretKey());
        try {
            artistService.modifyArtistInformation(artistInfoRequestDto, artistId);
            return ResponseFormat.success("작가 정보 수정 완료").toEntity();
        } catch (BusinessException e) {
            return ResponseFormat.fail(CustomStatus.USER_NOT_FOUND).toEntity();
        }
    }

    @PutMapping("/artist")
    public ResponseEntity<?> changeArtistIsOpen(@RequestParam Boolean isOpen, HttpServletRequest request) {
        Long artistId = JwtProvider.getArtistId(JwtProvider.resolveToken(request), JwtProvider.getSecretKey());
        try {
            artistService.changeArtistIsOpen(isOpen, artistId);
            return ResponseFormat.success("작가 공개 여부 전환 완료").toEntity();
        } catch (BusinessException e) {
            return ResponseFormat.fail(CustomStatus.USER_NOT_FOUND).toEntity();
        }
    }

    @DeleteMapping("/artist/deactivate")
    public ResponseEntity<?> deactivateArtist(HttpServletRequest request){
        Long artistId = JwtProvider.getArtistId(JwtProvider.resolveToken(request), JwtProvider.getSecretKey());
        try {
            artistService.deactivateArtist(artistId);
            return ResponseFormat.success("작가 비활성화 완료").toEntity();
        } catch (BusinessException e) {
            return ResponseFormat.fail(CustomStatus.USER_NOT_FOUND).toEntity();
        }
    }

}
