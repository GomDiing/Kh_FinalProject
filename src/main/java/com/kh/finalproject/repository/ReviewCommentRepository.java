package com.kh.finalproject.repository;

import com.kh.finalproject.entity.ReviewComment;
import com.kh.finalproject.entity.enumurate.MemberStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewCommentRepository extends JpaRepository<ReviewComment, Long> {

    Optional<List<ReviewComment>> findAllByAccuseCountGreaterThan(Integer count);

    @Modifying
    @Query("UPDATE Member n SET n.status = :status where n.index = :index")
    Optional<Integer> changeStatusMember(@Param("index") Long index, @Param("status") MemberStatus status);

    @Query(nativeQuery = true,
    value = "select * from review_comment")
    List<ReviewComment> selectAll(Pageable size);


}
