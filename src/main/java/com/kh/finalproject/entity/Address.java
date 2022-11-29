package com.kh.finalproject.entity;

import com.kh.finalproject.common.BaseTimeEntity;
import lombok.Getter;

import javax.persistence.*;

@Getter
@Entity
@Table(name = "address")
public class Address extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "address_index")
    private Long index;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_index")
    private Member member;

    @Column(name = "address_road", nullable = false)
    private String road;

    @Column(name = "address_jibun")
    private String jibun;

    @Column(name = "address_detail")
    private String detail;

    @Column(name = "address_zipcode", nullable = false)
    private String zipcode;
}
