package com.kh.finalproject.repository;

import com.kh.finalproject.entity.RankingWeek;
import com.kh.finalproject.entity.enumurate.ProductCategory;
import com.kh.finalproject.entity.enumurate.RankStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RankingWeekRepository extends JpaRepository<RankingWeek, Long> {
    List<RankingWeek> findAllByRankStatusAndProductCategoryOrderByOrder(RankStatus rankStatus, ProductCategory category, Pageable pageSize);
}
