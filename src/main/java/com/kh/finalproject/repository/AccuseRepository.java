package com.kh.finalproject.repository;

import com.kh.finalproject.entity.Accuse;
import com.kh.finalproject.entity.Address;
import com.kh.finalproject.entity.Member;
import com.kh.finalproject.entity.ReviewComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface AccuseRepository extends JpaRepository<Accuse, Long> {

    //신고자랑 리뷰글 인자로 받아서 신고 한 적 있는지 확인 용
    Optional<Accuse> findByMemberSuspectAndReviewComment(Member member, ReviewComment reviewComment);

//    @Modifying
//    @Query(nativeQuery = true,
//            value = "UPDATE" +
//                    "member m INNER JOIN reviewComment r" +
//                    "ON m.member_id = r.member_id" +
//                    "SET" +
//                    "m.member_status=:#{#paramMember.status.BLACKLIST}"+
//                    "where r.accuse_Count>=5")
//    Long changeAccuseStatus(
//            @Param("paramMember") Member member);
//
//    Accuse changeAccuseStatus(Integer accuseCount);
}
