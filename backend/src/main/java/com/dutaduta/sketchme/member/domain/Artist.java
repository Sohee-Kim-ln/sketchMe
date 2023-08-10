package com.dutaduta.sketchme.member.domain;

import com.dutaduta.sketchme.common.domain.BaseEntity;
import com.dutaduta.sketchme.global.exception.BadRequestException;
import com.dutaduta.sketchme.member.dto.ArtistInfoRequest;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Entity
@Table(name = "artist")
@SuperBuilder
@Getter
//@ToString
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Artist extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 512)
    private String nickname;

    @Column(length = 1024)
    private String profileImgUrl;

    @Column(length = 1024)
    private String description;

    private boolean isOpen;

    private boolean isDeactivated;

    @OneToOne(mappedBy = "artist")
    private User user;

    @OneToMany(mappedBy = "artist")
    private List<ArtistHashtag> artistHashtagList;

    @OneToMany(mappedBy = "artist")
    private List<FavoriteArtist> favoriteArtistList;

    public void setUser(User user) {
        if(this.user==user) return;
        if(this.user!=null) throw new BadRequestException("이미 유저가 배정되어 있습니다.");
        user.setArtist(this);
    }

    public void updateArtistInformation(ArtistInfoRequest artistInfoRequest){
        this.nickname = artistInfoRequest.getNickname();
        this.description = artistInfoRequest.getDescription();
        this.profileImgUrl = artistInfoRequest.getProfileImgUrl();
    }

    public void updateIsOpen(boolean isOpen) {
        this.isOpen = isOpen;
    }

    public void deactivate() {
        this.isDeactivated = true;
    }

    public void reactivate() {this.isDeactivated = false; }
}
