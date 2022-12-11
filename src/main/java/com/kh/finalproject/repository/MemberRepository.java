package com.kh.finalproject.repository;

import com.kh.finalproject.entity.Member;
import com.kh.finalproject.entity.enumurate.MemberStatus;
import com.kh.finalproject.entity.enumurate.NoticeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MemberRepository extends JpaRepository<Member, Long> {
    List<Member> findByStatus(MemberStatus status);

//    체크박스 삭제시 회원 상태 탈퇴회원으로 변환
    @Modifying
    @Query("UPDATE Member n SET n.status = :status where n.index = :index")
    Integer changeStatusMember(@Param("index") Long index, @Param("status") MemberStatus status);

}
