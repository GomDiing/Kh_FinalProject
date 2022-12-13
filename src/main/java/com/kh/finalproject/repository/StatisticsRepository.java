package com.kh.finalproject.repository;

import com.kh.finalproject.entity.Statistics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StatisticsRepository extends JpaRepository <Statistics, Long> {

}