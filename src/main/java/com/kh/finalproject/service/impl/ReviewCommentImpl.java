package com.kh.finalproject.service.impl;

import com.kh.finalproject.dto.reviewComment.*;
import com.kh.finalproject.service.ReviewCommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewCommentImpl implements ReviewCommentService {
    @Override
    public void create(CreateReviewCommentDTO createReviewCommentDTO) {

    }

    @Override
    public void remove(RemoveReviewCommentDTO removeReviewCommentDTO) {

    }

    @Override
    public void update(UpdateReviewCommentDTO updateReviewCommentDTO) {

    }

    @Override
    public void rearrangeOrder(Long productCode) {

    }

    @Override
    public void addRateAverage(UpdateRateAverageDTO updateRateAverageDTO) {

    }

    @Override
    public ReviewCommentDTO searchByProduct(Long index) {
        return null;
    }

    @Override
    public List<ReviewCommentDTO> searchAll() {
        return null;
    }
}
