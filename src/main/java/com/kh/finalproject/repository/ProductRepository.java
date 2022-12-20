package com.kh.finalproject.repository;

import com.kh.finalproject.entity.Product;
import com.kh.finalproject.entity.ReserveTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {
    Optional<Product> findByCode(String code);

    List<Product> findAllByCode(String code);

    List<Product> findByTitleContaining(String title);

    Optional<Product> findByReserveTimeListContaining(ReserveTime reserveTime);

}

