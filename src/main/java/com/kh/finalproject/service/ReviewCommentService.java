package com.kh.finalproject.service;

import com.kh.finalproject.dto.member.PagingMemberDTO;
import com.kh.finalproject.dto.reviewComment.*;
import com.kh.finalproject.entity.ReviewComment;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * 후기/댓글 서비스 인터페이스
 */
public interface ReviewCommentService {
    /**
     * 후기/댓글 생성 메서드
     */
    void create(CreateReviewCommentDTO createReviewCommentDTO);

    /*후기/댓글 대댓글 생성 메서드*/
    void reCreate(CreateReviewCommentDTO createReviewCommentDTO);

    /**
     * 후기/댓글 삭제 메서드
     * 실제로 삭제되지않고 해당 후기/댓글 상태 변경
     */
    void remove(RemoveReviewCommentDTO removeReviewCommentDTO);

    /**
     * 후기/댓글 수정 메서드
     */
    void update(UpdateReviewCommentDTO updateReviewCommentDTO);

    /**
     * 순서 갱신 메서드
     * 해당 상품의 후기/댓글에 CRUD / 상태 변경 발생했을 경우 순서를 다시 재정렬
     * [추가 논의] 후기/댓글 상태가 탈퇴 / 삭제 / 신고이고 연결된 댓글/대댓글이 없으면
     * 순서를 매기지않거나 -1로 둔 후 유저들에게 보여주지 않을지 고려
     */
    void rearrangeOrder(Long productCode);

    /**
     * 평점 추가 메서드
     * [상품] 테이블의 평균 평점도 갱신
     */
    void addRateAverage(UpdateRateAverageDTO updateRateAverageDTO);

    /**
     * 상품별 후기/댓글 조회 메서드
     * 단, 후기/댓글 상태가 '활성'이 아닌경우 적절한 내용으로 대체
     */
    ReviewCommentDTO searchByProduct(Long index);

    /**
     * 후기/댓글 전체 조회 메서드(관리자용 페이징)
     */
    List<ReviewCommentDTO> searchAll(Pageable pageSize);

    /*후기 댓글 전체 메서드*/

    PageReviewCommentDTO allComment(String productCode, Pageable pageable);
}
