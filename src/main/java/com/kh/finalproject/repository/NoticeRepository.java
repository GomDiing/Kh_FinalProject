package com.kh.finalproject.repository;

import com.kh.finalproject.entity.Notice;
import org.aspectj.weaver.ast.Not;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;

import java.awt.print.Pageable;
import java.util.List;

public interface NoticeRepository extends JpaRepository <Notice,Long>{
    List<Notice> findByIndex(Long index);

//    List<Notice> findAll(Pageable pageable); //페이지네이션

//    전체 공지 조회
//    public List<Notice> findAll(){
//        re
//    }

}
