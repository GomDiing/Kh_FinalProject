package com.kh.finalproject.repository;

import com.kh.finalproject.entity.Address;
import com.kh.finalproject.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AddressRepository extends JpaRepository<Address, Long> {
    Address findByMember(Member member);
}
