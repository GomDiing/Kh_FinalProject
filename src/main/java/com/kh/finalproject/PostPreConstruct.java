package com.kh.finalproject;

import com.kh.finalproject.dto.member.SignupDTO;
import com.kh.finalproject.entity.Address;
import com.kh.finalproject.entity.Member;
import com.kh.finalproject.entity.QnA;
import com.kh.finalproject.repository.AddressRepository;
import com.kh.finalproject.repository.MemberRepository;
import com.kh.finalproject.repository.QnARepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static java.time.temporal.TemporalAdjusters.firstDayOfMonth;
import static java.time.temporal.TemporalAdjusters.lastDayOfMonth;

@RequiredArgsConstructor
@Component
@Slf4j
public class PostPreConstruct {

    private final MemberRepository memberRepository;

    private final AddressRepository addressRepository;
    private final QnARepository qnARepository;

    private final List<Member> memberList;
    private final List<Address> addressList;
    private final List<QnA> qnAList;

    /**
     * Bean 생성 이전 시점 자동 실행
     */
//    @PostConstruct
    public void createMember() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime nowDayOfMonth = LocalDateTime.of(now.getYear(), now.getMonth(), now.getDayOfMonth(), 0, 0, 0);
        LocalDateTime lastDayOfMonth = nowDayOfMonth.with(lastDayOfMonth());
        log.info("now = {}", now.toString());
        log.info("nowDayOfMonth = {}", nowDayOfMonth.toString());
        log.info("lastDayOfMonth = {}", lastDayOfMonth.toString());

        memberList.clear();
        addressList.clear();
        qnAList.clear();

        for (int i = 0; i < 10; i++) {
            String uuid = UUID.randomUUID().toString().substring(0, 5);

            Member member = new Member().createMember("testMember_" + uuid, "testName_" + uuid,
                    "testPassword_" + uuid, "testEmail_" + uuid);
            memberList.add(member);
            memberRepository.save(member);

            Address address = new Address()
                    .createAddress(member, "testRoad_" + uuid, "testJibun_" + uuid, "testDetail_" + uuid, "testZipcode_" + uuid);
            addressList.add(address);
            addressRepository.save(address);

            QnA qnA = new QnA().createQnA(member, "testTitle_" + uuid, "testCategory_" + uuid, "testContent_" + uuid);
            qnAList.add(qnA);
            qnARepository.save(qnA);
        }
    }

    /**
     * Bean 종료 이전 시점 자동 실행
     */
//    @PreDestroy
    public void deleteMember() {
        qnARepository.deleteAll(qnAList);
        addressRepository.deleteAll(addressList);
        memberRepository.deleteAll(memberList);
    }
}
