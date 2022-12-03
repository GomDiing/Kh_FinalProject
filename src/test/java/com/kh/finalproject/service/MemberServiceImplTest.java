package com.kh.finalproject.service;

import com.kh.finalproject.dto.member.SignupDTO;
import com.kh.finalproject.entity.Member;
import com.kh.finalproject.repository.AddressRepository;
import com.kh.finalproject.repository.MemberRepository;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;


@SpringBootTest
class MemberServiceImplTest {

    @Autowired
    private MemberRepository memberRepository;
    private AddressRepository addressRepository;

    public void 회원가입_테스트() throws Exception {
        //given

        //when

        //then
    }

    private SignupDTO createSignupDTO(Integer count) {
        String member =
    }

    private Member createMember() {
        return null;
    }
}