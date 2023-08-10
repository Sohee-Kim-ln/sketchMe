package com.dutaduta.sketchme.meeting.service;

import com.dutaduta.sketchme.common.dao.CategoryRepository;
import com.dutaduta.sketchme.common.domain.Category;
import com.dutaduta.sketchme.global.exception.BadRequestException;
import com.dutaduta.sketchme.meeting.dao.MeetingRepository;
import com.dutaduta.sketchme.meeting.domain.Meeting;
import com.dutaduta.sketchme.meeting.dto.MeetingInfoDTO;
import com.dutaduta.sketchme.meeting.dto.ReservationDTO;
import com.dutaduta.sketchme.member.dao.ArtistRepository;
import com.dutaduta.sketchme.member.dao.UserRepository;
import com.dutaduta.sketchme.member.domain.Artist;
import com.dutaduta.sketchme.member.domain.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Log4j2
public class MeetingService {

    private final MeetingRepository meetingRepository;

    private final UserRepository userRepository;

    private final ArtistRepository artistRepository;

    private final CategoryRepository categoryRepository;

    @Transactional
    public Long createMeeting(ReservationDTO reservationDto) {
        User user = userRepository.getReferenceById(reservationDto.getUserID());
        Artist artist = artistRepository.getReferenceById(reservationDto.getArtistID());
        Category category = categoryRepository.getReferenceById(reservationDto.getCategoryID());
        Meeting meeting = Meeting.createMeeting(user, artist, category, reservationDto);
        return meetingRepository.save(meeting).getId();
    }

    @Transactional
    public MeetingInfoDTO getMeetingInformation(Long id) {
        Meeting meeting = meetingRepository.findById(id).orElseThrow(() -> new BadRequestException("존재하지 않는 미팅입니다."));
        return MeetingInfoDTO.of(meeting);
    }
}
