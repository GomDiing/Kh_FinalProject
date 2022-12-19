package com.kh.finalproject.repository;

import com.kh.finalproject.entity.Casting;
import com.kh.finalproject.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CastingRepository extends JpaRepository<Casting, String> {

    Optional<List<Casting>> findAllByProductOrderByOrder(Product product);
}
