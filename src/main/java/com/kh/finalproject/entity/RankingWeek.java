package com.kh.finalproject.entity;

import lombok.Getter;

import javax.persistence.*;

@Getter
@Entity
@Table(name = "ranking_week")
public class RankingWeek {
    @Id
    @Column(name = "ranking_order")
    private Long order;
}
