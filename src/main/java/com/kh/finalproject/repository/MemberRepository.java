package com.kh.finalproject.repository;

import com.kh.finalproject.entity.Address;
import com.kh.finalproject.entity.Member;
import com.kh.finalproject.entity.Notice;
import com.kh.finalproject.entity.enumurate.MemberStatus;
import com.kh.finalproject.entity.enumurate.NoticeStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.persistence.PostUpdate;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {

//    Optional<List<Member>> findByStatus(MemberStatus status);

    Page<Member> findByStatus(MemberStatus status,Pageable pageable);

    /**
     * 체크박스 삭제시 회원 상태 탈퇴회원으로 변환
     */
    @Modifying
    @Query("UPDATE Member n SET n.status = :status where n.index = :index")
    Optional<Integer> changeStatusMember(@Param("index") Long index, @Param("status") MemberStatus status);

    Optional<Member> findById(String id);

    Optional<Member> findByEmail(String email);

    Optional<Member> findByNameAndEmail(String name, String email);

    Optional<Member> findByIdAndNameAndEmail(String id, String name, String email);
//    List<Member> findAllByCreate_timeBetween(LocalDateTime start, LocalDateTime end);
}
