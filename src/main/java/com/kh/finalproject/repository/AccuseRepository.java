package com.kh.finalproject.repository;

import com.kh.finalproject.entity.Accuse;
import com.kh.finalproject.entity.Member;
import com.kh.finalproject.entity.ReviewComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccuseRepository extends JpaRepository<Accuse, Long> {

//    신고자랑 리뷰글 인자로 받아서 신고 한 적 있는지 확인 용
    Optional<Accuse> findByMemberSuspectAndReviewComment(Member member, ReviewComment reviewComment);

}
