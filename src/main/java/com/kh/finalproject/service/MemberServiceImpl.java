package com.kh.finalproject.service;

import com.kh.finalproject.common.BaseTimeEntity;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

        // 아이디 중복 확인
        validateDuplicateById(signupDto.getId());

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
    public void editMemberInfo(EditMemberInfoDTO memberInfoDTO) {

        //주어진 ID로 회원 조회
        Member findMember = memberRepository.findById(memberInfoDTO.getId())
                .orElseThrow(() -> new CustomException(CustomErrorCode.EMPTY_MEMBER));

        //주어진 회원과 연결된 주소 조회
        Address findAddress = addressRepository.findByMember(findMember);

        // 엔티티로 변환 OK
//        Member saveMember = new Member().toEntity(memberInfoDTO);

        //주소 정보 갱신 (단순 값 교체)
//        findAddress.updateAddress(memberInfoDTO);

        //회원 정보 갱신 (단순 값 교체 + 연관관계 편의 메서드)
        findMember.updateMember(findAddress, memberInfoDTO);

        // 엔티티로 변환 OK
//        Address findAddress = new Address().toEntity(memberInfoDTO, saveMember);

//        Integer updateMember = memberRepository.updateInfo(saveMember, LocalDateTime.now(), findAddress);

//        addressRepository.save(findAddress);

//        if(updateMember == 2) return true;
//        else throw new CustomException(CustomErrorCode.ERROR_UPDATE_MEMBER_INFO);
    }

    @Override
    public Boolean unregister(UnregisterDTO unregisterDTO) {
        return null;
    }

    /**
     * 중복 아이디 확인 메서드
     */
    @Transactional
    @Override
    public void validateDuplicateById(String id) {

        Optional<Member> findId = memberRepository.findById(id);

        if(findId.isPresent()) {
            throw new CustomException(CustomErrorCode.DUPLI_MEMBER_ID);
        }
    }

    /**
     * 중복 이메일 확인 메서드
     */
    @Override
    @Transactional
    public void validateDuplicateByEmail(String email) {

        Optional<Member> findEmail = memberRepository.findByEmail(email);

        //중복 이메일 존재 시 예외 처리
        if (findEmail.isPresent()) {
            throw new CustomException(CustomErrorCode.DUPLI_EMAIL);
        }
    }

    /**
     * search member by id
     */
    @Transactional
    @Override
    public SignupDTO searchById(String id) {

        Member findId = memberRepository.findById(id)
                .orElseThrow(() -> new CustomException(CustomErrorCode.EMPTY_MEMBER));

        Address memberAddress = addressRepository.findByMember(findId);

        return new SignupDTO().toDTO(findId, memberAddress);
    }

    /**
     * find memberId search by name and email
     */
    @Override
    @Transactional
    public Map<String, String> findMemberId(String name, String email) {

        Member findNameAndEmail = memberRepository.findByNameAndEmail(name, email)
                .orElseThrow(() -> new CustomException(CustomErrorCode.DUPLI_EMAIL_NAME));

        Map<String, String> memberId = new LinkedHashMap<>();

        FindIdMemberDTO searchMemberId = new FindIdMemberDTO().toDTO(findNameAndEmail);

        memberId.put("member_id", searchMemberId.getId());

        return memberId;
    }

    /**
     * find password search by id, name and email
     */
    @Transactional
    @Override
    public Map<String, String> findPassword(String id, String name, String email) {

        Member findIdNameEmail = memberRepository.findByIdAndNameAndEmail(id, name, email)
                .orElseThrow(() -> new CustomException(CustomErrorCode.NOT_MATCH_ID_EMAIL_NAME));

        Map<String, String> memberPassword = new LinkedHashMap<>();

        FindPwdMemberDTO searchPassword = new FindPwdMemberDTO().toDTO(findIdNameEmail);

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
    public PagingMemberDTO searchAllActiveMember(Pageable pageable) {
        List<MemberDTO> memberDTOList = new ArrayList<>();

        //활성 상태 회원 조회
        Page<Member> pageMemberList = memberRepository.findByStatus(MemberStatus.ACTIVE, pageable);

        if (Objects.isNull(pageMemberList)) {
            throw new CustomException(CustomErrorCode.EMPTY_MEMBER_ACTIVE_LIST);
        }

        List<Member> memberList = pageMemberList.getContent();
        Integer totalPages = pageMemberList.getTotalPages();
        Integer page = pageMemberList.getNumber()+1;
        Long totalResults = pageMemberList.getTotalElements();

        for(Member member : memberList){
            Address memberAddress = addressRepository.findByMember(member);
            MemberDTO memberDTO = new MemberDTO().toDTO(member, memberAddress);
            memberDTOList.add(memberDTO);
        }
        PagingMemberDTO pagingMemberDTO = new PagingMemberDTO().toPageDTO(page,totalPages,totalResults,memberDTOList);

        return pagingMemberDTO;
    }

    /**
     * 전체 블랙리스트 회원 조회
     */
    @Override
    public PagingMemberDTO searchAllBlackMember(Pageable pageable) {
        //회원 목록
        List<MemberDTO> memberDTOList = new ArrayList<>();
        //블랙 상태 회원 조회
        Page<Member> pageMemberList = memberRepository.findByStatus(MemberStatus.BLACKLIST,pageable);

        if (Objects.isNull(pageMemberList)) {
            throw new CustomException(CustomErrorCode.EMPTY_MEMBER_BLAK_LIST);
        }
        List<Member> memberList = pageMemberList.getContent();
        Integer totalPages = pageMemberList.getTotalPages();
        Integer page = pageMemberList.getNumber()+1;
        Long totalResults = pageMemberList.getTotalElements();
        for(Member member : memberList){

            Address memberAddress = addressRepository.findByMember(member);
            MemberDTO memberDTO = new MemberDTO().toDTO(member, memberAddress);
            memberDTOList.add(memberDTO);
        }
        PagingMemberDTO pagingMemberDTO = new PagingMemberDTO().toPageDTO(page,totalPages,totalResults,memberDTOList);

        return pagingMemberDTO;

//        for(Member e : memberList){
//            MemberDTO memberDTO = new MemberDTO().toDTO(e);
//            memberBlackDTOList.add(memberDTO);
//        }
//        return memberBlackDTOList;
    }



//    /**
//     * 전체 일반 회원 조회 서비스
//     */
//    @Override
//    public List<MemberDTO> searchAllActiveMember() {
//        List<MemberDTO> memberDTOSList = new ArrayList<>();
//        //활성 상태 회원 조회
//        List<Member> memberList = memberRepository.findByStatus(MemberStatus.ACTIVE)
//                .orElseThrow(() -> new CustomException(CustomErrorCode.EMPTY_MEMBER_ACTIVE_LIST));
//
//        for(Member e : memberList){
//            MemberDTO memberDTO = new MemberDTO().toDTO(e);
//            memberDTOSList.add(memberDTO);
//        }
//        return memberDTOSList;
//    }
//
//    /**
//     * 전체 블랙리스트 회원 조회
//     */
//    @Override
//    public List<MemberDTO> searchAllBlackMember() {
//        //회원 목록
//        List<MemberDTO> memberBlackDTOList = new ArrayList<>();
//        //블랙 상태 회원 조회
//        List<Member> memberList = memberRepository.findByStatus(MemberStatus.BLACKLIST)
//                .orElseThrow(() -> new CustomException(CustomErrorCode.EMPTY_MEMBER_BLAK_LIST));
//        for(Member e : memberList){
//            MemberDTO memberDTO = new MemberDTO().toDTO(e);
//            memberBlackDTOList.add(memberDTO);
//        }
//        return memberBlackDTOList;
//    }

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