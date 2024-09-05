package com.kh.finalproject.repository;

import com.kh.finalproject.entity.ReserveTime;
import com.kh.finalproject.entity.ReserveTimeSeatPrice;
import com.kh.finalproject.entity.SeatPrice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReserveTimeSeatPriceRepository extends JpaRepository<ReserveTimeSeatPrice, Long> {
    Optional<ReserveTimeSeatPrice> findByReserveTimeAndSeatPrice(ReserveTime reserveTime, SeatPrice seatPrice);
    Optional<ReserveTimeSeatPrice> findByReserveTimeIndexAndSeatPrice(Long reserveTimeIndex, SeatPrice seatPrice);
    Optional<ReserveTimeSeatPrice> findByReserveTimeIndexAndSeatPriceIndex(Long reserveTimeIndex, Long seatPriceIndex);
}
