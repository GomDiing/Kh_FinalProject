package com.kh.finalproject.repository;

import com.kh.finalproject.entity.Chart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChartRepository extends JpaRepository<Chart, String> {

    /*월별 매출 조회
    * @param year*/
//    List<Chart> findByDateStartsWith(String year);


}
