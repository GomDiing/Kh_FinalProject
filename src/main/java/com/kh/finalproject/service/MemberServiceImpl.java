package com.kh.finalproject.service;

import com.kh.finalproject.dto.member.*;
import com.kh.finalproject.entity.Address;
import com.kh.finalproject.entity.Member;
import com.kh.finalproject.entity.enumurate.MemberStatus;
import com.kh.finalproject.exception.CustomErrorCode;
import com.kh.finalproject.exception.CustomException;
import com.kh.finalproject.repository.AddressRepository;
import com.kh.finalproject.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class MemberServiceImpl implements MemberService{
    private final MemberRepository memberRepository;
    private final AddressRepository addressRepository;

    @Override
    @Transactional
    public void signup(SignupDTO signupDto) {

        validateDuplicateByEmail(signupDto.getEmail());

        Member signMember = new Member().toEntity(signupDto);

        Member saveMember = memberRepository.save(signMember);

        Address signAddress = new Address().toEntity(signupDto, saveMember);

        addressRepository.save(signAddress);
    }

    /**
     * member info update
     */
    @Override
    @Transactional
    public Boolean editMemberInfo(EditMemberInfoDTO memberInfoDTO) {

        Member member = new Member().toEntity(memberInfoDTO);

        Optional<Member> findIndex = memberRepository.findByIndex(member.getIndex());

        if(findIndex.isEmpty()) {
            throw new CustomException(CustomErrorCode.EMPTY_MEMBER);
        }

        Address address = new Address().toEntity(memberInfoDTO, member);

        int updateMember = memberRepository.updateInfo(member.getIndex(), member.getId(), member.getPassword(), member.getName(),
                member.getEmail(), address.getRoad(), address.getJibun(), address.getDetail(), address.getZipcode());

        if(updateMember == 2) return true;
        else throw new IllegalArgumentException("회원정보 업데이트 실패 ! ! !");
    }

    @Override
    public Boolean unregister(UnregisterDTO unregisterDTO) {
        return null;
    }

    /**
     * email duplicate check
     */
    @Override
    @Transactional
    public void validateDuplicateByEmail(String email) {

        Optional<Member> findEmail = memberRepository.findByEmail(email);

        if(findEmail.isPresent()) {
            throw new CustomException(CustomErrorCode.DUPLI_EMAIL);
        }
    }

    /**
     * search member by email
     */
    @Override
    @Transactional
    public SignupDTO searchByEmail(String email) {

        Optional<Member> findEmail = memberRepository.findByEmail(email);

        if (findEmail.isEmpty()) {
            throw new IllegalArgumentException("조회된 회원이 없습니다");
        }

        Address memberAddress = addressRepository.findByMember(findEmail.get());

        SignupDTO searchByEmail = new SignupDTO().toDTO(findEmail.get(), memberAddress);

        return searchByEmail;
    }

    /**
     * find memberId search by name and email
     */
    @Override
    @Transactional
    public Map<String, String> findMemberId(String name, String email) {

        Optional<Member> findNameAndEmail = memberRepository.findByNameAndEmail(name, email);

        if(findNameAndEmail.isEmpty()) {
            throw new CustomException(CustomErrorCode.DUPLI_EMAIL);
        }

        Map<String, String> memberId = new LinkedHashMap<>();

        FindMemberDTO searchMemberId = new FindMemberDTO().toDTO(findNameAndEmail.get());

        memberId.put("member_id", searchMemberId.getId());

        return memberId;
    }

    /**
     * find password search by id, name and email
     */
    @Override
    @Transactional
    public Map<String, String> findPassword(String id, String name, String email) {

        Optional<Member> findIdNameEmail = memberRepository.findByIdAndNameAndEmail(id, name, email);

        if(findIdNameEmail.isEmpty()) {
            throw new CustomException(CustomErrorCode.NOT_MATCH_EMAIL_NAME);
        }

        Map<String, String> memberPassword = new LinkedHashMap<>();

        FindMemberDTO searchPassword = new FindMemberDTO().toDTO(findIdNameEmail.get());

        memberPassword.put("password", searchPassword.getPassword());

        return memberPassword;
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

    //    일반회원조회
    @Override
    public List<MemberDTO> searchAllMember() {
        List<MemberDTO> memberDTOSList = new ArrayList<>();
        List<Member> memberList = memberRepository.findByStatus(MemberStatus.ACTIVE);
        for(Member e : memberList){
            MemberDTO memberDTO = new MemberDTO().toDTO(e);
            memberDTOSList.add(memberDTO);
        }
        return memberDTOSList;
    }
// 블랙리스트조회
    @Override
    public List<MemberDTO> searchAllBlackMember() {
        List<MemberDTO> memberDTOSList = new ArrayList<>();
        List<Member> memberList = memberRepository.findByStatus(MemberStatus.BLACKLIST);
        for(Member e : memberList){
            MemberDTO memberDTO = new MemberDTO().toDTO(e);
            memberDTOSList.add(memberDTO);
        }
        return memberDTOSList;
    }

    @Override
    public void updateTotalMemberInChart(Integer count) {

    }

    @Override
    public void updateStatusInReviewComment(Long index) {

    }

//    체크박스로 회원 탈퇴시키기
    @Transactional
    public Boolean deleteCheckMember(List<CheckMemberDTO> memberIndexList){
        List<Member> deleteCheckList = new ArrayList<>();
        for(CheckMemberDTO memberIndex : memberIndexList){
            log.info("memberIndex = {}", memberIndex.getIndex());
            memberRepository.changeStatusMember(memberIndex.getIndex(),MemberStatus.UNREGISTER);
        }
        return true;
    }


}