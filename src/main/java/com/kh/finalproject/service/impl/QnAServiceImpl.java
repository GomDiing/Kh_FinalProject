
package com.kh.finalproject.service.impl;
import com.kh.finalproject.dto.qna.*;
import com.kh.finalproject.entity.Member;
import com.kh.finalproject.entity.QnA;
import com.kh.finalproject.exception.CustomErrorCode;
import com.kh.finalproject.exception.CustomException;
import com.kh.finalproject.repository.MemberRepository;
import com.kh.finalproject.repository.QnARepository;
import com.kh.finalproject.service.QnAService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class QnAServiceImpl implements QnAService {
    private final QnARepository qnARepository;
    private final MemberRepository memberRepository;

//   qna 작성
    @Override
    @Transactional
    public Map<String,String> create(CreateQnADTO createQnADTO) {
//        작성할때 회원 아이디로 회원 조회
        Optional<Member> findOne = memberRepository.findByIndex(createQnADTO.getIndex());
        if(findOne.isEmpty()) {
            throw new CustomException(CustomErrorCode.EMPTY_MEMBER);
        }
        Member member = findOne.get(); // repository list로 쓰고 싶은데 optional findbyid 이미 쓰면 list findbyId 못쓰는지?
        log.info("아이디 일치하는지", member);
//        qna 생성
        QnA writeQna = new QnA().createQnA(member, createQnADTO.getTitle(), createQnADTO.getCategory(), createQnADTO.getContent());
        qnARepository.save(writeQna);
        return null;
    }

    @Override
    public void update(UpdateQnADTO updateQnADTO) {

    }

    @Override
    public void cancel(CancelQnADTO cancelQnADTO) {

    }


    /*qna 목록 조회 (마이페이지)*/
    @Override
    public PagingQnaDTO searchByMember(Long index,Pageable pageable) {
        List<QnADTO> qnaDTOList = new ArrayList<>();

        Page<QnA> pageMyQnaList = qnARepository.findByMemberIndex(index, pageable);

        List<QnA> qnaMypageList = pageMyQnaList.getContent();
        Integer totalPages = pageMyQnaList.getTotalPages();
        Integer page = pageMyQnaList.getNumber()+1;
        Long totalResults = pageMyQnaList.getTotalElements();

        for(QnA qnA : qnaMypageList){
            QnADTO qnADTO = new QnADTO().toDTO(qnA);
            qnaDTOList.add(qnADTO);
        }
        PagingQnaDTO pagingQnaDTO = new PagingQnaDTO().toPageDTO(page, totalPages, totalResults, qnaDTOList);

        return pagingQnaDTO;
    }

//  qna 리스트 조회 service
    @Override
    public PagingQnaDTO searchAll(Pageable pageable) {
        List<QnADTO> qnaDTOList = new ArrayList<>();
        Page<QnA> pageMyQnaList = qnARepository.findAll(pageable);

        List<QnA> qnaMypageList = pageMyQnaList.getContent();
        Integer totalPages = pageMyQnaList.getTotalPages();
        Integer page = pageMyQnaList.getNumber()+1;
        Long totalResults = pageMyQnaList.getTotalElements();

        for(QnA qnA : qnaMypageList){
            QnADTO qnADTO = new QnADTO().toDTO(qnA);
            qnaDTOList.add(qnADTO);
        }
        PagingQnaDTO pagingQnaDTO = new PagingQnaDTO().toPageDTO(page, totalPages, totalResults, qnaDTOList);

        return pagingQnaDTO;
    }

//    qna 답장 보내기
    @Override
    @Transactional
    public void response(ResponseQnADTO responseQnADTO) {
        log.info("responseQnADTO = {}", responseQnADTO.getIndex());
        QnA findQnA = qnARepository.findByIndex(responseQnADTO.getIndex())
                .orElseThrow(() -> new CustomException(CustomErrorCode.ERROR_EMPTY_QNA));

        findQnA.updateQna(responseQnADTO);
    }

    @Override
    public void createExtra(CreateExtraQnADTO createExtraQnADTO) {

    }
}
