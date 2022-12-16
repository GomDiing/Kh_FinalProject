package com.kh.finalproject.repository;

import com.kh.finalproject.entity.Address;
import com.kh.finalproject.entity.Member;
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

    /**
     * 체크박스 삭제시 회원 상태 탈퇴회원으로 변환
     */
    @Modifying
    @Query("UPDATE Member n SET n.status = :status where n.index = :index")
    Optional<Integer> changeStatusMember(@Param("index") Long index, @Param("status") MemberStatus status);

    Optional<Member> findById(String id);
//    List<Member> findById(String id);

    Optional<Member> findByEmail(String email);

    Optional<Member> findByNameAndEmail(String name, String email);

    Optional<Member> findByIdAndNameAndEmail(String id, String name, String email);

    Optional<Member> findByIndex(Long index);
   @Modifying
    @Query(nativeQuery = true,
            value = "UPDATE " +
                      "member a INNER JOIN address b " +
                    "ON a.member_index = b.member_index " +
                      "SET " +
                        "a.member_pwd=:#{#paramMember.password}" +
                        " ,a.member_name=:#{#paramMember.name}" +
                        " ,a.member_email=:#{#paramMember.email}" +
                        " ,a.update_time=:nowDate" +
                        " ,b.address_road=:#{#paramAddress.road}" +
                        " ,b.address_jibun=:#{#paramAddress.jibun}" +
                        " ,b.address_detail=:#{#paramAddress.detail}" +
                        " ,b.address_zipcode=:#{#paramAddress.zipcode}" +
                        " ,b.update_time=:nowDate" +
                    " WHERE a.member_id=:#{#paramMember.id}")
    Integer updateInfo(
            @Param("paramMember") Member member, @Param("nowDate") LocalDateTime now, @Param("paramAddress") Address address);

    Optional<List<Member>> findAllByMemberAccuseCountGreaterThan(Integer count);

//    List<Member> findById(String id);

}
