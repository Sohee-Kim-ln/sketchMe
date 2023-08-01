package com.dutaduta.sketchme.chat.controller;

import com.dutaduta.sketchme.chat.dao.CreateUserTestRepository;
import com.dutaduta.sketchme.member.dao.ArtistRepository;
import com.dutaduta.sketchme.member.domain.Artist;
import com.dutaduta.sketchme.member.domain.User;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;


@RestController
@AllArgsConstructor
@Slf4j
public class CreateUserTestController {
    private final CreateUserTestRepository createUserTestRepository;
    private final ArtistRepository artistRepository;

    @PostMapping("/create/user")
    public User createUser(@RequestBody User user) {
        log.info(user.toString());
        User user1 = createUserTestRepository.save(user);
        log.info(user1.toString());
        return user1;
    }

    @PostMapping("/create/user/{userId}")
    public Artist createArtist(@RequestBody Artist artist, @PathVariable("userId") Long userId) {
        Optional<User> user = createUserTestRepository.findById(userId);
        log.info("USER" + user.toString());
        Artist toSave = Artist.builder()
                .user(user.get())
                .description(artist.getDescription())
                .build();

        log.info(toSave.toString());
        artistRepository.save(toSave);
        return toSave;
    }
}