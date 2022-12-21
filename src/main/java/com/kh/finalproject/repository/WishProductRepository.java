package com.kh.finalproject.repository;

import com.kh.finalproject.entity.Member;
import com.kh.finalproject.entity.Product;
import com.kh.finalproject.entity.WishProduct;
import com.kh.finalproject.service.WishProductService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WishProductRepository extends JpaRepository<WishProduct, Long> {

    Optional<WishProduct> findByMemberAndProduct(Member member, Product product);

    Optional<WishProduct> findByIndex(Long wishIndex);
}
