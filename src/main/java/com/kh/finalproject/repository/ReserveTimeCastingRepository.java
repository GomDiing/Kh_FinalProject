package com.kh.finalproject.repository;

import com.kh.finalproject.entity.ReserveTime;
import com.kh.finalproject.entity.ReserveTimeCasting;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReserveTimeCastingRepository extends JpaRepository<ReserveTimeCasting, Long> {

    Optional<List<ReserveTimeCasting>> findAllByReserveTime(ReserveTime reserveTime);

    Optional<List<ReserveTimeCasting>> findAllByIndex(Long index);

    Optional<List<ReserveTimeCasting>> findAllByReserveTimeIndex(Long index);
}
