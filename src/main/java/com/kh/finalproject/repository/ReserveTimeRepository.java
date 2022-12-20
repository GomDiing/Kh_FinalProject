package com.kh.finalproject.repository;

import com.kh.finalproject.entity.Product;
import com.kh.finalproject.entity.ReserveTime;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ReserveTimeRepository extends JpaRepository<ReserveTime, Long> {
    Optional<List<ReserveTime>> findAllByProductAndTimeBetween(Product product, LocalDateTime first, LocalDateTime last);

    Optional<List<ReserveTime>> findAllByProductAndTimeAfter(Product product, LocalDateTime first);

    Optional<List<ReserveTime>> findAllByProductAndTimeBefore(Product product, LocalDateTime last);

    Optional<ReserveTime> findFirstByProductAndTimeAfter(Product product, LocalDateTime first);

}
