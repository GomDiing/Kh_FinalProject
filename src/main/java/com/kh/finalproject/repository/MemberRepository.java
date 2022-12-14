package com.kh.finalproject.repository;

import com.kh.finalproject.entity.Member;
import com.kh.finalproject.entity.enumurate.MemberStatus;
import com.kh.finalproject.entity.enumurate.NoticeStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {

    List<Member> findByStatus(MemberStatus status);

//    체크박스 삭제시 회원 상태 탈퇴회원으로 변환
    @Modifying
    @Query("UPDATE Member n SET n.status = :status where n.index = :index")
    Integer changeStatusMember(@Param("index") Long index, @Param("status") MemberStatus status);

    Optional<Member> findByEmail(String email);

    Optional<Member> findByNameAndEmail(String name, String email);

    Optional<Member> findByIdAndNameAndEmail(String id, String name, String email);

    Optional<Member> findByIndex(Long index);

    @Modifying
    @Query(nativeQuery = true, value = "UPDATE member as a, address as b" +
            " SET " +
            "a.member_id=:id" +
            " ,a.member_pwd=:pwd" +
            " ,a.member_name=:name" +
            " ,a.member_email=:email" +
            " ,b.address_road=:road" +
            " ,b.address_jibun=:jibun" +
            " ,b.address_detail=:detail" +
            " ,b.address_zipcode=:zipcode" +
            " WHERE a.member_index=:index" +
            " AND a.member_index = b.member_index")
    int updateInfo(
            @Param("index")Long index, @Param("id") String id, @Param("pwd") String password,
            @Param("name")String name, @Param("email") String email, @Param("road") String road,
            @Param("jibun") String jibun, @Param("detail") String detail, @Param("zipcode") String zipcode);
}
