package com.kh.finalproject.repository;

import com.kh.finalproject.entity.Member;
import com.kh.finalproject.entity.Notice;
import com.kh.finalproject.entity.enumurate.MemberStatus;
import com.kh.finalproject.entity.enumurate.NoticeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoticeRepository extends JpaRepository <Notice,Long> {
    List<Notice> findByIndex(Long index);

//    공지사항 index로 제목 내용 변경
    @Modifying
    @Query("UPDATE Notice n SET n.title = :#{#paramNotice.title},n.content = :#{#paramNotice.content} where n.index = :#{#paramNotice.index}")
    Integer updateNotice(@Param("paramNotice") Notice notice);

//    체크박스로 상태 변환
    @Modifying
    @Query("UPDATE Notice n SET n.status = :status where n.index = :index")
    Integer changeStatusNotice(@Param("index") Long index, @Param("status") NoticeStatus status);

//  상태값 ACTIVE 인것만 조회하도록
    List<Notice> findByStatus(NoticeStatus status);
}

