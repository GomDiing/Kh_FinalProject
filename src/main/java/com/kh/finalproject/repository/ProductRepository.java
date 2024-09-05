package com.kh.finalproject.repository;

import com.kh.finalproject.entity.Product;
import com.kh.finalproject.entity.ReserveTime;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {
    Optional<Product> findByCode(String code);

    List<Product> findAllByCode(String code);

    List<Product> findByTitleContaining(String title);

    Optional<Product> findByReserveTimeListContaining(ReserveTime reserveTime);

    Page<Product> findByDetailLocationStartsWith(String regionName, Pageable pageable);
    Page<Product> findByDetailLocationStartsWithAndDetailLocationNotContaining(String regionName, String regionNameNotContain, Pageable pageable);


    @Query("select distinct rt.product from Product p, ReserveTime rt where rt.time > :now and rt.product.title like %:title%")
    Page<Product> browseByTitle(@Param("title")String title, @Param("now")LocalDateTime now, Pageable pageable);
}