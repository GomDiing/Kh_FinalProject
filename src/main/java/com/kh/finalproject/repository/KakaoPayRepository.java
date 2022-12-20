package com.kh.finalproject.repository;

import com.kh.finalproject.entity.KakaoPay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KakaoPayRepository extends JpaRepository<KakaoPay, Long> {

}
