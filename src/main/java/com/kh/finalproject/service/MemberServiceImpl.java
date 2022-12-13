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

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class MemberServiceImpl implements MemberService{
    private final MemberRepository memberRepository;
    private final AddressRepository addressRepository;

    /**
     * 회원 가입 메서드
     */
    @Override
    @Transactional
    public void signup(SignupDTO signupDto) {

        Member signMember = new Member().toEntity(signupDto);

        //이메일 중복 확인
        validateDuplicateByEmail(signupDto.getEmail());

        //회원 가입
        Member saveMember = memberRepository.save(signMember);

        Address signAddress = new Address().toEntity(signupDto, saveMember);

        //주소 정보 저장
        addressRepository.save(signAddress);
    }

    /**
     * 회원 정보 수정 메서드
     */
    @Override
    @Transactional
    public Boolean editMemberInfo(EditMemberInfoDTO memberInfoDTO) {

        Member findMember = memberRepository.findByIndex(memberInfoDTO.getIndex())
                .orElseThrow(() -> new CustomException(CustomErrorCode.EMPTY_MEMBER));

        Address findAddress = new Address().toEntity(memberInfoDTO, findMember);

//        int updateMember = memberRepository.updateInfo(findMember.getIndex(), findMember.getId(),
//                findMember.getPassword(), findMember.getName(), findMember.getEmail(), address.getRoad(), address.getJibun(), address.getDetail(), address.getZipcode());

        Integer updateMember = memberRepository.updateInfo(findMember, LocalDateTime.now(), findAddress);

        if(updateMember == 2) return true;
        else throw new IllegalArgumentException("회원정보 업데이트 실패 ! ! !");
    }

    @Override
    public Boolean unregister(UnregisterDTO unregisterDTO) {
        return null;
    }

    /**
     * 중복 이메일 확인 메서드
     */
    @Override
    public void validateDuplicateByEmail(String email) {

        Optional<Member> findEmail = memberRepository.findByEmail(email);

        //중복 이메일 존재 시 예외 처리
        if (findEmail.isPresent()) {
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

    /**
     * 전체 일반 회원 조회 서비스
     */
    @Override
    public List<MemberDTO> searchAllActiveMember() {
        List<MemberDTO> memberDTOSList = new ArrayList<>();
        //활성 상태 회원 조회
        List<Member> memberList = memberRepository.findByStatus(MemberStatus.ACTIVE)
                .orElseThrow(() -> new CustomException(CustomErrorCode.EMPTY_MEMBER_ACTIVE_LIST));

        for(Member e : memberList){
            MemberDTO memberDTO = new MemberDTO().toDTO(e);
            memberDTOSList.add(memberDTO);
        }
        return memberDTOSList;
    }

    /**
     * 전체 블랙리스트 회원 조회
     */
    @Override
    public List<MemberDTO> searchAllBlackMember() {
        //회원 목록
        List<MemberDTO> memberBlackDTOList = new ArrayList<>();
        //블랙 상태 회원 조회
        List<Member> memberList = memberRepository.findByStatus(MemberStatus.BLACKLIST)
                .orElseThrow(() -> new CustomException(CustomErrorCode.EMPTY_MEMBER_BLAK_LIST));
        for(Member e : memberList){
            MemberDTO memberDTO = new MemberDTO().toDTO(e);
            memberBlackDTOList.add(memberDTO);
        }
        return memberBlackDTOList;
    }

    @Override
    public void updateTotalMemberInChart(Integer count) {

    }

    @Override
    public void updateStatusInReviewComment(Long index) {

    }

    /**
     * 회원 상태 탈퇴 변환 메서드
     */
    @Transactional
    public void changeMemberStatusToUnregister(List<CheckMemberDTO> checkMemberDTOList){
        for(CheckMemberDTO checkMemberDTO : checkMemberDTOList){
            log.info("memberIndex = {}", checkMemberDTO.getIndex());
            memberRepository.changeStatusMember(checkMemberDTO.getIndex(), MemberStatus.UNREGISTER)
                    .orElseThrow(() -> new CustomException(CustomErrorCode.ERROR_UPDATE_UNREGISTER_MEMBER));
        }
    }
}