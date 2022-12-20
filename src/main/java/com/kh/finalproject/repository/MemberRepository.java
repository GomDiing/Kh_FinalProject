package com.kh.finalproject.repository;

import com.kh.finalproject.entity.Member;
import com.kh.finalproject.entity.enumurate.MemberProviderType;
import com.kh.finalproject.entity.enumurate.MemberStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {

//    Optional<List<Member>> findByStatus(MemberStatus status);

    Page<Member> findByStatus(MemberStatus status,Pageable pageable);

    Optional<Member> findById(String id);

    /**
     * 체크박스 삭제시 회원 상태 탈퇴회원으로 변환
     */
    @Modifying
    @Query("UPDATE Member n SET n.status = :status where n.index = :index")
    Optional<Integer> changeStatusMember(@Param("index") Long index, @Param("status") MemberStatus status);

    Optional<Member> findByIdAndStatusNotAndProviderType(String id, MemberStatus status, MemberProviderType providerType);

//    회원 고유 인덱스로 찾기
    Optional<Member> findByIndex(Long index);

    Optional<Member> findByEmailAndStatusNot(String email, MemberStatus status);
    Optional<Member> findByEmailAndStatusNotAndProviderTypeNot(String email, MemberStatus status, MemberProviderType providerType);

    Optional<Member> findByNameAndEmailAndStatusNotAndProviderType(String name, String email, MemberStatus status, MemberProviderType provider);

    Optional<Member> findByIdAndNameAndEmailAndStatusNotAndProviderType(String id, String name, String email, MemberStatus status, MemberProviderType providerType);

    Optional<List<Member>> findAllByAccuseCountGreaterThan(Integer count);

    Optional<Member> findByIdAndPasswordAndProviderType(String id, String password, MemberProviderType providerType);

    Optional<List<Member>> findAllByStatusAndUnregisterAfter(MemberStatus status, LocalDateTime time);

    Optional<Member> findByIdAndPassword(String id, String password);

    Optional<Member> findByEmailAndProviderType(String email, MemberProviderType providerType);

    @Query(nativeQuery = true,
    value = "select DATE_ADD(update_time, INTERVAL 7 DAY) from member where member_index = :member_index"
    )
    LocalDateTime memberDelete(@Param("member_index") Long index);
//    List<Member> findById(String id);
}
