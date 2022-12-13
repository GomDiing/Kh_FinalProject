package com.kh.finalproject.exception.repository;

import com.kh.finalproject.entity.Notice;
import com.kh.finalproject.entity.enumurate.NoticeStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoticeRepository extends JpaRepository <Notice,Long> {
    List<Notice> findByIndex(Long index);

//    공지사항 index로 제목 내용 수정
    @Modifying
    @Query("UPDATE Notice n SET n.title = :#{#paramNotice.title},n.content = :#{#paramNotice.content} where n.index = :#{#paramNotice.index}")
    Integer updateNotice(@Param("paramNotice") Notice notice);

//    체크박스로 삭제상태 변환 /(상세페이지 삭제 버튼 누르면 상태변환)
    @Modifying
    @Query("UPDATE Notice n SET n.status = :status where n.index = :index")
    Integer changeStatusNotice(@Param("index") Long index, @Param("status") NoticeStatus status);

//  상태값 ACTIVE 인것만 조회하도록
    Page<Notice> findByStatus(NoticeStatus status, Pageable pageable);

}

