package com.kh.finalproject.service.impl;

import com.kh.finalproject.dto.member.*;
import com.kh.finalproject.entity.Address;
import com.kh.finalproject.entity.Member;
import com.kh.finalproject.entity.enumurate.MemberProviderType;
import com.kh.finalproject.entity.enumurate.MemberStatus;
import com.kh.finalproject.exception.CustomErrorCode;
import com.kh.finalproject.exception.CustomException;
import com.kh.finalproject.repository.AddressRepository;
import com.kh.finalproject.repository.MemberRepository;
import com.kh.finalproject.service.MemberService;
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
public class MemberServiceImpl implements MemberService {
    private final MemberRepository memberRepository;
    private final AddressRepository addressRepository;

    /**
     * 회원 가입 메서드
     */
    @Override
    @Transactional
    public void signup(SignupDTO signupDto) {

        unregisterCheck();

        // DTO -> ENTITY 변환
        Member signMember = new Member().toEntity(signupDto, MemberProviderType.valueOf(signupDto.getProviderType()));

        // 해당 하는 아이디의 정보를 가져옴 재가입일 수도 있기 때문에 아이디 중복처리는 아직.
        Optional<Member> findId = memberRepository.findByIdAndStatusNotAndProviderType(signMember.getId(), MemberStatus.UNREGISTER, signMember.getProviderType());

        // 아이디가 있다면 그 회원의 상태가 블랙리스트 또는 영구탈퇴라면 재가입 방지.
        if(findId.isPresent()) {
            if (findId.get().getStatus().getStatus().equals("Unregister")) {
                throw new CustomException(CustomErrorCode.UNREGISTER_MEMBER_SIGN);
            } else if(findId.get().getStatus().getStatus().equals("Blacklist")) {
                throw new CustomException(CustomErrorCode.BLACKLIST_MEMBER_SIGN);
            }
        }

        // 그 다음 절차에 따라 아이디 중복 확인
        validateDuplicateById(signupDto.getId(), MemberProviderType.valueOf( signupDto.getProviderType()));

        //이메일 중복 확인
        validateDuplicateByEmail(signupDto.getEmail(), MemberProviderType.valueOf( signupDto.getProviderType()));

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
    public void editMemberInfoByHome(EditMemberInfoDTO memberInfoDTO) {

        unregisterCheck();

        //주어진 ID로 회원 조회
        Member findMember = memberRepository.findByIdAndStatusNotAndProviderType(memberInfoDTO.getId(), MemberStatus.UNREGISTER, MemberProviderType.valueOf(memberInfoDTO.getProviderType()))
                .orElseThrow(() -> new CustomException(CustomErrorCode.EMPTY_MEMBER));

        //주어진 회원과 연결된 주소 조회
        Address findAddress = addressRepository.findByMember(findMember);

        //회원 정보 갱신 (단순 값 교체 + 연관관계 편의 메서드)
        findMember.updateMember(findAddress, memberInfoDTO);
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
    public void validateDuplicateById(String id, MemberProviderType providerType) {

        unregisterCheck();

        Optional<Member> findId = memberRepository.findByIdAndStatusNotAndProviderType(id, MemberStatus.UNREGISTER, providerType);

        if(findId.isPresent()) {
            throw new CustomException(CustomErrorCode.DUPLI_MEMBER_ID);
        }
    }

    /**
     * 중복 이메일 확인 메서드
     */
    @Override
    @Transactional
    public void validateDuplicateByEmail(String email, MemberProviderType providerType) {

        Optional<Member> findEmail = memberRepository.findByEmailAndStatusNotAndProviderType(email, MemberStatus.UNREGISTER, providerType);

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
    public MemberDTO searchById(String id) {
        //홈에서 가입 회원이고 완전 탈퇴된 회원 제외
        Member findId = memberRepository.findByIdAndStatusNotAndProviderType(id, MemberStatus.UNREGISTER, MemberProviderType.HOME)
                .orElseThrow(() -> new CustomException(CustomErrorCode.EMPTY_MEMBER));

        Address memberAddress = addressRepository.findByMember(findId);

        return new MemberDTO().toDTO(findId, memberAddress);
    }

    /**
     * 소셜 로그인 이메일 가입여부 확인
     */
    @Override
    public Boolean searchByEmailSocialLogin(String email) {
        return memberRepository.findByEmailAndStatusNotAndProviderTypeNot(email, MemberStatus.UNREGISTER, MemberProviderType.HOME)
                .isPresent();
    }

    /**
     * find memberId search by name and email
     */
    @Override
    @Transactional
    public Map<String, String> findMemberId(String name, String email) {

        unregisterCheck();

        Member findNameAndEmail = memberRepository.findByNameAndEmailAndStatusNotAndProviderType(name, email, MemberStatus.UNREGISTER, MemberProviderType.HOME)
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

        unregisterCheck();

        Member findIdNameEmail = memberRepository.findByIdAndNameAndEmailAndStatusNotAndProviderType(id, name, email, MemberStatus.UNREGISTER, MemberProviderType.HOME)
                .orElseThrow(() -> new CustomException(CustomErrorCode.NOT_MATCH_ID_EMAIL_NAME));

        Map<String, String> memberPassword = new LinkedHashMap<>();

        FindPwdMemberDTO searchPassword = new FindPwdMemberDTO().toDTO(findIdNameEmail);

        memberPassword.put("password", searchPassword.getPassword());

        return memberPassword;
    }

    /**
     * 회원이 탈퇴 버튼 누르면 상태 변경 1주일 후에는 영구 탈퇴
     */
    @Override
    @Transactional
    public Boolean deleteChangeMember(DeleteMemberDTO deleteMemberDTO) {

        // 탈퇴하기 전에 먼저 1주일이 지난 회원을 다 unregister 변경
        unregisterCheck();

        // 아이디 패스워드로 조회 성공하면
        Member findMember = memberRepository.findByIdAndPasswordAndProviderType(deleteMemberDTO.getId(), deleteMemberDTO.getPassword(), MemberProviderType.valueOf(deleteMemberDTO.getProviderType()))
                .orElseThrow(() -> new CustomException(CustomErrorCode.ERROR_UPDATE_UNREGISTER_MEMBER));

        // 조회한 회원의 정보를 DELETE 업데이트 !!
        findMember.changeMemberStatus(deleteMemberDTO);
        return true;
    }

    @Override
    @Transactional
    /**
     * DELETE인 회원 중에 update_time 이 1주일 지난 회원은 UNREGISTER
     */
    public void unregisterCheck() {
        // 현재 시간
        LocalDateTime now = LocalDateTime.now();
        // 1주일 뒤에 시간
        LocalDateTime afterTime = LocalDateTime.of(now.getYear(), now.getMonth(), now.getDayOfMonth() + 7, now.getHour(), now.getMinute());
        // DELETE 회원 중 1주일이 지난 회원을 체크
        Optional<List<Member>> deleteListMember = memberRepository.findAllByStatusAndUnregisterAfter(MemberStatus.DELETE, afterTime);
        // 찾은 회원이 있으면 그 회원만 UNREGISTER 변경 !!
        if(deleteListMember.isPresent()) {
            for(Member deleteMember : deleteListMember.get()) {
                // 1주일이 지난 회원들은 다 unregister status Change
                deleteMember.changeMemberStatus();
            }
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
    /**
     * 전체 일반 회원 조회 서비스
     */
    @Override
    public PagingMemberDTO searchAllActiveMember(Pageable pageable) {

        unregisterCheck();

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
        unregisterCheck();
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
        unregisterCheck();

        for(CheckMemberDTO checkMemberDTO : checkMemberDTOList){
            log.info("memberIndex = {}", checkMemberDTO.getIndex());
            memberRepository.changeStatusMember(checkMemberDTO.getIndex(), MemberStatus.UNREGISTER)
                    .orElseThrow(() -> new CustomException(CustomErrorCode.ERROR_UPDATE_UNREGISTER_MEMBER));
        }
    }

    @Override
    @Transactional
    public List<MemberDTO> updateStatusByCount() {
        unregisterCheck();

        List<MemberDTO> memberDTOList = new ArrayList<>();

        List<Member> findMemberList = memberRepository.findAllByAccuseCountGreaterThan(4)
                .orElseThrow(() -> new IllegalArgumentException("조회된 신고횟수가 5개 이상인 회원이 없습니다"));

        for (Member member : findMemberList) {
            member.updateBlackByCount();
            memberDTOList.add(new MemberDTO().toDTOByCount(member));
        }
        return memberDTOList;
    }

    @Override
    public SigninResponseDTO signIn(SigninRequestDTO signinRequestDTO) {
        log.info("signinRequestDTO.getProviderType() = {}", signinRequestDTO.getProviderType());
        //홈페이지 가입 회원일 시
        if (signinRequestDTO.getProviderType().equals(MemberProviderType.HOME.name())) {
            //비밀번호 없으면 예외 처리
            if (Objects.isNull(signinRequestDTO.getPassword())) {
                throw new CustomException(CustomErrorCode.EMPTY_PASSWORD);
            }
             Member findMember = memberRepository.findByIdAndPasswordAndProviderType(signinRequestDTO.getId(), signinRequestDTO.getPassword(), MemberProviderType.HOME)
                     .orElseThrow(() -> new CustomException(CustomErrorCode.EMPTY_MEMBER));
            return new SigninResponseDTO().toDTO(findMember);
        //소셜 로그인 가입 회언일 시
        } else {
            //이메일 정보가 없으면 예외 처리
            if (Objects.isNull(signinRequestDTO.getEmail())) {
                throw new CustomException(CustomErrorCode.EMPTY_EMAIL);
            }
            Member findMember = memberRepository.findByEmailAndProviderType(signinRequestDTO.getEmail(), MemberProviderType.valueOf(signinRequestDTO.getProviderType()))
                    .orElseThrow(() -> new CustomException(CustomErrorCode.EMPTY_MEMBER));
            return new SigninResponseDTO().toDTO(findMember);
        }
    }

    /**
     * 회원탈퇴 신청 1주일이 지나지 않은 회원 복구 메서드
     */
    @Override
    @Transactional
    public void deleteCancelMember(DeleteCancelDTO deleteCancelDTO) {
        unregisterCheck();
        // DELETE 상태인 회원만 조회
        Member deleteMember = memberRepository.findByIdAndPasswordAndStatus(deleteCancelDTO.getId(), deleteCancelDTO.getPassword(), MemberStatus.DELETE)
                .orElseThrow(() -> new CustomException(CustomErrorCode.EMPTY_MEMBER));
        // ACTIVE 변경
        deleteMember.deleteCancel(deleteCancelDTO);
    }
}