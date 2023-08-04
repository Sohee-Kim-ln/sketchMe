package com.dutaduta.sketchme.member.domain;

import com.dutaduta.sketchme.common.domain.BaseEntity;
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

//    @Temporal(value = TemporalType.TIMESTAMP)
//    private Date debutDateTime;

    @Column(length = 1024)
    private String description;

    private boolean isOpen;

    private boolean isDeactivated;

    @Setter
    @OneToOne(mappedBy = "artist")
    private User user;

    @OneToMany(mappedBy = "artist")
    private List<ArtistHashtag> artistHashtagList;

    @OneToMany(mappedBy = "artist")
    private List<FavoriteArtist> favoriteArtistList;
}
