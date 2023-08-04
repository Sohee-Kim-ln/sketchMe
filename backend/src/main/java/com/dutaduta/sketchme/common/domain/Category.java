package com.dutaduta.sketchme.common.domain;

import com.dutaduta.sketchme.common.dto.CategoryRequestDto;
import com.dutaduta.sketchme.meeting.dto.ReservationDto;
import com.dutaduta.sketchme.member.domain.Artist;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "category")
@Builder
@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Category extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 512)
    private String name;

    @Column(length = 1024)
    private String description;

    @Builder.Default // 초기값 공개로 설정
    private boolean isOpen = true;

    private boolean isDeleted;

    @ManyToOne
    @JoinColumn(name = "artist_id")
    private Artist artist;

    @Column
    private Long approximatePrice;

    // 카테고리 생성시, 무료라서 가격을 입력하지 않으면 (null이면) 자동으로 0 들어가도록
    @PrePersist // 새로운 엔티티에 대해 persist 되기 전 호출
    public void prePersist() {
        this.approximatePrice = this.approximatePrice == null ? 0L : this.approximatePrice;
    }

    public static Category createCategory(CategoryRequestDto categoryRequestDto, Artist artist){
        return Category.builder()
                .name(categoryRequestDto.getName())
                .description(categoryRequestDto.getDescription())
                .approximatePrice(categoryRequestDto.getApproximatePrice())
                .artist(artist)
                .build();
    }
}
