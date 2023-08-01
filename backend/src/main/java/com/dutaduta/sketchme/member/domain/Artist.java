package com.dutaduta.sketchme.member.domain;

import com.dutaduta.sketchme.common.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "artist")
@SuperBuilder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Artist extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 512)
    private String nickname;

    @Column(length = 1024)
    private String profileImgUrl;

//    @Temporal(value = TemporalType.TIMESTAMP)
//    private Date debutDateTime;

    @Column(length = 1024)
    private String description;

    private boolean isOpen;

    private boolean isDeactivated;

    @Setter
    @OneToOne(mappedBy = "artist")
//    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "artist")
    List<ArtistHashtag> artistHashtagList;

    @OneToMany(mappedBy = "artist")
    List<FavoriteArtist> favoriteArtistList;

    // 작가 등록할 때 사용하는 생성자
    @Builder
    public Artist(String nickname, String profileImgUrl, String description, boolean isOpen) {
        this.nickname = nickname;
        this.profileImgUrl = profileImgUrl;
        this.description = description;
        this.isOpen = isOpen;
    }
}
