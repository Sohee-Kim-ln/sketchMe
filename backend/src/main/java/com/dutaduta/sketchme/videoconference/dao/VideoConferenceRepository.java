package com.dutaduta.sketchme.videoconference.dao;

import com.dutaduta.sketchme.videoconference.domain.VideoConference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

public interface VideoConferenceRepository extends JpaRepository<VideoConference,Long> {
}
