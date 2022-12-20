package com.kh.finalproject.repository;

import com.kh.finalproject.entity.KakaoPay;
import com.kh.finalproject.entity.Reserve;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface KakaoPayRepository extends JpaRepository<KakaoPay, Long> {
    Optional<KakaoPay> findByReserve(Reserve reserve);
}
