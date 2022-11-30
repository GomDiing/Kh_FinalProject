package com.kh.finalproject.entity;

import lombok.Getter;

import javax.persistence.*;

@Getter
@Entity
@Table(name = "statistics")
public class Statistics {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "statistics_index")
    private Long index;

    @Column(name = "statistics_male")
    private Float male;

    @Column(name = "statistics_female")
    private Float female;

    @Column(name = "statistics_teen")
    private Float teen;

    @Column(name = "statistics_twenties")
    private Float twenties;

    @Column(name = "statistics_thirties")
    private Float thirties;

    @Column(name = "statistics_forties")
    private Float forties;

    @Column(name = "statistics_fifties")
    private Float fifties;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_code", nullable = false)
    private Product product;
}
