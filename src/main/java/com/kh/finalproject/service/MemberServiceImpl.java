package com.kh.finalproject.service;

import com.kh.finalproject.dto.member.*;
import com.kh.finalproject.entity.Address;
import com.kh.finalproject.entity.Member;
import com.kh.finalproject.exception.CustomErrorCode;
import com.kh.finalproject.exception.CustomException;
import com.kh.finalproject.repository.AddressRepository;
import com.kh.finalproject.repository.MemberRepository;
import com.kh.finalproject.response.StatusCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;
    private final AddressRepository addressRepository;

    /**
     * 회원 가입 서비스
     * @param signupDto
     */
    @Override
    @Transactional
    public void signup(SignupDTO signupDto) {

        //아이디 중복 검증
        validateDuplicateByEmail(signupDto.getEmail());

        Member signupMember = new Member().toEntity(signupDto);

        //회원 가입
        Member saveMember = memberRepository.save(signupMember);

        //회원 주소 엔티티 변환
        Address signupAddress = new Address().toEntity(signupDto, saveMember);

        //주소 정보 저장
        addressRepository.save(signupAddress);
    }

    @Override
    public void unregister(UnregisterDTO unregisterDTO) {

    }

    @Override
    public void validateDuplicateByEmail(String email) {
        Optional<Member> findEmail = memberRepository.findByEmail(email);
        if (findEmail.isPresent()) {
            throw new CustomException(CustomErrorCode.DUPLI_EMAIL);
        }
    }

    @Override
    public MemberDTO searchByIdPassword(SearchByIdPasswordDTO searchByIdPasswordDTO) {
        return null;
    }

    @Override
    public MemberDTO searchByIndex(Long index) {
        return null;
    }

    @Override
    public void updatePassword(UpdatePasswordDTO updatePasswordDTO) {

    }

    @Override
    public List<MemberDTO> searchAllMember() {
        return null;
    }

    @Override
    public void updateTotalMemberInChart(Integer count) {

    }

    @Override
    public void updateStatusInReviewComment(Long index) {

    }

    @Override
    public void editMemberInfo(EditMemberInfoDTO editMemberInfoDTO) {

    }
}
