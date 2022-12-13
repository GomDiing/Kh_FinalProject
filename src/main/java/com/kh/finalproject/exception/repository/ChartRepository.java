package com.kh.finalproject.exception.repository;

import com.kh.finalproject.entity.Chart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChartRepository extends JpaRepository<Chart, Long> {

    /*월별 매출 조회
    * @param year*/
//    List<Chart> findByDateStartsWith(String year);
}
