package com.kh.finalproject.service;

import com.kh.finalproject.dto.accuse.AccuseDTO;
import com.kh.finalproject.dto.accuse.CancelAccuseDTO;
import com.kh.finalproject.dto.accuse.CreateAccuseDTO;
import com.kh.finalproject.dto.accuse.ProcessAccuseDTO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


/**
 * 신고 서비스 구현체
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class AccuseServiceImpl implements AccuseService {
    @Override
    public void create(CreateAccuseDTO createAccuseDTO) {

    }

    @Override
    public void process(ProcessAccuseDTO processAccuseDTO) {

    }

    @Override
    public List<AccuseDTO> searchAll() {
        return null;
    }

    @Override
    public AccuseDTO searchByMemberVictim() {
        return null;
    }

    @Override
    public void cancel(CancelAccuseDTO cancelAccuseDTO) {

    }
}
