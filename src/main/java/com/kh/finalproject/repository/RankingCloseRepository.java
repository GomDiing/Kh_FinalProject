package com.kh.finalproject.repository;

import com.kh.finalproject.entity.RankingCloseSoon;
import com.kh.finalproject.entity.enumurate.ProductCategory;
import com.kh.finalproject.entity.enumurate.RankStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RankingCloseRepository extends JpaRepository<RankingCloseSoon, Long> {
    List<RankingCloseSoon> findAllByRankStatusAndProductCategoryOrderByOrder(RankStatus rankStatus, ProductCategory category, Pageable size);
}
