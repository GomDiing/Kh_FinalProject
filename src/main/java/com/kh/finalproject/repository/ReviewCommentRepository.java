package com.kh.finalproject.repository;

import com.kh.finalproject.entity.Product;
import com.kh.finalproject.entity.ReviewComment;
import com.kh.finalproject.entity.enumurate.MemberStatus;
import com.kh.finalproject.entity.enumurate.ReviewCommentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewCommentRepository extends JpaRepository<ReviewComment, Long> {

    Optional<List<ReviewComment>> findAllByAccuseCountGreaterThan(Integer count);

    @Modifying
    @Query("UPDATE Member n SET n.status = :status where n.index = :index")
    Optional<Integer> changeStatusMember(@Param("index") Long index, @Param("status") MemberStatus status);

    Optional<ReviewComment> findByIndex(Long index);

//    @Query(nativeQuery = true,
//    value = "select * from review_comment")
//    List<ReviewComment> selectAll(Pageable size);

    /*후기 최근글 조회할때 부모 댓글만 볼 수 있게 layer=0*/
    List<ReviewComment> searchAllByLayerAndStatus(Integer layer,ReviewCommentStatus status,Pageable size);

    List<ReviewComment> findAllByProduct(Product productCode);


    /*review 수정 시 게시글 index 번호로 조회 후 수정*/
    @Modifying
    @Query("UPDATE ReviewComment r SET r.content = :#{#paramReviewComment.content},r.rate = :#{#paramReviewComment.rate},r.updateTime = :updateTime " +
            "where r.index = :#{#paramReviewComment.index}")
    Integer updateReviewComment(@Param("paramReviewComment") ReviewComment reviewComment, @Param("updateTime")LocalDateTime now);

    Optional<ReviewComment> findByMember_Id(String memberId);


    Page<ReviewComment> findByProductCodeAndStatusAndLayer(String code, ReviewCommentStatus status, Pageable pageable, Integer layer);
    List<ReviewComment> findByProductCodeAndStatusAndLayerAndIndexNotAndGroup(String code, ReviewCommentStatus status, Integer layer, Long index, Long group);

    Page<ReviewComment> findAllByProductCodeAndStatus(String code, ReviewCommentStatus status, Pageable pageable);

}
