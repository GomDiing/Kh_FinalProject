package com.kh.finalproject.repository;

import com.kh.finalproject.entity.RankingMonth;
import com.kh.finalproject.entity.RankingWeek;
import com.kh.finalproject.entity.enumurate.RankStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RankingMonRepository extends JpaRepository<RankingMonth, Long> {

    List<RankingMonth> findAllByRankStatus(RankStatus rankStatus);
}
