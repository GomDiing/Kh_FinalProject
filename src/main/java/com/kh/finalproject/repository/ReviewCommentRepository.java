package com.kh.finalproject.repository;

import com.kh.finalproject.entity.ReviewComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewCommentRepository extends JpaRepository<ReviewComment, Long> {

    Optional<List<ReviewComment>> findAllByAccuseCountGreaterThan(Integer count);
}
