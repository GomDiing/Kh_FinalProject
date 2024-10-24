package com.kh.finalproject.controller;

import com.kh.finalproject.dto.accuse.CreateAccuseDTO;
import com.kh.finalproject.response.DefaultResponse;
import com.kh.finalproject.response.DefaultResponseMessage;
import com.kh.finalproject.response.StatusCode;
import com.kh.finalproject.service.AccuseService;
import com.kh.finalproject.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;


/**
 * 신고 기능 관련 API 컨트롤러
 * 리뷰 신고 접수, 신고 횟수 따른 회원 상태 관리 담당
 *
 * @author GomDiing
 */
@RequiredArgsConstructor
@RestController
@Slf4j
@RequestMapping("/api/accuse")
public class AccuseController {

    private final AccuseService accuseService;
    private final MemberService memberService;

    /**
     * 리뷰 글에 대한 신고 접수 및 블랙리스트 처리
     * 5회 이상인 회원은 자동으로 블랙리스트 처리
     *
     * @param index 신고할 리뷰 고유 식별자
     * @param createAccuseDTO 신고 내용 정보
     * @return 신고 접수 성공 응답 메시지
     */
    @PostMapping("/{index}")
    public ResponseEntity<DefaultResponse<Void>> createAccuse(@PathVariable Long index,
                                                                @Validated @RequestBody CreateAccuseDTO createAccuseDTO) {
        //후기 index 랑 유저 정보 service 넘겨주기
        accuseService.create(createAccuseDTO, index);

        //신고 횟수 5회 이상인 회원 블랙리스트 회원으로 변환
        memberService.updateStatusByCount();

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_CREATE_ACCUSE), HttpStatus.OK);
    }


}