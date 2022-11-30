package com.kh.finalproject.entity;

import lombok.Getter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Getter
@Entity
@Table(name = "ranking_close_soon")
public class RankingCloseSoon {
    @Id
    @Column(name = "ranking_order")
    private Long order;
}
