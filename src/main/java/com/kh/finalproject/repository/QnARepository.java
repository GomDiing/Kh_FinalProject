package com.kh.finalproject.repository;

import com.kh.finalproject.entity.QnA;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface QnARepository extends JpaRepository<QnA,Long> {
    Optional<QnA> findByIndex(Long index);

//    qna 답장 보내기(선택한 문의사항의 index값 조회해서 답장, status update
    @Modifying
    @Transactional
    @Query("UPDATE QnA q SET q.reply =:reply, q.replyTime = now(),q.status = 'COMPLETE' where q.index =:index ")
    Integer updateReply(@Param("reply") String reply, @Param("index") Long index);

}
