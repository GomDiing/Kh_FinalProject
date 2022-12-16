package com.kh.finalproject.repository;

import com.kh.finalproject.entity.RankingMonth;
import com.kh.finalproject.entity.enumurate.ProductCategory;
import com.kh.finalproject.entity.enumurate.RankStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RankingMonRepository extends JpaRepository<RankingMonth, Long> {

    List<RankingMonth> findAllByRankStatusAndProductCategoryOrderByOrder(RankStatus rankStatus, ProductCategory category, Pageable size);
}
