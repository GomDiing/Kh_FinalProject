package com.kh.finalproject.repository;

import com.kh.finalproject.entity.Reserve;
import com.kh.finalproject.entity.enumurate.ReserveStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReserveRepository extends JpaRepository<Reserve, String> {

    Optional<List<Reserve>> findAllByCreateTimeBeforeAndStatus(LocalDateTime now, ReserveStatus status);
    Optional<List<Reserve>> findAllByCreateTimeBefore(LocalDateTime now);

    Optional<Reserve> findByIdAndStatus(String id, ReserveStatus status);
}
