package com.kh.finalproject.service;

import com.kh.finalproject.dto.member.*;
import com.kh.finalproject.dto.notice.NoticeDTO;
import com.kh.finalproject.entity.Member;
import com.kh.finalproject.entity.Notice;
import com.kh.finalproject.entity.enumurate.MemberStatus;
import com.kh.finalproject.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService{
    private final MemberRepository memberRepository;

    @Override
    public void signup(SignupDTO signupDto) {

    }

    @Override
    public Boolean unregister(UnregisterDTO unregisterDTO) {
        return null;
    }

//    @Override
//    public String unregister(UnregisterDTO unregisterDTO) {
//        Member findBlack = memberRepository.findByStatus(MemberStatus.BLACKLIST);
//        Member member = new Member().toEntity(unregisterDTO);
//        Member rst = memberRepository.deleteAll(member);
//        return true;
//    }

    @Override
    public void validateDuplicateByEmail(String email) {

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
    public void deleteMember(String id) {
        Member member = memberRepository.findById(Long.valueOf(id)).get();

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

    @Override
    public void editMemberInfo(EditMemberInfoDTO editMemberInfoDTO) {

    }
}