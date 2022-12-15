package com.kh.finalproject.repository;

import com.kh.finalproject.entity.RankingWeek;
import com.kh.finalproject.entity.enumurate.RankStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RankingRepository extends JpaRepository<RankingWeek, Long> {
    List<RankingWeek> findAllByRankStatus(RankStatus rankStatus);
    RankingWeek findByCode(String code);
}
