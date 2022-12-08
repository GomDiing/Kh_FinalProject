package com.kh.finalproject.repository;

import com.kh.finalproject.entity.QnA;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface QnARepository extends JpaRepository<QnA,Long> {

    List<QnA> findByIndex(Long index);
    @Modifying
    @Query("UPDATE QnA q SET q.reply = : qna_reply where q.index = : qna_index")
    void updateReply(@Param("qna_reply") String reply, @Param("qna_index") Long index);

}
